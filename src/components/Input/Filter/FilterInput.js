import {
    InputAdornment,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { isNullOrEmpty } from "../../../functions";
import { useTranslation } from "react-i18next";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const FilterInput = ({ data, handleUpdate }) => {
    ////// Init Variables
    const [search, setSearch] = useState("");
    const { t } = useTranslation();

    ////// Handle Key Down
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearch("");
            handleUpdate(search);
        }
    }

    useEffect(() => {
        setSearch(search => data);
    },[data])

    return (
        <TextField
            inputProps={{ inputMode: "text" }}
            value={search}
            InputProps={{
                endAdornment: isNullOrEmpty(search) ? (
                    <InputAdornment position="end">
                        <SearchIcon
                            sx={{
                                cursor: "pointer",
                            }}
                        />
                    </InputAdornment>
                ) : (
                    <InputAdornment position="end">
                        <CloseIcon
                            sx={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSearch("");
                                handleUpdate("");
                            }}
                        />
                    </InputAdornment>
                ),
            }}
            onChange={(event) => {
                setSearch(event.target.value);
            }}
            onBlur={() => handleUpdate(search)}
            onKeyDown={handleKeyDown}
            sx={{ background: "#f8f6f7" }}
            className="b-input bg-white"
            fullWidth
            placeholder={t("plholder_input_citizen_name_or_id")}
        />
    )
}

export default FilterInput;