const { Schema, model } = require("mongoose");

const generateUserId = () => Math.random().toString(36).substr(2, 9);

const userSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: generateUserId,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    let userIdExists = true;
    while (userIdExists) {
      const userId = generateUserId();
      const existingUser = await model("User").findOne({ userId });
      if (!existingUser) {
        this.userId = userId;
        userIdExists = false;
      }
    }
  }
  next();
});

const userModel = model("User", userSchema);
module.exports = { userModel };
