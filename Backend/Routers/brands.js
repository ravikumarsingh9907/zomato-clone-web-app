const express = require("express");
const router = new express.Router();
const Brands = require("../Models/brands.js");
const expError = require("../utils/expError.js");
const catchAsyncError = require("../utils/asyncError.js");
const { storage } = require("../Cloudinary/index");
const multer = require("multer");
const auth = require("../Middleware/auth.js");
const upload = multer({ storage });

router.post(
    "/restaurants", upload.single('image'), catchAsyncError(async (req, res) => {
        const checkBrandExistsOrNot = await Brands.findOne({
            name: req.body.name
        });

        if (checkBrandExistsOrNot) throw new expError({ message: "Brand already exists", statusCode: 400 })
        const brands = new Brands(req.body);
        brands.image = req.file.path;

        await brands.save();

        res.status(201).send({ brands });
    })
);

router.get(
    "/restaurants", catchAsyncError(async (req, res) => {
        let brands = {};

        if(req.query && req.query.query) {
            const data = req.query.query;
            brands = await Brands.find().or([{"description": { $regex: data, $options: 'i'} }, {"name": { $regex: data, $options: 'i'} }]);
        } else {
            brands = await Brands.find({});
        }

        res.status(200).send({ brands });
    })
);

router.get(
    "/restaurants/:id", catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const brand = await Brands.findById(id);

        res.status(200).send({ brand });
    })
);

router.patch(
    "/restaurants/:id", catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const brand = await Brands.findByIdAndUpdate(id, req.body);

        res.status(200).send({ brand });
    })
);

router.delete(
    "/restaurants/:id", catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const brand = await Brands.findByIdAndDelete(id);

        res.status(200).send({ brand });
    })
);

router.patch(
    "/restaurants/:id/image", upload.single("image"), catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const brand = await Brands.findById(id);

        if (!brand) throw new expError({ message: "Brand Not Found", statusCode: 404 })

        brand.image = req.file.path;
        await brand.save();

        res.status(200).send({ brand });
    })
);

router.patch(
    "/restaurants/:id/gallery", upload.array("gallery", 10), catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const brand = await Brands.findById(id);

        if (!brand) throw new expError({ message: "Brand Not Found", statusCode: 404 })

        req.files.forEach(file => {
            brand.gallery.push(file.path);
        });

        await brand.save();

        res.status(200).send({ brand });
    })
);

router.post("/restaurants/:id/bookmark", auth, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const getBrand = await Brands.findById(id);

    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 404});

    const { bookmarks } = await req.user.populate('bookmarks');

    const duplicationCheck = bookmarks.length > 0 && bookmarks.filter((bookmark) => {
        return bookmark.name === getBrand.name;
    });

    if(duplicationCheck && duplicationCheck.length !== 0) throw new expError({ message: 'Already bookmarked', statusCode: 400});

    req.user['bookmarks'].push(getBrand);
    await req.user.save();

    res.status(201).send({ success: 'Added to bookmark'});
}));

router.delete("/restaurants/:id/bookmark", auth, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const getBrand = await Brands.findById(id);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 404});

    const user = await req.user.populate('bookmarks');

    user.bookmarks = user.bookmarks.filter(book => {
        return book.name !== getBrand.name;
    })

    await req.user.save();
    res.status(200).send({ success: 'Removed from bookmark'});
}));

module.exports = router;