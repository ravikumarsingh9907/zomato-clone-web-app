const mongoose = require("mongoose");

const dishesSChema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            trim: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brands",
        },
        image: {
            type: String,
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews",
        }]
    },
    {
        timestamps: true,
    }
);

const Dishes = mongoose.model("Dishes", dishesSChema);

module.exports = Dishes;