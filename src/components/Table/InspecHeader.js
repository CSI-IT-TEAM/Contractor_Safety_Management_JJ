
import {
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getPageIns } from "../../functions";

const width = window.innerWidth;

const InspecHeader = ({handleNAClick}) => {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;

    /////Init Variables
    const { t } = useTranslation();

    /////Page Location
    const location = useLocation();
    const pageLocation = getPageIns(location);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#072d7a",
            borderRight: "1px solid rgba(255, 255, 255, 0.15)",
            color: theme.palette.common.white,
            fontSize: isMobile ? 17 : 18,
            fontWeight: 700,
            padding: isMobile ? "5px" : "8px 0",
            fontFamily: "Calibri,sans-serif",
            textTransform: "capitalize",
            borderBottom: "none"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: isMobile ? 15 : 16,
            backgroundColor: "#fff",
            padding: 0,
            fontWeight: 500,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
    }));

    if (width > 1280 || width <= 1024) {
        return (
            <TableHead className="b-table-head">
                <TableRow>
                    <StyledTableCell
                        width={pageLocation === "1" ? "10%" : "7%"}
                        align="center"
                        rowSpan={2}
                    >
                        {t("title_order")}
                    </StyledTableCell>
                    <StyledTableCell
                        width="44%"
                        align="center"
                        rowSpan={2}
                        colSpan={2}
                    >
                        {t("title_inspect")}
                    </StyledTableCell>
                    <StyledTableCell
                        width="24%"
                        align="center"
                        colSpan={3}
                        className="b-border-bottom"
                    >
                        {t("tb_status")}
                    </StyledTableCell>
                    <StyledTableCell
                        width={pageLocation === "1" ? "22%" : "25%"}
                        align="center"
                        rowSpan={2}
                        className="b-border-none"
                    >
                        {t("title_comment")}
                    </StyledTableCell>
                </TableRow>
                <TableRow>
                    <StyledTableCell
                        width="8%"
                        align="center"
                        sx={{ top: "43px" }}
                    >
                        OK
                    </StyledTableCell>
                    <StyledTableCell
                        width="8%"
                        align="center"
                        sx={{ top: "43px" }}
                    >
                        NO
                    </StyledTableCell>
                    <StyledTableCell
                        width="8%"
                        align="center"
                        sx={{ top: "43px" }}
                        onClick={handleNAClick}
                    >
                        N/A
                    </StyledTableCell>
                </TableRow>
            </TableHead>
        )
    } else {
        return (
            <TableHead className="b-table-head">
                <TableRow>
                    <StyledTableCell
                        width="45%"
                        align="center"
                        rowSpan={2}
                        colSpan={2}
                    >
                        {t("title_inspect")}
                    </StyledTableCell>
                    <StyledTableCell
                        width="30%"
                        align="center"
                        colSpan={3}
                        className="b-border-bottom"
                    >
                        {t("tb_status")}
                    </StyledTableCell>
                    <StyledTableCell
                        width="25%"
                        align="center"
                        rowSpan={2}
                        className="b-border-none"
                    >
                        {t("title_comment")}
                    </StyledTableCell>
                </TableRow>
                <TableRow>
                    <StyledTableCell
                        width="10%"
                        align="center"
                        sx={{ top: "42px" }}
                    >
                        OK
                    </StyledTableCell>
                    <StyledTableCell
                        width="10%"
                        align="center"
                        sx={{ top: "42px" }}
                    >
                        NO
                    </StyledTableCell>
                    <StyledTableCell
                        width="10%"
                        align="center"
                        sx={{ top: "42px" }}
                    >
                        N/A
                    </StyledTableCell>
                </TableRow>
            </TableHead>
        )
    }
}

export default InspecHeader;