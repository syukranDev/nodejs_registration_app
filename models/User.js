const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'userId' },
                { $inc: { sequence: 1 } },
                { new: true, upsert: true }
            );
            this.userId = counter.sequence;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);