import { useLanguage } from "../../context/LanguageContext";

interface FooterProps {
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

export function Footer({ saveStatus }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="text-center text-xs text-ink-faint mt-4 space-y-1">
      <p>{t.footer}</p>
      {saveStatus && saveStatus !== "idle" && (
        <p className="text-[10px] font-bold text-teal-dark">
          {saveStatus === "saving" ? t.saving : saveStatus === "saved" ? t.saved : t.saveError}
        </p>
      )}
    </footer>
  );
}