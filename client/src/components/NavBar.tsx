import React, { useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LightMode from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Toolbar, IconButton, Drawer, Divider, List, Chip, Box, Typography,
} from "@mui/material";
import {
  ChevronLeft, ChevronRight, EmojiEvents, SportsScore, Timer,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Image from "mui-image";
import { useOnClickOutside } from "usehooks-ts";
import AppBar from "./StyledComponents/AppBar";
import DrawerHeader from "./StyledComponents/DrawerHeader";
import { NavBarProps } from "./types";

const Main = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

const drawerWidth = 250;

function NavBar({ componentsToShow, toggleDarkMode, isDarkMode }: NavBarProps) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleClickOutside = () => setOpen(false);

  useOnClickOutside(menuRef, handleClickOutside);

  return (
    <>
      <AppBar position="sticky" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2, display: "flex", ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{
            margin: "auto", position: "absolute", right: "50%", transform: "translateX(50%)",
          }}
          >
            <Image
              src="./banner.png"
              height="4rem"
              width="auto"
              alt="ACC Race Hub"
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        ref={menuRef}
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
          {componentsToShow % 2 === 1
          && (
          <ListItem>
            <ListItemButton onClick={() => { navigate("/championship"); handleDrawerClose(); }}>
              <ListItemIcon>
                <EmojiEvents />
              </ListItemIcon>
              <ListItemText primary="Championship" />
            </ListItemButton>
          </ListItem>
          )}
          {(componentsToShow % 3 === 0 || componentsToShow === 7 || componentsToShow === 2)
          && (
          <ListItem>
            <ListItemButton onClick={() => { navigate("/races"); handleDrawerClose(); }}>
              <ListItemIcon>
                <SportsScore />
              </ListItemIcon>
              <ListItemText primary="Races" />
            </ListItemButton>
          </ListItem>
          )}
          {componentsToShow >= 4
          && (
          <ListItem>
            <ListItemButton onClick={() => { navigate("/classqualifying"); handleDrawerClose(); }}>
              <ListItemIcon>
                <Timer />
              </ListItemIcon>
              <ListItemText primary="Class qualifying" />
            </ListItemButton>
          </ListItem>
          )}
          <Divider />
          <ListItem>
            <ListItemButton onClick={toggleDarkMode}>
              <ListItemIcon>
                {isDarkMode ? <Brightness3Icon /> : <LightMode />}
              </ListItemIcon>
              <ListItemText primary={isDarkMode ? "Dark mode" : "Light mode"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main>
        <Outlet />
      </Main>

      <Typography sx={{ position: "fixed", right: 0, bottom: 0 }}>
        © 2023
        {" "}
        <a href="https://github.com/schmatteo">schmatteo</a>
      </Typography>
    </>
  );
}

export default NavBar;
