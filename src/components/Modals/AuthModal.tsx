import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<any>;
  onEmailLogin: (email: string, pass: string) => Promise<any>;
  onEmailSignUp: (email: string, pass: string, name: string) => Promise<any>;
  onResetPassword: (email: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onEmailLogin,
  onEmailSignUp,
  onResetPassword,
}) => {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<'google' | 'email'>('google');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    try {
      setErrMsg(null);
      await onGoogleLogin();
      onClose();
    } catch (err: any) {
      setErrMsg(lang === 'ar' ? 'فشل تسجيل الدخول بـ Google' : 'Google sign-in failed');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setInfoMsg(null);
    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrMsg(lang === 'ar' ? 'اكتب اسمك أولاً' : 'Please enter your name');
          return;
        }
        await onEmailSignUp(email, password, name);
      } else {
        await onEmailLogin(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrMsg(lang === 'ar' ? 'تأكد من بيانات الدخول' : 'Invalid email or password');
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setErrMsg(lang === 'ar' ? 'اكتب البريد أولاً' : 'Enter email first');
      return;
    }
    try {
      await onResetPassword(email);
      setInfoMsg(lang === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور' : 'Reset link sent');
    } catch (err: any) {
      setErrMsg(lang === 'ar' ? 'تعذر إرسال الرابط' : 'Failed to send reset link');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[420px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
          <h3 className="font-bold text-lg text-[var(--teal-dark)] flex items-center gap-2">
            <span>🔑</span>
            <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
          </h3>
          <button onClick={onClose} className="text-xl text-[var(--ink-soft)] hover:text-[var(--rose)] cursor-pointer">&times;</button>
        </div>

        {errMsg && <div className="p-2 mb-3 text-xs font-bold text-[var(--rose)] bg-[var(--rose-tint)] border border-[var(--rose)] rounded-lg text-center">{errMsg}</div>}
        {infoMsg && <div className="p-2 mb-3 text-xs font-bold text-[var(--teal-dark)] bg-[var(--teal-tint)] border border-[var(--teal)] rounded-lg text-center">{infoMsg}</div>}

        <div className="flex border-b border-[var(--line)] mb-3">
          <button onClick={() => setTab('google')} className={`flex-1 pb-2 text-xs font-bold border-b-2 ${tab === 'google' ? 'border-[var(--teal)] text-[var(--teal-dark)]' : 'border-transparent text-[var(--ink-faint)]'}`}>Google</button>
          <button onClick={() => setTab('email')} className={`flex-1 pb-2 text-xs font-bold border-b-2 ${tab === 'email' ? 'border-[var(--teal)] text-[var(--teal-dark)]' : 'border-transparent text-[var(--ink-faint)]'}`}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</button>
        </div>

        {tab === 'google' ? (
          <button onClick={handleGoogle} className="w-full py-2.5 px-3 flex items-center justify-center gap-2 rounded-xl text-xs font-bold bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--teal-tint)] cursor-pointer">
            <span>🔵</span> <span>{lang === 'ar' ? 'الدخول بحساب Google' : 'Sign in with Google'}</span>
          </button>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2.5">
            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-bold text-[var(--teal-dark)] block mb-1">{lang === 'ar' ? 'الاسم:' : 'Name:'}</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold text-[var(--teal-dark)] block mb-1">{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[var(--teal-dark)] block mb-1">{lang === 'ar' ? 'كلمة المرور:' : 'Password:'}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none" />
            </div>
            <button type="submit" className="w-full py-2 bg-[var(--teal)] text-white text-xs font-bold rounded-xl hover:bg-[var(--teal-dark)] cursor-pointer">
              {mode === 'signin' ? (lang === 'ar' ? 'دخول' : 'Sign In') : (lang === 'ar' ? 'إنشاء حساب' : 'Sign Up')}
            </button>
            <div className="flex justify-between text-[10px] pt-1">
              <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-[var(--teal-dark)] font-bold cursor-pointer">
                {mode === 'signin' ? (lang === 'ar' ? 'معندكش حساب؟ اعمل واحد' : 'No account? Create one') : (lang === 'ar' ? 'عندك حساب؟ ادخل' : 'Already have an account?')}
              </button>
              <button type="button" onClick={handleReset} className="text-[var(--ink-faint)] cursor-pointer">
                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};