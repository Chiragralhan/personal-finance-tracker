const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const allowedCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Books', 'Other'];

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    monthlyBudget: {
        type: Number,
        default: 0,
        min: 0
    },
    expenses: [
        {
            text: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            category: {
                type: String,
                required: true,
                enum: allowedCategories
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;