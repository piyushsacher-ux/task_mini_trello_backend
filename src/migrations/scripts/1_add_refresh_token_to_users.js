const { User } = require("../../models");
const { logger } = require("../../utils");

const up = async () => {
    logger.info("Backfilling refreshToken field for all users...");
    const result = await User.updateMany(
        { refreshToken: { $exists: false } },
        { $set: { refreshToken: null } }
    );
    logger.info(`Updated ${result.modifiedCount || 0} users.`);
};

module.exports = { up };
