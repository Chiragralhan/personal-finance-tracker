const Joi = require('joi');

const budgetValidation = (req, res, next) => {
    const schema = Joi.object({
        monthlyBudget: Joi.number().min(0).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error
        });
    }
    next();
};

module.exports = {
    budgetValidation
};
