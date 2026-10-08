import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Drawer, Paper } from "@mui/material";
import { WorkspaceSidebarContent } from "./workspace-sidebar";
import { WorkspaceFooter, WorkspaceTopBar } from "./workspace-topbar";

export { raincoMuiTheme } from "./workspace-theme";
export * from "./workspace-types";
export * from "./workspace-context";
export * from "./workspace-ui";
export * from "./workspace-sidebar";
export * from "./workspace-topbar";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleCloseMobile = () => setMobileOpen(false);
  const handleOpenMobile = () => setMobileOpen(true);

  return (
    <div className="workspace">
      {/* Desktop persistent sidebar — hidden on mobile (< 900px) */}
      <Paper
        component="aside"
        elevation={1}
        square
        className="sidebar"
        sx={{
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
        }}
      >
        <WorkspaceSidebarContent
          isMobile={false}
          pathname={pathname}
          onCloseMobile={handleCloseMobile}
        />
      </Paper>

      {/* Mobile slide-out Drawer — wipes out off-screen when closed */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 272,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <WorkspaceSidebarContent
          isMobile={true}
          pathname={pathname}
          onCloseMobile={handleCloseMobile}
        />
      </Drawer>

      <div className="workspace-main">
        <WorkspaceTopBar pathname={pathname} onOpenMobileMenu={handleOpenMobile} />
        <main className="main-content">{children}</main>
        <WorkspaceFooter />
      </div>
    </div>
  );
}
