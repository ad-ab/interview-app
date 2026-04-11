import { useState } from "react";
import {
  Button,
  ContentSwitcher,
  Dropdown,
  IconSwitch,
  Tile,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { Theme, useTheme } from "../../context/ThemeContext";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

const THEME_OPTIONS: { value: Theme; labelKey: string; rotation: number }[] = [
  { value: Theme.SYSTEM, labelKey: "theme.system", rotation: 60 },
  { value: Theme.LIGHT, labelKey: "theme.light", rotation: 0 },
  { value: Theme.DARK, labelKey: "theme.dark", rotation: 180 },
];

// Same half-moon SVG as the theme switcher in TopBar.tsx.
function ThemeIcon({
  rotation,
  size = 18,
}: {
  rotation: number;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ transform: `rotate(${rotation}deg)`, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m0-2V4a8 8 0 1 1 0 16" />
    </svg>
  );
}

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { preference, setPreference } = useTheme();

  // Local draft state — not propagated until Save is pressed.
  const [draftTheme, setDraftTheme] = useState<Theme>(preference);
  const [draftLanguage, setDraftLanguage] = useState<string>(i18n.language);

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((l) => l.code === draftLanguage) ??
    LANGUAGE_OPTIONS[0];

  const selectedThemeIndex = THEME_OPTIONS.findIndex(
    (o) => o.value === draftTheme,
  );

  const handleThemeSwitch = ({ index }: { index?: number }) => {
    if (index == null) return;
    setDraftTheme(THEME_OPTIONS[index].value);
  };

  const handleLanguageChange = ({
    selectedItem,
  }: {
    selectedItem: LanguageOption | null;
  }) => {
    if (selectedItem) {
      setDraftLanguage(selectedItem.code);
    }
  };

  const handleSave = () => {
    setPreference(draftTheme);
    if (draftLanguage !== i18n.language) {
      i18n.changeLanguage(draftLanguage);
    }
    alert(t("settings.saveTodo"));
  };

  return (
    <div
      className="tw-flex tw-flex-col tw-gap-3"
      style={{ width: "100%", maxWidth: "800px" }}
    >
      <h1 className="cds--type-heading-03 tw-font-bold tw-m-0">
        {t("settings.title")}
      </h1>

      <section className="tw-flex tw-flex-col tw-gap-3">
        <h2 className="cds--type-heading-02 tw-font-bold tw-m-0">
          {t("settings.personal")}
        </h2>

        <Tile className="tw-flex tw-flex-col" style={{ width: "100%" }}>
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-6 tw-flex-wrap">
            <span className="cds--type-heading-02">
              {t("settings.colorTheme.label")}
            </span>
            <ContentSwitcher
              selectedIndex={selectedThemeIndex === -1 ? 0 : selectedThemeIndex}
              onChange={handleThemeSwitch}
              size="md"
            >
              {THEME_OPTIONS.map((opt) => (
                <IconSwitch
                  key={opt.value}
                  name={opt.value}
                  text={t(opt.labelKey)}
                >
                  <ThemeIcon rotation={opt.rotation} size={18} />
                </IconSwitch>
              ))}
            </ContentSwitcher>
          </div>
        </Tile>

        <Tile className="tw-flex tw-flex-col" style={{ width: "100%" }}>
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-6 tw-flex-wrap">
            <span className="cds--type-heading-02">
              {t("settings.language.label")}
            </span>
            <div style={{ minWidth: "220px" }}>
              <Dropdown
                id="settings-language-dropdown"
                titleText=""
                hideLabel
                label=""
                items={LANGUAGE_OPTIONS}
                itemToString={(item: LanguageOption | null) =>
                  item ? item.label : ""
                }
                selectedItem={selectedLanguage}
                onChange={handleLanguageChange}
              />
            </div>
          </div>
        </Tile>
      </section>

      <div className="tw-flex tw-justify-start tw-mt-2">
        <Button kind="primary" onClick={handleSave}>
          {t("settings.save")}
        </Button>
      </div>
    </div>
  );
}
