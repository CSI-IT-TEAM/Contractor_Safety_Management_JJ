import { memo } from "react";
import { Box, Stack, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import InspectRowInput from "./InpectRowInput";
import { getPageIns, isNullOrEmpty } from "../../functions";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const width = window.innerWidth;

const InspecRow = memo(({ data, handleChecklist }) => {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;
    const location = useLocation();
    const { t } = useTranslation();

    /////Page Location
    const pageLocation = getPageIns(location);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#1976d2",
            borderRight: "1px solid rgba(255, 255, 255, 0.3)",
            color: theme.palette.common.white,
            fontSize: isMobile ? 17 : 18,
            fontWeight: 700,
            padding: isMobile ? "5px 3px" : "8px",
            fontFamily: "Calibri,sans-serif",
            textTransform: "capitalize",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: isMobile ? 13 : 15,
            backgroundColor: "#fff",
            padding: 0,
            fontWeight: 500,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    }));

    if (data.ROW_NO === 1) {
        if (pageLocation !== "3") {
            if (width > 1280 || width <= 1024) {
                return (
                    <StyledTableRow>
                        <StyledTableCell
                            rowSpan={data.COL_QTY}
                            width={pageLocation === "1" ? "10%" : "7%"}
                            align="center"
                            component="th"
                            scope="row"
                            className="b-table-cell b-border-left"
                        >
                            <Box className="b-table-item__title">{data.ORD}</Box>
                        </StyledTableCell>
                        <StyledTableCell
                            rowSpan={data.COL_QTY}
                            width="15%"
                            align="center"
                            className="b-table-cell b-table-title"
                        >
                            {t(data.DIV_NAME)}
                        </StyledTableCell>
                        <StyledTableCell
                            width="29%"
                            align="center"
                            className="b-table-cell b-table-title"
                        >
                            {t(data.ITEM_NAME)}
                        </StyledTableCell>
                        <StyledTableCell
                            width="8%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "OK")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "OK" ? "b-box b-box--green" : "b-box"
                                    }
                                ></Box>
                                <Typography>
                                    {data.ITEM_RS_TEMP === "OK" &&
                                        pageLocation === "2" ? (
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
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="8%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NOK")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : "b-box"
                                    }
                                ></Box>
                                <Typography>
                                    {data.ITEM_RS_TEMP === "NOK" &&
                                        pageLocation === "2" ? (
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
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="8%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NA")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width={pageLocation === "1" ? "22%" : "29%"}
                            align="center"
                            className="b-table-cell"
                        >
                            <InspectRowInput
                                itemCode={data.ITEM_CODE}
                                itemComment={data.ITEM_COMMENT}
                                handleCheck={handleChecklist}
                            />
                        </StyledTableCell>
                    </StyledTableRow>
                );
            } else {
                return (
                    <StyledTableRow>
                        <StyledTableCell
                            rowSpan={data.COL_QTY}
                            width="15%"
                            align="center"
                            className="b-table-cell b-table-title"
                        >
                            {t(data.DIV_NAME)}
                        </StyledTableCell>
                        <StyledTableCell
                            width="30%"
                            align="center"
                            className="b-table-cell b-table-title"
                        >
                            {t(data.ITEM_NAME)}
                        </StyledTableCell>
                        <StyledTableCell
                            width="10%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "OK")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "OK" ? "b-box b-box--green" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="10%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NOK")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="10%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NA")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="25%"
                            align="center"
                            className="b-table-cell"
                        >
                            <InspectRowInput
                                itemCode={data.ITEM_CODE}
                                itemComment={data.ITEM_COMMENT}
                                handleCheck={handleChecklist}
                            />
                        </StyledTableCell>
                    </StyledTableRow>
                );
            }
        } else {
            return (
                <StyledTableRow
                    sx={{
                        display:
                            data.ITEM_RS_TEMP === "NA" && pageLocation !== "1"
                                ? "none"
                                : "table-row",
                    }}
                >
                    <StyledTableCell
                        rowSpan={data.COL_QTY}
                        width="7%"
                        align="center"
                        component="th"
                        scope="row"
                        className="b-table-cell b-border-left"
                    >
                        <Box className="b-table-item__title">{data.ORD}</Box>
                    </StyledTableCell>
                    <StyledTableCell
                        rowSpan={data.COL_QTY}
                        width="15%"
                        align="center"
                        className="b-table-cell b-table-title"
                    >
                        {t(data.DIV_NAME)}
                    </StyledTableCell>
                    <StyledTableCell
                        width="29%"
                        align="center"
                        className="b-table-cell b-table-title"
                    >
                        {t(data.ITEM_NAME)}
                    </StyledTableCell>
                    <StyledTableCell
                        width="18%"
                        align="center"
                        className="b-table-cell b-table-box"
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            gap={0.5}
                        >
                            <Box
                                className={
                                    data.ITEM_RESULT === "OK"
                                        ? "b-box b-box--green"
                                        : data.ITEM_RESULT === "NOK"
                                            ? "b-box b-box--red"
                                            : data.ITEM_RESULT === "NA"
                                                ? "b-box b-box--gray"
                                                : "b-box"
                                }
                            ></Box>
                            <Box sx={{ fontWeight: 600, lineHeight: 1 }}>
                                {data.ITEM_RESULT === "OK"
                                    ? "OK"
                                    : data.ITEM_RESULT === "NOK"
                                        ? "NO"
                                        : data.ITEM_RESULT === "NA"
                                            ? "N/A"
                                            : ""}
                            </Box>
                        </Stack>
                    </StyledTableCell>
                    <StyledTableCell width="31%" align="center" className="b-table-cell">
                        <InspectRowInput
                            itemCode={data.ITEM_CODE}
                            itemComment={data.ITEM_COMMENT}
                            handleCheck={handleChecklist}
                        />
                    </StyledTableCell>
                </StyledTableRow>
            );
        }
    } else {
        if (pageLocation !== "3") {
            if (width > 1280 || width <= 1024) {
                return (
                    <>
                        {!isNullOrEmpty(data.ITEM_DESC) && data.SUB_ORD === 1 &&
                            <StyledTableRow>
                                <StyledTableCell
                                    width="75%"
                                    align="center"
                                    colSpan={5}
                                    className="b-table-cell b-table-title b-table-title--sub"
                                >
                                    {t(data.ITEM_DESC)}
                                </StyledTableCell>
                            </StyledTableRow>
                        }
                        <StyledTableRow
                            sx={{
                                display:
                                    data.ITEM_RS_TEMP === "NA" && pageLocation !== "1"
                                        ? "none"
                                        : "table-row",
                            }}
                        >
                            <StyledTableCell
                                width="22%"
                                align="center"
                                className="b-table-cell b-table-title"
                            >
                                {t(data.ITEM_NAME)}
                            </StyledTableCell>
                            <StyledTableCell
                                width="8%"
                                align="center"
                                className="b-table-cell b-table-box"
                                onClick={() =>
                                    handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "OK")
                                }
                            >
                                <Stack
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={0.5}
                                >
                                    <Box
                                        className={
                                            data.ITEM_RESULT === "OK" ? "b-box b-box--green" : "b-box"
                                        }
                                    ></Box>
                                    <Typography>
                                        {data.ITEM_RS_TEMP === "OK" &&
                                            pageLocation === "2" ? (
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
                                </Stack>
                            </StyledTableCell>
                            <StyledTableCell
                                width="8%"
                                align="center"
                                className="b-table-cell b-table-box"
                                onClick={() =>
                                    handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NOK")
                                }
                            >
                                <Stack
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={0.5}
                                >
                                    <Box
                                        className={
                                            data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : "b-box"
                                        }
                                    ></Box>
                                    <Typography>
                                        {data.ITEM_RS_TEMP === "NOK" &&
                                            pageLocation === "2" ? (
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
                                </Stack>
                            </StyledTableCell>
                            <StyledTableCell
                                width="8%"
                                align="center"
                                className="b-table-cell b-table-box"
                                onClick={() =>
                                    handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NA")
                                }
                            >
                                <Stack
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={0.5}
                                >
                                    <Box
                                        className={
                                            data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"
                                        }
                                    ></Box>
                                </Stack>
                            </StyledTableCell>
                            <StyledTableCell
                                width="29%"
                                align="center"
                                className="b-table-cell"
                            >
                                <InspectRowInput
                                    itemCode={data.ITEM_CODE}
                                    itemComment={data.ITEM_COMMENT}
                                    handleCheck={handleChecklist}
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    </>
                );
            } else {
                return (
                    <>
                        {!isNullOrEmpty(data.ITEM_DESC) && data.SUB_ORD === 1 &&
                            <StyledTableRow>
                                <StyledTableCell
                                    width="75%"
                                    align="center"
                                    colSpan={5}
                                    className="b-table-cell b-table-title b-table-title--sub"
                                >
                                    {t(data.ITEM_DESC)}
                                </StyledTableCell>
                            </StyledTableRow>
                        }
                    
                    <StyledTableRow
                        sx={{
                            display:
                                data.ITEM_RESULT === "NA" && pageLocation !== "1"
                                    ? "none"
                                    : "table-row",
                        }}
                    >
                        <StyledTableCell
                            width="25%"
                            align="center"
                            className="b-table-cell b-table-title"
                        >
                            {t(data.ITEM_NAME)}
                        </StyledTableCell>
                        <StyledTableCell
                            width="10%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "OK")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "OK" ? "b-box b-box--green" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="10%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NOK")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "NOK" ? "b-box b-box--red" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="10%"
                            align="center"
                            className="b-table-cell b-table-box"
                            onClick={() =>
                                handleChecklist(data.ITEM_CODE, "ITEM_RESULT", "NA")
                            }
                        >
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                gap={0.5}
                            >
                                <Box
                                    className={
                                        data.ITEM_RESULT === "NA" ? "b-box b-box--gray" : "b-box"
                                    }
                                ></Box>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell
                            width="25%"
                            align="center"
                            className="b-table-cell"
                        >
                            <InspectRowInput
                                itemCode={data.ITEM_CODE}
                                itemComment={data.ITEM_COMMENT}
                                handleCheck={handleChecklist}
                            />
                        </StyledTableCell>
                    </StyledTableRow>
                    </>
                );
            }
        } else {
            return (
                <>
                    {!isNullOrEmpty(data.ITEM_DESC) && data.SUB_ORD === 1 &&
                        <StyledTableRow>
                            <StyledTableCell
                                width="75%"
                                align="center"
                                colSpan={5}
                                className="b-table-cell b-table-title b-table-title--sub"
                            >
                                {t(data.ITEM_DESC)}
                            </StyledTableCell>
                        </StyledTableRow>
                    }
               
                <StyledTableRow
                    sx={{
                        display:
                            data.ITEM_RESULT === "NA" && pageLocation !== "1"
                                ? "none"
                                : "table-row",
                    }}
                >
                    <StyledTableCell
                        width="22%"
                        align="center"
                        className="b-table-cell b-table-title"
                    >
                        {t(data.ITEM_NAME)}
                    </StyledTableCell>
                    <StyledTableCell
                        width="18%"
                        align="center"
                        className="b-table-cell b-table-box"
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            gap={0.5}
                        >
                            <Box
                                className={
                                    data.ITEM_RESULT === "OK"
                                        ? "b-box b-box--green"
                                        : data.ITEM_RESULT === "NOK"
                                            ? "b-box b-box--red"
                                            : data.ITEM_RESULT === "NA"
                                                ? "b-box b-box--gray"
                                                : "b-box"
                                }
                            ></Box>
                            <Box sx={{ fontWeight: 600, lineHeight: 1 }}>
                                {data.ITEM_RESULT === "OK"
                                    ? "OK"
                                    : data.ITEM_RESULT === "NOK"
                                        ? "NO"
                                        : data.ITEM_RESULT === "NA"
                                            ? "N/A"
                                            : ""}
                            </Box>
                        </Stack>
                    </StyledTableCell>
                    <StyledTableCell width="31%" align="center" className="b-table-cell">
                        <InspectRowInput
                            itemCode={data.ITEM_CODE}
                            itemComment={data.ITEM_COMMENT}
                            handleCheck={handleChecklist}
                        />
                    </StyledTableCell>
                </StyledTableRow>
                </>
            );
        }
    }
});

export default InspecRow;