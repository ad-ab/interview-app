import { Outlet, useLocation } from "@tanstack/react-router";
import { SideNav, SideNavItems, SideNavMenuItem } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../context/SidebarContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { breakpoints } from "../../lib/breakpoints";

const NAV_ITEMS = [
  { labelKey: "system.settings", to: "/system/settings" },
  { labelKey: "system.network", to: "/system/network" },
  { labelKey: "system.log", to: "/system/log" },
];

export default function SystemLayout() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { sidebarOpen, closeSidebar } = useSidebar();
  const isLargeScreen = useMediaQuery(`(min-width: ${breakpoints.lg})`);

  const expanded = isLargeScreen || sidebarOpen;

  return (
    <>
      <SideNav
        isFixedNav
        isPersistent={isLargeScreen}
        expanded={expanded}
        aria-label="System navigation"
        onOverlayClick={closeSidebar}
        style={{ borderRight: "1px solid var(--cds-border-subtle)" }}
      >
        <SideNavItems>
          {NAV_ITEMS.map((item) => (
            <SideNavMenuItem
              key={item.to}
              isActive={pathname === item.to}
              href={item.to}
              onClick={!isLargeScreen ? closeSidebar : undefined}
            >
              {t(item.labelKey)}
            </SideNavMenuItem>
          ))}
        </SideNavItems>
      </SideNav>
      <main
        className="tw-p-8"
        style={{
          marginLeft: isLargeScreen ? "256px" : "0",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
