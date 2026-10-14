import { Link, useRouter } from "@tanstack/react-router";
import {
  AppBar,
  Box,
  Breadcrumbs,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { LogIn, LogOut, Mail, Menu, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace-context";
import { RaincoLogo } from "./workspace-ui";
import { adminNav, approvalsNav, evaluationNav, mastersNav, portalNav } from "./workspace-sidebar";
function getBreadcrumbLabel(pathname) {
  if (pathname === "/") return "Supplier Dashboard";
  if (pathname === "/login") return "Supplier Sign-In";
  if (pathname === "/register") return "Supplier Registration (Email Link)";
  if (pathname === "/approval-stages") return "Approvals / Approval Stages";
  if (pathname === "/approval-template") return "Approvals / Approval Template";
  if (pathname === "/approval-queue") return "Approvals / Pending Approvals";
  if (pathname === "/responded-approvals") return "Approvals / Approved Approvals";
  if (pathname === "/rejected-approvals") return "Approvals / Rejected Approvals";
  if (pathname === "/checklist") return "Masters / Supplier Checklist";
  if (pathname === "/supplier-types") return "Masters / Supplier Types";
  if (pathname === "/employees") return "Masters / Employee Master";
  if (pathname === "/tutorials" || pathname === "/criterias") return "Masters / Tutorials";
  if (pathname === "/ratings-master") return "Masters / Conditions";
  if (pathname === "/users") return "Administration / Users";
  if (pathname === "/user-permissions") return "Administration / User Permissions";
  if (pathname === "/suppliers") return "Administration / Suppliers";
  if (pathname === "/evaluation") return "Evaluation / Evaluation Sheet";
  if (pathname === "/evaluation-report") return "Evaluation / Evaluation Result Report";
  if (pathname === "/evaluation-chart") return "Evaluation / Evaluation Chart";
  if (pathname === "/invitations") return "Supplier Invitations";
  const found = [...portalNav, ...mastersNav, ...adminNav, ...approvalsNav, ...evaluationNav].find(
    (item) => item.to === pathname,
  );
  return found?.label ?? "Overview";
}
export function WorkspaceTopBar({ pathname, onOpenMobileMenu }) {
  const { role, isLoggedIn, logout, currentUser } = useWorkspace();
  const router = useRouter();
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        zIndex: 20,
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 48,
          justifyContent: "space-between",
          px: { xs: 1.5, md: 2.5 },
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
          <IconButton
            size="small"
            edge="start"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary" }}
          >
            <Menu size={18} />
          </IconButton>
          <Box sx={{ display: { xs: "inline-flex", sm: "none" }, alignItems: "center", mr: 0.5 }}>
            <RaincoLogo className="h-5 w-auto" />
          </Box>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              fontSize: "12px",
              "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "12px",
                display: { xs: "none", sm: "inline" },
              }}
            >
              {role === "supplier" ? "Supplier Portal" : "Supplier Evaluation"}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: "text.primary", fontWeight: 700, fontSize: "12px" }}
            >
              {getBreadcrumbLabel(pathname)}
            </Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
          {isLoggedIn && role === "rainco" && currentUser && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.4,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: "11px",
              }}
            >
              <UserCheck size={13} className="text-primary" />
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "11px" }}>
                {currentUser.fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "10.5px",
                  display: { xs: "none", md: "inline" },
                }}
              >
                ({currentUser.department})
              </Typography>
            </Box>
          )}

          <Chip
            component={Link}
            to="/register"
            clickable
            size="small"
            variant="outlined"
            icon={<Mail size={12} className="text-primary" />}
            label="Simulate Email Invite Link"
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              display: { xs: "none", sm: "inline-flex" },
            }}
          />
          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.navigate({ to: "/login" });
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/login">
                <LogIn size={13} />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
export function WorkspaceFooter() {
  return (
    <footer className="workspace-footer">
      <span>© 2026 Rainco. Procurement Suite · Material UI</span>
      <span>Wireframe · Sample data · Email invitation & login flow</span>
    </footer>
  );
}
