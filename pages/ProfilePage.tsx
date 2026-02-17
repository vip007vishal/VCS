import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { User, Shield, Key, Smartphone, Clock, LogOut, Laptop } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { currentUser, logout, addNotification } = useSimulation();
    const [twoFactor, setTwoFactor] = useState(false);

    const toggle2FA = () => {
        setTwoFactor(!twoFactor);
        addNotification('Security Update', `2FA has been ${!twoFactor ? 'enabled' : 'disabled'}.`, 'success');
    };

    const devices = [
        { id: 1, name: 'MacBook Pro 16"', location: 'San Francisco, US', active: true, icon: Laptop },
        { id: 2, name: 'iPhone 13', location: 'San Francisco, US', active: false, lastSeen: '2h ago', icon: Smartphone },
        { id: 3, name: 'Windows PC', location: 'New York, US', active: false, lastSeen: '5d ago', icon: Laptop },
    ];

    return (
        <div className="space-y-6">
            <div className="relative h-48 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-xl overflow-hidden mb-12">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 flex items-end translate-y-1/2 gap-6">
                    <img src={currentUser?.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-slate-950 shadow-xl" />
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold text-white">{currentUser?.name}</h2>
                        <div className="flex gap-2 items-center text-slate-300">
                             <span>{currentUser?.role}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                             <span>Level {currentUser?.verificationLevel}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Personal Information" icon={User}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Full Name</label>
                                <div className="p-2 bg-slate-900 border border-slate-700 rounded text-slate-300">{currentUser?.name}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Email Address</label>
                                <div className="p-2 bg-slate-900 border border-slate-700 rounded text-slate-300">user@skillverse.ai</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Role</label>
                                <div className="p-2 bg-slate-900 border border-slate-700 rounded text-slate-300 capitalize">{currentUser?.role.toLowerCase()}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Employee ID</label>
                                <div className="p-2 bg-slate-900 border border-slate-700 rounded text-slate-300 font-mono text-sm">{currentUser?.id}</div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline">Edit Profile</Button>
                        </div>
                    </Card>

                    <Card title="Active Sessions" icon={Clock}>
                        <div className="space-y-4">
                            {devices.map(device => (
                                <div key={device.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-800 rounded text-slate-400">
                                            <device.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-sm">{device.name}</p>
                                            <p className="text-xs text-slate-500">{device.location} • {device.active ? <span className="text-emerald-400">Active Now</span> : device.lastSeen}</p>
                                        </div>
                                    </div>
                                    {!device.active && (
                                        <button className="text-xs text-rose-400 hover:underline">Revoke</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Security Settings" icon={Shield}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-200">Two-Factor Auth</p>
                                    <p className="text-xs text-slate-500">Secure your account</p>
                                </div>
                                <div 
                                    className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${twoFactor ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                    onClick={toggle2FA}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${twoFactor ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Key size={16} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-200">Password</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">Last changed 3 months ago</p>
                                <Button variant="secondary" className="w-full text-xs">Change Password</Button>
                            </div>
                        </div>
                    </Card>

                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <Button variant="danger" className="w-full" onClick={logout}>
                            <LogOut size={16} /> Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;