import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LightMode from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Toolbar, IconButton, Drawer, Divider, List, Chip,
} from "@mui/material";
import {
  ChevronLeft, ChevronRight, EmojiEvents, SportsScore, Timer,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

const drawerWidth = 250;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Main = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function NavBar() {
  const [blackTheme, setBlackTheme] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const handleClick = () => {
    if (blackTheme) {
      setBlackTheme(false);
    } else {
      setBlackTheme(true);
    }
  };
  const navigate = useNavigate();
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <AppBar position="sticky" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Chip icon={theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />} label="Close menu" onClick={handleDrawerClose} />
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <ListItemButton onClick={() => navigate("/championship")}>
              <ListItemIcon>
                <EmojiEvents />
              </ListItemIcon>
              <ListItemText primary="Championship" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => navigate("/races")}>
              <ListItemIcon>
                <SportsScore />
              </ListItemIcon>
              <ListItemText primary="Races" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => navigate("/classqualifying")}>
              <ListItemIcon>
                <Timer />
              </ListItemIcon>
              <ListItemText primary="Class qualifying" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                {blackTheme ? <Brightness3Icon /> : <LightMode />}
              </ListItemIcon>
              {/* TODO handle dark mode */}
              <ListItemText primary={blackTheme ? "Dark mode" : "Light mode"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default NavBar;
