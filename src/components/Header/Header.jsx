import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Menu, IconButton } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import Select from "react-select";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuItem from "@mui/material/MenuItem";
import { Stack } from "@mui/material";
import i18next from "i18next";
import { UserMenuListSelectURL } from "../../api";
import { UploadUserMenuListParams } from "../../data/uploadParams";
import { useTranslation } from "react-i18next";
import longhaiAvatar from "../../assets/images/avatar/LONGHAI.png";
import "./Header.scss";
import { useNavigate } from "react-router-dom";

import vnlang_image from "../../assets/images/languages/vn.png";
import enlang_image from "../../assets/images/languages/en.png";
import krlang_image from "../../assets/images/languages/kr.png";
import indolang_image from "../../assets/images/languages/indo.png";

const menu_settings = [
    { title: "title_password_change", route: "/passwordchange" },
    { title: "title_logout", route: "/login" },
];
var languages = [
    // { value: "vn", label: "Việt Nam", image: vnlang_image,},
    { value: "en", label: "English", image: enlang_image },
    // { value: "kr", label: "Korean", image: krlang_image },
    { value: "indo", label: "Indonesian", image: indolang_image },
];

const Header = ({ open, handleOpen, handleOpenModal, handleNotify }) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [isLogged, setisLogged] = useState(false);
    const [UserAvatar, setUserAvatar] = useState("");

    const i18_Value =
        i18next.language !== null &&
            i18next.language !== undefined &&
            i18next.language !== ""
            ? i18next.language
            : "en";
    const [lang, setLang] = useState(i18_Value);
    const [pages, setpages] = useState([]);
    const [settings, setsettings] = useState([]);

    ///// Set Default language
    const navigate = useNavigate();
    const { t } = useTranslation();

    //////// Get Image Base-64
    const arrayBufferToBase64 = (buffer) => {
        var base64Flag = "data:image/jpeg;base64,";
        var binary = "";
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => (binary += String.fromCharCode(b)));

        return base64Flag + window.btoa(binary);
    };
    const handleChange = (event) => {
        i18next.changeLanguage(event.value);
        setLang(event.value);
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
                plant_cd: userInfor.plant_cd,
                dept_cd: userInfor.dept_cd,
                isAuth: false, //Logout
                isChief: userInfor.isChief,
            };
            localStorage.setItem("CONT_USER_INFOR", JSON.stringify(Infor));
            navigate(route);
        } else if (route === "/passwordchange") {
            navigate(route);
        }
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
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

    if (!isLogged) {
        return null;
    }

    return (
        <>
            <Sidebar isOpen={open} handleOpen={handleOpen} pages={pages} />
            <Box className={open ? "s-header header-active" : "s-header"}>
                <Box className="s-header-menu" onClick={handleOpen}>
                    {open ? (
                        <MenuOpenIcon sx={{ fontSize: 32 }} />
                    ) : (
                        <MenuIcon sx={{ fontSize: 32 }} />
                    )}
                </Box>
                <Box className="s-header-content">
                    <Box className="s-avatar">
                        <Stack spacing={1} direction={"row"} alignItems={"center"}>
                            <Select
                                defaultValue={languages.filter((item) => item.value === lang)}
                                options={languages}
                                isSearchable={false}
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
                                            spacing={0.8}
                                            direction={"row"}
                                            alignItems={"center"}
                                        >
                                            <img
                                                style={{
                                                    width: "32px",
                                                    height: "22px",
                                                    boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                                                }}
                                                src={item.image}
                                                alt="languages"
                                            />
                                            <Typography sx={{ fontSize: '17px' }}>{item.label}</Typography>
                                        </Stack>
                                    </Box>
                                )}
                                onChange={handleChange}
                            />
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
                                    alt="avatar"
                                    src={UserAvatar}
                                    className="s-avatar__thumb"
                                //onClick={handleToggle}
                                />
                            </IconButton>
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
                            {settings.map((setting) =>
                                setting.route ? (
                                    <MenuItem
                                        key={setting.title}
                                        onClick={() => handleCloseUserMenu(setting.route)}
                                    >
                                        <Typography textAlign="center">
                                            {t(`${setting.title}`)}
                                        </Typography>
                                    </MenuItem>
                                ) : (
                                    <MenuItem
                                        key={setting.title} //onClick={handleToggle}
                                    >
                                        <Typography textAlign="center">
                                            {t(`${setting.title}`)}
                                        </Typography>
                                    </MenuItem>
                                )
                            )}
                        </Menu>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Header;
