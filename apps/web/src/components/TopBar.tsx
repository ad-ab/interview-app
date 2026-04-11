import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderMenuButton,
  Theme as CarbonTheme,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { Theme, useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { breakpoints } from "../lib/breakpoints";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

const BraiinsWordmark = () => (
  <svg
    width="101"
    height="16"
    viewBox="0 0 101 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M30.7424 5.0253C30.7424 2.02822 28.925 0 26.0644 0H18.7256V15.7295H22.0964V9.9603H24.5131L27.2172 15.7295H30.9637L27.9272 9.55408C29.8107 8.8336 30.7424 7.14306 30.7424 5.0253ZM27.2618 5.5208C27.2618 6.53501 26.6409 7.07569 25.6432 7.07569H22.0964V2.97393H25.6432C26.6409 2.97393 27.2618 3.5146 27.2618 4.52881V5.5208Z"
      fill="white"
    />
    <path
      d="M81.1798 10.5917H81.1124L79.6273 7.43672L75.3934 0H71.7122V15.7296H74.8832V5.13804H74.9495L76.4345 8.29314L80.6695 15.7296H84.3498V0H81.1798V10.5917Z"
      fill="white"
    />
    <path
      d="M54.4428 0.00189211L51.072 0V0.00189211V2.72524L54.2699 13.5076V15.7295H57.6407V13.0031L54.4428 2.22111V0.00189211Z"
      fill="white"
    />
    <path
      d="M64.0098 0.00189211L60.6389 0V0.00189211V2.72524L63.8368 13.5076V15.7295H67.2077V13.0031L64.0098 2.22111V0.00189211Z"
      fill="white"
    />
    <path
      d="M44.2244 0H38.6043L37.9469 2.21921L34.749 13.0012V15.7275H38.1199V13.5056L41.2042 3.10626H41.6246L44.7088 13.5056V15.7275H48.0797V13.0012L44.8818 2.21921L44.2244 0Z"
      fill="white"
    />
    <path
      d="M99.3631 7.77442C98.5944 7.02333 97.4194 6.52007 95.8381 6.26465L94.2859 6.01669C93.6208 5.91177 93.1553 5.75777 92.8896 5.55469C92.6236 5.35208 92.4906 4.99526 92.4904 4.48424C92.4904 3.5378 93.2293 3.04291 94.7071 3.04291H99.4517V0H94.7071C92.9634 0.0302029 91.5964 0.465925 90.6062 1.30717C89.6156 2.14872 89.1207 3.29019 89.1207 4.68713C89.1207 6.00945 89.505 7.06115 90.2736 7.79709C91.0417 8.5334 92.2314 8.99907 93.8427 9.19409L95.3722 9.39695C96.0373 9.48706 96.503 9.67867 96.7691 9.97177C97.0397 10.2768 97.1828 10.6769 97.1683 11.0873C97.1785 11.3532 97.1277 11.6178 97.0199 11.8603C96.9121 12.1027 96.7503 12.3164 96.5472 12.4842C96.1331 12.8302 95.5273 13.003 94.7297 13.0028C93.2072 13.0028 91.9138 12.3943 90.8495 11.1774L88.6548 13.4534C90.1475 15.1513 92.0911 16.0001 94.4857 16C95.7417 16 96.8242 15.7859 97.7335 15.3577C98.6426 14.9296 99.3335 14.3324 99.8063 13.5661C100.288 12.767 100.534 11.8441 100.515 10.9071C100.515 9.56993 100.131 8.52572 99.3631 7.77442Z"
      fill="white"
    />
    <path
      d="M0 0V2.72481H1.99984V15.7317H10.203C10.754 15.7375 11.2992 15.6182 11.7993 15.3825C12.2806 15.1546 12.7108 14.8286 13.0629 14.4246C13.4259 14.0049 13.7079 13.5195 13.8941 12.9937C14.0957 12.4344 14.1971 11.8428 14.1934 11.2471C14.1934 9.17286 12.9715 7.96699 11.7194 7.52004V7.38421C12.7775 6.99101 13.5948 5.88968 13.5948 4.0355C13.5948 2.81868 13.2364 1.84219 12.5197 1.10601C11.8028 0.370003 10.8015 0.00191182 9.51585 0.00173838L0 0ZM5.37025 2.88612H8.71802C9.16187 2.88612 9.50933 3.01384 9.7604 3.26928C10.0115 3.52509 10.137 3.87818 10.137 4.32854V5.00464C10.137 5.45522 10.0115 5.80831 9.7604 6.06391C9.50875 6.31939 9.16129 6.44711 8.71802 6.44706H5.37025V2.88612ZM10.6915 11.4273C10.6915 11.8782 10.5622 12.2275 10.3036 12.4754C10.0448 12.7233 9.69378 12.8472 9.25055 12.847H5.37025V9.24132H9.25052C9.69374 9.24132 10.0448 9.3653 10.3036 9.61325C10.5618 9.86121 10.6911 10.2105 10.6915 10.661L10.6915 11.4273Z"
      fill="white"
    />
  </svg>
);

const BraiinsOsIcon = () => (
  <svg
    width="37"
    height="24"
    viewBox="0 0 37 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12.4819 8.63281C10.6194 8.63281 9.10938 10.1428 9.10938 12.0056C9.10938 13.8683 10.6194 15.3782 12.4819 15.3782C14.3445 15.3782 15.8547 13.8682 15.8547 12.0056C15.8547 10.1429 14.3447 8.63281 12.4819 8.63281Z"
      fill="white"
    />
    <path
      d="M31.6849 4.80005V0H0V4.80005L4.80005 19.2V24.0001H36.485V19.2L31.6849 4.80005ZM12.479 17.7333C9.31037 17.7333 6.7415 15.1645 6.7415 11.9957C6.7415 8.82683 9.31037 6.25804 12.479 6.25804C15.6477 6.25804 18.2166 8.82692 18.2166 11.9957C18.2166 15.1644 15.6478 17.7333 12.479 17.7333ZM27.9623 16.0165C27.6232 16.557 27.1279 16.9783 26.4761 17.2803C25.8241 17.5823 25.0478 17.7334 24.1473 17.7334C22.4301 17.7334 21.0365 17.1346 19.9662 15.9371L21.5399 14.3315C22.3031 15.1898 23.2305 15.6193 24.3222 15.6193C24.8942 15.6193 25.3286 15.4976 25.6255 15.2534C25.9219 15.0099 26.0708 14.6814 26.0708 14.268C26.0708 13.95 25.9753 13.6877 25.7846 13.481C25.5939 13.2745 25.2598 13.1392 24.7829 13.0756L23.6861 12.9325C22.5309 12.795 21.6777 12.4665 21.1269 11.9471C20.5758 11.428 20.3003 10.686 20.3003 9.75331C20.3003 8.76796 20.6553 7.96267 21.3655 7.36902C22.0754 6.77563 23.0557 6.46825 24.306 6.44697H27.7081V8.59348H24.306C23.2464 8.59348 22.7166 8.94262 22.7166 9.61021C22.7166 9.9707 22.8122 10.2223 23.0028 10.3653C23.1935 10.5084 23.5271 10.6172 24.004 10.6911L25.117 10.8661C26.2509 11.0462 27.0934 11.4012 27.6447 11.931C28.1953 12.4611 28.471 13.1976 28.471 14.1407C28.471 14.8509 28.3015 15.4761 27.9623 16.0165Z"
      fill="white"
    />
  </svg>
);

const THEME_ROTATION: Record<Theme, number> = {
  [Theme.LIGHT]: 0,
  [Theme.DARK]: 180,
  [Theme.SYSTEM]: 60,
};

function ThemeIcon({ theme, size = 20 }: { theme: Theme; size?: number }) {
  const rotation = THEME_ROTATION[theme];
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

const THEME_OPTIONS: { labelKey: string; value: Theme }[] = [
  { labelKey: "theme.light", value: Theme.LIGHT },
  { labelKey: "theme.dark", value: Theme.DARK },
  { labelKey: "theme.system", value: Theme.SYSTEM },
];

export default function TopBar() {
  const { pathname } = useLocation();
  const { preference, setPreference } = useTheme();
  const isConfigActive = pathname.startsWith("/configuration");
  const isSystemActive = pathname.startsWith("/system");
  const hasSidebar = isConfigActive || isSystemActive;
  const isLargeScreen = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!langOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langOpen]);

  return (
    <CarbonTheme theme="g100">
      <Header aria-label="Braiins">
        {hasSidebar && !isLargeScreen && (
          <HeaderMenuButton
            aria-label="Open menu"
            isActive={sidebarOpen}
            onClick={toggleSidebar}
          />
        )}
        <HeaderName prefix="">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {isLargeScreen ? <BraiinsWordmark /> : null}
            <BraiinsOsIcon />
          </span>
        </HeaderName>
        <HeaderNavigation
          aria-label="Main navigation"
          style={{ marginLeft: isLargeScreen ? "100px" : "0" }}
        >
          <HeaderMenuItem
            as={Link}
            to="/dashboard"
            isCurrentPage={pathname === "/dashboard"}
          >
            {t("nav.dashboard")}
          </HeaderMenuItem>
          <HeaderMenuItem
            as={Link}
            to="/configuration/pools"
            isCurrentPage={isConfigActive}
          >
            {t("nav.configuration")}
          </HeaderMenuItem>
          <HeaderMenuItem
            as={Link}
            to="/system"
            isCurrentPage={isSystemActive}
          >
            {t("nav.system")}
          </HeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <div
            ref={containerRef}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              aria-label="Theme"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "3rem",
                height: "3rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--cds-icon-primary)",
              }}
            >
              <ThemeIcon theme={preference} size={20} />
            </button>

            {open && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  width: "max-content",
                  backgroundColor: "var(--cds-layer-01)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  zIndex: 9000,
                  border: "1px solid var(--cds-border-subtle-01)",
                }}
              >
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    role="menuitem"
                    onClick={() => {
                      setPreference(opt.value);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.4rem 0.75rem",
                      background:
                        preference === opt.value
                          ? "var(--cds-layer-selected-01)"
                          : "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--cds-text-primary)",
                      fontSize: "0.8rem",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (preference !== opt.value)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "var(--cds-layer-hover-01)";
                    }}
                    onMouseLeave={(e) => {
                      if (preference !== opt.value)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "transparent";
                    }}
                  >
                    <ThemeIcon theme={opt.value} size={14} />
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            ref={langRef}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              aria-label="Language"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "3rem",
                padding: "0 0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--cds-icon-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {i18n.language.toUpperCase()}
            </button>
            {langOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  width: "max-content",
                  backgroundColor: "var(--cds-layer-01)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  zIndex: 9000,
                  border: "1px solid var(--cds-border-subtle-01)",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    role="menuitem"
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.4rem 0.75rem",
                      background:
                        i18n.language === lang.code
                          ? "var(--cds-layer-selected-01)"
                          : "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--cds-text-primary)",
                      fontSize: "0.8rem",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (i18n.language !== lang.code)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "var(--cds-layer-hover-01)";
                    }}
                    onMouseLeave={(e) => {
                      if (i18n.language !== lang.code)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "transparent";
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href="https://academy.braiins.com/en/braiins-os/about/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              height: "3rem",
              padding: "0 1rem",
              color: "var(--cds-text-secondary)",
              textDecoration: "none",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="topbar-docs-label">
              {t("topbar.documentation")}
            </span>
          </a>
        </HeaderGlobalBar>
      </Header>
    </CarbonTheme>
  );
}
