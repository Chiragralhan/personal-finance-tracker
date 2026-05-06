const UserModel = require("../Models/User");

const getBudget = async (req, res) => {
    const { _id } = req.user;
    try {
        const userData = await UserModel.findById(_id).select('monthlyBudget');
        res.status(200).json({
            message: "Budget fetched successfully",
            success: true,
            data: {
                monthlyBudget: userData?.monthlyBudget || 0
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

const updateBudget = async (req, res) => {
    const { _id } = req.user;
    const { monthlyBudget } = req.body;

    try {
        const payload = Number(monthlyBudget);
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $set: { monthlyBudget: payload } },
            { new: true }
        ).select('monthlyBudget');

        return res.status(200).json({
            message: "Monthly budget updated successfully",
            success: true,
            data: {
                monthlyBudget: userData?.monthlyBudget || 0
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

module.exports = {
    getBudget,
    updateBudget
};
