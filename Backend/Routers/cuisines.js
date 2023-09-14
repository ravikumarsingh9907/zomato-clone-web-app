const express = require("express");
const router = new express.Router();
const Cuisines = require("../Models/foodCuisines.js");
const expError = require("../utils/expError.js");
const catchAsyncError = require("../utils/asyncError.js");
const { storage } = require("../Cloudinary/index");
const multer = require("multer");
const upload = multer({ storage });

router.post(
    "/cuisines", upload.single('image'), catchAsyncError(async (req, res) => {
        const checkBrandExistsOrNot = await Cuisines.findOne({
            name: req.body.name
        });

        if (checkBrandExistsOrNot) throw new expError({ message: "Cuisine already exists", statusCode: 400 })
        const foodCuisines = new Cuisines(req.body);
        foodCuisines.image = req.file.path;

        await foodCuisines.save();

        res.status(201).send({ foodCuisines });
    })
);

router.get(
    "/cuisines", catchAsyncError(async (req, res) => {
        const cuisines = await Cuisines.find({});
        res.status(200).send({ cuisines });
    })
);

module.exports = router;