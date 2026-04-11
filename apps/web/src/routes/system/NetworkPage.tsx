import { useState } from "react";
import {
  Button,
  ContentSwitcher,
  Switch,
  TextInput,
  Tile,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { NetworkProtocol, type NetworkStaticConfig } from "@/types";
import { PROTOCOL_OPTIONS } from "@/const";
import PageTitle from "@/components/PageTitle";

// Loose IPv4 check — each octet 0-255. Used only for a visual invalid state;
// the Save button is a placeholder today, so validation never blocks submission.
const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;

function isValidIPv4(value: string): boolean {
  if (value === "") return true; // empty fields are not yet invalid
  return IPV4_REGEX.test(value.trim());
}

type StaticFieldKey = keyof NetworkStaticConfig;

interface StaticFieldSpec {
  key: StaticFieldKey;
  id: string;
  labelKey: string;
  placeholder: string;
}

const STATIC_FIELDS: readonly StaticFieldSpec[] = [
  {
    key: "ip",
    id: "network-static-ip",
    labelKey: "network.static.ip",
    placeholder: "192.168.1.10",
  },
  {
    key: "gateway",
    id: "network-static-gateway",
    labelKey: "network.static.gateway",
    placeholder: "192.168.1.1",
  },
  {
    key: "dns",
    id: "network-static-dns",
    labelKey: "network.static.dns",
    placeholder: "8.8.8.8",
  },
];

export default function NetworkPage() {
  const { t } = useTranslation();

  // Local draft state — there is no global network store yet, so Save is a
  // todo placeholder that only surfaces the current draft values.
  const [draftProtocol, setDraftProtocol] = useState<NetworkProtocol>(
    NetworkProtocol.DHCP,
  );
  const [draftStatic, setDraftStatic] = useState<NetworkStaticConfig>({
    ip: "",
    gateway: "",
    dns: "",
  });

  const selectedProtocolIndex = PROTOCOL_OPTIONS.findIndex(
    (o) => o.value === draftProtocol,
  );

  const handleProtocolSwitch = ({ index }: { index?: number }) => {
    if (index == null) return;
    setDraftProtocol(PROTOCOL_OPTIONS[index].value);
  };

  const updateStaticField =
    (field: StaticFieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftStatic((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = () => {
    // Placeholder — no backend wiring yet.
    alert(t("network.saveTodo"));
  };

  const showStaticFields = draftProtocol === NetworkProtocol.STATIC;

  return (
    <div className="tw-flex tw-flex-col tw-gap-1">
      <PageTitle>{t("network.title")}</PageTitle>

      <Tile className="tw-flex tw-flex-col tw-w-full">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-6 tw-flex-wrap">
          <span className="cds--type-heading-02">
            {t("network.protocol.label")}
          </span>
          <ContentSwitcher
            selectedIndex={
              selectedProtocolIndex === -1 ? 0 : selectedProtocolIndex
            }
            onChange={handleProtocolSwitch}
            size="md"
            style={{ inlineSize: "auto" }}
          >
            {PROTOCOL_OPTIONS.map((opt) => (
              <Switch
                key={opt.value}
                name={opt.value}
                style={{ inlineSize: "auto" }}
                text={t(opt.labelKey)}
              />
            ))}
          </ContentSwitcher>
        </div>
      </Tile>

      {showStaticFields &&
        STATIC_FIELDS.map((field) => {
          const value = draftStatic[field.key];
          return (
            <Tile key={field.key} className="tw-flex tw-flex-col tw-w-full">
              <div className="tw-flex tw-items-center tw-justify-between tw-gap-6 tw-flex-wrap">
                <span className="cds--type-heading-02">
                  {t(field.labelKey)}
                </span>
                <div style={{ minWidth: "220px" }}>
                  <TextInput
                    id={field.id}
                    labelText=""
                    hideLabel
                    placeholder={field.placeholder}
                    value={value}
                    onChange={updateStaticField(field.key)}
                    invalid={!isValidIPv4(value)}
                    invalidText={t("network.static.invalid")}
                  />
                </div>
              </div>
            </Tile>
          );
        })}

      <div className="tw-flex tw-justify-start tw-mt-4">
        <Button kind="primary" onClick={handleSave} className="tw-pr-4">
          {t("network.save")}
        </Button>
      </div>
    </div>
  );
}
