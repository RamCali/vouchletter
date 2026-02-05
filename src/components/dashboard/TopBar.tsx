"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { AppBar, Toolbar, Box, TextField, InputAdornment, IconButton, Avatar, Menu, MenuItem, Typography, Divider, ListItemIcon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

const DRAWER_WIDTH = 260;

export function TopBar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px`, borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2 }}>
        <TextField placeholder="Search students..." size="small" sx={{ width: 300, "& .MuiOutlinedInput-root": { bgcolor: "background.default" } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary" }} /></InputAdornment> }} />
        <Box sx={{ flex: 1 }} />
        <IconButton sx={{ color: "text.secondary" }}><NotificationsIcon /></IconButton>
        <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", p: 0.5, borderRadius: 2, "&:hover": { bgcolor: "action.hover" } }}>
          <Avatar src={user?.image || undefined} sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>{user?.name?.[0] || "U"}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{user?.name || "Counselor"}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>COUNSELOR</Typography>
          </Box>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem><ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut} sx={{ color: "error.main" }}><ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
