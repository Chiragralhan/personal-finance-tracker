import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import DashboardSummary from './DashboardSummary';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [monthlyBudget, setMonthlyBudget] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses])

    const categorySummary = useMemo(() => {
        const categoryMap = expenses.reduce((acc, item) => {
            if (item.amount < 0) {
                const key = item.category || 'Other';
                acc[key] = (acc[key] || 0) + Math.abs(item.amount);
            }
            return acc;
        }, {});

        return Object.entries(categoryMap)
            .map(([category, total]) => ({ category, total }))
            .sort((a, b) => b.total - a.total);
    }, [expenses]);

    const recentTransactions = useMemo(() => {
        return [...expenses]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    }, [expenses]);

    const monthlyExpense = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses
            .filter((item) => {
                const txnDate = new Date(item.createdAt);
                return (
                    item.amount < 0 &&
                    txnDate.getMonth() === currentMonth &&
                    txnDate.getFullYear() === currentYear
                );
            })
            .reduce((acc, item) => acc + Math.abs(item.amount), 0);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    const fetchExpenses = useCallback(async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }, [navigate])

    const fetchBudget = useCallback(async () => {
        try {
            const url = `${APIUrl}/budget`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            if (result?.success) {
                setMonthlyBudget(result?.data?.monthlyBudget || 0);
            }
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    const updateMonthlyBudget = async (budgetValue) => {
        try {
            const url = `${APIUrl}/budget`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify({ monthlyBudget: budgetValue })
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            if (result?.success) {
                handleSuccess(result?.message);
                setMonthlyBudget(result?.data?.monthlyBudget || 0);
                return;
            }
            handleError(result?.message || 'Failed to update monthly budget');
        } catch (err) {
            handleError(err);
        }
    }



    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchExpenses()
        fetchBudget()
    }, [fetchBudget, fetchExpenses])

    return (
        <div className='home-page'>
            <div className='user-section'>
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ExpenseDetails
                incomeAmt={incomeAmt}
                expenseAmt={expenseAmt}
            />

            <DashboardSummary
                incomeAmt={incomeAmt}
                expenseAmt={expenseAmt}
                balance={incomeAmt - expenseAmt}
                totalTransactions={expenses.length}
                categorySummary={categorySummary}
                recentTransactions={recentTransactions}
                monthlyBudget={monthlyBudget}
                monthlyExpense={monthlyExpense}
                onUpdateBudget={updateMonthlyBudget}
            />

            <div className='home-main-grid'>
                <ExpenseForm
                    addTransaction={addTransaction}
                />

                <section className='transaction-history-panel'>
                    <h2>Transaction History</h2>
                    <ExpenseTable
                        expenses={expenses}
                        deleteExpens={deleteExpens}
                    />
                </section>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Home