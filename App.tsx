import { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppDataProvider, useAppDataContext } from "./context/AppDataContext";
import { Header } from "./components/Header";
import { HoursSection } from "./components/Hours/HoursSection";
import { WeekNavigator } from "./components/Dashboard/WeekNavigator";
import { DayStrip } from "./components/Dashboard/DayStrip";
import { Footer } from "./components/Common/Footer";
import { HOURS } from "./lib/constants";

function AppShell() {
  const { currentDate, setCurrentDate, currentDayData, saveStatus } = useAppDataContext();
  const [isCompact, setIsCompact] = useState(false);

  const filledCount = HOURS.filter((k) => currentDayData.hours[k]?.note?.trim()).length;

  return (
    <div className="max-w-[860px] mx-auto px-3 pt-3.5 pb-16">
      <Header
        currentDate={currentDate}
        onPickDate={setCurrentDate}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact((c) => !c)}
        ringFilled={filledCount}
        ringTotal={24}
        saveStatus={saveStatus}
      />

      {!isCompact && (
        <div className="mb-3 p-2 bg-card border border-line rounded-2xl">
          <WeekNavigator />
          <DayStrip />
        </div>
      )}

      {/* Main Hours Section */}
      <HoursSection />

      <Footer saveStatus={saveStatus} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppDataProvider>
          <AppShell />
        </AppDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}