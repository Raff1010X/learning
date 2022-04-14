const express = require('express');

const reviewController = require('../controllers/reviewController');
const authControler = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // nested routs - mergeParams: true will allow us to access tourId

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authControler.protect,
        authControler.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(
        authControler.protect,
        authControler.restrictTo('user'),
        reviewController.deleteReview
    );

module.exports = router;
