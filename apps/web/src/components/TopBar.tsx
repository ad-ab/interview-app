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
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { breakpoints } from "@/lib/breakpoints";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/shared/const";
import BraiinsWordmark from "@/components/BraiinsWordmark";
import BraiinsOsIcon from "@/components/BraiinsOsIcon";
import ThemeIcon from "@/components/ThemeIcon";

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

  // Close the dropdown when clicked
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

  // Close the dropdown when clicked
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
          <HeaderMenuItem as={Link} to="/system" isCurrentPage={isSystemActive}>
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
              <ThemeIcon
                rotation={
                  (
                    THEME_OPTIONS.find((o) => o.value === preference) ??
                    THEME_OPTIONS[0]
                  ).rotation
                }
                size={20}
              />
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
                    <ThemeIcon rotation={opt.rotation} size={14} />
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
                {LANGUAGE_OPTIONS.map((lang) => (
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
