import {
    Box,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { isNullOrEmpty, getPageIns } from "../../functions";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const ChecklistCard = ({ data, handleCheck, validPermiss=true }) => {

    /////Init Variables
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);
    const [comment, setComment] = useState("");
    const location = useLocation();

    useEffect(() => {
        setComment(comment => data?.ITEM_COMMENT)
    }, [data?.ITEM_COMMENT])

    return (
        <Box className="b-card-16" sx={{display: (getPageIns(location) !== "1" && data.ITEM_RS_TEMP === "NA") ? "none" : "block"}}>
            <Stack className="b-top" flexDirection="row">
                <Box className={getPageIns(location) !== "3" ? "b-item b-item--first" : "b-item b-item--fourth"}>
                    <Box>{t(data.ITEM_NAME)}</Box>
                </Box>
                {getPageIns(location) === "1" &&
                    <>
                        <Box className="b-item b-item--sec" onClick={() => handleCheck(data.ITEM_CODE, "ITEM_RESULT", "OK")}>
                            <Box className={data.ITEM_RESULT === "OK" ? "b-box b-box--green" : "b-box"}></Box>
                        </Box>
                        <Box className="b-item b-item--sec" onClick={() => handleCheck(data.ITEM_CODE, "ITEM_RESULT", "NOK")}>
                            <Box className={data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : "b-box"}></Box>
                        </Box>
                        <Box className="b-item b-item--sec" onClick={() => handleCheck(data.ITEM_CODE, "ITEM_RESULT", "NA")}>
                            <Box className={data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"}></Box>
                        </Box>
                    </>
                }
                {getPageIns(location) === "2" &&
                    <>
                        <Box className="b-item b-item--sec b-item--flex" onClick={() => handleCheck(data.ITEM_CODE, "ITEM_RESULT", "OK")}>
                            <Box className={data.ITEM_RESULT === "OK" ? "b-box b-box--green" : "b-box"}></Box>
                            <Typography>
                                {data.ITEM_RS_TEMP === "OK" ? (
                                    <VerifiedUserIcon
                                        sx={{
                                            color: "green",
                                            fontSize: "1rem",
                                        }}
                                    />
                                ) : (
                                    ""
                                )}
                            </Typography>
                        </Box>
                        <Box className="b-item b-item--sec b-item--flex" onClick={() => handleCheck(data.ITEM_CODE, "ITEM_RESULT", "NOK")}>
                            <Box className={data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : "b-box"}></Box>
                            <Typography>
                                {data.ITEM_RS_TEMP === "NOK" ? (
                                    <VerifiedUserIcon
                                        sx={{
                                            color: "green",
                                            fontSize: "1rem",
                                        }}
                                    />
                                ) : (
                                    ""
                                )}
                            </Typography>
                        </Box>
                        <Box className="b-item b-item--sec b-item--flex" onClick={() => handleCheck(data.ITEM_CODE, "ITEM_RESULT", "NA")}>
                            <Box className={data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"}></Box>
                            <Typography>
                                {data.ITEM_RS_TEMP === "NA" ? (
                                    <VerifiedUserIcon
                                        sx={{
                                            color: "green",
                                            fontSize: "1rem",
                                        }}
                                    />
                                ) : (
                                    ""
                                )}
                            </Typography>
                        </Box>
                    </>
                }
                {getPageIns(location) === "3" &&
                    <>
                        <Stack className="b-item b-item--fifth" flexDirection="row" gap={0.5}>
                            <Box className={data.ITEM_RESULT === "OK" ? "b-box b-box--green" : data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"}></Box>
                            <Box sx={{fontWeight: 600}}>{data.ITEM_RESULT === "OK" ? "OK" : data.ITEM_RESULT === "NOK" ? "NO" : data.ITEM_RESULT === "NA" ? "N/A" : ""}</Box>
                        </Stack>
                    </>
                }
                <Box className="b-item b-item--third" onClick={() => setOpen(open => !open)}>
                    <Box className="b-circle">
                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Box>
                </Box>
            </Stack>
            <Box className={isOpen ? "b-bot" : "b-bot b-bot--close"}>
                <Stack flexDirection="row" alignItems="center" gap={1} sx={{ padding: '10px 5px' }}>
                    <Box sx={{ fontSize: 16 }}>{t('title_comment')}: </Box>
                    <TextField
                        variant="standard"
                        fullWidth
                        multiline
                        disabled={!validPermiss}
                        maxRows={2}
                        InputProps={{ disableUnderline: true }}
                        value={isNullOrEmpty(comment) ? "" : comment}
                        onChange={(event) => {
                            setComment(comment => event.target.value)
                        }}
                        onBlur={(event) => {
                            handleCheck(data.ITEM_CODE, "ITEM_COMMENT", comment)
                        }}
                        className="b-table-input"/>
                </Stack>
            </Box>
        </Box>
    )
}

export default ChecklistCard;