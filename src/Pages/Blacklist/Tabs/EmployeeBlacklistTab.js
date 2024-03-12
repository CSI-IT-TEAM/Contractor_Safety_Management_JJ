import {
    Box,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Placeholder } from "rsuite";
import EmptyCard from "../../../components/Card/EmptyCard";
import { UploadEmployeeBlackListSelectParams } from "../../../data/uploadParams";
import { EmployeeBlacklistSelectURL } from "../../../api";
import { EmployeeBlackListSelectParams } from "../../../data/configParams";
import { fetchData, isNullOrEmpty } from "../../../functions";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';

const width = window.innerWidth;

export default function EmployeeBlacklistTab() {
    //////Init Variables
    const [ParamsData, setParamsData] = useState(EmployeeBlackListSelectParams);
    const { t } = useTranslation();
    const [fillterWord, setfillterWord] = useState("");
    const [data, setData] = useState([]);
    const [prevData,setPrevData] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [colWidth, setColWidth] = useState(0);

    ///////Get column Width
    useEffect(() => {
        function handleResize() {
          if (width > 991) {
            let _width = (width - 270 - 24 - 120 - 220 - (120*3))/3;
            setColWidth(_width);
          }
        }
    
        handleResize(); // initial call to get width and height of the element
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    const columns = [
        {
            id: "EMP_CITIZEN_ID",
            label: t("frm_citizen_id"),
            minWidth: 120,
            maxWidth: 120,
            fontweight: 500,
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 3,
            colCount: 1,
        },
        {
            id: "EMP_NAME",
            label: t("frm_employee_name"),
            minWidth: 220,
            maxWidth: 220,
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 3,
            colCount: 1,
        },
        {
            id: "PIC",
            label: t("frm_blacklist"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 1,
            colCount: 6,
        },
    ];

    const child_times_columns = [
        {
            id: "1ST_TIMES",
            label: t("frm_1st"),
            align: "center",
            hBackgroundColor: "#1f4287",
            hColor: "white",
            colCount: 2,
        },
        {
            id: "2ND_TIMES",
            label: t("frm_2nd"),
            align: "center",
            hBackgroundColor: "#1f4287",
            hColor: "white",
            colCount: 2,
        },
        {
            id: "3RD_TIMES",
            label: t("frm_3rd"),
            align: "center",
            hBackgroundColor: "#1f4287",
            hColor: "white",
            colCount: 2,
        },
    ];

    const child_columns = [
        {
            id: "TIMES_1",
            label: t("date"),
            minWidth: 120,
            maxWidth: 120,
            align: "center",
            hBackgroundColor: "#1f4287",
            hColor: "white",
        },
        {
            id: "REASON_1",
            label: t("frm_reason"),
            minWidth: 170,
            maxWidth: colWidth,
            align: "left",
            hBackgroundColor: "#1f4287",
            hColor: "white",
        },
        {
            id: "TIMES_2",
            label: t("date"),
            minWidth: 120,
            maxWidth: 120,
            align: "center",
            hBackgroundColor: "#1f4287",
            hColor: "white",
        },
        {
            id: "REASON_2",
            label: t("frm_reason"),
            minWidth: 170,
            maxWidth: colWidth,
            align: "left",
            hBackgroundColor: "#1f4287",
            hColor: "white",
        },
        {
            id: "TIMES_3",
            label: t("date"),
            minWidth: 120,
            maxWidth: 120,
            align: "center",
            hBackgroundColor: "#1f4287",
            hColor: "white",
        },
        {
            id: "REASON_3",
            label: t("frm_reason"),
            minWidth: 170,
            maxWidth: colWidth,
            align: "left",
            hBackgroundColor: "#1f4287",
            hColor: "white",
        },
    ];

    const bodycolumns = [
        {
            id: "EMP_CODE",
            label: t("frm_citizen_id"),
            minWidth: 120,
            maxWidth: 120,
            fontweight: 500,
            align: "center",
            hBackgroundColor: "#24486b",
            hColor: "white",
        },
        {
            id: "EMP_NAME",
            label: t("frm_employee_name"),
            minWidth: 220,
            maxWidth: 220,
            hBackgroundColor: "#24486b",
            hColor: "white",
        },
        {
            id: "TIMES_1_BLACKLIST_DATE",
            label: t("frm_times_1"),
            minWidth: 120,
            maxWidth: 120,
            align: "center",
            hBackgroundColor: "#1e76a3",
            hColor: "white",
        },
        {
            id: "TIMES_1_BLACKLIST_REASON",
            label: t("frm_reason"),
            minWidth: 170,
            maxWidth: colWidth,
            align: "left",
            hBackgroundColor: "#1e76a3",
            hColor: "white",
        },
        {
            id: "TIMES_2_BLACKLIST_DATE",
            label: t("frm_times_2"),
            minWidth: 120,
            maxWidth: 120,
            align: "center",
            hBackgroundColor: "#2969a7",
            hColor: "white",
        },
        {
            id: "TIMES_2_BLACKLIST_REASON",
            label: t("frm_reason"),
            minWidth: 170,
            maxWidth: colWidth,
            align: "left",
            hBackgroundColor: "#2969a7",
            hColor: "white",
        },
        {
            id: "TIMES_3_BLACKLIST_DATE",
            label: t("frm_times_3"),
            minWidth: 120,
            maxWidth: 120,
            align: "center",
            hBackgroundColor: "#166086",
            hColor: "white",
        },
        {
            id: "TIMES_3_BLACKLIST_REASON",
            label: t("frm_reason"),
            minWidth: 170,
            maxWidth: colWidth,
            align: "left",
            hBackgroundColor: "#166086",
            hColor: "white",
        },
    ];

    ///////Handle Table Page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    ///////Filter Table
    const handleFindTextChange = (value) => {
        setPage(0);

        setfillterWord(value);
        let _prevData = prevData;

        if (isNullOrEmpty(value)) {
            setData(data => _prevData);
        } else {
            let _filterData = _prevData.filter(item => item.EMP_CODE.includes(value) || item.EMP_NAME.toLowerCase().includes(value));
            setData(data => _filterData);
        }
    };

    ///////Get Employee Blacklist Data
    const getBlackListData = async () => {
        setisLoading(true);
        const UploadData = UploadEmployeeBlackListSelectParams(ParamsData);
        await fetchData(EmployeeBlacklistSelectURL, UploadData)
            .then((result) => {
                setPrevData(result);
                setData(result);
                setisLoading(false);
            })
            .catch((error) => {
                setPrevData([]);
                setData([]);
                setisLoading(false);
            });
    };

    useEffect(() => {
        getBlackListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Stack spacing={2}>
            <Box
            >
                <Typography
                    style={{
                        fontWeight: 600,
                        color: "#333",
                        marginBottom: 3,
                        fontSize: 16,
                    }}
                >
                    {t("frm_quick_search")}
                </Typography>
                <TextField
                    className="b-input"
                    fullWidth
                    placeholder={t(
                        "plholder_input_emp_name_or_citizen_for_quickly_search"
                    )}
                    value={fillterWord}
                    InputProps={{
                        endAdornment: isNullOrEmpty(fillterWord) ? (
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
                                    onClick={() => handleFindTextChange("")}
                                />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => handleFindTextChange(e.target.value)}
                />
            </Box>
            {isLoading ? (
                <Placeholder.Grid rows={10} columns={10} />
            ) : data.length > 0 && data ? (
                <motion.div
                    initial={{ opacity: 0, x: -1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        type: "spring",
                    }}
                >
                    <>
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
                                                key={column.id}
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
                                        {child_times_columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                colSpan={column.colCount}
                                                style={{
                                                    backgroundColor: column.hBackgroundColor,
                                                    color: column.hColor,
                                                    borderRight: "1px solid rgba(255,255,255,.15)",
                                                    borderBottom: "1px solid rgba(255,255,255,.15)",
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
                                        {child_columns.map((column) => (
                                            <TableCell
                                                key={column.CONT_CODE + "_" + column.id}
                                                align={column.align}
                                                style={{
                                                    minWidth: column.minWidth,
                                                    maxWidth: column.maxWidth,
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
                                        .map((row, index) => {
                                            return (
                                                <TableRow
                                                    key={row.ROWID + "_" + index}
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
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
                                                                    width: column.maxWidth,
                                                                    borderRight: "0.5px solid silver",
                                                                   
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
                    </>
                </motion.div>
            ) : (
                <Box>
                    <EmptyCard />
                </Box>
            )}
        </Stack>
    );
}
