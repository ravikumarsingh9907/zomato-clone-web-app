const express = require("express");
const router = new express.Router();
const Dishes = require("../Models/dishes.js");
const expError = require("../utils/expError.js");
const catchAsyncError = require("../utils/asyncError.js");
const { storage } = require("../Cloudinary/index");
const multer = require("multer");
const Brands = require("../Models/brands.js");
const upload = multer({ storage });

router.post(
    "/restaurants/:id/dishes", 
    upload.single('image'),
     catchAsyncError(async (req, res) => {
        const checkBrandExistsOrNot = await Brands.findById(req.params.id);
        if(!checkBrandExistsOrNot) throw new expError({message: "Restaurant doesn't exists", statusCode: 404});

        const checkDishExistsOrNot = await Dishes.findOne({
            name: req.body.name,
            restaurant: req.params.id,
        });

        if (checkDishExistsOrNot) throw new expError({ message: "Dish already exists", statusCode: 400 })
        const dishes = new Dishes(req.body);

        dishes.image = req.file.path;

        dishes.restaurant = checkBrandExistsOrNot;

        await dishes.save();

        res.status(201).send({ dishes });
    })
);

router.patch(
    "/restaurants/:brandId/dishes/:dishId", 
    upload.single('image'),
     catchAsyncError(async (req, res) => {
        const checkBrandExistsOrNot = await Brands.findById(req.params.brandId);
        if(!checkBrandExistsOrNot) throw new expError({message: "Brand doesn't exists", statusCode: 404});

        const checkDishExistsOrNot = await Dishes.findOne({
            name: req.body.name,
            restaurant: req.params.brandId
        });

        if (checkDishExistsOrNot) throw new expError({ message: "Dish already exists", statusCode: 400 });

        const dishes = await Dishes.findByIdAndUpdate(id, req.body);
        dishes.image = req.file.path;

        await dishes.save();

        res.status(201).send({ dishes });
    })
);

router.get(
    "/restaurants/:id/dishes", catchAsyncError(async (req, res) => {
        let dishes;

        if(req.query && req.query.dish) {
            dishes = await Dishes.find({
                restaurant: req.params.id,
                $or: [{ name: {$regex: `${req.query.dish}`, $options: 'i'}}, { description: {$regex: `${req.query.dish}`, $options: 'i'}}]
            });
        } else{
            dishes = await Dishes.find({restaurant: req.params.id});
        }

        if(!dishes.length) throw new expError({message: 'Not Dish Found', statusCode: 404});

        res.status(200).send({ dishes });
    })
);

module.exports = router;