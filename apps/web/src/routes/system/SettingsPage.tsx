import { useEffect, useState } from "react";
import { Button, ContentSwitcher, Dropdown, Switch, Tile } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Theme, type LanguageOption } from "@/types";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/const";
import PageTitle from "@/components/PageTitle";
import ThemeIcon from "@/components/ThemeIcon";
import TileTitle from "@/components/TileTitle";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { preference, setPreference } = useTheme();

  // Local draft state — not propagated until Save is pressed.
  const [draftTheme, setDraftTheme] = useState<Theme>(preference);
  const [draftLanguage, setDraftLanguage] = useState<string>(i18n.language);

  // Keep the local drafts in sync when the global values change
  // (e.g. user switches theme/language from the TopBar while the page is open).
  useEffect(() => {
    setDraftTheme(preference);
  }, [preference]);

  useEffect(() => {
    setDraftLanguage(i18n.language);
  }, [i18n.language]);

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
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-1">
      <PageTitle>{t("settings.title")}</PageTitle>

      <TileTitle>{t("settings.personal")}</TileTitle>

      <Tile className="tw-flex tw-flex-col tw-w-full">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-6 tw-flex-wrap">
          <span className="cds--type-heading-02">
            {t("settings.colorTheme.label")}
          </span>
          <ContentSwitcher
            selectedIndex={selectedThemeIndex === -1 ? 0 : selectedThemeIndex}
            onChange={handleThemeSwitch}
            size="md"
            style={{
              inlineSize: "auto",
            }}
          >
            {THEME_OPTIONS.map((opt) => (
              <Switch
                key={opt.value}
                name={opt.value}
                style={{
                  inlineSize: "auto",
                }}
                text={
                  (
                    <span
                      className="tw-inline-flex tw-items-center tw-gap-2"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <ThemeIcon rotation={opt.rotation} size={16} />
                      {t(opt.labelKey)}
                    </span>
                  ) as unknown as string
                }
              />
            ))}
          </ContentSwitcher>
        </div>
      </Tile>

      <Tile className="tw-flex tw-flex-col tw-w-full">
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

      <div className="tw-flex tw-justify-start tw-mt-4">
        <Button kind="primary" onClick={handleSave} className="tw-pr-4">
          {t("settings.save")}
        </Button>
      </div>
    </div>
  );
}
