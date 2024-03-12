import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { DateRangePicker, Placeholder } from "rsuite";
import EmptyCard from "../../../components/Card/EmptyCard";
import { fetchData } from "../../../functions";
import { ContBlacklistSelectURL } from "../../../api";
import { ContBlackListSelectParams } from "../../../data/configParams";
import { UploadContBlackListSelectParams } from "../../../data/uploadParams";

export default function ContractorBlacklistTab() {
    ///////Init Variable
    const { t } = useTranslation();
    const [rangeDate, setrangeDate] = useState([
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
    ]);
    const [ParamsData, setParamsData] = useState(ContBlackListSelectParams);
    const [data, setData] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const columns = [
        {
            id: "CONT_NAME",
            label: t("frm_vendor"),
            minWidth: 170,
            fontweight: 500,
            hBackgroundColor: "navy",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_ADDRESS",
            label: t("frm_address"),
            minWidth: 100,
            hBackgroundColor: "navy",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_EMAIL",
            label: t("frm_email"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "navy",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "navy",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "PIC",
            label: t("frm_pic"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "navy",
            hColor: "white",
            rowCount: 1,
            colCount: 2,
        },
        {
            id: "BLACKLIST_REASON",
            label: t("frm_reason"),
            minWidth: 120,
            align: "center",
            hBackgroundColor: "navy",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
    ];

    const cont_child_columns = [
        {
            id: "CONT_PIC",
            label: t("frm_full_nm"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#232354",
            hColor: "white",
        },
        {
            id: "CONT_PIC_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#232354",
            hColor: "white",
        },
    ];

    const bodycolumns = [
        {
            id: "CONT_NAME",
            label: t("frm_vendor"),
            minWidth: 170,
            fontweight: 600,
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_ADDRESS",
            label: t("frm_address"),
            minWidth: 100,
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_EMAIL",
            label: t("frm_email"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_PIC",
            label: t("frm_pic"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 1,
            colCount: 2,
        },
        {
            id: "CONT_PIC_PHONE",
            label: t("frm_pic"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 1,
            colCount: 2,
        },
        {
            id: "BLACKLIST_REASON",
            label: t("frm_reason"),
            minWidth: 120,
            align: "center",
            hBackgroundColor: "#232354",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
    ];

    //////Handle Table Page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    ///////Get Contractor Blacklist Data
    const getBlackListData = async () => {
        setisLoading(true);
        const UploadData = UploadContBlackListSelectParams(ParamsData);
        await fetchData(ContBlacklistSelectURL, UploadData)
            .then((result) => {
                setData(result);
                setisLoading(false);
            })
            .catch((error) => {
                setisLoading(false);
            });
    };

    useEffect(() => {
        getBlackListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Stack spacing={2}>
            <Box>
                <Typography
                    style={{
                        fontWeight: 600,
                        color: "#333",
                        marginBottom: 3,
                        fontSize: 16,
                    }}
                >
                    {t("frm_blacklist_date")}
                </Typography>
                <DateRangePicker
                    value={rangeDate}
                    onChange={setrangeDate}
                    size="lg"
                    placeholder="Select a range date to view"
                    cleanable
                    className="w-100"
                />
            </Box>
            {isLoading ? (
                <Placeholder.Grid rows={10} columns={10} />
            ) : data && data.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        type: "spring",
                    }}
                >
                    <TableContainer
                        sx={{
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            boxShadow: "rgba(0, 0, 0, 0.16) -1px 0px 0px",
                            borderRight: "1px solid #c4c4c4",
                        }}
                    >
                        <Table size="small" stickyHeader aria-label="sticky table">
                            <TableHead sx={{ minHeight: "200px" }}>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.CONT_CODE}
                                            align={column.align}
                                            rowSpan={column.rowCount}
                                            colSpan={column.colCount}
                                            style={{
                                                minWidth: column.minWidth,
                                                backgroundColor: column.hBackgroundColor,
                                                color: column.hColor,
                                                borderRight: "1px solid rgba(255,255,255,.15)",
                                                borderColor: "rgba(255,255,255,.15)",
                                                textAlign: "center",
                                                textTransform: "capitalize",
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                fontFamily: "Calibri,sans-serif",
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    {cont_child_columns.map((column) => (
                                        <TableCell
                                            key={column.CONT_CODE}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                backgroundColor: column.hBackgroundColor,
                                                color: column.hColor,
                                                borderRight: "1px solid rgba(255,255,255,.15)",
                                                borderBottom: "none",
                                                textAlign: "center",
                                                textTransform: "capitalize",
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                fontFamily: "Calibri,sans-serif",
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow
                                                key={row.ROWID}
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                // key={row.CONT_CODE}
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {bodycolumns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            sx={{
                                                                padding: "10px",
                                                                fontWeight: column.fontweight,
                                                                borderRight: "1px solid silver",
                                                            }}
                                                        >
                                                            {column.format && typeof value === "number"
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </motion.div>
            ) : (
                <EmptyCard />
            )}
        </Stack>
    );
}
