import type { Lang } from "../types";

export interface Strings {
  brand: string;
  today: string;
  hoursTitle: string;
  timerStartBtnText: string;
  timerStopBtnText: string;
  timerModalTitle: string;
  timerSaveBtnText: string;
  priorTitle: string;
  ringLabel: string;
  ringSub: string;
  footer: string;
  langBtn: string;
  saving: string;
  saved: string;
  saveError: string;
  collapseHours: string;
  expandHours: string;
  compactBtn: string;
  expandedBtn: string;
  pwaInstallBtn: string;
  txtAiBtn: string;
  txtChartsBtn: string;
  txtExportBtn: string;
  aiModalTitle: string;
  chartsModalTitle: string;
  exportModalTitle: string;
  pwaModalTitle: string;
  pwaModalDesc: string;
  pwaAndroidTitle: string;
  pwaAndroidDesc: string;
  pwaIosTitle: string;
  pwaIosDesc: string;
  txtPrintPdf: string;
  txtExportCsv: string;
  txtBackupJson: string;
  txtRollover: string;
  goldenTitle: string;
  goldenPlaceholder: string;
  priorityPlaceholder: string;
  addPriority: string;
  tagLegendTitle: string;
  hourPlaceholder: string;
  ringCount: (filled: number, total: number) => string;
  priorProgress: (done: number, total: number, pct: number) => string;
  rolloverSuccess: (count: number) => string;
  noPendingRollover: string;
  ageBtnText: string;
  ageModalTitle: string;
  lblBirthDate: string;
  lblDisplayOption: string;
  optCompass: string;
  optDays: string;
  optYears: string;
  txtSaveAge: string;
  loginBtn: string;
  logoutTooltip: string;
  authModalTitle: string;
  tabGoogle: string;
  tabEmail: string;
  emailLabel: string;
  passwordLabel: string;
  nameLabel: string;
  btnSignIn: string;
  btnSignUp: string;
  switchToSignUp: string;
  switchToSignIn: string;
  forgotPassword: string;
  btnGoogleSignIn: string;
  appInstallSectionTitle: string;
  appInstallSectionSub: string;
  contactSectionTitle: string;
  lblContactEmail: string;
  lblContactMessage: string;
  btnSendContactText: string;
  contactEmailPlaceholder: string;
  contactMessagePlaceholder: string;
  devToolsSectionTitle: string;
  devToolsSectionSub: string;
  lblDevTools: string;
  advancedToolsToggleText: string;
  settingsSupportToggleText: string;
  calSyncTitle: string;
  calSyncSub: string;
  txtConnectGCal: string;
  txtGCalConnected: string;
  lblCalSync: string;
  statsTabWeekBtn: string;
  statsTabMonthBtn: string;
  copyNextTooltip: string;
  ageSettingsTitle: string;
  ageSettingsSub: string;
  ageLabel: string;
  dayDistModalTitle: string;
  statsDistTitle: string;
  guideSettingsLabel: string;
  guideSettingsSub: string;
  txtGuideSettingsBtn: string;
  goldenNotEmpty: string;
}

export const STR: Record<Lang, Strings> = {
  ar: {
    brand: "سجل الوقت",
    today: "اليوم",
    hoursTitle: "ساعات اليوم",
    timerStartBtnText: "بدء تايمر لنشاط جديد",
    timerStopBtnText: "إيقاف وتسجيل",
    timerModalTitle: "اكتب اللي حصل",
    timerSaveBtnText: "حفظ في الساعات",
    priorTitle: "الأولويات",
    ringLabel: "ساعات مسجلة",
    ringSub: "من أصل 24",
    footer: "البيانات محفوظة تلقائيًا، وبتتزامن بين أجهزتك",
    langBtn: "English",
    saving: "جاري الحفظ...",
    saved: "تم الحفظ ✓",
    saveError: "خطأ بالحفظ",
    collapseHours: "طي الساعات",
    expandHours: "إظهار الساعات",
    compactBtn: "عرض تفصيلي ⯆",
    expandedBtn: "عرض مدمج ⯅",
    pwaInstallBtn: "تثبيت التطبيق",
    txtAiBtn: "ملخص اليوم الإحصائي",
    txtChartsBtn: "إحصائيات الأسبوع والشهر",
    txtExportBtn: "تصدير وطباعة",
    aiModalTitle: "ملخص اليوم الإحصائي",
    chartsModalTitle: "إحصائيات وتوزيع الوقت",
    exportModalTitle: "تصدير وتنسيق البيانات",
    pwaModalTitle: "تثبيت التطبيق على الهاتف",
    pwaModalDesc: "يمكنك إضافة هذا التطبيق مباشرة إلى شاشة هاتفك الرئيسية كـ تطبيق بدون الحاجة لمتجر:",
    pwaAndroidTitle: "🤖 للـ Android (Chrome):",
    pwaAndroidDesc: 'اضغط على <b>النقاط الثلاث  ⋮</b> أعلى المتصفح ⬅️ اختر <b>"إضافة إلى الشاشة الرئيسية"</b> أو <b>"تثبيت التطبيق"</b>.',
    pwaIosTitle: "🍎 للـ iPhone / iPad (Safari):",
    pwaIosDesc: 'اضغط على زر <b>المشاركة ⎋ (Share)</b> بالأسفل ⬅️ اختر <b>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</b>.',
    txtPrintPdf: "طباعة / حفظ كـ PDF مرتب",
    txtExportCsv: "تصدير ملف CSV (Excel)",
    txtBackupJson: "حفظ نسخة احتياطية (JSON)",
    txtRollover: "ترحيل المهام غير المنجزة للغد",
    goldenTitle: "🌟 الهدف الذهبي لليوم (The One Thing)",
    goldenPlaceholder: "أهم مهمة إذا أنجزتها يُعتبر يومك ناجحاً...",
    priorityPlaceholder: "أولوية #",
    addPriority: "+ إضافة أولوية",
    tagLegendTitle: "التصنيفات:",
    hourPlaceholder: "سجّل إيه اللي عملته...",
    ringCount: (filled, total) => `${filled} / ${total}`,
    priorProgress: (done, total, pct) => `إنجاز الأولويات: ${done} / ${total} (${pct}%)`,
    rolloverSuccess: (count) => `تم ترحيل ${count} مهمة إلى الغد بنجاح ✓`,
    noPendingRollover: "لا توجد مهام غير منجزة لترحيلها",
    ageBtnText: "إعدادات العمر والميلاد",
    ageModalTitle: "حساب وعرض العمر",
    lblBirthDate: "تاريخ ميلادك:",
    lblDisplayOption: "خيار العرض:",
    optCompass: "🧭 بوصلة وقتك ✨ (الأدوات الذكية)",
    optDays: "⏳ العمر بالأيام",
    optYears: "🎂 العمر بالسنين",
    txtSaveAge: "حفظ وإظهار",
    loginBtn: "تسجيل الدخول",
    logoutTooltip: "تسجيل الخروج",
    authModalTitle: "تسجيل الدخول",
    tabGoogle: "Google",
    tabEmail: "البريد الإلكتروني",
    emailLabel: "البريد الإلكتروني:",
    passwordLabel: "كلمة المرور:",
    nameLabel: "الاسم (اختياري):",
    btnSignIn: "دخول",
    btnSignUp: "إنشاء حساب جديد",
    switchToSignUp: "معندكش حساب؟ اعمل واحد",
    switchToSignIn: "عندك حساب بالفعل؟ ادخل",
    forgotPassword: "نسيت كلمة المرور؟",
    btnGoogleSignIn: "الدخول بحساب Google",
    appInstallSectionTitle: "تثبيت التطبيق على جهازك",
    appInstallSectionSub: "استخدم التطبيق بشكل أسرع ومتاح دائماً من شاشة هاتفك الرئيسية",
    contactSectionTitle: "التواصل والدعم الفني",
    lblContactEmail: "بريدك الإلكتروني للتواصل:",
    lblContactMessage: "رسالتك أو ملاحظتك:",
    btnSendContactText: "إرسال الرسالة",
    contactEmailPlaceholder: "example@mail.com",
    contactMessagePlaceholder: "اكتب اقتراحك، استفسارك، أو مشكلتك هنا...",
    devToolsSectionTitle: "الأدوات المتقدمة والتحليل",
    devToolsSectionSub: "إظهار أو إخفاء أزرار التحليل الذكي والإحصائيات والتصدير",
    lblDevTools: "تفعيل وضعية التحليل الاحصائيات والذكاء الاصطناعي",
    advancedToolsToggleText: "الأدوات المتقدمة والتحليل",
    settingsSupportToggleText: "الإعدادات والدعم الفني",
    calSyncTitle: "ربط وتقويم جوجل (Google Calendar)",
    calSyncSub: "قراءة المواعيد المحجوزة في تقويم جوجل واقتراحها شفافة بالساعة الحالية",
    txtConnectGCal: "ربط تقويم جوجل",
    txtGCalConnected: "متصل بتقويم جوجل ✓",
    lblCalSync: "تفعيل اقتراح المواعيد",
    statsTabWeekBtn: "إحصائيات الأسبوع",
    statsTabMonthBtn: "إحصائيات الشهر",
    copyNextTooltip: "نسخ النص والتصنيف للساعة التالية ⬇️",
    ageSettingsTitle: "إعدادات العمر والميلاد",
    ageSettingsSub: "تحديد تاريخ ميلادك وحساب العمر بالأيام بالسنين المتبقية",
    ageLabel: "العمر بالأيام",
    dayDistModalTitle: "توزيع اليوم الكامل (24 ساعة)",
    statsDistTitle: "📊 توزيع اليوم الكامل (24 ساعة)",
    guideSettingsLabel: "دليل تسجيل الوقت",
    guideSettingsSub: "دليل شامل لاستخدام التطبيق وفلسفة التاقات الخمسة والتكامل مع أوراق الأهداف",
    txtGuideSettingsBtn: "فتح الدليل",
    goldenNotEmpty: "⚠️ الهدف الذهبي مش فارغ! افرغه أو أكمله قبل النقل.",
  },
  en: {
    brand: "Time Log",
    today: "Today",
    hoursTitle: "Today's Hours",
    timerStartBtnText: "Start a timer for a new activity",
    timerStopBtnText: "Stop & log",
    timerModalTitle: "What happened?",
    timerSaveBtnText: "Save to hours",
    priorTitle: "Priorities",
    ringLabel: "Logged hours",
    ringSub: "out of 24",
    footer: "Data saved automatically & synced across devices",
    langBtn: "عربي",
    saving: "Saving...",
    saved: "Saved ✓",
    saveError: "Save Error",
    collapseHours: "Collapse Hours",
    expandHours: "Expand Hours",
    compactBtn: "Detailed View ⯆",
    expandedBtn: "Compact View ⯅",
    pwaInstallBtn: "Install App",
    txtAiBtn: "Daily Statistical Summary",
    txtChartsBtn: "Weekly & Monthly Stats",
    txtExportBtn: "Export & Print",
    aiModalTitle: "Daily Statistical Summary",
    chartsModalTitle: "Time Statistics & Distribution",
    exportModalTitle: "Export Data",
    pwaModalTitle: "Install Mobile App",
    pwaModalDesc: "You can add this app directly to your phone home screen as a standalone app without needing an app store:",
    pwaAndroidTitle: "🤖 For Android (Chrome):",
    pwaAndroidDesc: 'Tap the <b>three dots ⋮</b> at top ⬅️ Select <b>"Add to Home Screen"</b> or <b>"Install App"</b>.',
    pwaIosTitle: "🍎 For iPhone / iPad (Safari):",
    pwaIosDesc: 'Tap the <b>Share button ⎋</b> at bottom ⬅️ Select <b>"Add to Home Screen"</b>.',
    txtPrintPdf: "Print / Save as PDF",
    txtExportCsv: "Export CSV (Excel)",
    txtBackupJson: "Backup JSON",
    txtRollover: "Rollover Unfinished Tasks to Tomorrow",
    goldenTitle: "🌟 Today's Golden Goal (The One Thing)",
    goldenPlaceholder: "The single most important task for today...",
    priorityPlaceholder: "Priority #",
    addPriority: "+ Add Priority",
    tagLegendTitle: "Tag Categories:",
    hourPlaceholder: "What did you accomplish...",
    ringCount: (filled, total) => `${filled} / ${total}`,
    priorProgress: (done, total, pct) => `Priorities Done: ${done} / ${total} (${pct}%)`,
    rolloverSuccess: (count) => `Moved ${count} task(s) to tomorrow successfully ✓`,
    noPendingRollover: "No pending tasks to rollover",
    ageBtnText: "Age Settings",
    ageModalTitle: "Age Calculator & Display",
    lblBirthDate: "Your Birth Date:",
    lblDisplayOption: "Display Option:",
    optCompass: "🧭 Smart Compass ✨ (Tools)",
    optDays: "⏳ Age in Days",
    optYears: "🎂 Age in Years",
    txtSaveAge: "Save & Display",
    loginBtn: "Sign in",
    logoutTooltip: "Log out",
    authModalTitle: "Sign in",
    tabGoogle: "Google",
    tabEmail: "Email",
    emailLabel: "Email:",
    passwordLabel: "Password:",
    nameLabel: "Name (optional):",
    btnSignIn: "Sign in",
    btnSignUp: "Create account",
    switchToSignUp: "No account? Create one",
    switchToSignIn: "Already have an account? Sign in",
    forgotPassword: "Forgot password?",
    btnGoogleSignIn: "Sign in with Google",
    appInstallSectionTitle: "Install App on Your Device",
    appInstallSectionSub: "Access the app faster and anytime directly from your mobile home screen",
    contactSectionTitle: "Contact & Support",
    lblContactEmail: "Your Contact Email:",
    lblContactMessage: "Your Message or Inquiry:",
    btnSendContactText: "Send Message",
    contactEmailPlaceholder: "example@mail.com",
    contactMessagePlaceholder: "Type your feedback, question, or issue here...",
    devToolsSectionTitle: "Advanced Tools & Analytics",
    devToolsSectionSub: "Show or hide AI analysis, weekly stats, and export buttons",
    advancedToolsToggleText: "Advanced Tools & Analytics",
    settingsSupportToggleText: "Settings & Support",
    lblDevTools: "Enable Analysis, Statistics & AI Mode",
    calSyncTitle: "Google Calendar Integration",
    calSyncSub: "Read scheduled events from your Google Calendar and suggest them for current hours",
    txtConnectGCal: "Connect Google Calendar",
    txtGCalConnected: "Google Calendar Connected ✓",
    lblCalSync: "Enable Calendar Event Suggestions",
    statsTabWeekBtn: "Weekly Stats",
    statsTabMonthBtn: "Monthly Stats",
    copyNextTooltip: "Copy text & tag to next hour ⬇️",
    ageSettingsTitle: "Age & Birthday Settings",
    ageSettingsSub: "Set birth date and display age in days or years remaining",
    ageLabel: "Age in days",
    dayDistModalTitle: "Full Day Distribution (24 hours)",
    statsDistTitle: "📊 Full Day Distribution (24 hours)",
    guideSettingsLabel: "Time Log Guide",
    guideSettingsSub: "Comprehensive guide on using the app, the five tags philosophy, and integration with Goals Pages",
    txtGuideSettingsBtn: "Open Guide",
    goldenNotEmpty: "⚠️ Golden Goal is not empty! Clear or complete it before moving.",
  },
};
