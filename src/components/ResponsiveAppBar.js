import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Select from "react-select";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { useNavigate } from "react-router-dom/dist";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import avatar from "../assets/images/gear.png";
import { Slide, Stack } from "@mui/material";
import HideOnScroll from "./HideOnScroll";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "../redux/store/userSlice";
import i18next from "i18next";
import { UserMenuListSelectURL } from "../api";
import { UploadUserMenuListParams } from "../data/uploadParams";
import { useTranslation } from "react-i18next";
import longhaiAvatar from "../assets/images/avatar/LONGHAI.png";
// const pages = ["Products", "Pricing", "Blog"];
import vnlang_image from "../assets/images/languages/vn.png";
import enlang_image from "../assets/images/languages/en.png";
import { hover } from "@testing-library/user-event/dist/hover";
var languages = [
  {
    value: "vn",
    label: "Việt Nam",
    image: vnlang_image,
  },
  { value: "en", label: "English", image: enlang_image },
];

// const pages = [
//   // { title: "Nhập phiếu tiếp nhận", route: "/" },
//   { title: "Danh sách", route: "/RSM/history" },
// ];

// const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLogged, setisLogged] = useState(false);
  const [UserAvatar, setUserAvatar] = useState("");

  const [pages, setpages] = useState([]);
  const [settings, setsettings] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const i18_Value =
    i18next.language !== null &&
    i18next.language !== undefined &&
    i18next.language !== ""
      ? i18next.language
      : "en";
  const [lang, setLang] = useState(i18_Value);

  ////// Transldate
  const { t } = useTranslation();
  const menu_settings = [
    { title: "title_account_infor", route: "/user" },
    { title: "title_logout", route: "/login" },
  ];
  //////// Get Image Base-64
  const arrayBufferToBase64 = (buffer) => {
    var base64Flag = "data:image/jpeg;base64,";
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return base64Flag + window.btoa(binary);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (route) => {
    setAnchorElNav(null);
    if (route.button !== 0) {
      navigate(route);
    }
  };

  const handleCloseUserMenu = (route) => {
    setAnchorElUser(null);
    if (route === "/login") {
      let userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
      let Infor = {
        username: userInfor.username, // State username với giá trị mặc định là "Guest"
        password: userInfor.password,
        displayname: userInfor.displayname, // State display name
        avatar: userInfor.avatar, // State avatar
        Permission: userInfor.Permission,
        isAuth: false, //Logout
        isChief: userInfor.isChief,
      };
      localStorage.setItem("CONT_USER_INFOR", JSON.stringify(Infor));
      navigate(route);
    }
  };

  const handleChange = (event) => {
    i18next.changeLanguage(event.value);
    setLang(event.value);
  };

  useEffect(() => {
    let userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
    if (userInfor !== null && userInfor !== undefined) {
      let UserAvatar = userInfor.avatar;
      if (userInfor.Permission === "SCR") {
        setUserAvatar(longhaiAvatar);
      } else {
        setUserAvatar(arrayBufferToBase64(UserAvatar));
      }

      if (userInfor.isAuth) {
        const UserMenuParams = {
          TYPE: "Q",
          EMPID: userInfor.username,
        };
        fetch(UserMenuListSelectURL, {
          method: "POST",
          mode: "cors",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(UploadUserMenuListParams(UserMenuParams)),
        }).then((response) => {
          response.json().then((result) => {
            setpages(result);
          });
        });
        setsettings(menu_settings);

        setisLogged(true);
      } else {
        setisLogged(false);
      }
    } else {
      navigate(false);
    }
  }, [navigate]);

  return (
    <>
      {isLogged === true && (
        <HideOnScroll threshold={100}>
          <AppBar
            position="sticky"
            size="small"
            sx={{
              backgroundColor: "navy",
            }}
          >
            <Container maxWidth="full">
              <Toolbar disableGutters variant="dense">
                <HomeRepairServiceIcon
                  sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/loading"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "Times New Roman",
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {/* INFRASTRUCTURE DAILY REPORT */}
                  Contractor Safety Management System
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {pages &&
                      pages.map((page) => (
                        <MenuItem
                          key={page.title}
                          onClick={() => handleCloseNavMenu(page.ROUTE)}
                        >
                          <Typography
                            textAlign="center"
                            sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          >
                            {t(`${page.MENU_DISPLAY_NAME}`)}
                          </Typography>
                        </MenuItem>
                      ))}
                  </Menu>
                </Box>
                <HomeRepairServiceIcon
                  sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                />
                <Typography
                  variant="h7"
                  noWrap
                  component="a"
                  href="/loading"
                  sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontFamily: "Times New Roman",
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Contractor Safety Management System
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  {isLogged === true &&
                    pages &&
                    pages.map((page) => (
                      <Button
                        // variant="outlined"
                        key={page.title}
                        onClick={() => handleCloseNavMenu(page.ROUTE)}
                        sx={[
                          {
                            "&:hover": {
                              color: "white",
                              backgroundColor: "#14C86E",
                            },
                          },
                          {
                            mx: 0.1,
                            my: 2,
                            color: "yellow",
                            display: "block",
                            textTransform: "none",
                            fontWeight: "bold",
                            // backgroundColor: "#161654",
                          },
                        ]}
                      >
                        {t(`${page.MENU_DISPLAY_NAME}`)}
                      </Button>
                    ))}
                </Box>

                {isLogged === true ? (
                  <Box>
                    <Stack spacing={1} direction={"row"} alignItems={"center"}>
                      <Select
                        defaultValue={languages.filter(
                          (item) => item.value === lang
                        )}
                        options={languages}
                        styles={{
                          control: (base, { isDisabled, isFocused }) => ({
                            ...base,
                            borderRadius: 5,
                            background: isDisabled ? "#EBEBEB" : "#FFFFFF",
                            minWidth: "100px",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                            color: "black",
                          }),
                        }}
                        formatOptionLabel={(item) => (
                          <Box alignItems={"center"}>
                            <Stack
                              spacing={0.5}
                              direction={"row"}
                              alignItems={"center"}
                            >
                              <img
                                style={{
                                  width: "32px",
                                  height: "22px",
                                }}
                                src={item.image}
                                alt="languages"
                              />
                              <Typography>{item.label}</Typography>
                            </Stack>
                          </Box>
                        )}
                        onChange={handleChange}
                      />
                      <Tooltip title="Open settings">
                        <IconButton
                          onClick={handleOpenUserMenu}
                          id="basic-button"
                          sx={{ p: 0 }}
                          size="large"
                          aria-label="account of current user"
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                        >
                          <Avatar
                            sx={{
                              width: "50px",
                              height: "50px",
                            }}
                            alt="S"
                            src={UserAvatar}
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem
                          key={setting.title}
                          onClick={() => handleCloseUserMenu(setting.route)}
                        >
                          <Typography textAlign="center">
                            {t(`${setting.title}`)}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                ) : null}
              </Toolbar>
            </Container>
          </AppBar>
        </HideOnScroll>
      )}
    </>
  );
}
export default ResponsiveAppBar;
