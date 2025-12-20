import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const Messaging = () => {
  // lightweight animation helpers
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform: translateY(0);} }
      .animate-fade-in { opacity:0; animation: fadeIn 0.6s ease-out forwards; }
      .animate-slide-up { opacity:0; animation: slideUp 0.5s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [newMessage, setNewMessage] = useState({
    receiverId: '',
    studentId: '',
    subject: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);

  const isParent = user?.role === 'parent';
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    fetchConversations();
    fetchUsers();
    if (isParent) {
      fetchStudents();
    }
  }, []);

  // Ensure newMessage.receiverId is set when selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      setNewMessage((prev) => ({ ...prev, receiverId: selectedConversation }));
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data);
      if (response.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0].partner._id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages', {
        params: { conversationWith: selectedConversation }
      });
      setMessages(response.data.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      // Only allow parent-teacher chat
      let filtered = response.data;
      if (isParent) {
        filtered = response.data.filter(u => u.role === 'teacher');
      } else if (isTeacher) {
        filtered = response.data.filter(u => u.role === 'parent');
      }
      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.content.trim() || !newMessage.receiverId) {
      alert('Please select a recipient and enter a message.');
      return;
    }

    try {
      await axios.post('/api/messages', newMessage);
      setNewMessage({
        receiverId: selectedConversation,
        studentId: '',
        subject: '',
        content: '',
      });
      fetchMessages();
      fetchConversations();
    } catch (error) {
      // Show backend validation error if available
      let msg = 'Error sending message';
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      } else if (error.response && error.response.data && error.response.data.errors) {
        // Mongoose validation errors
        msg = Object.values(error.response.data.errors).map(e => e.message).join('\n');
      }
      console.error('Error sending message:', error);
      alert(msg);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`);
      fetchMessages();
      fetchConversations();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-slate-100">
        <div className="flex h-[calc(100vh-8rem)] page-hero max-w-6xl mx-auto px-4 py-6 gap-4 animate-fade-in">
        {/* Conversations List */}
        <div className="w-1/3 border border-amber-800/12 bg-gradient-to-br from-indigo-800/20 to-purple-900/10 rounded-xl shadow-2xl overflow-y-auto card text-slate-100 animate-slide-up">
          <div className="p-4 border-b border-amber-800/12 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-t-xl">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="divide-y divide-indigo-800/10">
            {conversations.map((conv) => (
              <button
                key={conv.partner._id}
                onClick={() => {
                  setSelectedConversation(conv.partner._id);
                }}
                className={`w-full p-4 text-left hover:bg-indigo-800/30 transition-colors ${
                  selectedConversation === conv.partner._id ? 'bg-indigo-800/30 border-l-4 border-amber-400' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-100">
                      {conv.partner.firstName} {conv.partner.lastName}
                    </p>
                    <p className="text-sm text-amber-300 capitalize">{conv.partner.role}</p>
                    {conv.lastMessage && (
                      <p className="text-sm text-slate-300 mt-1 truncate">
                        {conv.lastMessage.content.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-amber-400 text-slate-900 text-xs font-bold rounded-full px-2 py-1 shadow">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {/* Start new conversation */}
          <div className="p-4 border-t border-amber-800/12">
            <h3 className="text-md font-semibold mb-2 text-slate-100">Start New Conversation</h3>
            <select
              value={selectedConversation || ''}
              onChange={e => {
                setSelectedConversation(e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm mb-2 transition"
            >
              <option value="">Select {isParent ? 'Teacher' : isTeacher ? 'Parent' : 'User'}</option>
              {users.map(u => (
                <option key={u._id} value={u._id} className="bg-slate-800 text-slate-100">
                  {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-800/12 to-slate-900/8 rounded-xl shadow-2xl card border border-amber-800/12 animate-slide-up text-slate-100">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-amber-800/12 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-t-xl">
                <h3 className="text-lg font-semibold text-white">
                  {conversations.find(c => c.partner._id === selectedConversation)?.partner.firstName}{' '}
                  {conversations.find(c => c.partner._id === selectedConversation)?.partner.lastName}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
                {messages.map((message) => {
                  const isOwn = message.senderId._id === user.id;
                  const isUnread = !message.isRead && !isOwn;

                  if (isUnread) {
                    // mark as read for incoming unread messages
                    markAsRead(message._id);
                  }

                  return (
                    <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md px-4 py-2 rounded-2xl shadow ${
                          isOwn
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-slate-800/40 border border-amber-800/8 text-slate-100'
                        } transition-transform duration-200 transform hover:scale-[1.01]`}
                      >
                        <p className={`text-xs font-semibold mb-1 ${isOwn ? 'text-indigo-100' : 'text-amber-200'}`}>
                          {message.senderId.firstName} {message.senderId.lastName}
                        </p>
                        {message.subject && (
                          <p className={`font-semibold mb-1 ${isOwn ? 'text-white' : 'text-slate-100'}`}>
                            {message.subject}
                          </p>
                        )}
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-amber-800/12 bg-gradient-to-t from-slate-900/40 to-transparent rounded-b-xl">
                <form onSubmit={handleSendMessage} className="space-y-2">
                  {isParent && students.length > 0 && (
                    <select
                      value={newMessage.studentId}
                      onChange={(e) => setNewMessage({ ...newMessage, studentId: e.target.value })}
                      className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition bg-slate-800/40 text-slate-100"
                    >
                      <option value="">Select Student (Optional)</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id} className="text-slate-100">
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    placeholder="Subject (Optional)"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                  />
                  <div className="flex space-x-2">
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      rows="3"
                      required
                      className="flex-1 px-3 py-2 bg-slate-800/40 text-slate-100 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <button
                      type="submit"
                      className="btn flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 bg-slate-900/40 rounded-xl shadow-inner">
              <p className="font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Messaging;

