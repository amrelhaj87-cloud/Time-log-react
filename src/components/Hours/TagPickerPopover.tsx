import { useState, useRef, useEffect } from "react";
import type { TagCode } from "../../types";
import { TAGS, TAG_ORDER } from "../../lib/constants";
import { useLanguage } from "../../context/LanguageContext";

interface TagPickerProps {
  selectedTag: TagCode;
  onSelectTag: (tag: TagCode) => void;
  disabledTags?: TagCode[];
}

export function TagPickerPopover({ selectedTag, onSelectTag, disabledTags = [] }: TagPickerProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTagDef = TAGS[selectedTag] || TAGS[""];

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`w-12 h-7 text-xs font-bold rounded-md border transition-all text-center ${
          selectedTag ? "bg-teal-tint text-teal-dark border-teal" : "bg-card text-ink-faint border-line"
        }`}
        title={currentTagDef.fullTitle[lang]}
      >
        {selectedTag || "—"}
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 end-0 p-2 bg-card border border-line rounded-xl shadow-xl grid grid-cols-4 gap-1.5 min-w-[200px]">
          {TAG_ORDER.map((code) => {
            const isDisabled = disabledTags.includes(code);
            const tagDef = TAGS[code];
            const isSelected = selectedTag === code;

            return (
              <button
                key={code || "none"}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  onSelectTag(code);
                  setIsOpen(false);
                }}
                className={`p-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                  isSelected ? "border-teal font-extrabold bg-teal-tint text-teal-dark" : "border-line bg-bg text-ink-soft hover:bg-teal-tint"
                } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                title={tagDef.fullTitle[lang]}
              >
                {code || "—"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}