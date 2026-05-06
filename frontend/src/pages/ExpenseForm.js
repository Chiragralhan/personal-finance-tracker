import React, { useState } from 'react'
import { handleError } from '../utils';

const CATEGORY_OPTIONS = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Books', 'Other'];

function ExpenseForm({ addTransaction }) {

    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        category: 'Other'
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyExpenseInfo = { ...expenseInfo };
        copyExpenseInfo[name] = value;
        setExpenseInfo(copyExpenseInfo);
    }

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, category } = expenseInfo;
        if (!amount || !text || !category) {
            handleError('Please add Expense Details');
            return;
        }
        addTransaction(expenseInfo);
        setExpenseInfo({ amount: '', text: '', category: 'Other' })
    }

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter your Expense Detail...'
                        value={expenseInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='category'>Category</label>
                    <select
                        onChange={handleChange}
                        name='category'
                        value={expenseInfo.category}
                    >
                        {CATEGORY_OPTIONS.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter your Amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    )
}

export default ExpenseForm