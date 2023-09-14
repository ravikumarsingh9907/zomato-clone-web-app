const express = require("express");
const Router = new express.Router();
const Brands = require("../Models/brands.js");
const expError = require("../utils/expError.js");
const catchAsyncError = require("../utils/asyncError.js");
const auth = require("../Middleware/auth.js");
const Reviews = require("../Models/reviews.js");
const { storage } = require("../Cloudinary/index");
const multer = require("multer");
const Users = require("../Models/users.js");
const upload = multer({ storage });

Router.post("/restaurants/:id/reviews", auth, upload.array('images', 4), catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const getBrand = await Brands.findById(id);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const review = new Reviews(req.body);

    if(req.files) {
        review.images = req.files.map(file => {
            return file.path;
        });
    }

    review.user = req.user;
    review.brand = getBrand;
    await review.save();

    res.status(200).send(review);
}));

Router.get("/restaurants/:id/reviews", catchAsyncError(async (req, res) => {
    const Brand = await Brands.findById(req.params.id);
    const reviews = await Reviews.find({}).populate('brand').populate('user').sort({createdAt: -1});

    const ReviewByRestaurant = reviews.filter(review => {
        return review.brand.name === Brand.name
    });

    res.status(200).send(ReviewByRestaurant);
}));

Router.get("/users/:id/reviews", catchAsyncError(async (req, res) => {
    const foundUser = await Users.findById(req.params.id);
    if(!foundUser) throw new expError({message: "User not found", statusCode: 400});

    const reviews = await Reviews.find({}).populate('brand').populate('user').sort({createdAt: -1});

    const ReviewByUser = reviews.filter(review => {
        return review.user.email === foundUser.email;
    });

    res.status(200).send(ReviewByUser);
}));

Router.delete("/reviews/:id", auth, catchAsyncError(async (req, res) => {
    const { reviewId } = req.params;
    const review = await Reviews.findByIdAndDelete(reviewId);
    res.status(200).send(review);
}));

Router.patch("/restaurants/:restId/reviews/:reviewId/like", auth, catchAsyncError(async (req, res) => {
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId).populate('likes');
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    if(getReview.likes) {
        const checkIsLikeIsUniqueOrNot = getReview.likes.filter(like => {
            return like.email === req.user.email
        });

        if(checkIsLikeIsUniqueOrNot.length > 0) {
            throw new expError({message: "Already liked", statusCode: 400});
        }
    }

    getReview.likes.push(req.user);
    await getReview.save();

    res.status(200).send(getReview);
}));

Router.delete("/restaurants/:restId/reviews/:reviewId/like", auth, catchAsyncError(async (req, res) => {;
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId).populate('likes');
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    let removeLike;
    if(getReview.likes) {
        removeLike = getReview.likes.filter(like => {
            return like.email !== req.user.email
        });
    }

    getReview.likes = removeLike;
    await getReview.save();

    res.status(200).send(getReview);
}));

Router.get("/restaurants/:restId/reviews/:reviewId/like", catchAsyncError(async (req, res) => {;
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId).populate('likes');
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    res.status(200).send({count: getReview.likes.length, likes: getReview.likes});
}));

Router.patch("/restaurants/:restId/reviews/:reviewId/comment", auth, catchAsyncError(async (req, res) => {
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId);
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    getReview.comments.push({
        user: req.user,
        comment: req.body.comment
    });

    await getReview.save();

    res.status(200).send(getReview);
}));

Router.delete("/restaurants/:restId/reviews/:reviewId/comment/:id", auth, catchAsyncError(async (req, res) => {;
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId).populate('comments');
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    getReview.comments.forEach((comment, index) => {
        if(comment._id.equals(req.params.id)) {
            getReview.comments.splice(index, 1);
        }
    });

    await getReview.save();

    res.status(200).send(getReview);
}));

Router.patch("/restaurants/:restId/reviews/:reviewId/comment/:id", auth, catchAsyncError(async (req, res) => {;
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId).populate('comments');
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    getReview.comments.forEach((comment) => {
        if(comment._id.equals(req.params.id)) {
            comment.comment = req.body.comment;
        }
    });

    await getReview.save();

    res.status(200).send(getReview);
}));

Router.get("/restaurants/:restId/reviews/:reviewId/comment", catchAsyncError(async (req, res) => {;
    const getBrand = await Brands.findById(req.params.restId);
    if(!getBrand) throw new expError({message: "No Restaurant Found", statusCode: 400});

    const getReview = await Reviews.findById(req.params.reviewId).populate('comments.user');
    if(!getReview) throw new expError({message: "Review not found", statusCode: 400});

    res.status(200).send({count: getReview.comments.length, comments: getReview.comments});
}));

module.exports = Router;