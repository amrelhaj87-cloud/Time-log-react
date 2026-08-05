import { useLanguage } from "../../context/LanguageContext";

interface HourNoteInputProps {
  value: string;
  onChange: (text: string) => void;
  onCopyNext?: () => void;
  showCopyBtn?: boolean;
}

export function HourNoteInput({ value, onChange, onCopyNext, showCopyBtn }: HourNoteInputProps) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 min-w-0 relative flex items-center gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.hourPlaceholder}
        className="w-full bg-transparent border-b border-transparent focus:border-teal text-xs text-ink py-1 px-1 outline-none transition-colors"
      />

      {showCopyBtn && onCopyNext && (
        <button
          type="button"
          onClick={onCopyNext}
          className="text-ink-soft hover:text-teal-dark opacity-50 hover:opacity-100 p-1 rounded transition-all text-xs"
          title="نسخ النص والتصنيف للساعة التالية ⬇️"
        >
          ⬇️
        </button>
      )}
    </div>
  );
}