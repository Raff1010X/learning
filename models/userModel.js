const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//+ Schema for user model
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A user must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A user name must have less or equal then 40 characters',
            ],
            minlength: [
                4,
                'A user name must have more or equal then 10 characters',
            ],
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contain characters',
            // ], //validator.isAlpha(value)
        },
        email: {
            type: String,
            required: [true, 'A user must have an email'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (val) {
                    return validator.isEmail(val);
                },
                message: '{VALUE} is not a valid email',
            },
        },
        photo: {
            type: String,
            default: 'defaultUser.jpg',
        },
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'A user must have a password'],
            minlength: [
                8,
                'A user password must have more or equal then 8 characters',
            ],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'A user must have a password confirm'],
            validate: {
                //This only works on CREATE and SAVE!!!
                validator: function (val) {
                    return val === this.password;
                },
                message: 'Passwords are not the same!',
            },
        },
        passwordChangedAt: {
            type: Date,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//+ Encrypt user's password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //if password is not modified, skip

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

//+ If password has been changed, set the passwordChangedAt to the current time -1sec
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

//+ Hide inactive users from finding
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

//+ Check if the password is correct
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//+ Check if the password has been changed after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

//+ Create a token for password reset
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
