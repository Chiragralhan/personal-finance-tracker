const express = require('express');
const { getBudget, updateBudget } = require('../Controllers/BudgetController');
const { budgetValidation } = require('../Middlewares/BudgetValidation');

const router = express.Router();

router.get('/', getBudget);
router.put('/', budgetValidation, updateBudget);

module.exports = router;
