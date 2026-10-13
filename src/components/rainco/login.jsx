import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Alert,
  AlertTitle,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RaincoLogo, useWorkspace } from "./workspace";
export function Login() {
  const { supplier, systemUsers, login, lastRegistrationNotice, setLastRegistrationNotice } =
    useWorkspace();
  const router = useRouter();
  const [loginType, setLoginType] = useState("supplier");
  const [username, setUsername] = useState(supplier.username || "leabon_ops");
  const [password, setPassword] = useState(supplier.password || "password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const defaultRaincoUser = systemUsers[0] ?? {
    username: "sunil.j",
    password: "password123",
  };
  const handleRoleSwitch = (nextRole) => {
    setLoginType(nextRole);
    setError("");
    if (nextRole === "supplier") {
      setUsername(supplier.username || "leabon_ops");
      setPassword(supplier.password || "password123");
    } else {
      setUsername(defaultRaincoUser.username);
      setPassword(defaultRaincoUser.password || "password123");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Please enter your username or email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(username, password, loginType);
      setLastRegistrationNotice(null);
      router.navigate({ to: loginType === "rainco" ? "/evaluation" : "/" });
    }, 350);
  };
  const handlePrefill = () => {
    if (loginType === "supplier") {
      setUsername(supplier.username || "leabon_ops");
      setPassword(supplier.password || "password123");
    } else {
      setUsername(defaultRaincoUser.username);
      setPassword(defaultRaincoUser.password || "password123");
    }
    setError("");
  };
  return (
    <Box sx={{ maxWidth: 440, mx: "auto", py: 4 }}>
      {/* Brand header */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Paper
          elevation={1}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            py: 1.5,
            borderRadius: 2.5,
            mb: 1.5,
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <RaincoLogo className="h-10 w-auto" />
        </Paper>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {loginType === "supplier" ? "Supplier Portal Sign-In" : "Rainco User Sign-In"}
        </Typography>
      </Box>

      {/* Registration notice banner if redirected from registration */}
      {lastRegistrationNotice && (
        <Alert
          severity="success"
          icon={<CheckCircle2 size={18} />}
          sx={{ mb: 2.5, borderRadius: 2, fontSize: "12px" }}
        >
          <AlertTitle sx={{ fontSize: "12.5px", fontWeight: 700, mb: 0.25 }}>
            Registration Completed!
          </AlertTitle>
          {lastRegistrationNotice}
        </Alert>
      )}

      {/* Login Card */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2.5,
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            p: 0.5,
            mb: 2.5,
            borderRadius: 2,
            bgcolor: "rgba(0,0,0,0.04)",
          }}
        >
          <Button
            type="button"
            size="sm"
            variant={loginType === "supplier" ? "default" : "ghost"}
            onClick={() => handleRoleSwitch("supplier")}
            className="h-8 text-xs font-semibold"
          >
            Login as Supplier
          </Button>
          <Button
            type="button"
            size="sm"
            variant={loginType === "rainco" ? "default" : "ghost"}
            onClick={() => handleRoleSwitch("rainco")}
            className="h-8 text-xs font-semibold"
          >
            Login as Rainco User
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.25}>
            <TextField
              label="Username or Email"
              size="small"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={loginType === "supplier" ? "e.g. leabon_ops" : "e.g. sunil.j"}
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={15} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.75 }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Account Password
                </Typography>
                <button
                  type="button"
                  onClick={handlePrefill}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  Pre-fill sample credentials
                </button>
              </Stack>
              <TextField
                label="Password"
                size="small"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={15} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          edge="end"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ py: 0.5, fontSize: "12px" }}>
                {error}
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full h-9">
              <span>
                {loading
                  ? "Signing in..."
                  : loginType === "supplier"
                    ? "Sign In to Supplier Portal"
                    : "Sign In as Rainco User"}
              </span>
              <ArrowRight size={14} />
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Stack spacing={1.25} sx={{ fontSize: "12px", color: "text.secondary" }}>
          {loginType === "supplier" && (
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <span>Need to complete registration?</span>
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Mail size={12} />
                <span>Supplier Registration</span>
              </Link>
            </Stack>
          )}
          <Paper
            variant="outlined"
            sx={{ p: 1.25, bgcolor: "rgba(0,0,0,0.02)", fontSize: "11px", borderRadius: 1.5 }}
          >
            <strong>Sample Credentials:</strong> Username:{" "}
            <code className="text-foreground font-mono">
              {loginType === "supplier"
                ? supplier.username || "leabon_ops"
                : defaultRaincoUser.username}
            </code>{" "}
            · Password:{" "}
            <code className="text-foreground font-mono">
              {loginType === "supplier"
                ? supplier.password || "password123"
                : defaultRaincoUser.password || "password123"}
            </code>
          </Paper>
        </Stack>
      </Paper>

      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
          color: "text.secondary",
          fontSize: "11px",
        }}
      >
        <ShieldCheck size={13} className="text-primary" />
        <span>Rainco Procurement Suite · Material UI</span>
      </Stack>
    </Box>
  );
}
