"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Drawer,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const SIDEBAR_WIDTH = 220;

const mainNavItems = [
  { label: "Letters", href: "/letters", icon: EditNoteIcon },
  { label: "Students", href: "/students", icon: PeopleIcon },
  { label: "Calendar", href: "/calendar", icon: CalendarMonthIcon, disabled: true },
];

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  disabled,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  disabled?: boolean;
}) {
  const content = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 0.875,
        mx: 1,
        borderRadius: 1.5,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        color: isActive ? "primary.main" : "text.secondary",
        bgcolor: isActive ? "primary.50" : "transparent",
        fontWeight: isActive ? 600 : 500,
        fontSize: "0.875rem",
        transition: "all 0.15s ease",
        position: "relative",
        "&:hover": disabled
          ? {}
          : {
              bgcolor: isActive ? "primary.50" : "grey.100",
              color: isActive ? "primary.main" : "text.primary",
            },
        "&::before": isActive
          ? {
              content: '""',
              position: "absolute",
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 20,
              borderRadius: 2,
              bgcolor: "primary.main",
            }
          : {},
      }}
    >
      <Icon sx={{ fontSize: 18 }} />
      <span>{label}</span>
      {disabled && (
        <Box
          component="span"
          sx={{
            ml: "auto",
            fontSize: "0.6rem",
            bgcolor: "grey.200",
            color: "text.secondary",
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            fontWeight: 500,
          }}
        >
          Soon
        </Box>
      )}
    </Box>
  );

  if (disabled) return content;
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
            }}
          >
            V
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
            >
              VouchLetter
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.65rem" }}>
              Counselor Suite
            </Typography>
          </Box>
        </Stack>
        {onClose && (
          <IconButton size="small" onClick={onClose} sx={{ display: { md: "none" } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flex: 1, py: 1.5, overflow: "auto" }}>
        <Typography
          variant="caption"
          sx={{
            px: 2.5,
            py: 1,
            display: "block",
            color: "text.disabled",
            fontWeight: 600,
            fontSize: "0.65rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Main
        </Typography>
        <Stack spacing={0.25}>
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname.startsWith(item.href)}
              disabled={item.disabled}
            />
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: 1, borderColor: "divider" }}>
        {/* FERPA Status */}
        <Box
          sx={{
            mx: 1.5,
            my: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            bgcolor: "success.50",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 16, color: "success.main" }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "success.dark", fontSize: "0.7rem" }}
            >
              FERPA Compliant
            </Typography>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <Stack direction="row" spacing={0.5} sx={{ px: 1.5, pb: 1 }}>
          <Tooltip title="Settings">
            <IconButton
              component={Link}
              href="/settings"
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <SettingsIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <HelpOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* User */}
        <Box
          sx={{
            px: 1.5,
            py: 1.5,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            DC
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.8rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Demo Counselor
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.7rem" }}
            >
              Lincoln High
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
          }}
        >
          <Box sx={{ position: "fixed", height: "100vh" }}>
            <SidebarContent />
          </Box>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH },
        }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <IconButton size="small" onClick={() => setMobileOpen(true)}>
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              V
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              VouchLetter
            </Typography>
          </Box>
        )}

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 2.5 }, maxWidth: 1100 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
