import React from 'react';
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import BudgetMonitor from './BudgetMonitor';

function DashboardSummary({
    incomeAmt,
    expenseAmt,
    balance,
    totalTransactions,
    categorySummary,
    recentTransactions,
    monthlyBudget,
    monthlyExpense,
    onUpdateBudget
}) {
    const pieData = [
        { name: 'Income', value: incomeAmt },
        { name: 'Expense', value: expenseAmt }
    ];

    const pieColors = ['#27ae60', '#c0392b'];
    const totalPie = incomeAmt + expenseAmt;

    const barData = categorySummary.map((item) => ({
        category: item.category,
        total: item.total
    }));

    const pieTooltipFormatter = (value) => {
        const percentage = totalPie ? ((value / totalPie) * 100).toFixed(1) : 0;
        return [`₹${value} (${percentage}%)`, 'Amount'];
    };

    return (
        <section className="dashboard-section">
            <h2 className="dashboard-title">Dashboard Summary</h2>

            <BudgetMonitor
                monthlyBudget={monthlyBudget}
                monthlyExpense={monthlyExpense}
                onUpdateBudget={onUpdateBudget}
            />

            <div className="summary-cards-grid">
                <article className="summary-card income-card">
                    <p className="summary-label">Total Income</p>
                    <h3>₹{incomeAmt}</h3>
                </article>
                <article className="summary-card expense-card">
                    <p className="summary-label">Total Expense</p>
                    <h3>₹{expenseAmt}</h3>
                </article>
                <article className="summary-card balance-card">
                    <p className="summary-label">Current Balance</p>
                    <h3>₹{balance}</h3>
                </article>
                <article className="summary-card transaction-card">
                    <p className="summary-label">Total Transactions</p>
                    <h3>{totalTransactions}</h3>
                </article>
            </div>

            <div className="dashboard-lists-grid">
                <div className="dashboard-panel">
                    <h3>Category-wise Expenses</h3>
                    {categorySummary.length === 0 ? (
                        <p className="empty-state-text">No expense categories yet.</p>
                    ) : (
                        categorySummary.map((item) => (
                            <div className="dashboard-row" key={item.category}>
                                <span>{item.category}</span>
                                <span>₹{item.total}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="dashboard-panel">
                    <h3>Recent Transactions</h3>
                    {recentTransactions.length === 0 ? (
                        <p className="empty-state-text">No transactions yet.</p>
                    ) : (
                        recentTransactions.map((txn) => (
                            <div className="dashboard-row" key={txn._id}>
                                <div>
                                    <p className="txn-text">{txn.text}</p>
                                    <small>{txn.category || 'Other'}</small>
                                </div>
                                <span className={txn.amount >= 0 ? 'income-amount' : 'expense-amount'}>
                                    ₹{txn.amount}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="dashboard-charts-grid">
                <div className="dashboard-panel chart-panel">
                    <h3>Income vs Expense</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={95}
                                >
                                    {pieData.map((item, index) => (
                                        <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={pieTooltipFormatter} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-panel chart-panel">
                    <h3>Category-wise Expense Chart</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`₹${value}`, 'Expense']} />
                                <Legend />
                                <Bar dataKey="total" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DashboardSummary;
