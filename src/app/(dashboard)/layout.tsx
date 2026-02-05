"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const navItems = [
  { label: "Letters", href: "/letters", icon: <EditNoteIcon sx={{ fontSize: 18 }} /> },
  { label: "Students", href: "/students", icon: <PeopleIcon sx={{ fontSize: 18 }} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileMenu, setMobileMenu] = useState<null | HTMLElement>(null);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Compact Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 48, sm: 52 }, px: { xs: 1.5, sm: 2 } }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              V
            </Box>
            {!isMobile && (
              <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                VouchLetter
              </Typography>
            )}
          </Stack>

          {/* Desktop Nav */}
          {!isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  size="small"
                  sx={{
                    color: pathname.startsWith(item.href) ? "primary.main" : "text.secondary",
                    bgcolor: pathname.startsWith(item.href) ? "primary.50" : "transparent",
                    fontWeight: pathname.startsWith(item.href) ? 600 : 400,
                    fontSize: "0.8rem",
                    px: 1.5,
                    py: 0.5,
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <Button
                onClick={(e) => setMobileMenu(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                size="small"
                sx={{ color: "text.primary", flex: 1, justifyContent: "flex-start", fontSize: "0.8rem" }}
              >
                {navItems.find((n) => pathname.startsWith(n.href))?.label || "Menu"}
              </Button>
              <Menu
                anchorEl={mobileMenu}
                open={Boolean(mobileMenu)}
                onClose={() => setMobileMenu(null)}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    component={Link}
                    href={item.href}
                    selected={pathname.startsWith(item.href)}
                    onClick={() => setMobileMenu(null)}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {item.icon}
                      <span>{item.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          {/* Right Side */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Chip
              label="FERPA"
              size="small"
              color="success"
              sx={{ height: 22, fontSize: "0.65rem", display: { xs: "none", sm: "flex" } }}
            />
            <IconButton component={Link} href="/settings" size="small" sx={{ p: 0.5 }}>
              <SettingsIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: "primary.light",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              DC
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Page Content - Full Width with max constraint */}
      <Box
        component="main"
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
