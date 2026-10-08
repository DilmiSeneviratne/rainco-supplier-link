import { Box, Chip, Paper, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace-context";
export function RaincoLogo({ className = "h-8 w-auto" }) {
    return (<img src="/rainco-logo-trimmed.jpg" alt="Rainco" className={`${className} object-contain mix-blend-multiply select-none`}/>);
}
export function AccessNotice({ audience }) {
    const { setRole } = useWorkspace();
    return (<Paper elevation={1} className="access-notice" sx={{ p: 4, borderRadius: 2.5, textAlign: "center" }}>
      <ShieldCheck size={32} className="text-primary"/>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {audience === "supplier" ? "Supplier Portal" : "Supplier Evaluation"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This view is reserved for {audience === "supplier" ? "suppliers" : "Rainco users"}.
      </Typography>
      <Button onClick={() => setRole(audience)}>
        Preview as {audience === "supplier" ? "a supplier" : "a Rainco user"}
      </Button>
      <Typography variant="caption" color="text.secondary">
        Audience simulation only; no secure sign-in is connected.
      </Typography>
    </Paper>);
}
export function PageHeading({ eyebrow, title, children, }) {
    return (<Box className="page-heading">
      <Box>
        <Chip label={eyebrow} size="small" color="primary" variant="outlined" sx={{
            height: 20,
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 0.5,
            bgcolor: "rgba(238, 28, 37, 0.06)",
            borderColor: "rgba(238, 28, 37, 0.25)",
        }}/>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 800, fontSize: "1.25rem" }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>);
}
export function pageMeta(title, description) {
    return {
        meta: [
            { title: `${title} | Rainco Procurement` },
            { name: "description", content: description },
            { property: "og:title", content: `${title} | Rainco Procurement` },
            { property: "og:description", content: description },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    };
}
