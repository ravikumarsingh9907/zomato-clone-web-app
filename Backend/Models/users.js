const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSChema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true, 
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
      },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      caseSensitive: true,
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    }],
    bookmarks:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brands'
    }],
    Tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//Hiding critical data from user
userSChema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.Tokens;

  return userObject;
};


// generate tokens for user
userSChema.methods.generateTokens = async function () {
  const users = this;
  const token = jwt.sign({ _id: users._id.toString() }, process.env.WEB_TOKEN, {
    expiresIn: "24h",
  });

  users.Tokens = users.Tokens.concat({ token });
  await users.save();

  return token;
};

// finfing user by his credentials : email, password
userSChema.statics.findByCredentials = async (email, password) => {
  const users = await Users.findOne({ email });
  if (!users) {
    throw new Error("Incorrect email or password");
  }

  const isMatched = await bcrypt.compare(password, users.password);

  if (!isMatched) {
    throw new Error("Incorrect email or password");
  }

  return users;
};

//store password as hashed code before saving
userSChema.pre("save", async function (next) {
  const users = this;

  if (users.isModified("password")) {
    users.password = await bcrypt.hash(users.password, 8);
  }

  next();
});

const Users = mongoose.model("Users", userSChema);

module.exports = Users;