import {
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { isNullOrEmpty } from "../../../functions";
import { useTranslation } from "react-i18next";

const width = window.innerWidth;

const TextInput = ({ id, value, defaultDate, handleChange  }) => {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;

    //////Init Variables
    const { t } = useTranslation();
    const [textValue, setTextValue] = useState("");

    useEffect(() => {
        setTextValue(textValue => value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id, value]);

    return (
        <TextField
            name="VISITOR_ID"
            disabled={!isNullOrEmpty(defaultDate)}
            value={textValue}
            onChange={(event) =>
                setTextValue(textValue => event.target.value)
            }
            onBlur={() => handleChange(textValue)}
            sx={{
                background: isNullOrEmpty(defaultDate) ? "#fff" : "#f8f6f7",
                maxWidth: "180px"
            }}
            className={isMobile ? "b-input b-input--mobile" : "b-input"}
            label={t(
                "plholder_input_visitor_no"
            )}
            variant="outlined"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="start">
                        <Typography sx={{fontSize: "22px"}}>💳</Typography>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default TextInput;