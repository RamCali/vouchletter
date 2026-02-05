"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Letters", href: "/letters", icon: <EditNoteIcon /> },
  { label: "Students", href: "/students", icon: <PeopleIcon /> },
  { label: "Scheduling", href: "/scheduling", icon: <CalendarMonthIcon />, badge: "Coming Soon", disabled: true },
  { label: "IEP Reviews", href: "/iep", icon: <SchoolIcon />, badge: "Coming Soon", disabled: true },
];

export function AdminOSSidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.25rem" }}>
          V
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>VouchLetter</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>Enterprise</Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, py: 1 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={item.disabled ? "div" : Link}
                href={item.disabled ? undefined : item.href}
                selected={pathname.startsWith(item.href)}
                disabled={item.disabled}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.badge && <Chip label={item.badge} size="small" sx={{ height: 20, fontSize: "0.65rem" }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/settings">
            <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>District Compliance Mode</Typography>
        <Chip label="FERPA Enabled" size="small" color="success" sx={{ mt: 0.5, height: 20, fontSize: "0.65rem" }} />
      </Box>
    </Drawer>
  );
}
