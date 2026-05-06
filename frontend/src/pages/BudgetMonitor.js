import React, { useEffect, useMemo, useState } from 'react';
import { handleError } from '../utils';

function BudgetMonitor({ monthlyBudget, monthlyExpense, onUpdateBudget }) {
    const [budgetInput, setBudgetInput] = useState(monthlyBudget);

    useEffect(() => {
        setBudgetInput(monthlyBudget);
    }, [monthlyBudget]);

    const budgetStats = useMemo(() => {
        const remaining = monthlyBudget - monthlyExpense;
        const spendingPercent = monthlyBudget > 0
            ? Math.min((monthlyExpense / monthlyBudget) * 100, 100)
            : 0;
        const isExceeded = monthlyBudget > 0 && monthlyExpense > monthlyBudget;

        return {
            remaining,
            spendingPercent,
            isExceeded
        };
    }, [monthlyBudget, monthlyExpense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedValue = Number(budgetInput);
        if (Number.isNaN(parsedValue) || parsedValue < 0) {
            handleError('Monthly budget must be a valid non-negative number');
            return;
        }
        onUpdateBudget(parsedValue);
    };

    return (
        <section className="dashboard-panel budget-panel">
            <h3>Monthly Budget Monitor</h3>

            <form className="budget-form" onSubmit={handleSubmit}>
                <label htmlFor="monthlyBudget">Set Monthly Budget</label>
                <div className="budget-input-row">
                    <input
                        id="monthlyBudget"
                        type="number"
                        min="0"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        placeholder="Enter monthly budget"
                    />
                    <button type="submit">Save Budget</button>
                </div>
            </form>

            <div className="budget-summary-grid">
                <div>
                    <p className="summary-label">Monthly Budget</p>
                    <h4>₹{monthlyBudget}</h4>
                </div>
                <div>
                    <p className="summary-label">This Month Expense</p>
                    <h4>₹{monthlyExpense}</h4>
                </div>
                <div>
                    <p className="summary-label">Remaining Budget</p>
                    <h4 className={budgetStats.remaining < 0 ? 'expense-amount' : 'income-amount'}>
                        ₹{budgetStats.remaining}
                    </h4>
                </div>
                <div>
                    <p className="summary-label">Spent</p>
                    <h4>{budgetStats.spendingPercent.toFixed(1)}%</h4>
                </div>
            </div>

            <div className="progress-wrap">
                <div className="progress-track">
                    <div
                        className={`progress-fill ${budgetStats.isExceeded ? 'progress-fill-exceeded' : ''}`}
                        style={{ width: `${budgetStats.spendingPercent}%` }}
                    />
                </div>
            </div>

            {budgetStats.isExceeded && (
                <p className="budget-warning">
                    Warning: You have exceeded your monthly budget.
                </p>
            )}
        </section>
    );
}

export default BudgetMonitor;
