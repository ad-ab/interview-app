import { useState } from "react";
import { Stack, TextInput, Tile } from "@carbon/react";
import { useTranslation } from "react-i18next";
import PageTitle from "@/components/PageTitle";

export default function CoolingPage() {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  return (
    <Stack gap={1} className="tw-w-full">
      <PageTitle>{t("config.cooling")}</PageTitle>

      <Tile className="tw-flex tw-flex-col tw-w-full">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-6 tw-flex-wrap">
          <span className="cds--type-heading-02">{t("config.temporaryText")}</span>
          <div style={{ minWidth: "220px" }}>
            <TextInput
              id="cooling-temporary-text"
              labelText=""
              hideLabel
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
      </Tile>
    </Stack>
  );
}
