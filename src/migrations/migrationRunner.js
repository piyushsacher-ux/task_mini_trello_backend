const fs = require("fs");
const path = require("path");
const { SystemConfig } = require("../models");
const { logger } = require("../utils");

const runMigrations = async () => {
    const migrationsPath = path.join(__dirname, "scripts");
    if (!fs.existsSync(migrationsPath)) {
        logger.info("No migrations directory found.");
        return;
    }

    // Get or create system config
    let config = await SystemConfig.findOne();
    if (!config) {
        config = await SystemConfig.create({ dbVersion: 0 });
    }

    const currentVersion = config.dbVersion;

    const files = fs
        .readdirSync(migrationsPath)
        .filter((f) => f.endsWith(".js"))
        .map((f) => {
            const match = f.match(/^(\d+)_/);
            return {
                filename: f,
                version: match ? parseInt(match[1]) : -1,
            };
        })
        .filter((m) => m.version > currentVersion)
        .sort((a, b) => a.version - b.version);

    if (files.length === 0) {
        logger.info(`Database is up to date (Version: ${currentVersion})`);
        return;
    }

    for (const item of files) {
        logger.info(`Running migration version ${item.version}: ${item.filename}`);
        const migration = require(path.join(migrationsPath, item.filename));

        try {
            await migration.up();
            config.dbVersion = item.version;
            await config.save();
            logger.info(`Successfully migrated to version ${item.version}`);
        } catch (err) {
            logger.error(`Migration failed at version ${item.version} (${item.filename})`, err);
            throw err;
        }
    }
};

module.exports = { runMigrations };
