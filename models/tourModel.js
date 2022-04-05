const mongoose = require('mongoose');
//const slugify = require('slugify');
//const validator = require('validator');

//+ Schema for tour model
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal then 40 characters',
            ],
            minlength: [
                10,
                'A tour name must have more or equal then 10 characters',
            ],
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contain characters',
            // ], //validator.isAlpha(value)
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium or difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below regular price',
            },
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        // virtual properties
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// virtual properties - not a part of database - not to use with a query - on get request
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() - runs only on document
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });
// // runs after saving the document
// tourSchema.post('save', (doc, next) => {
//     console.log(doc);
//     next();
// });

// Querry middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

// tourSchema.post(/^find/, function (docs, next) {
//     //console.log(docs);
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     next();
// });

// AGGREGATION middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
