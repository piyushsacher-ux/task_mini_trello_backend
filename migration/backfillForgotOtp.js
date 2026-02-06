const mongoose = require("mongoose");
const User = require("../src/models/user.model");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI);

(async () => {
  await User.updateMany(
    { forgotOtpVerified: { $exists: false } },
    { $set: { forgotOtpVerified: false } }
  );

  console.log("Done backfilling forgotOtpVerified");
  process.exit();
})();
