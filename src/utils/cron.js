const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

const cleanupLogs = () => {
    const logsDir = path.join(__dirname, "../../logs");
    const retentionDays = 3;
    const now = Date.now();

    if (!fs.existsSync(logsDir)) {
        return;
    }

    fs.readdir(logsDir, (err, files) => {
        if (err) {
            logger.error("Error reading logs directory during cleanup:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(logsDir, file);

            // Only target log and zipped log files
            if (!file.endsWith(".log") && !file.endsWith(".gz")) {
                return;
            }

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    logger.error(`Error statting file ${file}:`, err);
                    return;
                }

                const fileAgeDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

                if (fileAgeDays > retentionDays) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            logger.error(`Failed to delete old log file ${file}:`, err);
                        } else {
                            logger.info(`Deleted old log file: ${file}`);
                        }
                    });
                }
            });
        });
    });
};

/**
 * Initialize all cron jobs
 */
const initCrons = () => {
    // Run log cleanup every day at midnight
    cron.schedule("0 0 * * *", () => {
        logger.info("Running daily log cleanup cron job...");
        cleanupLogs();
    });

    // Run once on startup to clean up any old logs immediately
    logger.info("Running initial log cleanup on startup...");
    cleanupLogs();
};

module.exports = { initCrons };
