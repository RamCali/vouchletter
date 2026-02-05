import { Box } from "@mui/material";
import { AdminOSSidebar } from "@/components/dashboard/AdminOSSidebar";
import { TopBar } from "@/components/dashboard/TopBar";

const DRAWER_WIDTH = 260;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminOSSidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          ml: `${DRAWER_WIDTH}px`,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <Box sx={{ p: 3, mt: "64px" }}>{children}</Box>
      </Box>
    </Box>
  );
}
