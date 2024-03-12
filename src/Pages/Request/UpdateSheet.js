import {
    Box,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Grid,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Drawer, Placeholder, DatePicker } from 'rsuite';
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { HistorySelectURL } from "../../api";
import { HistorySelectParams } from "../../data/configParams";
import { fetchData, isNullOrEmpty, getDateFormat, handleTimeout } from "../../functions";
import EmptyCard from "../../components/Card/EmptyCard";
import Select from "react-select";

const width = window.innerWidth;

//////Desktop or Mobile
const isMobile = width < 560 ? true : false;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f6f6f6",
        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        color: "#457395",
        fontSize: 17,
        fontWeight: 600,
        padding: isMobile ? "5px" : "8px 0",
        fontFamily: "Calibri,sans-serif",
        textTransform: "capitalize",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        padding: "9px 8px",
        fontWeight: 500,
        borderBottom: "1px solid rgba(224, 224, 224, .6)",
        cursor: "pointer"
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: "cornsilk",
    },
}));

const UpdateSheet = ({ open, handleClose, handleSelect }) => {
    //////Init Variables
    const [date, setDate] = useState(new Date());
    const [contractor, setContractor] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optionList, setOptionList] = useState([]);
    const sheetWidth = isMobile ? 0.9 * width : 600;

    ////// Transldate
    const { t } = useTranslation();

    ///// Handel Change Date
    const handleChangeDate = async (ymd = "") => {
        let _fetchConfig = HistorySelectParams();
        _fetchConfig.ARG_TYPE = "Q_CONT";
        _fetchConfig.ARG_DATE = isNullOrEmpty(ymd) ? getDateFormat(date) : getDateFormat(ymd);

        let posData = await fetchData(HistorySelectURL, _fetchConfig);

        if (posData && posData.length > 0) {
            setOptionList(optionList => posData);
            setContractor(contractor => posData[0].value);
            handleSearch(isNullOrEmpty(ymd) ? getDateFormat(date) : getDateFormat(ymd), posData[0].value);
        }
        else {
            setOptionList(optionList => null);
            setContractor("");
            setLoading(false);
            setSearchData(searchData => null);
        }
    }

    /////Handle Search
    const handleSearch = async (ymd, value = "") => {
        setLoading(loading => true);
        let _fetchConfig = HistorySelectParams();
        _fetchConfig.ARG_TYPE = "Q_SEARCH";
        _fetchConfig.ARG_DATE = isNullOrEmpty(ymd) ? getDateFormat(date) : ymd;
        _fetchConfig.ARG_CONT_CODE = isNullOrEmpty(value) ? contractor : value;

        let posData = await fetchData(HistorySelectURL, _fetchConfig);
        if (posData && posData.length > 0) {
            setSearchData(searchData => posData);
        }
        else {
            setSearchData(searchData => null);
        }

        handleTimeout(500).then(() => {
            setLoading((loading) => false);
        });
    }

    useEffect(() => {
        if(open){
            setLoading(loading => true);
            handleChangeDate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Drawer size={sheetWidth} open={open} onClose={handleClose}>
            <Drawer.Header className="s-drawer--header">
                <Typography
                    width={"100%"}
                    variant="h5"
                    component={"div"}
                    sx={{
                        color: "#072d7a",
                        fontWeight: 700,
                        fontSize: isMobile ? "23px" : "25px",
                        textTransform: "capitalize",
                    }}
                >
                    {t('reg_history')}
                </Typography>
            </Drawer.Header>
            <Drawer.Body className="s-drawer--reg">
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={6} lg={12}>
                        <Typography
                            style={{
                                fontWeight: 600,
                                color: '#333',
                                marginBottom: 3,
                                fontSize: 16,
                            }}
                        >{t('title_visit_start_date')}</Typography>
                        <DatePicker
                            value={date}
                            oneTap
                            onChange={(e) => {
                                setDate(e);
                                handleChangeDate(e);
                            }}
                            cleanable={false}
                            block
                            size="lg"
                            placeholder="yyyy-MM-dd"
                            style={{ borderColor: "#333" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={12}>
                        <Typography
                            style={{
                                fontWeight: 600,
                                color: '#333',
                                marginBottom: 3,
                                fontSize: 16,
                            }}
                        >{t('title_contractor')}</Typography>
                        <Select
                            className="bg-white"
                            value={contractor ? optionList.filter(item => item.value === contractor) : ""}
                            onChange={(e) => {
                                setContractor(contractor => e.value);
                                handleSearch("", e.value);
                            }}
                            options={optionList}
                            classNames={{
                                control: (state) =>
                                    state.isFocused ? "border-red-600" : "border-grey-300",
                            }}
                            styles={{
                                control: (base, { isDisabled, isFocused }) => ({
                                    ...base,
                                    padding: 5,
                                    borderRadius: 5,
                                    fontSize: 18,
                                    background: isDisabled ? "#EBEBEB" : "#fff",
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                    fontSize: 17,
                                }),
                            }}
                        />
                    </Grid>
                </Grid>
                {loading &&
                    <Box sx={{ marginTop: "16px" }}>
                        <Placeholder.Paragraph rows={20} />
                    </Box>
                }
                {!loading &&
                    <Box sx={{ marginTop: "16px" }}>
                        {searchData !== null && searchData.length > 0 &&
                            <TableContainer className="b-table-control" >
                                <Table
                                    stickyHeader
                                    size="small"
                                    aria-label="a dense table"
                                    className="b-table"
                                >
                                    <TableHead className="b-table-head">
                                        <TableRow>
                                            <StyledTableCell
                                                width="20%"
                                                align="center"
                                            >
                                                {t('frm_dept')}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                width="60%"
                                                align="center"
                                                rowSpan={2}
                                            >
                                                {t('title_purpose')}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                width="20%"
                                                align="center"
                                            >
                                                {t('title_total_people')}
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="b-table-body">
                                        {searchData.map((item) => {
                                            return (
                                                <StyledTableRow key={item.REQ_NO} onClick={() => handleSelect(item.REQ_NO)}>
                                                    <StyledTableCell width="20%" align="center" className="b-table-cell">
                                                        {item.DEPT_NM}
                                                    </StyledTableCell>
                                                    <StyledTableCell width="60%" align="center" className="b-table-cell b-table-title">
                                                        {item.VISIT_PURPOSE}
                                                    </StyledTableCell>
                                                    <StyledTableCell width="20%" align="center" className="b-table-cell">
                                                        {item.EMP_QTY}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                        {(isNullOrEmpty(searchData) || searchData.length < 1) &&
                            <EmptyCard />
                        }
                    </Box>
                }
            </Drawer.Body>
        </Drawer>
    )
}

export default UpdateSheet;