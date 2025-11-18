'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Shield, Bell, HelpCircle, Star, Award, Calendar } from 'lucide-react';

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

const Profile: React.FC = () => {
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
        {
            id: '1',
            type: 'credit',
            last4: '4242',
            brand: 'Visa',
            expiry: '12/25',
            primary: true
        },
        {
            id: '2',
            type: 'credit',
            last4: '5555',
            brand: 'Mastercard',
            expiry: '08/24',
            primary: false
        }
    ];

    const stats = [
        { label: 'Total Rides', value: profile.totalRides, icon: Calendar },
        { label: 'Member Since', value: profile.joinDate, icon: Award },
        { label: 'Avg Rating', value: profile.rating.toString(), icon: Star }
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <header className="pt-2 md:pt-0">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your account settings and preferences</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                                    <stat.icon size={24} className="text-yellow-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm">
                        <div className="flex space-x-2">
                            {(['personal', 'payment', 'preferences'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                                        activeTab === tab
                                            ? 'bg-[#FFC107] text-black'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    {tab === 'personal' && 'Personal Info'}
                                    {tab === 'payment' && 'Payment Methods'}
                                    {tab === 'preferences' && 'Preferences'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-4 py-2 text-[#FFC107] hover:bg-yellow-50 rounded-lg font-semibold transition-colors"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <textarea
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            className="bg-[#FFC107] hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                                <User size={32} className="text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-800">{profile.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                        {profile.membership} Member
                                                    </span>
                                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Star size={14} className="text-yellow-400 fill-current" />
                                                        {profile.rating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                                <Mail size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-semibold text-gray-800">{profile.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                                <Phone size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="font-semibold text-gray-800">{profile.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl md:col-span-2">
                                                <MapPin size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="font-semibold text-gray-800">{profile.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-800">Payment Methods</h3>
                                    <button className="px-4 py-2 bg-[#FFC107] hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors">
                                        Add New Card
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#FFC107] transition-colors">
                                            <div className="flex items-center gap-4">
                                                <CreditCard size={24} className="text-gray-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {method.brand} •••• {method.last4}
                                                    </p>
                                                    <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {method.primary && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                        Primary
                                                    </span>
                                                )}
                                                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800">Preferences</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <Bell size={20} className="text-gray-400" />
                                            <div>
                                                <p className="font-semibold text-gray-800">Push Notifications</p>
                                                <p className="text-sm text-gray-500">Receive ride updates and promotions</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC107]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <Shield size={20} className="text-gray-400" />
                                            <div>
                                                <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
                                                <p className="text-sm text-gray-500">Extra security for your account</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC107]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <HelpCircle size={20} className="text-gray-400" />
                                            <div>
                                                <p className="font-semibold text-gray-800">Customer Support</p>
                                                <p className="text-sm text-gray-500">Get help with your account</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-semibold">
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Membership Card */}
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Gold Membership</h3>
                            <Award size={24} />
                        </div>
                        <p className="text-yellow-100 text-sm mb-4">Enjoy premium benefits and priority support</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Priority booking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>5% cashback on rides</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Dedicated support</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#FFC107] hover:bg-yellow-50 transition-colors">
                                <p className="font-semibold text-gray-800">Ride History</p>
                                <p className="text-sm text-gray-500">View all your past trips</p>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#FFC107] hover:bg-yellow-50 transition-colors">
                                <p className="font-semibold text-gray-800">Safety Center</p>
                                <p className="text-sm text-gray-500">Learn about safety features</p>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#FFC107] hover:bg-yellow-50 transition-colors">
                                <p className="font-semibold text-gray-800">Help & Support</p>
                                <p className="text-sm text-gray-500">Get assistance</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;