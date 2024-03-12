import {
    Box,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    TablePagination,
    FormControlLabel,
    Checkbox,
    Grid,
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
import { UserGroupMenuSelectURL, UserGroupMenuSaveURL } from "../../../api";
import { fetchData, fetchPostData, handleTimeout, getUserPermissOnPage } from "../../../functions";
import { UploadUserRegAuthorityParams } from "../../../data/uploadParams";

const width = window.innerWidth;

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
        borderColor: "rgba(255, 255, 255, 0.15)",
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

const GroupAuthTab = ({comHeight}) => {
    ////// Init Varables
    const [groupOption, setGroupOption] = useState([]);
    const [group, setGroup] = useState("");
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);

    ////// User Page
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(13);

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
            ARG_TYPE: "Q",
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
    const handleSearch = async (type = "") => {
        setLoading(true);
        setPage(0);
        setGroup(group => type);

        let _menuListData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q_SEARCH",
            ARG_EMPID: "ALL",
            ARG_GROUP: type,
            OUT_CURSOR: ""
        });

        if (_menuListData != null && _menuListData.length > 0) {
            setMenuList(menuList => _menuListData);
        }
        else {
            setMenuList(menuList => []);
        }

        await handleTimeout(500);
        setLoading(false);
    }

    useEffect(() => {
        handleDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    ////// Handle Update
    const handleUpdate = async (type, itemCd, value) => {
        let _validType = "SAVE_YN";
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

        Swal.fire({
            title: t('title_confirm'),
            position: "center",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "seagreen",
            cancelButtonColor: "#dc3741",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.value) {
                let _uploadConfig = UploadUserRegAuthorityParams();
                _uploadConfig.ARG_TYPE = "Q_GROUP_USER";
                _uploadConfig.ARG_EMPID = "";
                _uploadConfig.ARG_PASSWORD = "";
                _uploadConfig.ARG_GROUP_CD = group;
                _uploadConfig.ARG_MENU_CD = itemCd;
                _uploadConfig.ARG_PERMISS = type;
                _uploadConfig.ARG_USE_YN = value ? "Y" : "N";
                _uploadConfig.ARG_CREATE_PROGRAM_ID = "CSMS_SYSTEM";

                let _result = await fetchPostData(UserGroupMenuSaveURL, _uploadConfig);

                if (_result) {
                    setMenuList(menuList.map(item => {
                        if (item.MENU_CD === itemCd) {
                            let nextItem = item;
                            nextItem = {
                                ...nextItem,
                                [type]: value ? "Y" : "N",
                            }
                            return nextItem;
                        } else {
                            return item;
                        }
                    }));
                } else {
                    Swal.fire({
                        icon: "error",
                        position: "center",
                        title: t("title_confirm_fail"),
                        text: t("text_please_check_again"),
                    });
                }
            }
        });
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
                                        onChange={(e) => handleSearch(e.value)}
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
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={9}>
                        <Box className="s-right">
                            {!loading && (menuList === null || menuList.length < 1) &&
                                <Box sx={{ marginTop: "15px" }}>
                                    <EmptyCard />
                                </Box>
                            }
                            {!loading && menuList !== null && menuList.length > 0 &&
                                <>
                                    <TableContainer
                                        className="b-table-control"
                                        //sx={{ maxHeight: `${comHeight}px` }}
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
                                                        width="10%"
                                                        align="center"
                                                        rowSpan={2}
                                                    >
                                                        {t('title_order')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="60%"
                                                        align="center"
                                                        rowSpan={2}
                                                    >
                                                        {t('menu_nm')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        width="30%"
                                                        align="center"
                                                        colSpan={4}
                                                    >
                                                        {t('permiss')}
                                                    </StyledTableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell
                                                        className="b-table-head--sub"
                                                        width="7.5%"
                                                        align="center"
                                                    >
                                                        {t('view')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        className="b-table-head--sub"
                                                        width="7.5%"
                                                        align="center"
                                                    >
                                                        {t('new')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        className="b-table-head--sub"
                                                        width="7.5%"
                                                        align="center"
                                                    >
                                                        {t('update')}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        className="b-table-head--sub"
                                                        width="7.5%"
                                                        align="center"
                                                    >
                                                        {t('btn_delete')}
                                                    </StyledTableCell>
                                                </TableRow>

                                            </TableHead>
                                            <TableBody className="b-table-body">
                                                {menuList.slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                ).map((item) => {
                                                    return (
                                                        <StyledTableRow key={item.MENU_CD}>
                                                            <StyledTableCell width="10%" align="center" component="th" scope="row" className="b-table-cell b-border-left">
                                                                <Box className="b-table-item__title">
                                                                    {item.ORD}
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell width="60%" align="center" className="b-table-cell b-table-title">
                                                                {t(item.MENU_DISPLAY_NAME)}
                                                            </StyledTableCell>
                                                            <StyledTableCell width="7.5%" align="center" className="b-table-cell b-table--checkbox">
                                                                <FormControlLabel control={<Checkbox
                                                                    onChange={(e) => handleUpdate("USE_YN", item.MENU_CD, e.target.checked)}
                                                                    checked={item.USE_YN === "Y" ? true : false}
                                                                    color="success"
                                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                                                                />} />
                                                            </StyledTableCell>
                                                            <StyledTableCell width="7.5%" align="center" className="b-table-cell b-table--checkbox">
                                                                <FormControlLabel control={<Checkbox
                                                                    onChange={(e) => handleUpdate("NEW_YN", item.MENU_CD, e.target.checked)}
                                                                    checked={item.NEW_YN === "Y" ? true : false}
                                                                    color="success"
                                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                                                                />} />
                                                            </StyledTableCell>
                                                            <StyledTableCell width="7.5%" align="center" className="b-table-cell b-table--checkbox">
                                                                <FormControlLabel control={<Checkbox
                                                                    onChange={(e) => handleUpdate("SAVE_YN", item.MENU_CD, e.target.checked)}
                                                                    checked={item.SAVE_YN === "Y" ? true : false}
                                                                    color="success"
                                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                                                                />} />
                                                            </StyledTableCell>
                                                            <StyledTableCell width="7.5%" align="center" className="b-table-cell b-table--checkbox">
                                                                <FormControlLabel control={<Checkbox
                                                                    onChange={(e) => handleUpdate("DELETE_YN", item.MENU_CD, e.target.checked)}
                                                                    checked={item.DELETE_YN === "Y" ? true : false}
                                                                    color="success"
                                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                                                                />} />
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[13, 30, 50]}
                                        component="div"
                                        count={menuList.length}
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
                                            <Grid item xs={7}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                            </Grid>
                                            <Grid item xs={1}>
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
        </ >
    );
}

export default GroupAuthTab;