'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Shield, Bell, HelpCircle, Star, Award, Calendar, Edit, Save } from 'lucide-react';
import './RiderProfile.css';

interface RiderProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    totalRides: number;
    rating: number;
    membership: 'Gold' | 'Silver' | 'Bronze';
    license: string;
}

const AdBanner: React.FC = () => (
    <div className="ad-banner-card">
        <div className="ad-content">
            <h4>Boost Your Earnings</h4>
            <p>Drive during peak hours to get 1.5x surge pricing.</p>
            <button>Learn More</button>
        </div>
    </div>
);

export default function RiderProfilePage() {
    const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'preferences'>('personal');
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState<RiderProfile>({
        name: 'Kelechi Eze',
        email: 'kelechi.eze@driver.com',
        phone: '+234 801 234 5678',
        address: '15B, Allen Avenue, Ikeja, Lagos',
        joinDate: 'January 2024',
        totalRides: 1247,
        rating: 4.9,
        membership: 'Gold',
        license: 'LAG-123-XYZ-456'
    });

    const [editForm, setEditForm] = useState(profile);

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);
    };

    const paymentMethods = [
        { id: '1', type: 'bank', account: '•••• 7890', bank: 'GTBank', primary: true },
    ];

    const stats = [
        { label: 'Total Rides', value: profile.totalRides, icon: Calendar },
        { label: 'Member Since', value: profile.joinDate, icon: Award },
        { label: 'Rider Rating', value: profile.rating.toString(), icon: Star }
    ];

    return (
        <div className="profile-container">
            <header className="page-header">
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your account settings and vehicle documents.</p>
            </header>
            <div className="main-grid">
                <div className="main-content-column">
                    <div className="profile-stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-icon-wrapper"><stat.icon size={24} /></div>
                                <p className="stat-value">{stat.value}</p>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="tabs-container"><div className="tabs-wrapper">
                        {(['personal', 'payment', 'preferences'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button ${activeTab === tab ? 'active' : ''}`}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div></div>
                    <div className="tab-content">
                        {activeTab === 'personal' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <h3 className="section-title">Personal Information</h3>
                                    <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
                                        {isEditing ? 'Cancel' : <><Edit size={16}/> Edit</>}
                                    </button>
                                </div>
                                {isEditing ? (
                                    <div className="edit-form">
                                        <div className="form-grid">
                                            <div><label>Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                            <div><label>Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></div>
                                        </div>
                                        <div><label>Phone Number</label><input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                                        <div><label>Address</label><textarea value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} rows={3} /></div>
                                        <button onClick={handleSave} className="save-button"><Save size={16}/> Save Changes</button>
                                    </div>
                                ) : (
                                    <div className="view-mode">
                                        <div className="user-banner">
                                            <div className="user-avatar"><User size={32} /></div>
                                            <div>
                                                <p className="user-name">{profile.name}</p>
                                                <div className="user-meta">
                                                    <span className="membership-badge">{profile.membership} Driver</span>
                                                    <span className="rating-badge"><Star size={14} />{profile.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-grid">
                                            <div className="info-card"><Mail size={20} /><div><p>Email</p><p>{profile.email}</p></div></div>
                                            <div className="info-card"><Phone size={20} /><div><p>Phone</p><p>{profile.phone}</p></div></div>
                                            <div className="info-card"><Shield size={20} /><div><p>License No.</p><p>{profile.license}</p></div></div>
                                            <div className="info-card full-width"><MapPin size={20} /><div><p>Address</p><p>{profile.address}</p></div></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                         {activeTab === 'payment' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <h3 className="section-title">Payout Methods</h3>
                                    <button className="add-card-button">Add Bank Account</button>
                                </div>
                                <div className="payment-methods-list">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="payment-method-card">
                                            <div className="card-details">
                                                <CreditCard size={24} />
                                                <div><p>{method.bank} - {method.account}</p><p>Bank Account</p></div>
                                            </div>
                                            <div className="card-actions">
                                                {method.primary && <span className="primary-badge">Primary</span>}
                                                <button className="edit-link">Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'preferences' && (
                             <div className="content-section">
                                <h3 className="section-title">Preferences</h3>
                                <div className="preferences-list">
                                    <div className="preference-item">
                                        <div className="preference-info"><Bell size={20} /><div><p>Push Notifications</p><p>Receive ride requests and updates</p></div></div>
                                        <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info"><Shield size={20} /><div><p>Two-Factor Authentication</p><p>Extra security for your account</p></div></div>
                                        <label className="toggle-switch"><input type="checkbox" /><span className="slider"></span></label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="sidebar-column">
                     <AdBanner />
                     <div className="quick-actions-card">
                        <h3 className="card-title">Quick Actions</h3>
                        <div className="actions-list">
                            <button className="action-button"><p>My Vehicles</p><p>Manage your cars</p></button>
                            <button className="action-button"><p>Earnings</p><p>View your income details</p></button>
                            <button className="action-button"><p>Help & Support</p><p>Get assistance</p></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};