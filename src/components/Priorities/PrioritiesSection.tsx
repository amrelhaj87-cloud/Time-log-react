{/* شريط نسبة إنجاز الأولويات المئوي */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2 mb-3">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--teal-dark)] mb-1">
          <span>
            {lang === 'ar'
              ? `إنجاز الأولويات: ${completedCount} / ${totalPrioritiesCount} (${priorityPct}%)`
              : `Priorities Done: ${completedCount} / ${totalPrioritiesCount} (${priorityPct}%)`}
          </span>
          <span>🎯 {priorityPct}%</span>
        </div>
        <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-300"
            style={{ width: `${priorityPct}%` }}
          />
        </div>
      </div>