const UserModel = require("../Models/User");
const allowedCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Books', 'Other'];

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    const { text, amount, category } = req.body;
    try {
        if (!text || amount === undefined || !category) {
            return res.status(400).json({
                message: "text, amount and category are required",
                success: false
            });
        }

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                message: "Invalid category provided",
                success: false
            });
        }

        const payload = {
            text: text.trim(),
            amount: Number(amount),
            category: category.trim()
        };

        if (Number.isNaN(payload.amount)) {
            return res.status(400).json({
                message: "Amount must be a valid number",
                success: false
            });
        }

        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: payload } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense added successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    try {
        const userData = await UserModel.findById(_id).select('expenses');
        res.status(200)
            .json({
                message: "Fetched Expenses successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense Deleted successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
}