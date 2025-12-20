import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      if (formData.role === 'parent') navigate('/parent/dashboard');
      else if (formData.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/parent/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4
      bg-[url('./assets/register.png')]
      bg-cover bg-center bg-no-repeat
      animate-[parallax_40s_linear_infinite]"
    >

      {/* Moon shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent
                      animate-[shimmer_8s_ease-in-out_infinite]"></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#041b2d]/80 via-[#083344]/60 to-[#020617]/90"></div>

      {/* 🌀 Portal Ripple */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="absolute w-[420px] h-[420px] rounded-full border border-cyan-400/30 animate-[ripple_6s_linear_infinite]"></span>
        <span className="absolute w-[420px] h-[420px] rounded-full border border-cyan-300/20 animate-[ripple_6s_linear_infinite_2s]"></span>
        <span className="absolute w-[420px] h-[420px] rounded-full border border-teal-300/20 animate-[ripple_6s_linear_infinite_4s]"></span>
      </div>

      {/* Floating hologram icons */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-20 left-16 text-cyan-300 opacity-40 text-3xl animate-[float_6s_ease-in-out_infinite]">📘</span>
        <span className="absolute top-40 right-24 text-teal-300 opacity-40 text-2xl animate-[float_7s_ease-in-out_infinite]">⚙️</span>
        <span className="absolute bottom-32 left-24 text-sky-300 opacity-40 text-3xl animate-[float_8s_ease-in-out_infinite]">🧪</span>
        <span className="absolute bottom-20 right-32 text-amber-300 opacity-40 text-2xl animate-[float_6.5s_ease-in-out_infinite]">🎵</span>
      </div>

      {/* Glass Card */}
      <div
        className="relative w-full max-w-md
        bg-white/10 backdrop-blur-2xl
        border border-white/20
        rounded-3xl p-8 space-y-6
        shadow-[0_0_120px_rgba(56,189,248,0.35)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_180px_rgba(56,189,248,0.6)]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <FiBookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              EduConnect
            </span>
          </Link>
        </div>

        <div>
          <h2 className="text-center text-3xl font-extrabold text-white drop-shadow">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-cyan-200">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-teal-300 hover:text-teal-200 transition"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="input-glass"
              />
              <input
                name="lastName"
                placeholder="Last name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="input-glass"
              />
            </div>

            <input name="email" type="email" placeholder="Email address" required value={formData.email} onChange={handleChange} className="input-glass" />

            <select name="role" value={formData.role} onChange={handleChange} className="input-glass">
              <option className="bg-[#020617]" value="parent">Parent</option>
              <option className="bg-[#020617]" value="teacher">Teacher</option>
            </select>

            <input name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleChange} className="input-glass" />
            <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="input-glass" />
            <input name="confirmPassword" type="password" placeholder="Confirm password" required value={formData.confirmPassword} onChange={handleChange} className="input-glass" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold
            bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400
            hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-300
            shadow-lg hover:shadow-[0_0_40px_rgba(56,189,248,0.7)]
            transition-all active:scale-[0.97]"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-sm text-cyan-200 hover:text-cyan-100 transition">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .input-glass {
            width: 100%;
            padding: 0.6rem 1rem;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 0.5rem;
            transition: all 0.3s;
          }
          .input-glass::placeholder { color: #a5f3fc; }
          .input-glass:focus { outline: none; box-shadow: 0 0 0 2px #22d3ee; }

          @keyframes ripple {
            0% { transform: scale(0.6); opacity: 0.6; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          @keyframes float {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
          @keyframes shimmer {
            0%,100% { opacity: 0.1; }
            50% { opacity: 0.25; }
          }
          @keyframes parallax {
            0% { background-position: center top; }
            100% { background-position: center bottom; }
          }
        `}
      </style>
    </div>
  );
};

export default Register;
