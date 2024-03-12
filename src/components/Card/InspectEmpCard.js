import { Box, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getPageIns } from "../../functions";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BlockIcon from "@mui/icons-material/Block";

const InspectEmpCard = memo(({
    data,
    handleClick,
    handleBlacklist = null,
    isBlacklist = false,
    isMobile = false,
}) => {
    /////Init Variable
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    /////Page Location
    const location = useLocation();
    const pageLocation = getPageIns(location);

    let _pos_nm = data.POS_NM_EN === "Worker" ? t("worker") : t("supervisor");

    useEffect(() => {
        setOpen(open => data.SELECTED_YN === "Y" ? true : false);
    },[data])

    if (isBlacklist) {
        if (isMobile) {
            return (
                <>
                    <Box className="b-card-20">
                        <Stack
                            className={isOpen ? "b-top b-top--active" : "b-top"}
                            flexDirection="row"
                        >
                            <Box
                                className="b-item b-item--first"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                <Box>{data.EMP_NAME}</Box>
                            </Box>
                            <Box
                                className="b-item b-item--sec"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {data.EMP_CITIZEN_ID}
                            </Box>
                            <Box
                                className="b-item b-item--third"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {_pos_nm}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.CHECKED_YN === "Y" ? true : false}
                                            color="success"
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
                                        />
                                    }
                                />
                            </Box>
                            <Box
                                className="b-item b-item--fifth b-right-none"
                                onClick={() => setIsOpen((open) => !open)}
                            >
                                <Box className="b-circle">
                                    {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </Box>
                            </Box>
                        </Stack>
                        <Box className={isOpen ? "b-bot" : "b-bot b-bot--close"}>
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={1}
                                sx={{ padding: "0 5px" }}
                            >
                                <Box sx={{ fontSize: 16 }}>{t("blacklist")}: </Box>
                                <Stack flexDirection="row" gap={3}>
                                    <Stack
                                        className="b-item b-item--seventh"
                                        alignItems="center"
                                        flexDirection="row"
                                        gap={0.7}
                                        onClick={() =>
                                            handleBlacklist(
                                                data.EMP_CITIZEN_ID,
                                                data.EMP_NAME,
                                                data.BLIST_1ST_SEQ,
                                                data.BLIST_1ST_YMD
                                            )
                                        }
                                    >
                                        <Box sx={{ fontWeight: 600 }}>1st</Box>
                                        <Box
                                            className={
                                                data.BLIST_1ST_SEQ === "Y"
                                                    ? "b-box b-box--red"
                                                    : "b-box"
                                            }
                                        >
                                            {data.BLIST_1ST_SEQ === "Y" && (
                                                <BlockIcon sx={{ fontSize: 22 }} />
                                            )}
                                        </Box>
                                    </Stack>
                                    <Stack
                                        className="b-item b-item--seventh"
                                        alignItems="center"
                                        flexDirection="row"
                                        gap={0.7}
                                        onClick={() =>
                                            handleBlacklist(
                                                data.EMP_CITIZEN_ID,
                                                data.EMP_NAME,
                                                data.BLIST_2ND_SEQ,
                                                data.BLIST_2ND_YMD
                                            )
                                        }
                                    >
                                        <Box sx={{ fontWeight: 600 }}>2nd</Box>
                                        <Box
                                            className={
                                                data.BLIST_2ND_SEQ === "Y"
                                                    ? "b-box b-box--red"
                                                    : "b-box"
                                            }
                                        >
                                            {data.BLIST_2ND_SEQ === "Y" && (
                                                <BlockIcon sx={{ fontSize: 22 }} />
                                            )}
                                        </Box>
                                    </Stack>
                                    <Stack
                                        className="b-item b-item--seventh"
                                        alignItems="center"
                                        flexDirection="row"
                                        gap={0.7}
                                        onClick={() =>
                                            handleBlacklist(
                                                data.EMP_CITIZEN_ID,
                                                data.EMP_NAME,
                                                data.BLIST_3RD_SEQ,
                                                data.BLIST_3RD_YMD
                                            )
                                        }
                                    >
                                        <Box sx={{ fontWeight: 600 }}>3rd</Box>
                                        <Box
                                            className={
                                                data.BLIST_3RD_SEQ === "Y"
                                                    ? "b-box b-box--red"
                                                    : "b-box"
                                            }
                                        >
                                            {data.BLIST_3RD_SEQ === "Y" && (
                                                <BlockIcon sx={{ fontSize: 22 }} />
                                            )}
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </>
            );
        } else {
            return (
                <>
                    <Box className={open ? "b-card-20 b-card-20--active" : "b-card-20"}>
                        <Stack className="b-top" flexDirection="row">
                            <Box
                                className="b-item b-item--first"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                <Box>{data.EMP_NAME}</Box>
                            </Box>
                            <Box
                                className="b-item b-item--sec"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {data.EMP_CITIZEN_ID}
                            </Box>
                            <Box
                                className="b-item b-item--third"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {_pos_nm}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.CHECKED_YN === "Y" ? true : false}
                                            color="success"
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
                                        />
                                    }
                                />
                            </Box>
                            <Box
                                className="b-item b-item--fifth"
                                onClick={() =>
                                    handleBlacklist(
                                        data.EMP_CITIZEN_ID,
                                        data.EMP_NAME,
                                        data.BLIST_1ST_SEQ,
                                        data.BLIST_1ST_YMD
                                    )
                                }
                            >
                                {data.BLIST_1ST_SEQ === "Y" && (
                                    <BlockIcon sx={{ fontSize: 30, color: "#d32f2f" }} />
                                )}
                            </Box>
                            <Box
                                className="b-item b-item--fifth"
                                onClick={() =>
                                    handleBlacklist(
                                        data.EMP_CITIZEN_ID,
                                        data.EMP_NAME,
                                        data.BLIST_2ND_SEQ,
                                        data.BLIST_2ND_YMD
                                    )
                                }
                            >
                                {data.BLIST_2ND_SEQ === "Y" && (
                                    <BlockIcon sx={{ fontSize: 30, color: "#d32f2f" }} />
                                )}
                            </Box>
                            <Box
                                className="b-item b-item--fifth b-right-none"
                                onClick={() =>
                                    handleBlacklist(
                                        data.EMP_CITIZEN_ID,
                                        data.EMP_NAME,
                                        data.BLIST_3RD_SEQ,
                                        data.BLIST_3RD_YMD
                                    )
                                }
                            >
                                {data.BLIST_3RD_SEQ === "Y" && (
                                    <BlockIcon sx={{ fontSize: 30, color: "#d32f2f" }} />
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </>
            );
        }
    }
    else if (pageLocation === "2") {
        if (isMobile) {
            return (
                <>
                    <Box className="b-card-15 b-card-15--mobile">
                        <Stack className="b-top" flexDirection="row">
                            <Box
                                className="b-item b-item--sec"
                                onClick={() => {
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }}
                            >
                                <Box>{data.EMP_NAME}</Box>
                            </Box>
                            <Box
                                className="b-item b-item--third"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {data.EMP_CITIZEN_ID}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {_pos_nm}
                            </Box>
                            <Box
                                className="b-item b-item--first b-right-none"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.CHECKED_YN === "Y" ? true : false}
                                            color="success"
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                                        />
                                    }
                                />
                            </Box>
                        </Stack>
                    </Box>
                </>
            );
        } else {
            return (
                <>
                    <Box className={open ? "b-card-15 b-card-15--active" : "b-card-15"}>
                        <Stack className="b-top" flexDirection="row">
                            <Box
                                className="b-item b-item--first"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                <Box>{data.ORD}</Box>
                            </Box>
                            <Box
                                className="b-item b-item--sec"
                                sx={{
                                    backgroundColor: data.IS_VACATION === "Y" ? "#e34e3b" : "",
                                    color: data.IS_VACATION === "Y" ? "#fff" : "#000",
                                }}
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {data.EMP_NAME}
                            </Box>
                            <Box
                                className="b-item b-item--third"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {data.EMP_CITIZEN_ID}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID
                                    )
                                }
                            >
                                {_pos_nm}
                            </Box>
                            <Box
                                className={`b-item b-item--fifth ${pageLocation === "2" ? "" : "b-right-none"}`}
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                    )
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.CHECKED_YN === "Y" ? true : false}
                                            color="success"
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 26 } }}
                                        />
                                    }
                                />
                            </Box>
                            {pageLocation === "2" && (
                                <Box
                                    className="b-item b-item--sixth b-right-none"
                                    onClick={() =>
                                        handleClick(
                                            data,
                                            data.DISTINCT_ROW,
                                            data.REQ_NO,
                                            data.EMP_CITIZEN_ID,
                                        )
                                    }
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.WORKSHOP_YN === "Y" ? true : false}
                                                color="success"
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 26 } }}
                                            />
                                        }
                                    />
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </>
            );
        }
    }
    else if (pageLocation === "1") {
        if (isMobile) {
            return (
                <>
                    <Box className="b-card-15 b-card-15--mobile">
                        <Stack className="b-top" flexDirection="row">
                            <Box
                                className="b-item b-item--sec"
                                onClick={() => {
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }}
                            >
                                <Box>{data.EMP_NAME}</Box>
                            </Box>
                            <Box
                                className="b-item b-item--third"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {data.EMP_CITIZEN_ID}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {_pos_nm}
                            </Box>
                            <Box
                                className="b-item b-item--first b-right-none"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.CHECKED_YN === "Y" ? true : false}
                                            color="success"
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                                        />
                                    }
                                />
                            </Box>
                        </Stack>
                    </Box>
                </>
            );
        } else {
            return (
                <>
                    <Box className={open ? "b-card-30 b-card-30--active" : "b-card-30"}>
                        <Stack className="b-top" flexDirection="row">
                            <Box
                                className="b-item b-item--first"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {data.EMP_NAME}
                            </Box>
                            <Box
                                className="b-item b-item--sec"
                                sx={{
                                    backgroundColor: data.IS_VACATION === "Y" ? "#e34e3b" : "",
                                    color: data.IS_VACATION === "Y" ? "#fff" : "#000",
                                }}
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {data.EMP_CITIZEN_ID}
                            </Box>
                            <Box
                                className="b-item b-item--third"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {_pos_nm}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {data.CHECK_IN}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW + "_CHECK_OUT",
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {data.CHECK_OUT}
                            </Box>
                            <Box
                                className="b-item b-item--fourth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                {data.VISITOR_ID}
                            </Box>
                            <Box
                                className="b-item b-item--fifth"
                                onClick={() =>
                                    handleClick(
                                        data,
                                        data.DISTINCT_ROW,
                                        data.REQ_NO,
                                        data.EMP_CITIZEN_ID,
                                        data.CHECKED_YN === "Y"
                                    )
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.CHECKED_YN === "Y" ? true : false}
                                            color="success"
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 26 } }}
                                        />
                                    }
                                />
                            </Box>
                        </Stack>
                    </Box>
                </>
            );
        }
    }
});

export default InspectEmpCard;