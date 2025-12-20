import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiMail, FiCalendar, FiShield, FiBookOpen, FiAward, FiCheckCircle, FiArrowRight, FiStar } from 'react-icons/fi';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Mouse follower glow */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
        <div className="absolute top-3/4 left-1/4 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl animate-blob animation-delay-5000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: `rgba(${Math.random() > 0.5 ? '6, 182, 212' : '168, 85, 247'}, ${0.2 + Math.random() * 0.4})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              boxShadow: `0 0 ${10 + Math.random() * 10}px rgba(6, 182, 212, 0.3)`
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 3 + Math.random() * 2}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          />
        ))}
      </div>

      {/* Gradient lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        .animate-blob { animation: blob 15s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-6000 { animation-delay: 6s; }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px) rotate(-45deg); opacity: 0; }
        }
        .animate-shooting-star {
          animation: shooting-star 3s ease-in-out infinite;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8), -100px 0 50px 10px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <FiBookOpen className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                EduConnect
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-cyan-300 transition">Features</a>
              <a href="#stats" className="text-slate-300 hover:text-cyan-300 transition">Stats</a>
              <a href="#testimonials" className="text-slate-300 hover:text-cyan-300 transition">Reviews</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-cyan-300 hover:text-cyan-200 font-medium transition">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 mb-8">
              <FiStar className="text-amber-400 mr-2" size={16} />
              <span className="text-cyan-200 text-sm font-medium">Trusted by 10,000+ Schools Worldwide</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Connect, Track &</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
                Succeed Together
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform bridging parents and teachers with seamless communication, 
              real-time progress tracking, and powerful insights to help every student thrive.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/register" className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105 transition-all duration-300 flex items-center">
                Start Free Trial
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 hover:border-cyan-400/40 transition-all duration-300">
                Sign In
              </Link>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '10K+', label: 'Schools' },
                { value: '500K+', label: 'Students' },
                { value: '98%', label: 'Satisfaction' },
                { value: '24/7', label: 'Support' }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Features</span>
              <h3 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                Everything You Need
              </h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Powerful tools designed to enhance communication and track student success
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={FiTrendingUp} title="Progress Tracking" description="Monitor academic performance with detailed analytics, grade tracking, and visual progress reports." color="cyan" />
              <FeatureCard icon={FiUsers} title="Attendance Management" description="Real-time attendance tracking with instant notifications and comprehensive reports." color="emerald" />
              <FeatureCard icon={FiMail} title="Secure Messaging" description="End-to-end encrypted communication between parents and teachers." color="purple" />
              <FeatureCard icon={FiCalendar} title="Meeting Scheduler" description="Easy scheduling with calendar sync, reminders, and video conferencing." color="amber" />
              <FeatureCard icon={FiShield} title="Behavior Reports" description="Track and analyze student behavior with actionable insights." color="rose" />
              <FeatureCard icon={FiAward} title="Announcements" description="Stay updated with school news, events, and important notifications." color="indigo" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl p-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">95%</div>
                  <div className="text-slate-300">Parent Engagement Increase</div>
                </div>
                <div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent mb-2">2x</div>
                  <div className="text-slate-300">Faster Communication</div>
                </div>
                <div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent mb-2">30%</div>
                  <div className="text-slate-300">Better Student Outcomes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
              <h3 className="text-4xl font-bold text-white mt-4">What People Say</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Priya Sharma', role: 'Teacher', text: 'EduConnect has transformed how I communicate with parents. The progress tracking is incredibly intuitive!' },
                { name: 'Rahul Mehta', role: 'Parent', text: 'I love being able to track my children\'s progress in real-time. The app keeps me connected with their education.' },
                { name: 'Anita Verma', role: 'Principal', text: 'Our school\'s parent engagement has increased dramatically since implementing EduConnect.' }
              ].map((testimonial, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} className="text-amber-400 fill-amber-400" size={16} />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-3">
                      <div className="text-white font-medium">{testimonial.name}</div>
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-12 md:p-16 text-center bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-amber-500/20 backdrop-blur-2xl border border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Education?
                </h3>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of schools already using EduConnect to improve student outcomes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register" className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105 transition-all duration-300 flex items-center">
                    Create Free Account
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-sm">
                  <span className="flex items-center"><FiCheckCircle className="text-emerald-400 mr-2" /> Free 14-day trial</span>
                  <span className="flex items-center"><FiCheckCircle className="text-emerald-400 mr-2" /> No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 bg-slate-950/80 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <FiBookOpen className="text-white" size={20} />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">EduConnect</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Empowering education through seamless communication between parents, teachers, and students.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-slate-400 hover:text-cyan-400 transition text-sm">Features</a></li>
                  <li><a href="#stats" className="text-slate-400 hover:text-cyan-400 transition text-sm">Statistics</a></li>
                  <li><a href="#testimonials" className="text-slate-400 hover:text-cyan-400 transition text-sm">Testimonials</a></li>
                  <li><Link to="/login" className="text-slate-400 hover:text-cyan-400 transition text-sm">Login</Link></li>
                  <li><Link to="/register" className="text-slate-400 hover:text-cyan-400 transition text-sm">Register</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition text-sm">Help Center</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition text-sm">Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition text-sm">API Reference</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition text-sm">Blog</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition text-sm">Community</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-400 text-sm">
                    <FiMail className="mr-3 text-cyan-400" size={16} />
                    support@educonnect.com
                  </li>
                  <li className="flex items-center text-slate-400 text-sm">
                    <FiCalendar className="mr-3 text-cyan-400" size={16} />
                    Mon - Fri: 9AM - 6PM
                  </li>
                  <li className="flex items-start text-slate-400 text-sm">
                    <FiUsers className="mr-3 text-cyan-400 mt-0.5" size={16} />
                    <span>123 Education Street,<br />New Delhi, India 110001</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">&copy; 2024 EduConnect. All rights reserved.</p>
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm transition">Privacy Policy</a>
                  <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm transition">Terms of Service</a>
                  <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm transition">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-400/50 shadow-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/50 shadow-emerald-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 hover:border-purple-400/50 shadow-purple-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 hover:border-amber-400/50 shadow-amber-500/20',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 hover:border-rose-400/50 shadow-rose-500/20',
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-400/50 shadow-indigo-500/20'
  };

  const iconColors = {
    cyan: 'from-cyan-400 to-cyan-600 shadow-cyan-500/50',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/50',
    purple: 'from-purple-400 to-purple-600 shadow-purple-500/50',
    amber: 'from-amber-400 to-amber-600 shadow-amber-500/50',
    rose: 'from-rose-400 to-rose-600 shadow-rose-500/50',
    indigo: 'from-indigo-400 to-indigo-600 shadow-indigo-500/50'
  };

  return (
    <div className={`group p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconColors[color]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white" size={24} />
      </div>
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default LandingPage;
