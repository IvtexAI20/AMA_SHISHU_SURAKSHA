import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assest/logo.png';

const translations = {
  English: {
    welcome: "Welcome Back!",
    subwelcome: "Sign in to your console using your official government credentials.",
    email: "Email",
    password: "Password",
    forgot: "Forgot?",
    signinAs: "Sign in as",
    rememberMe: "Remember me",
    signinBtn: "Sign in securely",
    needHelp: "Need help?",
    superAdmin: "Super Admin",
    admin: "Admin",
    districtCoordinator: "District Coordinator",
    blockUser: "Block User",
    emailPlaceholder: "Enter email address",
    passwordPlaceholder: "Enter password"
  },
  Odia: {
    welcome: "ପୁଣିଥରେ ସ୍ଵାଗତ!",
    subwelcome: "ଆପଣଙ୍କର ସରକାରୀ ପ୍ରମାଣପତ୍ର ବ୍ୟବହାର କରି କନସୋଲରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।",
    email: "ଇମେଲ୍",
    password: "ପାସୱାର୍ଡ",
    forgot: "ଭୁଲିଗଲେ କି?",
    signinAs: "ଏହିପରି ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
    rememberMe: "ମୋତେ ମନେ ରଖନ୍ତୁ",
    signinBtn: "ସୁରକ୍ଷିତ ଭାବରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
    needHelp: "ସାହାଯ୍ୟ ଦରକାର କି?",
    superAdmin: "ସୁପର ଆଡମିନ୍",
    admin: "ଆଡମିନ୍",
    districtCoordinator: "ଜିଲ୍ଲା ସଂଯୋଜକ",
    blockUser: "ବ୍ଲକ ବ୍ୟବହାରକାରୀ",
    emailPlaceholder: "ଇମେଲ୍ ପ୍ରବେଶ କରନ୍ତୁ",
    passwordPlaceholder: "ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ"
  },
  Hindi: {
    welcome: "आपका स्वागत है!",
    subwelcome: "अपने आधिकारिक सरकारी क्रेडेंशियल्स का उपयोग करके अपने कंसोल में साइन इन करें।",
    email: "ईमेल",
    password: "पासवर्ड",
    forgot: "भूल गए?",
    signinAs: "इस रूप में साइन इन करें",
    rememberMe: "मुझे याद रखें",
    signinBtn: "सुरक्षित रूप से साइन इन करें",
    needHelp: "सहायता चाहिए?",
    superAdmin: "सुपर एडमिन",
    admin: "एडमिन",
    districtCoordinator: "जिला समन्वयक",
    blockUser: "ब्लॉक उपयोगकर्ता",
    emailPlaceholder: "ईमेल दर्ज करें",
    passwordPlaceholder: "पासवर्ड दर्ज करें"
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');

  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'Test@123') {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans bg-white">

      {/* Left Side: Brand Banner */}
      <div className="w-full md:w-[45%] lg:w-[42%] xl:w-[40%] bg-gradient-to-b from-[#0038a8] via-[#002776] to-[#001746] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white min-h-[380px] md:min-h-screen">

        {/* Subtle concentric line vectors in background */}
        <div className="absolute -top-10 -right-10 w-64 h-64 border border-blue-400/10 rounded-full pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 border border-blue-400/10 rounded-full pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] border border-blue-400/5 rounded-full pointer-events-none"></div>

        {/* Decorative Dot Grid in Top-Left */}
        <div className="relative z-10 opacity-20 flex flex-col gap-1 w-12">
          {[...Array(4)].map((_, r) => (
            <div key={r} className="flex gap-1.5">
              {[...Array(6)].map((_, c) => (
                <div key={c} className="w-1 h-1 bg-white rounded-full"></div>
              ))}
            </div>
          ))}
        </div>

        {/* Center Brand Content */}
        <div className="my-auto flex flex-col items-center text-center relative z-10 py-8 lg:py-0">
          {/* Logo Image */}
          <div className="w-36 h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mb-6">
            <img
              src={logoImg}
              alt="Ama Shishu Suraksha Logo"
              className="w-full h-full object-contain select-none"
            />
          </div>

          {/* Brand Title */}
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-wide leading-tight">
            AMA <span className="text-[#38bdf8]">SHISHU</span> SURAKSHA
          </h1>

          {/* Decorative blue accent line */}
          <div className="w-16 h-0.5 bg-[#0080ff] my-4 rounded-full"></div>

          {/* Subtitle */}
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-blue-200 uppercase select-none">
            Government of Odisha
          </p>
        </div>

        {/* Bottom Graphics: Custom SVG Odisha Temples & Trees Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden pointer-events-none z-0">
          <svg
            viewBox="0 0 400 130"
            className="w-full h-full text-[#001746] fill-current opacity-85"
            preserveAspectRatio="none"
          >
            {/* Back hills/layer */}
            <path d="M -10,130 C 50,110 120,120 180,115 C 240,110 320,125 410,130 Z" fill="#001f5c" opacity="0.4" />

            {/* Left Trees */}
            <circle cx="15" cy="110" r="15" fill="#001440" opacity="0.9" />
            <circle cx="32" cy="115" r="12" fill="#001440" opacity="0.9" />
            <circle cx="8" cy="120" r="10" fill="#001440" opacity="0.9" />
            {/* Left Palm tree */}
            <path d="M 45,120 Q 43,105 38,90 L 40,90 Q 45,105 47,120 Z" fill="#001440" />
            {/* Palm leaves */}
            <path d="M 38,90 Q 30,85 24,90 Q 32,92 38,90 Q 32,82 28,78 Q 36,86 38,90 Q 38,80 38,72 Q 40,81 38,90 Q 45,80 50,78 Q 44,86 38,90 Q 48,88 54,92 Q 44,93 38,90 Z" fill="#001440" />

            {/* Mid-Left Temple (Mukteshwar/Rajarani style spire) */}
            <path d="M 120,130 L 120,95 Q 120,80 124,70 Q 127,60 131,52 Q 133,48 135,48 Q 137,48 139,52 Q 143,60 146,70 Q 150,80 150,95 L 150,130 Z" fill="#001035" />
            {/* Amalaka / Cap */}
            <ellipse cx="135" cy="46" rx="6" ry="2" fill="#001035" />
            {/* Kalasha and tiny flag */}
            <line x1="135" y1="44" x2="135" y2="35" stroke="#001035" strokeWidth="1.5" />
            <path d="M 135,38 L 142,35 L 135,32 Z" fill="#001035" />

            {/* Main Temple (Jagannath Temple style) */}
            <path d="M 180,130 L 180,95 C 180,90 181,85 183,75 C 186,63 190,52 195,40 C 197,35 200,32 203,32 C 206,32 209,35 211,40 C 216,52 220,63 223,75 C 225,85 226,90 226,95 L 226,130 Z" fill="#000d2b" />
            {/* Horizontal bands decoration (Subtle ridges) */}
            <line x1="182" y1="92" x2="224" y2="92" stroke="#001746" strokeWidth="1.5" opacity="0.4" />
            <line x1="184" y1="80" x2="222" y2="80" stroke="#001746" strokeWidth="1.5" opacity="0.4" />
            <line x1="187" y1="68" x2="219" y2="68" stroke="#001746" strokeWidth="1.5" opacity="0.4" />
            <line x1="191" y1="55" x2="215" y2="55" stroke="#001746" strokeWidth="1.5" opacity="0.4" />
            {/* Amalaka */}
            <ellipse cx="203" cy="30" rx="9" ry="3" fill="#000d2b" />
            {/* Kalasha */}
            <circle cx="203" cy="25" r="2.5" fill="#000d2b" />
            {/* Flag Mast */}
            <line x1="203" y1="23" x2="203" y2="5" stroke="#000d2b" strokeWidth="1.5" />
            {/* Fluttering Flag */}
            <path d="M 203,15 C 208,13 213,17 218,14 L 218,8 C 213,11 208,7 203,9 Z" fill="#000d2b" />

            {/* Smaller Right Temple */}
            <path d="M 245,130 L 245,102 Q 245,90 248,82 Q 251,74 254,68 C 255,66 257,65 258,65 C 259,65 261,66 262,68 Q 265,74 268,82 Q 271,90 271,102 L 271,130 Z" fill="#00123a" />
            {/* Amalaka */}
            <ellipse cx="258" cy="63" rx="5" ry="1.5" fill="#00123a" />
            <line x1="258" y1="62" x2="258" y2="54" stroke="#00123a" strokeWidth="1.2" />
            <path d="M 258,58 L 264,56 L 258,54 Z" fill="#00123a" />

            {/* Trees in front of temples */}
            <circle cx="105" cy="115" r="14" fill="#000d2b" />
            <circle cx="120" cy="120" r="10" fill="#000d2b" />
            <circle cx="160" cy="122" r="11" fill="#000d2b" />
            <circle cx="240" cy="120" r="12" fill="#000e30" />
            <circle cx="285" cy="115" r="16" fill="#000d2b" />
            <circle cx="305" cy="118" r="13" fill="#000d2b" />

            {/* Right Palm tree */}
            <path d="M 355,130 Q 352,110 345,92 L 347,92 Q 354,110 357,130 Z" fill="#001038" />
            <path d="M 345,92 Q 337,87 331,92 Q 339,94 345,92 Q 339,84 335,80 Q 343,88 345,92 Q 345,82 345,74 Q 347,83 345,92 Q 352,82 357,80 Q 351,88 345,92 Q 355,90 361,94 Q 351,95 345,92 Z" fill="#001038" />

            {/* Far Right Bush */}
            <circle cx="380" cy="120" r="15" fill="#001440" />
            <circle cx="395" cy="125" r="10" fill="#001440" />
          </svg>
        </div>

      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-[55%] lg:w-[58%] xl:w-[60%] bg-slate-50/60 flex items-center justify-center relative px-4 sm:px-8 lg:px-12 md:min-h-screen py-10 md:py-12">
        {/* Language Selection Dropdown (Top Right) */}
        <div className="absolute top-6 right-6 sm:right-8 flex items-center gap-1.5 z-20 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 transition-colors shadow-xs">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.003 9.003 0 008.354-5.646M12 21a9 9 0 00-8.354-5.646M12 21c3.291 0 6-3.003 6-7s-2.709-7-6-7-6 3.003-6 7 2.709 7 6 7zM12 2a9 9 0 00-9 9m18 0a9 9 0 01-9 9m9-9H3m9 9a9 9 0 01-9-9m9 0c0-3.997-.895-7-2-7s-2 3.003-2 7 1.895 7 2 7z" />
          </svg>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer border-none pr-1 select-none"
          >
            <option value="English">English</option>
            <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
          </select>
        </div>

        {/* Login Form Elevated Card */}
        <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 p-7 sm:p-9 relative z-10">
          {/* Header lock badge & greetings */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-[#f0f5ff] border border-[#dce7ff] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{t.welcome}</h2>
            <p className="text-sm text-slate-500 mt-2">
              {t.subwelcome}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4.5 h-4.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                {t.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all duration-200 text-sm md:text-base"
                  placeholder={t.emailPlaceholder}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {t.password}
                </label>
                <a href="#forgot" className="text-xs font-semibold text-[#004bcf] hover:text-[#003eb3] hover:underline transition-all">
                  {t.forgot}
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all duration-200 text-sm md:text-base"
                  placeholder={t.passwordPlaceholder}
                />
                {/* Eye Icon Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a9.96 9.96 0 014.122-.963c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 11-4.243-4.243M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-1">
              <label className="relative flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                  rememberMe ? 'bg-[#004bcf] border-[#004bcf]' : 'bg-white border-slate-300'
                }`}>
                  {rememberMe && (
                    <svg className="w-3.5 h-3.5 text-white stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="ml-2.5 text-xs md:text-sm text-slate-600 font-medium hover:text-slate-800 transition-colors">
                  {t.rememberMe}
                </span>
              </label>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#078662] hover:bg-[#066e51] text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all duration-200"
            >
              <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{t.signinBtn}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
