import {
    Box,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    TablePagination,
    Grid,
    IconButton,
    InputAdornment,
    Avatar,
    TextField,
    Typography,
    Skeleton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Swal from "sweetalert2";
import Select from "react-select";
import EmptyCard from "../../../components/Card/EmptyCard";
import UserRegSheet from "../UserRegSheet";
import { UserGroupMenuSelectURL } from "../../../api";
import { fetchData, isNullOrEmpty, arrayBufferToBase64, getUserPermissOnPage } from "../../../functions";
import longhaiAvatar from "../../../assets/images/avatar/LONGHAI.png";

import PersonIcon from '@mui/icons-material/Person';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';

const width = window.innerWidth;
const height = window.innerHeight;

//////Desktop or Mobile
const isMobile = width < 560 ? true : false;

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
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        padding: "8px",
        fontWeight: 500,
        borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const RegisterTab = ({comHeight}) => {

    ////// Init Varables
    const [groupOption, setGroupOption] = useState([]);
    const [group, setGroup] = useState("");
    const [prevUserList, setPrevUserList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    ////// User Page
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(13);

    ////// User Sheet
    const [open, setOpen] = useState(false);
    const [selectID, setSelectID] = useState("");

    ////// Transldate
    const { t } = useTranslation();
    const location = useLocation();

    ////// Handle User Table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    ////// Handle Default
    const handleDefault = async () => {
        let _downloadData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q_ALL",
            ARG_EMPID: "",
            ARG_GROUP: "",
            OUT_CURSOR: ""
        });

        if (_downloadData !== null && _downloadData.length > 0) {
            setGroupOption(groupOption => _downloadData);
            handleSearch(_downloadData[0].value);
        } else {
            setGroupOption(groupOption => []);
            setGroup(group => "");
        }
    }

    /////Handle Search
    const handleSearch = async (type = "", isReload = false) => {
        setLoading(true);
        setPage(0);
        if (!isReload) {
            setGroup(group => type);
        }

        let _userListData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q_USER",
            ARG_EMPID: "ALL",
            ARG_GROUP: isReload ? group : type,
            OUT_CURSOR: ""
        });

        if (_userListData != null && _userListData.length > 0) {
            setUserList(userList => _userListData);
            setPrevUserList(userList => _userListData);
        }
        else {
            setUserList(userList => []);
            setPrevUserList(userList => []);
        }

        setLoading(false);
    }

    useEffect(() => {
        handleDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /////Handle Reg User
    const handleReg = async (empID = "") => {
        let _validType = isNullOrEmpty(empID) ? "NEW_YN" : "SAVE_YN";
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage(_validType, location.pathname);
        if (!_validPermiss) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        setSelectID(selectID => empID);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    /////Handle Filter
    const handleFilter = (value) => {
        setSearch(search => value);
        setPage(0);
        let _prevData = prevUserList;

        if (isNullOrEmpty(value)) {
            setUserList(userList => _prevData);
        } else {
            let _filterData = _prevData.filter(item => item.EMPID.includes(value) || item.NAME.toLowerCase().includes(value));
            setUserList(userList => _filterData);
        }
    }

    return (
        <>
            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={3}>
                        <Box className="s-left">
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={12}>
                                    <Typography
                                        style={{
                                            fontWeight: 600,
                                            color: '#333',
                                            marginBottom: 3,
                                            fontSize: 16,
                                        }}
                                    >{t('user_group')}</Typography>
                                    <Select
                                        className="bg-white"
                                        value={group ? groupOption.filter(item => item.value === group) : ""}
                                        onChange={(e) => {
                                            setSearch(search => "");
                                            handleSearch(e.value);
                                        }}
                                        options={groupOption}
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
                                <Grid item xs={12} sm={6} md={6} lg={12}>
                                    <Typography
                                        style={{
                                            fontWeight: 600,
                                            color: '#333',
                                            marginBottom: 3,
                                            fontSize: 16,
                                        }}
                                    >{t('id_name')}</Typography>
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
                                                        onClick={() => handleFilter("")}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(event) => {
                                            handleFilter(event.target.value);
                                        }}
                                        sx={{ background: "#f8f6f7" }}
                                        className="b-input bg-white"
                                        fullWidth
                                        placeholder={t('plholder_input_emp_name_or_id')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={12}>
                                    <Button
                                        fullWidth
                                        endIcon={<PersonAddAlt1Icon />}
                                        color="success"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            height: 45,
                                            minWidth: 100,
                                            textTransform: "none",
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            boxShadow: 'none',
                                            marginTop: "5px"
                                        }}
                                        onClick={() => handleReg("")}
                                    >
                                        {t('new')} User
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={9}>
                        <Box className="s-right">
                            {!loading && (userList === null || userList.length < 1) &&
                                <Box sx={{ marginTop: "15px" }}>
                                    <EmptyCard />
                                </Box>
                            }
                            {!loading && userList !== null && userList.length > 0 &&
                                <>
                                    <TableContainer
                                        className="b-table-control"
                                    >
                                        <Table
                                            stickyHeader
                                            size="small"
                                            aria-label="a dense table"
                                            className="b-table"
                                        >
                                            <TableHead className="b-table-head">
                                                <TableRow>
                                                    <StyledTableCell
                                                        width="8%"
                                                        align="center"
                                                        rowSpan={2}
                                                    >
                                                        <PersonIcon sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="12%"
                                                        align="center"
                                                        rowSpan={2}
                                                    >
                                                        {t('frm_userID')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="22%"
                                                        align="center"
                                                        rowSpan={2}
                                                    >
                                                        {t('frm_userName')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="15%"
                                                        align="center"
                                                        rowSpan={2}
                                                    >
                                                        {t('user_group')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="25%"
                                                        align="center"
                                                        rowSpan={2}
                                                        sx={{display: width <= 479 ? "none" : "table-cell"}}
                                                    >
                                                        {t('frm_dept')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="18%"
                                                        align="center"
                                                        rowSpan={2}
                                                        sx={{display: width <= 479 ? "none" : "table-cell"}}
                                                    >
                                                        {t('frm_position')}
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="b-table-body">
                                                {userList.slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                ).map((item) => {
                                                    return (
                                                        <StyledTableRow key={item.USERNAME} onClick={() => handleReg(item.EMPID)}>
                                                            <StyledTableCell width="8%" align="center" component="th" scope="row" className="b-table-cell b-border-left b-cell--user">
                                                                <Box className="b-table-item__title">
                                                                    <IconButton
                                                                        id="basic-button"
                                                                        sx={{ p: 0, boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}
                                                                        size="large"
                                                                        aria-label="account of current user"
                                                                        aria-controls="menu-appbar"
                                                                        aria-haspopup="true"
                                                                    >
                                                                        <Avatar
                                                                            alt="avatar"
                                                                            src={item.PERMISSION === "SCR" ? longhaiAvatar : arrayBufferToBase64(item.PHOTO.data)}
                                                                            className="s-avatar__thumb"
                                                                            sx={{ width: 35, height: 35 }}
                                                                        />
                                                                    </IconButton>
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell width="12%" align="center" className="b-table-cell b-cell--user">
                                                                {item.EMPID}
                                                            </StyledTableCell>
                                                            <StyledTableCell width="22%" align="center" className="b-table-cell b-table-title b-cell--user">
                                                                {item.NAME}
                                                            </StyledTableCell>
                                                            <StyledTableCell width="15%" align="center" className="b-table-cell b-table-title b-cell--user">
                                                                {item.PERMISSION}
                                                            </StyledTableCell>
                                                            <StyledTableCell width="25%" align="center" sx={{display: width <= 479 ? "none" : "table-cell"}} className="b-table-cell b-table-title b-cell--user">
                                                                {item.DEPT_NM}
                                                            </StyledTableCell>
                                                            <StyledTableCell width="18%" align="center" sx={{display: width <= 479 ? "none" : "table-cell"}} className="b-table-cell b-table-title b-cell--user">
                                                                {item.JOB_POSITION_NM}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[13, 30, 50]}
                                        component="div"
                                        count={userList.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage} />
                                </>
                            }
                            {loading &&
                                <>
                                    <Box>
                                        <Grid container spacing={1}>
                                            <Grid item xs={1}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                        </Grid>
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                        <Skeleton variant="rounded" sx={{ marginTop: isMobile ? '8px' : '10px' }} height={isMobile ? 30 : 40} />
                                    </Box>
                                </>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <UserRegSheet open={open} handleClose={handleClose} handleReload={handleSearch} empID={selectID} />
        </ >
    );
}

export default RegisterTab;