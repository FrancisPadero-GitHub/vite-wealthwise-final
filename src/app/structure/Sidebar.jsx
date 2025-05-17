import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 250;
const minimizedDrawerWidth = 65;

const menuItems = [
  { text: "📊 Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "💸 Transactions", icon: <ReceiptIcon />, path: "/transactions" },
  { text: "👤 Profile", icon: <PersonIcon />, path: "/profile" },
];

export default function Sidebar({ open }) {
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      ModalProps={{
        keepMounted: true,
        disableAutoFocus: true,
        disableEnforceFocus: true,
      }}
      sx={{
        width: open ? drawerWidth : minimizedDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : minimizedDrawerWidth,
          boxSizing: "border-box",
          transition: "width 0.2s ease-in-out",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflowX: "hidden" }}>
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <Tooltip title={!open ? text : ""} placement="right" key={text}>
              <ListItemButton
                component={Link}
                to={path}
                selected={location.pathname === path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
