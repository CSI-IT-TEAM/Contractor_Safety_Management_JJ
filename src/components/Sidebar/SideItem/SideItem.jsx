import { Box, Typography, Popover } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import "./SideItem.scss";
import { useTranslation } from "react-i18next";

const width = window.innerWidth;

const SideItem = ({ data, handleNavigate, isOpen }) => {
    /////// Location
    const location = useLocation();
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if(width <= 991 || isOpen === false){
            setAnchorEl(null);
        }else{
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Box
                className="s-menu"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Box
                    className={
                        location.pathname === data.ROUTE
                            ? "s-menu-top is-active"
                            : "s-menu-top"
                    }
                    onClick={() => {
                        handleNavigate(data.ROUTE);
                    }}
                >
                    <Box className="s-menu-thumb">
                        <img src={data.IMAGE_URL} alt={data.MENU_NAME} />
                    </Box>
                    <Typography className="s-menu-title">
                        {t(`${data.MENU_DISPLAY_NAME}`)}
                    </Typography>
                </Box>
            </Box>
            <Popover
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                className="s-popover"
            >
                <Typography sx={{ p: 1 }}>{t(`${data.MENU_DISPLAY_NAME}`)}</Typography>
            </Popover>
        </>
    );
};

export default SideItem;