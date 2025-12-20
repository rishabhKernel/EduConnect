import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const userRole =
        JSON.parse(localStorage.getItem('user'))?.role ||
        (formData.email.includes('teacher') ? 'teacher' : 'parent');

      if (userRole === 'parent') navigate('/parent/dashboard');
      else if (userRole === 'teacher') navigate('/teacher/dashboard');
      else navigate('/parent/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4
      bg-[url('./assets/login.png')]
      bg-cover bg-center bg-no-repeat
      animate-[parallax_40s_linear_infinite]"
    >

      {/* Moonlight shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent
                      animate-[shimmer_8s_ease-in-out_infinite]"></div>

      {/* Cinematic dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#081a2b]/70 via-[#0b2d3a]/50 to-[#081a2b]/80"></div>

      {/* Floating hologram icons */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-20 left-16 text-cyan-300 opacity-40 text-3xl animate-[float_6s_ease-in-out_infinite]">⚙️</span>
        <span className="absolute top-40 right-24 text-teal-300 opacity-40 text-2xl animate-[float_7s_ease-in-out_infinite]">📘</span>
        <span className="absolute bottom-32 left-24 text-sky-300 opacity-40 text-3xl animate-[float_8s_ease-in-out_infinite]">🧪</span>
        <span className="absolute bottom-20 right-32 text-amber-300 opacity-40 text-2xl animate-[float_6.5s_ease-in-out_infinite]">🎵</span>
      </div>

      {/* Glass Login Card */}
      <div
        className="relative w-full max-w-sm sm:max-w-md
        bg-white/10 backdrop-blur-2xl
        border border-white/20
        rounded-3xl p-6 sm:p-8 space-y-6
        shadow-[0_0_90px_rgba(56,189,248,0.35)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_140px_rgba(56,189,248,0.55)]"
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
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white drop-shadow">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-cyan-200">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-teal-300 hover:text-teal-200 transition"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="rounded-md -space-y-px">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-2
              bg-white/10 text-white placeholder-cyan-200
              border border-white/20 rounded-t-md
              focus:outline-none focus:ring-2 focus:ring-cyan-400
              transition"
            />

            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2
              bg-white/10 text-white placeholder-cyan-200
              border border-white/20 rounded-b-md
              focus:outline-none focus:ring-2 focus:ring-cyan-400
              transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg
            text-white font-semibold tracking-wide
            bg-gradient-to-r from-cyan-500 via-teal-500 to-amber-400
            hover:from-cyan-400 hover:via-teal-400 hover:to-amber-300
            shadow-lg hover:shadow-[0_0_40px_rgba(250,204,21,0.7)]
            transition-all active:scale-[0.97]"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-cyan-200 hover:text-cyan-100 transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Tailwind keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.1; }
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

export default Login;
