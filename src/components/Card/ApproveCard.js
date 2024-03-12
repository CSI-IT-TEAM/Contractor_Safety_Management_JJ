import {
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getDateFormatString, getUserPermissOnPage } from "../../functions";

const ApproveCard = ({ data, selectItem, handleClick, handleSelect }) => {
    /////Init Variable
    const location = useLocation();
    const [isRSM, setIsRSM] = useState(false);
    const open = data.REQ_NO === selectItem ? true : false;

    const handlePermission = async() => {
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("SAVE_YN", location.pathname);

        ///////Set Permissions
        setIsRSM(isRSM => _validPermiss);
    }

    useEffect(() => {   
        handlePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data.PIC_CONFIRM_YN])

    return (
        <>
            <Box className={open ? "b-card-11 b-card-11--active" : "b-card-11"}>
                <Stack className="b-top" flexDirection="row">
                    <Box className="b-item b-item--first" onClick={() => handleClick(data.REQ_NO)}>
                        <Box>{data.ORD}</Box>
                    </Box>
                    <Box className="b-item b-item--sec" onClick={() => handleClick(data.REQ_NO)}>
                        {data.CONT_NAME}
                    </Box>
                    <Box className="b-item b-item--eighth" onClick={() => handleClick(data.REQ_NO)}>
                        {data.VISIT_PURPOSE}
                    </Box>
                    <Box className="b-item b-item--third" onClick={() => handleClick(data.REQ_NO)}>
                        {data.EMP_QTY}
                    </Box>
                    <Box className="b-item b-item--fourth" onClick={() => handleClick(data.REQ_NO)}>
                        {data.VISIT_START_DATE === data.VISIT_END_DATE ?
                            getDateFormatString(data.VISIT_START_DATE) : getDateFormatString(data.VISIT_START_DATE) + " - " + getDateFormatString(data.VISIT_END_DATE)}
                    </Box>
                    <Box className="b-item b-item--nineth" onClick={() => handleClick(data.REQ_NO)}>
                        {data.DEPT_NM}
                    </Box>
                    <Box className="b-item b-item--sixth b-justify--start" onClick={() => handleClick(data.REQ_NO)}>
                        {data.SUPERVISOR_NM}
                    </Box>
                    <Box className="b-item b-item--sixth" onClick={() => handleClick(data.REQ_NO)}>
                        {data.SUPERVISOR_PHONE}
                    </Box>
                    <Box className="b-item b-item--fifth">
                        <FormControlLabel control={<Checkbox
                            disabled={!isRSM}
                            onChange={(e) => handleSelect(data.REQ_NO, "RSM_CONFIRM_YN", "Y")}
                            checked={data.RSM_CONFIRM_YN === "Y" ? true : false}
                            color="success"
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                        />} />
                    </Box>
                    <Box className="b-item b-item--fifth b-right-none">
                        <FormControlLabel control={<Checkbox
                            disabled={!isRSM}
                            onChange={(e) => handleSelect(data.REQ_NO, "RSM_CONFIRM_YN", "D")}
                            checked={data.RSM_CONFIRM_YN === "D" ? true : false}
                            color="error"
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                        />} />
                    </Box>
                </Stack>
            </Box>
        </>
    )
}

export default ApproveCard;