import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import thumb from "../../assets/images/signal/not-found.png";
import thumb1 from "../../assets/images/signal/shield.png";

const EmptyCard = ({ type = "empty", size="window" }) => {
    ////// Translate
    const { t } = useTranslation();

    return (
        <>
            <Box className={size === "window" ? "b-empty-box" : "b-empty-box b-empty-box--mobile"}>
                <img
                    className="b-thumb"
                    src={type === "empty" ? thumb : thumb1}
                    alt="Empty"
                />
                <Typography className="b-title" style={{ color: "#545454" }}>
                    {type === "empty"
                        ? t('title_no_exist')
                        : t('title_no_permission')}
                </Typography>
                <Typography style={{ color: "#999" }} className="b-desc">
                    {type === "empty"
                        ? t('text_no_exist')
                        : t('text_no_permission')}
                </Typography>
            </Box>
        </>
    );
};

export default EmptyCard;