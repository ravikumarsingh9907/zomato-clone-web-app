const mongoose = require("mongoose");

const brandsSChema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        locations: [
            {
                street: {
                    type: String,
                    trim: true,
                    required: true,
                },
                city: {
                    type: String,
                    trim: true,
                    required: true,
                },
                pincode: {
                    type: Number,
                    trim: true,
                    required: true,
                },
                state: {
                    type: String,
                    trim: true,
                    required: true,
                },
            }
        ],
        image: {
            type: String,
        },
        gallery: [{
            type: String,
        }]
    },
    {
        timestamps: true,
    }
);

const Brands = mongoose.model("Brands", brandsSChema);

module.exports = Brands;