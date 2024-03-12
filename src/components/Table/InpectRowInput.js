import {
    TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isNullOrEmpty, getPageIns, getUserPermissOnPage } from "../../functions";

const InspectRowInput = ({itemCode, itemComment, handleCheck}) => {

    /////Init Variables
    const [comment, setComment] = useState(itemComment);
    const [userPermiss, setUserPermiss] = useState(true);
    const location = useLocation();

    //////User Permission
    const handleUserPermission = async() => {
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("SAVE_YN", location.pathname);

        if(_validPermiss && getPageIns(location) === "1"){
            setUserPermiss(userPermiss => true);
        }else{
            setUserPermiss(userPermiss => false);
        }
    }

    useEffect(() => {
        handleUserPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <TextField
            key={itemCode + "_input"}
            variant="standard"
            fullWidth
            InputProps={{ disableUnderline: true }}
            value={isNullOrEmpty(comment) ? "" : comment}
            onChange={(event) => {
                if(userPermiss) setComment(comment => event.target.value)
            }}
            onBlur={(e) => {
                handleCheck(itemCode, "ITEM_COMMENT", comment)
            }}
            className="b-table-input" />
    )
}

export default InspectRowInput;