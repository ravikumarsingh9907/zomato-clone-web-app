const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
    images: [{
      type: String
    }],
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'Users'
    }],
    comments: [
      {
        comment: {
          type: String,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'Users'
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", reviewSchema);

module.exports = Reviews;