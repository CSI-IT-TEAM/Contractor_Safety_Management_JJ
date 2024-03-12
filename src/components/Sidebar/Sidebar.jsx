import { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideItem from "./SideItem/SideItem";
import BookIcon from '@mui/icons-material/Book';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';

import "./Sidebar.scss";
import logo from "../../assets/images/logos/logo.jpg";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

const Sidebar = ({ isOpen, handleOpen, pages }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));

    /////// Navigate
    const navigate = useNavigate();

    const handleNavigate = async(path) => {
        if (matches) {
            handleOpen();
        }

        if (path !== null && path !== "" && path !== undefined) {
            navigate(path);
        }
    };

    /////// Loop Title By Time
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState("");
    const [delta, setDelta] = useState(220);
    const { t } = useTranslation();
    const toRotate = ["Be Safe Today", "Safe And Sound", "Work Safely"];
    const period = 220;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => {
            clearInterval(ticker);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting
            ? fullText.substring(0, text.length - 1)
            : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updatedText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(period);
        }
    };

    return (
        <>
            <Box className={isOpen ? "s-sidebar is-open" : "s-sidebar"}>
                <Box className="s-sidebar__logo" onClick={() => handleNavigate("/")}>
                    <Box
                        className="s-sidebar__logo-thumb"
                    >
                        <img src={logo} alt="Logo" />
                    </Box>
                    <span>
                        <Typography variant="h1" className="s-sidebar__logo-title">
                            <span>Contractor Safety</span> Management System
                        </Typography>
                    </span>
                </Box>
                <Box className="s-sidebar__menu">
                    <Box className="s-sidebar__menu-item s-sidebar__menu-item--sub">
                        <AutoAwesomeMosaicIcon sx={{ fontSize: 30 }} />
                        <Typography className="s-sidebar__menu-item-title">
                            {t("title_services")}
                        </Typography>
                    </Box>
                    {pages != null &&
                        pages.length > 0 &&
                        pages.map((item, index) => {
                            if(item.CATEGORY_CD === "SERVICE"){
                                return (
                                    <SideItem
                                        key={item.MENU_NAME}
                                        data={item}
                                        handleNavigate={handleNavigate}
                                        isOpen={isOpen}
                                    />
                                );
                            }
                            else{
                                return null;
                            }
                        })}
                    {pages !== null && pages.length > 0 && pages.filter(item => item.CATEGORY_CD === "REPORT").length > 0 &&
                        <Box className="s-sidebar__menu-item s-sidebar__menu-item--sub">
                            <BookIcon sx={{ fontSize: 30 }} />
                            <Typography className="s-sidebar__menu-item-title">
                                {t('report')}
                            </Typography>
                        </Box>
                    }
                    {pages != null &&
                        pages.length > 0 &&
                        pages.map((item, index) => {
                            if(item.CATEGORY_CD === "REPORT"){
                                return (
                                    <SideItem
                                        key={item.MENU_NAME}
                                        data={item}
                                        handleNavigate={handleNavigate}
                                        isOpen={isOpen}
                                    />
                                );
                            }
                            else{
                                return null;
                            }
                        })}
                </Box>
            </Box>
        </>
    );
};

export default Sidebar;