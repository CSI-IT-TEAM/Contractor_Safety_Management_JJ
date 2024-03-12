import {
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getDateFormatString } from "../../functions";

import thumb1 from "../../assets/images/signal/encrypted.png";
import thumb2 from "../../assets/images/signal/piercing.png";
import thumb3 from "../../assets/images/signal/expired.png";

const EmployeeCard = ({ data }) => {

    /////Translate
    const { t } = useTranslation();

    return (
        <Box className="b-card-14">
            <Stack className="b-top" flexDirection="row">
                <Box className="b-item b-item--first">
                    <Box>{data.ORD}</Box>
                </Box>
                <Box className="b-item b-item--sec">
                    {data.EMP_NAME}
                </Box>
                <Box className="b-item b-item--third">
                    {data.EMP_CITIZEN_ID}
                </Box>
                <Box className="b-item b-item--fourth">
                    {getDateFormatString(data.EMP_BIRTHDATE)}
                </Box>
                <Box className="b-item b-item--fifth">
                    {data.EMP_GENDER === "Male" ? t('male') : t('female')}
                </Box>
                <Box className="b-item b-item--sixth">
                    {data.POS_NM_EN === "Worker" ? t('worker') : t('supervisor')}
                </Box>
                <Box className="b-item b-item--seventh">
                    {data.SECURITY_CARD_YN === "Y" &&
                        <Stack flexDirection="row" gap={0.5}>
                            <Box sx={{height: "20px"}}><img src={thumb1} alt="Validated" /></Box>
                            <Box>{t('validate')}</Box>
                        </Stack>
                    }
                    {data.SECURITY_CARD_YN === "N" &&
                        <Stack flexDirection="row" gap={0.5}>
                            <Box sx={{height: "25px"}}><img src={thumb2} alt="Empty" /></Box>
                            <Box>{t('empty')}</Box>
                        </Stack>
                    }
                    {data.SECURITY_CARD_YN === "EXP" &&
                        <Stack flexDirection="row" gap={0.5}>
                            <Box sx={{height: "25px"}}><img src={thumb3} alt="Expired" /></Box>
                            <Box>{t('expired_text')}</Box>
                        </Stack>
                    }
                </Box>
            </Stack>
        </Box>
    )
}

export default EmployeeCard;