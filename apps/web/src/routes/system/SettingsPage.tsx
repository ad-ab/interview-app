import { Button, Dropdown, Tile, Toggle } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { Theme, useTheme } from "../../context/ThemeContext";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

function ThemeToggleIcon({
  active,
  size = 16,
}: {
  active: boolean;
  size?: number;
}) {
  // Same SVG as the theme switcher in TopBar.tsx. Rotated 180deg when "dark".
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{
        transform: `rotate(${active ? 180 : 0}deg)`,
        transition: "transform 200ms ease",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m0-2V4a8 8 0 1 1 0 16" />
    </svg>
  );
}

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { preference, setPreference } = useTheme();

  // Toggle treats System as "light" for the binary switch.
  const isDark = preference === Theme.DARK;

  const handleThemeToggle = (checked: boolean) => {
    setPreference(checked ? Theme.DARK : Theme.LIGHT);
  };

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((l) => l.code === i18n.language) ??
    LANGUAGE_OPTIONS[0];

  const handleLanguageChange = ({
    selectedItem,
  }: {
    selectedItem: LanguageOption | null;
  }) => {
    if (selectedItem) {
      i18n.changeLanguage(selectedItem.code);
    }
  };

  const handleSave = () => {
    alert(t("settings.saveTodo"));
  };

  return (
    <div
      className="tw-flex tw-flex-col tw-gap-8"
      style={{ maxWidth: "960px" }}
    >
      <h1 className="cds--type-heading-05">{t("settings.title")}</h1>

      <section className="tw-flex tw-flex-col tw-gap-4">
        <h2 className="cds--type-heading-03">{t("settings.personal")}</h2>

        <Tile className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-items-start tw-justify-between tw-gap-6 tw-flex-wrap">
            <div className="tw-flex tw-items-center tw-gap-3">
              <ThemeToggleIcon active={isDark} size={20} />
              <div className="tw-flex tw-flex-col">
                <span className="cds--type-heading-02">
                  {t("settings.colorTheme.label")}
                </span>
                <span
                  className="cds--type-body-01"
                  style={{ color: "var(--cds-text-secondary)" }}
                >
                  {t("settings.colorTheme.description")}
                </span>
              </div>
            </div>
            <Toggle
              id="settings-color-theme-toggle"
              size="md"
              labelText=""
              hideLabel
              labelA={t("settings.colorTheme.toggleLabelA")}
              labelB={t("settings.colorTheme.toggleLabelB")}
              toggled={isDark}
              onToggle={handleThemeToggle}
            />
          </div>
        </Tile>

        <Tile className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-items-start tw-justify-between tw-gap-6 tw-flex-wrap">
            <div className="tw-flex tw-flex-col">
              <span className="cds--type-heading-02">
                {t("settings.language.label")}
              </span>
              <span
                className="cds--type-body-01"
                style={{ color: "var(--cds-text-secondary)" }}
              >
                {t("settings.language.description")}
              </span>
            </div>
            <div style={{ minWidth: "220px" }}>
              <Dropdown
                id="settings-language-dropdown"
                titleText=""
                hideLabel
                label={t("settings.language.placeholder")}
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

      <div className="tw-flex tw-justify-end">
        <Button kind="primary" onClick={handleSave}>
          {t("settings.save")}
        </Button>
      </div>
    </div>
  );
}
