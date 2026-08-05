import type { HourData, HourKey, TagCode } from "../../types";
import { HOUR_LABELS, SLEEP_ALLOWED_KEYS } from "../../lib/constants";
import { useLanguage } from "../../context/LanguageContext";
import { TagPickerPopover } from "./TagPickerPopover";
import { HourNoteInput } from "./HourNoteInput";

interface HourRowProps {
  hourKey: HourKey;
  hourData: HourData;
  onUpdate: (tag: TagCode, note: string) => void;
  onCopyNext: () => void;
  isLastHour: boolean;
}

export function HourRow({ hourKey, hourData, onUpdate, onCopyNext, isLastHour }: HourRowProps) {
  const { lang } = langContext();
  const label = HOUR_LABELS[lang][hourKey];
  const disabledTags: TagCode[] = SLEEP_ALLOWED_KEYS.includes(hourKey) ? [] : ["SL"];

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 border-b border-line hover:bg-teal-tint/30 transition-colors">
      <div className="w-11 text-xs text-ink-soft font-semibold">{label}</div>
      <HourNoteInput
        value={hourData.note}
        onChange={(note) => onUpdate(hourData.tag, note)}
        onCopyNext={onCopyNext}
        showCopyBtn={!isLastHour}
      />
      <TagPickerPopover
        selectedTag={hourData.tag}
        onSelectTag={(tag) => onUpdate(tag, hourData.note)}
        disabledTags={disabledTags}
      />
    </div>
  );
}

function langContext() {
  return useLanguage();
}