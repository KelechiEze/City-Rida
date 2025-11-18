'use client';

import React from 'react';
import { DollarSign, BarChart2, Calendar, Download, TrendingUp } from 'lucide-react';
import './Earnings.css';

const StatCard: React.FC<{ title: string; amount: string; period: string; icon: React.ReactNode; color: string; }> = ({ title, amount, period, icon, color }) => (
    <div className="earning-stat-card">
        <div className={`icon-wrapper ${color}`}>{icon}</div>
        <div className="text-content">
            <p className="card-title">{title}</p>
            <p className="card-amount">{amount}</p>
            <p className="card-period">{period}</p>
        </div>
    </div>
);

const WeeklyChart: React.FC = () => {
    const weeklyData = [
        { day: 'Mon', earnings: 12500 },
        { day: 'Tue', earnings: 15000 },
        { day: 'Wed', earnings: 11000 },
        { day: 'Thu', earnings: 18500 },
        { day: 'Fri', earnings: 22000 },
        { day: 'Sat', earnings: 25000 },
        { day: 'Sun', earnings: 17000 },
    ];
    const maxEarning = Math.max(...weeklyData.map(d => d.earnings));

    return (
        <div className="content-card">
            <div className="chart-header">
                <h3>This Week's Earnings</h3>
                <div className="chart-total">
                    <span>Total</span>
                    <p>₦{weeklyData.reduce((sum, d) => sum + d.earnings, 0).toLocaleString()}</p>
                </div>
            </div>
            <div className="chart-body">
                <div className="bars-container">
                    {weeklyData.map(data => (
                        <div key={data.day} className="bar-wrapper">
                            <div className="bar" style={{ height: `${(data.earnings / maxEarning) * 100}%` }}>
                                <div className="tooltip">₦{data.earnings.toLocaleString()}</div>
                            </div>
                            <span className="day-label">{data.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TransactionHistory: React.FC = () => {
    const transactions = [
        { id: 1, type: 'Payout', date: 'Nov 15, 2025', amount: '+ ₦87,200', status: 'Completed' },
        { id: 2, type: 'Bonus', date: 'Nov 12, 2025', amount: '+ ₦5,000', status: 'Completed' },
        { id: 3, type: 'Payout', date: 'Nov 8, 2025', amount: '+ ₦75,500', status: 'Completed' },
         { id: 4, type: 'Fuel Card', date: 'Nov 7, 2025', amount: '- ₦10,000', status: 'Deduction' },
    ];
    return (
        <div className="content-card">
            <h3>Transaction History</h3>
            <div className="transactions-list">
               {transactions.map(tx => (
                   <div key={tx.id} className="transaction-item">
                       <div className={`transaction-icon ${tx.amount.startsWith('+') ? 'income' : 'expense'}`}>
                           {tx.amount.startsWith('+') ? <TrendingUp size={20} /> : <DollarSign size={20} />}
                       </div>
                       <div className="transaction-details">
                           <p className="transaction-type">{tx.type}</p>
                           <p className="transaction-date">{tx.date}</p>
                       </div>
                       <div className="transaction-amount">
                           <p className={tx.amount.startsWith('+') ? 'income' : 'expense'}>{tx.amount}</p>
                           <span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span>
                       </div>
                   </div>
               ))}
            </div>
        </div>
    );
}

export default function EarningsPage() {
    return (
        <div className="earnings-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Earnings</h1>
                    <p className="page-subtitle">Track your income and view transaction history.</p>
                </div>
                <button className="download-report-btn">
                    <Download size={18} />
                    <span>Download Report</span>
                </button>
            </header>
            
            <div className="earnings-stats-grid">
                <StatCard title="Today" amount="₦12,500" period="from 5 rides" icon={<DollarSign size={24} />} color="bg-green-100 text-green-600"/>
                <StatCard title="This Week" amount="₦87,200" period="Nov 11 - Nov 17" icon={<BarChart2 size={24} />} color="bg-blue-100 text-blue-600" />
                <StatCard title="This Month" amount="₦215,800" period="November 2025" icon={<Calendar size={24} />} color="bg-purple-100 text-purple-600" />
            </div>

            <div className="earnings-main-content">
                <WeeklyChart />
                <TransactionHistory />
            </div>
        </div>
    );
};