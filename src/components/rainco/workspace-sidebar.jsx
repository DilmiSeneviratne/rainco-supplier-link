import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Layers,
  Layers3,
  LayoutDashboard,
  ListOrdered,
  LogIn,
  LogOut,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useWorkspace } from "./workspace-context";
import { RaincoLogo } from "./workspace-ui";
export const portalNav = [
  { to: "/", label: "Supplier Dashboard", icon: LayoutDashboard },
  { to: "/quotations", label: "Purchase Quotations", icon: FileText },
  { to: "/ratings", label: "My Evaluation", icon: Star },
];
export const mastersNav = [
  { to: "/checklist", label: "Supplier Checklist", icon: FileCheck2 },
  { to: "/supplier-types", label: "Supplier Types", icon: Building2 },
  { to: "/employees", label: "Employee Master", icon: Users },
  { to: "/tutorials", label: "Tutorials", icon: ListOrdered },
  { to: "/ratings-master", label: "Conditions", icon: Star },
];
export const evaluationNav = [
  { to: "/evaluation", label: "Evaluation Sheet", icon: ClipboardCheck },
  { to: "/evaluation-report", label: "Evaluation Result Report", icon: FileText },
  { to: "/evaluation-chart", label: "Evaluation Chart", icon: Star },
];
export const adminNav = [
  { to: "/users", label: "Users", icon: Users },
  { to: "/user-permissions", label: "User Permissions", icon: ShieldCheck },
  { to: "/suppliers", label: "Suppliers", icon: Building2 },
];
export const approvalsNav = [
  { to: "/approval-stages", label: "Approval Stages", icon: Layers },
  { to: "/approval-template", label: "Approval Template", icon: ListOrdered },
  { to: "/approval-queue", label: "Pending Approvals", icon: UserCheck },
  { to: "/responded-approvals", label: "Approved Approvals", icon: CheckCircle2 },
  { to: "/rejected-approvals", label: "Rejected Approvals", icon: XCircle },
];
function SidebarCollapsibleSection({
  label,
  icon: SectionIcon,
  open,
  onToggle,
  items,
  pathname,
  onItemClick,
}) {
  return (
    <>
      <ListItemButton onClick={onToggle} sx={{ borderRadius: 1.5, py: 0.65 }}>
        <ListItemIcon sx={{ minWidth: 26, color: "text.secondary" }}>
          <SectionIcon size={14} />
        </ListItemIcon>
        <ListItemText
          primary={label}
          slotProps={{ primary: { sx: { fontSize: "12px", fontWeight: 600 } } }}
        />
        <ChevronDown size={14} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{ pl: 1.5, ml: 1.5, borderLeft: "1px solid rgba(0,0,0,0.1)", my: 0.25 }}
        >
          {items.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={onItemClick}
              selected={pathname === item.to}
              sx={{
                borderRadius: 1.25,
                py: 0.55,
                mb: 0.2,
                "&.Mui-selected": {
                  bgcolor: "rgba(238, 28, 37, 0.1)",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 24, color: "text.secondary" }}>
                <item.icon size={13} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    noWrap: true,
                    sx: {
                      fontSize: "11.5px",
                      fontWeight: pathname === item.to ? 700 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}
function SidebarUserFooter({ isMobile, onCloseMobile }) {
  const { role, isLoggedIn, supplier, logout } = useWorkspace();
  const router = useRouter();
  return (
    <Box sx={{ p: 1.25 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          borderRadius: 2,
          bgcolor: "rgba(238, 28, 37, 0.03)",
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: "primary.main",
            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          {role === "supplier"
            ? supplier.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "SP"
            : "RC"}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "12px" }} noWrap>
            {role === "supplier" ? supplier.name : "Rainco Procurement"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "10px" }}>
            {role === "supplier"
              ? isLoggedIn
                ? "Supplier · Logged In"
                : "Supplier · Logged Out"
              : isLoggedIn
                ? "Rainco User · Logged In"
                : "Rainco User · Logged Out"}
          </Typography>
        </Box>
        {isLoggedIn ? (
          <Tooltip title="Sign out to Login screen">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                logout();
                if (isMobile) onCloseMobile();
                router.navigate({ to: "/login" });
              }}
            >
              <LogOut size={14} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Sign in">
            <IconButton
              size="small"
              color="primary"
              component={Link}
              to="/login"
              onClick={isMobile ? onCloseMobile : undefined}
            >
              <LogIn size={14} />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
}
export function WorkspaceSidebarContent({ isMobile = false, pathname, onCloseMobile }) {
  const { role, setRole, isLoggedIn } = useWorkspace();
  const [mastersOpen, setMastersOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [approvalsOpen, setApprovalsOpen] = useState(true);
  const [evaluationOpen, setEvaluationOpen] = useState(true);
  const handleItemClick = isMobile ? onCloseMobile : undefined;
  const isSupplierPortalDisabled = isLoggedIn && role === "rainco";
  const isSupplierEvaluationDisabled = isLoggedIn && role === "supplier";
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: isMobile ? 1.5 : 0,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Link
          to="/"
          className="brand"
          onClick={handleItemClick}
          style={{ borderBottom: "none", flex: 1 }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <RaincoLogo className="h-9 w-auto" />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "9px",
                color: "text.secondary",
              }}
            >
              Procurement Suite
            </Typography>
          </Box>
        </Link>
        {isMobile && (
          <IconButton
            size="small"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            sx={{ color: "text.secondary" }}
          >
            <X size={18} />
          </IconButton>
        )}
      </Box>

      <List
        component="nav"
        dense
        subheader={
          <ListSubheader
            component="div"
            sx={{
              bgcolor: "transparent",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              lineHeight: "24px",
              color: "text.secondary",
              px: 1.5,
            }}
          >
            WORKSPACE
          </ListSubheader>
        }
        sx={{ px: 1, flex: 1, overflowY: "auto" }}
      >
        <ListItemButton
          selected={role === "supplier"}
          disabled={isSupplierPortalDisabled}
          onClick={() => {
            if (!isSupplierPortalDisabled) setRole("supplier");
          }}
          sx={{
            borderRadius: 1.5,
            mb: 0.5,
            py: 0.9,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              boxShadow: "0 2px 6px rgba(238, 28, 37, 0.28)",
              "&:hover": { bgcolor: "primary.dark" },
              "& .MuiListItemIcon-root": { color: "primary.contrastText" },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
            <Layers3 size={15} />
          </ListItemIcon>
          <ListItemText
            primary="Supplier Portal"
            slotProps={{ primary: { sx: { fontSize: "12.5px", fontWeight: 700 } } }}
          />
          {role === "supplier" && <ChevronDown size={14} />}
        </ListItemButton>

        <Collapse
          in={role === "supplier" && !isSupplierPortalDisabled}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding sx={{ pl: 1.5, mb: 1 }}>
            {portalNav.map((item) => (
              <ListItemButton
                key={item.to}
                component={Link}
                to={item.to}
                onClick={handleItemClick}
                selected={pathname === item.to}
                sx={{
                  borderRadius: 1.5,
                  py: 0.65,
                  mb: 0.25,
                  "&.Mui-selected": {
                    bgcolor: "rgba(238, 28, 37, 0.1)",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 26, color: "text.secondary" }}>
                  <item.icon size={14} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "12px",
                        fontWeight: pathname === item.to ? 700 : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <Tooltip
          title={
            isSupplierEvaluationDisabled
              ? "Supplier Evaluation is disabled for supplier accounts. Only the Supplier Portal is accessible."
              : ""
          }
          disableHoverListener={!isSupplierEvaluationDisabled}
        >
          <span>
            <ListItemButton
              selected={role === "rainco"}
              disabled={isSupplierEvaluationDisabled}
              onClick={() => {
                if (!isSupplierEvaluationDisabled) setRole("rainco");
              }}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                py: 0.9,
                ...(isSupplierEvaluationDisabled && {
                  opacity: 0.45,
                  cursor: "not-allowed !important",
                  bgcolor: "transparent !important",
                }),
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow: "0 2px 6px rgba(238, 28, 37, 0.28)",
                  "&:hover": { bgcolor: "primary.dark" },
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                <ClipboardCheck size={15} />
              </ListItemIcon>
              <ListItemText
                primary="Supplier Evaluation"
                secondary={isSupplierEvaluationDisabled ? "Disabled for supplier account" : null}
                slotProps={{
                  primary: { sx: { fontSize: "12.5px", fontWeight: 700 } },
                  secondary: { sx: { fontSize: "10px", color: "text.disabled" } },
                }}
              />
              {role === "rainco" && !isSupplierEvaluationDisabled && <ChevronDown size={14} />}
            </ListItemButton>
          </span>
        </Tooltip>

        <Collapse
          in={role === "rainco" && !isSupplierEvaluationDisabled}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding sx={{ pl: 1 }}>
            <SidebarCollapsibleSection
              label="Master"
              icon={Layers3}
              open={mastersOpen}
              onToggle={() => setMastersOpen((prev) => !prev)}
              items={mastersNav}
              pathname={pathname}
              onItemClick={handleItemClick}
            />
            <SidebarCollapsibleSection
              label="Evaluation"
              icon={ClipboardCheck}
              open={evaluationOpen}
              onToggle={() => setEvaluationOpen((prev) => !prev)}
              items={evaluationNav}
              pathname={pathname}
              onItemClick={handleItemClick}
            />
            <SidebarCollapsibleSection
              label="Administration"
              icon={ShieldCheck}
              open={adminOpen}
              onToggle={() => setAdminOpen((prev) => !prev)}
              items={adminNav}
              pathname={pathname}
              onItemClick={handleItemClick}
            />
            <SidebarCollapsibleSection
              label="Approvals"
              icon={UserCheck}
              open={approvalsOpen}
              onToggle={() => setApprovalsOpen((prev) => !prev)}
              items={approvalsNav}
              pathname={pathname}
              onItemClick={handleItemClick}
            />
          </List>
        </Collapse>
      </List>

      <Divider />
      <SidebarUserFooter isMobile={isMobile} onCloseMobile={onCloseMobile} />
    </>
  );
}
