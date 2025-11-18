
'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Shield, Bell, HelpCircle, Star, Award, Calendar } from 'lucide-react';
import './Profile.css';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    totalRides: number;
    rating: number;
    membership: 'Gold' | 'Silver' | 'Bronze';
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'preferences'>('personal');
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, Apt 4B, New York, NY 10001',
        joinDate: 'January 2023',
        totalRides: 47,
        rating: 4.8,
        membership: 'Gold'
    });

    const [editForm, setEditForm] = useState(profile);

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);
    };

    const paymentMethods = [
        { id: '1', type: 'credit', last4: '4242', brand: 'Visa', expiry: '12/25', primary: true },
        { id: '2', type: 'credit', last4: '5555', brand: 'Mastercard', expiry: '08/24', primary: false }
    ];

    const stats = [
        { label: 'Total Rides', value: profile.totalRides, icon: Calendar },
        { label: 'Member Since', value: profile.joinDate, icon: Award },
        { label: 'Avg Rating', value: profile.rating.toString(), icon: Star }
    ];

    return (
        <div className="profile-container">
            <header className="page-header">
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your account settings and preferences</p>
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
                                {tab === 'personal' && 'Personal Info'}
                                {tab === 'payment' && 'Payment Methods'}
                                {tab === 'preferences' && 'Preferences'}
                            </button>
                        ))}
                    </div></div>
                    <div className="tab-content">
                        {activeTab === 'personal' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <h3 className="section-title">Personal Information</h3>
                                    <button onClick={() => setIsEditing(!isEditing)} className="edit-button">{isEditing ? 'Cancel' : 'Edit Profile'}</button>
                                </div>
                                {isEditing ? (
                                    <div className="edit-form">
                                        <div className="form-grid">
                                            <div><label>Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                            <div><label>Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></div>
                                        </div>
                                        <div><label>Phone Number</label><input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                                        <div><label>Address</label><textarea value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} rows={3} /></div>
                                        <button onClick={handleSave} className="save-button">Save Changes</button>
                                    </div>
                                ) : (
                                    <div className="view-mode">
                                        <div className="user-banner">
                                            <div className="user-avatar"><User size={32} /></div>
                                            <div>
                                                <p className="user-name">{profile.name}</p>
                                                <div className="user-meta">
                                                    <span className="membership-badge">{profile.membership} Member</span>
                                                    <span className="rating-badge"><Star size={14} />{profile.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-grid">
                                            <div className="info-card"><Mail size={20} /><div><p>Email</p><p>{profile.email}</p></div></div>
                                            <div className="info-card"><Phone size={20} /><div><p>Phone</p><p>{profile.phone}</p></div></div>
                                            <div className="info-card full-width"><MapPin size={20} /><div><p>Address</p><p>{profile.address}</p></div></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'payment' && (
                            <div className="content-section">
                                <div className="section-header">
                                    <h3 className="section-title">Payment Methods</h3>
                                    <button className="add-card-button">Add New Card</button>
                                </div>
                                <div className="payment-methods-list">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="payment-method-card">
                                            <div className="card-details">
                                                <CreditCard size={24} />
                                                <div><p>{method.brand} •••• {method.last4}</p><p>Expires {method.expiry}</p></div>
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
                                        <div className="preference-info"><Bell size={20} /><div><p>Push Notifications</p><p>Receive ride updates and promotions</p></div></div>
                                        <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info"><Shield size={20} /><div><p>Two-Factor Authentication</p><p>Extra security for your account</p></div></div>
                                        <label className="toggle-switch"><input type="checkbox" /><span className="slider"></span></label>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-info"><HelpCircle size={20} /><div><p>Customer Support</p><p>Get help with your account</p></div></div>
                                        <button className="contact-button">Contact</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="sidebar-column">
                    <div className="membership-card">
                        <div className="membership-header">
                            <h3 className="membership-title">Gold Membership</h3><Award size={24} />
                        </div>
                        <p className="membership-subtitle">Enjoy premium benefits and priority support</p>
                        <div className="benefits-list">
                            <div className="benefit-item"><div className="benefit-dot"></div><span>Priority booking</span></div>
                            <div className="benefit-item"><div className="benefit-dot"></div><span>5% cashback on rides</span></div>
                            <div className="benefit-item"><div className="benefit-dot"></div><span>Dedicated support</span></div>
                        </div>
                    </div>
                    <div className="quick-actions-card">
                        <h3 className="card-title">Quick Actions</h3>
                        <div className="actions-list">
                            <button className="action-button"><p>Ride History</p><p>View all your past trips</p></button>
                            <button className="action-button"><p>Safety Center</p><p>Learn about safety features</p></button>
                            <button className="action-button"><p>Help & Support</p><p>Get assistance</p></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
