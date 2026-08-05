import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    // محاكاة الإرسال بنجاح
    setStatus(
      lang === 'ar'
        ? 'تم إرسال رسالتك بنجاح ✅'
        : 'Your message was sent successfully ✅'
    );
    setEmail('');
    setMessage('');
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="pt-3 border-t border-[var(--line)] mt-3">
      <div className="text-xs font-bold text-[var(--teal-dark)] mb-2 flex items-center gap-1.5">
        <span>💬</span>
        <span>{lang === 'ar' ? 'التواصل والدعم الفني' : 'Contact & Support'}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <label className="text-[10px] font-bold text-[var(--teal-dark)] block mb-1">
            {lang === 'ar' ? 'بريدك الإلكتروني للتواصل:' : 'Your Email:'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full p-2 text-xs rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[var(--teal-dark)] block mb-1">
            {lang === 'ar' ? 'رسالتك أو ملاحظتك:' : 'Your Message:'}
          </label>
          <textarea
            required
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'اكتب اقتراحك، استفسارك، أو مشكلتك هنا...'
                : 'Write your feedback or issue here...'
            }
            className="w-full p-2 text-xs rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none resize-y"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-1.5 px-3 bg-[var(--teal)] text-white text-xs font-bold rounded-lg hover:bg-[var(--teal-dark)] cursor-pointer transition-colors"
          >
            ✉️ {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
          </button>
        </div>

        {status && (
          <div className="p-2 text-xs font-bold text-[var(--teal-dark)] bg-[var(--teal-tint)] border border-[var(--teal)] rounded-lg text-center mt-1">
            {status}
          </div>
        )}
      </form>
    </div>
  );
};