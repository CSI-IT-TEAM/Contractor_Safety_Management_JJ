import React from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslation } from "react-i18next";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const width = window.innerWidth;

const EmployeeInfoCard = ({ data, handleSelect}) => {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;

    ////// Transldate
    const { t } = useTranslation();
    const _pos_nm = data.EMP_POSITION === "P001" ? t("worker") : data.EMP_POSITION === "P002" ? t("supervisor") : "";

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="b-card-40" onClick={() => handleSelect(data.EMP_CITIZEN_ID)}>
            <Stack direction="row" alignItems="center" gap={1} sx={{position: "relative"}}>
                <Box className="b-icon">
                    {data.SELECTED_YN === "Y" ? <CheckCircleIcon sx={{fontSize: 20, color: "seagreen"}} /> : <FiberManualRecordIcon sx={{ fontSize: 10, color: "#cdd7dc" }} />}
                </Box>
                <Box className={data.SELECTED_YN === "Y" ? "b-title b-title--selected" : "b-title"}>{data.EMP_NAME}</Box>
            </Stack>
            {isMobile ? <>
                <Box className="b-desc">{_pos_nm}</Box>
            </> :
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: "50%"}} >
                    <Box sx={{fontSize: "17px"}}>{data.EMP_CITIZEN_ID}</Box>
                    <Box className="b-desc">{_pos_nm}</Box>
                </Stack>
            }
        </Stack>
    )
}

export default EmployeeInfoCard;