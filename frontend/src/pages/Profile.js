import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiLock, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put('/api/users/profile', profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      await axios.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error changing password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-[#2b0f3f] via-[#062e2a] to-[#3b2f12]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-white/70 mt-1">
              Manage your account information and preferences
            </p>
          </div>

          {/* Tabs Card */}
          <div className={`${"bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"} rounded-2xl overflow-hidden`}>
            <div className="flex border-b border-white/20">
              {[
                { key: 'profile', label: 'Profile', icon: <FiUser /> },
                { key: 'password', label: 'Change Password', icon: <FiLock /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold
                    transition-all duration-300
                    ${
                      activeTab === tab.key
                        ? 'text-emerald-400 border-b-2 border-emerald-400'
                        : 'text-white/60 hover:text-white'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-6 rounded-xl p-4 text-sm font-medium border
                      ${
                        message.type === 'success'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30'
                          : 'bg-red-500/10 text-red-300 border-red-400/30'
                      }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PROFILE */}
              {activeTab === 'profile' && (
                <motion.form
                  onSubmit={handleProfileUpdate}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-white/80 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-emerald-400 px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/80 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-emerald-400 px-4 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full rounded-xl bg-white/5 border border-white/10 text-white/50 px-4 py-2"
                    />
                    <p className="text-xs text-white/60 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-1">Address</label>
                    <textarea
                      rows="3"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-emerald-400 px-4 py-2"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-emerald-400 via-yellow-300 to-yellow-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(253,224,71,0.6)] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* PASSWORD */}
              {activeTab === 'password' && (
                <motion.form
                  onSubmit={handlePasswordChange}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 px-4 py-2"
                    />
                    <p className="text-xs text-white/60 mt-1">Password must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 px-4 py-2"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-purple-400 via-emerald-400 to-yellow-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(167,139,250,0.6)] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>

          {/* Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl p-6`}>
            <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Role</span>
                <span className="capitalize text-emerald-400 font-semibold">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>
            
            {/* Logout Button */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;

