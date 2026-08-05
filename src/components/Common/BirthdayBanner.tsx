import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const BirthdayBanner: React.FC = () => {
  const { lang } = useLanguage();
  const birthDateStr = localStorage.getItem('user_birth_date');

  if (!birthDateStr) return null;

  const birth = new Date(birthDateStr + 'T00:00:00');
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < today) {
    nextBday.setFullYear(today.getFullYear() + 1);
  }

  const diffDays = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 30 || diffDays < 0) return null;

  let msg = '';
  if (diffDays === 0) {
    msg =
      lang === 'ar'
        ? '🥳🎉 اليوم هو عيد ميلادك! كل عام وأنت بألف خير ونجاح وتوفيق دائم! ✨'
        : '🥳🎉 Happy Birthday Today! Wishing you success and happiness always! ✨';
  } else if (diffDays <= 7) {
    msg =
      lang === 'ar'
        ? `🎂 تنبيه قريب جداً: متبقي على عيد ميلادك ${diffDays} أيام فقط! 🎉`
        : `🎂 Countdown Alert: Only ${diffDays} days left until your Birthday! 🎉`;
  } else {
    msg =
      lang === 'ar'
        ? `🎈 عد تنازلي: متبقي على عيد ميلادك القادم ${diffDays} يوماً ✨`
        : `🎈 Birthday Countdown: ${diffDays} days remaining until your birthday ✨`;
  }

  return (
    <div className="bg-gradient-to-r from-[var(--amber-tint)] to-[#FFF3E0] border border-[var(--amber)] text-[var(--teal-dark)] rounded-xl py-2 px-4 text-xs font-bold text-center mb-3 shadow-xs animate-pulse">
      <span dangerouslySetInnerHTML={{ __html: msg }} />
    </div>
  );
};