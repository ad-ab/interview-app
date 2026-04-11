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

// Loose IPv4 check — each octet 0-255. Used only for a visual invalid state;
// the Save button is a placeholder today, so validation never blocks submission.
const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;

function isValidIPv4(value: string): boolean {
  if (value === "") return true; // empty fields are not yet invalid
  return IPV4_REGEX.test(value.trim());
}

export default function NetworkPage() {
  const { t } = useTranslation();

  // Local draft state — there is no global network store yet, so Save is a
  // todo placeholder that only surfaces the current draft values.
  const [draftProtocol, setDraftProtocol] = useState<NetworkProtocol>(
    NetworkProtocol.DHCP,
  );
  const [draftStatic, setDraftStatic] = useState<NetworkStaticConfig>({
    ip: "",
    subnet: "",
    gateway: "",
  });

  const selectedProtocolIndex = PROTOCOL_OPTIONS.findIndex(
    (o) => o.value === draftProtocol,
  );

  const handleProtocolSwitch = ({ index }: { index?: number }) => {
    if (index == null) return;
    setDraftProtocol(PROTOCOL_OPTIONS[index].value);
  };

  const updateStaticField =
    (field: keyof NetworkStaticConfig) =>
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
      <h1 className="tw-font-bold tw-m-0 tw-mb-4 tw-text-2xl">
        {t("network.title")}
      </h1>

      <Tile className="tw-flex tw-flex-col tw-w-full tw-gap-4">
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

        {showStaticFields && (
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mt-2">
            <TextInput
              id="network-static-ip"
              labelText={t("network.static.ip")}
              placeholder="192.168.1.10"
              value={draftStatic.ip}
              onChange={updateStaticField("ip")}
              invalid={!isValidIPv4(draftStatic.ip)}
              invalidText={t("network.static.invalid")}
            />
            <TextInput
              id="network-static-subnet"
              labelText={t("network.static.subnet")}
              placeholder="255.255.255.0"
              value={draftStatic.subnet}
              onChange={updateStaticField("subnet")}
              invalid={!isValidIPv4(draftStatic.subnet)}
              invalidText={t("network.static.invalid")}
            />
            <TextInput
              id="network-static-gateway"
              labelText={t("network.static.gateway")}
              placeholder="192.168.1.1"
              value={draftStatic.gateway}
              onChange={updateStaticField("gateway")}
              invalid={!isValidIPv4(draftStatic.gateway)}
              invalidText={t("network.static.invalid")}
            />
          </div>
        )}
      </Tile>

      <div className="tw-flex tw-justify-start tw-mt-4">
        <Button kind="primary" onClick={handleSave} className="tw-pr-4">
          {t("network.save")}
        </Button>
      </div>
    </div>
  );
}
