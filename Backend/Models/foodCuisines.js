const mongoose = require("mongoose");

const cuisinesSChema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Cuisines = mongoose.model("Cuisines", cuisinesSChema);

module.exports = Cuisines;