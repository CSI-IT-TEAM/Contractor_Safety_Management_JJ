import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Drawer, Placeholder } from 'rsuite';
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { UserGroupMenuSelectURL, UserGroupMenuSaveURL, UserPermissionSaveURL } from "../../api";
import { fetchData, fetchPostData, isNullOrEmpty, getUserPermissOnPage } from "../../functions";
import { UploadUserRegAuthorityParams, UploadUserPermissionParams } from "../../data/uploadParams";
import { encode as base64_encode } from "base-64";
import Swal from "sweetalert2";
import Select from "react-select";

import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

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
        fontSize: 14,
        padding: "9px 8px",
        fontWeight: 500,
        borderBottom: "1px solid rgba(224, 224, 224, .6)",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: "silk",
    },
}));

const UserRegSheet = ({ open, handleClose, handleReload, empID = "" }) => {

    ////// Init Varables
    const [groupOption, setGroupOption] = useState([]);
    const [group, setGroup] = useState("DEPT");
    const [employeeID, setEmployeeID] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [permissList, setPermissList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState({
        EMPID: true,
        EMPNM: true,
        GROUP: true,
    });
    const sheetWidth = isMobile ? 0.9 * width : 600;

    ////// Transldate
    const { t } = useTranslation();
    const location = useLocation();

    const handleDefault = async () => {
        let _downloadData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q",
            ARG_EMPID: "",
            ARG_GROUP: "",
            OUT_CURSOR: ""
        });

        if (_downloadData !== null && _downloadData.length > 0) {
            setGroupOption(groupOption => _downloadData);
        } else {
            setGroupOption(groupOption => []);
        }
    }

    ////// Handle Data
    const handleData = async () => {
        setLoading(loading => true);
        setEmployeeID(employeeID => empID);

        setValid({
            EMPID: true,
            EMPNM: true,
            GROUP: true,
        });
        setGroup(group => "DEPT");

        let _downloadData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q_USER",
            ARG_EMPID: empID,
            ARG_GROUP: "ALL",
            OUT_CURSOR: ""
        });

        if (_downloadData !== null && _downloadData.length > 0) {
            setEmployeeName(employeeName => _downloadData[0].NAME);
            setGroup(group => _downloadData[0].PERMISSION);
            handleGetPermission(empID, _downloadData[0].PERMISSION);
        } else {
            setEmployeeName(employeeName => "");
            setGroup(group => "DEPT");
            handleGetPermission(empID, "DEPT");
        }
        setLoading(loading => false);
    }

    /////Handle User Name
    const handleUserName = async (value) => {
        let _downloadData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q_USER",
            ARG_EMPID: value,
            ARG_GROUP: "ALL",
            OUT_CURSOR: ""
        });

        if (_downloadData !== null && _downloadData.length > 0) {
            setEmployeeName(employeeName => "");
            setEmployeeID(employeeID => "");

            Swal.fire({
                icon: "error",
                position: "center",
                title: t("frm_id_required"),
                text: t("swal_existed_id"),
            });
        } else {
            let _downloadData = await fetchData(UserGroupMenuSelectURL, {
                ARG_TYPE: "Q_USER_INFO",
                ARG_EMPID: value,
                ARG_GROUP: "",
                OUT_CURSOR: ""
            });

            if (_downloadData !== null && _downloadData.length > 0) {
                setEmployeeName(employeeName => _downloadData[0].NAME);

                setValid(valid => {
                    return {
                        ...valid,
                        EMPID: true,
                        EMPNM: true,
                    }
                })
            } else {
                setEmployeeName(employeeName => "");
                setValid(valid => {
                    return {
                        ...valid,
                        EMPID: true,
                    }
                })
            }
        }
    }

    ////// Handle Permission
    const handleGetPermission = async(empID, groupCd) => {
        let _downloadData = await fetchData(UserGroupMenuSelectURL, {
            ARG_TYPE: "Q_USER_PERMISSION",
            ARG_EMPID: empID,
            ARG_GROUP: groupCd,
            OUT_CURSOR: ""
        });

        if(_downloadData !== null && _downloadData.length > 0){
            setPermissList(permissList => _downloadData);
        }
        else{
            setPermissList(permissList => []);
        }
    }

    ////// Handle Permission
    const handlePermission = (type, itemCd, value) => {
        setPermissList(permissList.map(item => {
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
    }

    ////// Effect Hook
    useEffect(() => {
        handleDefault();
    }, []);

    useEffect(() => {
        handleData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empID]);

    useEffect(() => {
        if(open && isNullOrEmpty(empID)){
            setEmployeeID("");
            setEmployeeName("");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[open])

    ////////Button Upload
    async function getPosts() {
        let _count = 0;

        for (let iCount = 0; iCount < permissList.length; iCount++) {
            try {
                let uploadConfig = UploadUserPermissionParams();
                uploadConfig.ARG_TYPE                     = "Q_ADD";
                uploadConfig.ARG_EMPID                    = employeeID;
                uploadConfig.ARG_MENU_CD                  = permissList[iCount].MENU_CD;
                uploadConfig.ARG_PERMISS                  = "";
                uploadConfig.ARG_USE_YN                   = permissList[iCount].USE_YN;
                uploadConfig.ARG_NEW_YN                   = permissList[iCount].NEW_YN;
                uploadConfig.ARG_SAVE_YN                  = permissList[iCount].SAVE_YN;
                uploadConfig.ARG_DELETE_YN                = permissList[iCount].DELETE_YN;
                uploadConfig.ARG_CREATE_PROGRAM_ID = "CSMS_SYSTEM";

                let _result = await fetchPostData(UserPermissionSaveURL, uploadConfig);

                if (_result) {
                    _count++;
                }
            }
            catch {
                break;
            }
        }
        return _count === permissList.length ? true : false;
    };

    ///////Handle Register
    const handleRegister = async (qType) => {
        let _validType = qType === "Q_USER_REMOVE" ? "DELETE_YN" : isNullOrEmpty(empID) ? "NEW_YN" : "SAVE_YN";
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage(_validType, location.pathname);
        if(!_validPermiss){
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        setValid(valid => {
            return {
                ...valid,
                EMPID: !isNullOrEmpty(employeeID),
                EMPNM: !isNullOrEmpty(employeeName),
                GROUP: !isNullOrEmpty(group),
            }
        })
        if (isNullOrEmpty(employeeID) || isNullOrEmpty(employeeName) || isNullOrEmpty(group)) {
            return;
        }
        let _txt_desc = qType === "Q_USER" ? "title_reg_success" : "title_del_success";

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
                if(qType === "Q_USER"){
                    //////Show wait screen
                    Swal.fire({
                        title: "Please wait!",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    let _uploadConfig = UploadUserRegAuthorityParams();
                    _uploadConfig.ARG_TYPE = qType;
                    _uploadConfig.ARG_EMPID = employeeID;
                    _uploadConfig.ARG_PASSWORD = base64_encode(employeeID);
                    _uploadConfig.ARG_GROUP_CD = group;
                    _uploadConfig.ARG_CREATE_PROGRAM_ID = "CSMS_SYSTEM";
                    let _result = await fetchPostData(UserGroupMenuSaveURL, _uploadConfig);
    
                    if (_result) {
                        /////Delete Existed Permission Of Current User ID
                        let _delConfig = UploadUserPermissionParams();
                        _delConfig.ARG_TYPE                     = "Q_DELETE";
                        _delConfig.ARG_EMPID                    = employeeID;
                        let _deleteResult = await fetchPostData(UserPermissionSaveURL, _delConfig);

                        if(_deleteResult){
                            ///////Add Permission To Current User ID
                            getPosts().then(async (res) => {
                                if (res) {
                                    Swal.close();
                                    handleClose();
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: t(_txt_desc),
                                        showConfirmButton: false,
                                        timer: 1500,
                                    }).then(() => {
                                        handleReload("", true);
                                    });
                                }
                                else {
                                    Swal.close();
                                    Swal.fire({
                                        icon: "error",
                                        position: "center",
                                        title: t("title_reg_fail"),
                                        text: t("text_please_check_again"),
                                    });
                                }
                            })
                        }else{
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                position: "center",
                                title: t("title_confirm_fail"),
                                text: t("text_please_check_again"),
                            });
                        }
                    } else {
                        Swal.close();
                        Swal.fire({
                            icon: "error",
                            position: "center",
                            title: t("title_confirm_fail"),
                            text: t("text_please_check_again"),
                        });
                    }
                }else{
                    //////Show wait screen
                    Swal.fire({
                        title: "Please wait!",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    let _uploadConfig = UploadUserRegAuthorityParams();
                    _uploadConfig.ARG_TYPE = qType;
                    _uploadConfig.ARG_EMPID = employeeID;
                    _uploadConfig.ARG_PASSWORD = base64_encode(employeeID);
                    _uploadConfig.ARG_GROUP_CD = group;
                    _uploadConfig.ARG_CREATE_PROGRAM_ID = "CSMS_SYSTEM";
                    let _result = await fetchPostData(UserGroupMenuSaveURL, _uploadConfig);
    
                    if (_result) {
                        Swal.close();
                        handleClose();
    
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: t(_txt_desc),
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                            handleReload("", true);
                        });
                    } else {
                        Swal.close();
                        Swal.fire({
                            icon: "error",
                            position: "center",
                            title: t("title_confirm_fail"),
                            text: t("text_please_check_again"),
                        });
                    }
                }
            }
        });
    }

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
                    }}
                >
                    {isNullOrEmpty(empID) ? t('create_user') : t('update_user')}
                </Typography>
            </Drawer.Header>
            <Drawer.Body className="s-drawer--reg">
                {loading &&
                    <Placeholder.Paragraph rows={25} />
                }
                {!loading &&
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={5}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('frm_userID')}</Typography>
                                <TextField
                                    inputProps={{ inputMode: "text" }}
                                    value={employeeID}
                                    onChange={(event) => {
                                        setEmployeeID((employeeID) => event.target.value);
                                    }}
                                    onBlur={(event) => handleUserName(event.target.value)}
                                    disabled={!isNullOrEmpty(empID)}
                                    sx={{ background: "#f8f6f7" }}
                                    className={isNullOrEmpty(empID) ? "b-input bg-white" : "b-input"}
                                    fullWidth
                                    placeholder={t('plholder_userID')}
                                />
                                {!valid.EMPID && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={7}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('frm_userName')}</Typography>
                                <TextField
                                    inputProps={{ inputMode: "text" }}
                                    value={employeeName}
                                    disabled
                                    sx={{ background: "#f8f6f7" }}
                                    className="b-input"
                                    fullWidth
                                    placeholder={t('frm_full_nm')}
                                />
                                {!valid.EMPNM && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
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
                                        handleGetPermission(employeeID, e.value);
                                        setGroup(e.value);
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
                                {!valid.GROUP && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
                        </Grid>
                        <Box sx={{paddingTop: "8px"}}>
                            <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 5,
                                        fontSize: 16,
                                    }}
                                >{t('assign_permiss')}</Typography>
                            <Box>
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
                                                    width="52%"
                                                    align="center"
                                                    rowSpan={2}
                                                >
                                                    {t('menu_nm')}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    width="12%"
                                                    align="center"
                                                >
                                                    {t('view')}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    width="12%"
                                                    align="center"
                                                >
                                                    {t('new')}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    width="12%"
                                                    align="center"
                                                >
                                                    {t('update')}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    width="12%"
                                                    align="center"
                                                >
                                                    {t('btn_delete')}
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="b-table-body">
                                            {permissList !== null && permissList.length > 0 && permissList.map((item) => {
                                                return(
                                            <StyledTableRow key={item.MENU_CD}>
                                                <StyledTableCell width="52%" align="center" className="b-table-cell b-table-title">
                                                    {t(item.MENU_DISPLAY_NAME)}
                                                </StyledTableCell>
                                                <StyledTableCell width="12%" align="center" className="b-table-cell">
                                                    <FormControlLabel control={<Checkbox
                                                            onChange={(e) => handlePermission("USE_YN", item.MENU_CD, e.target.checked)}
                                                            checked={item.USE_YN === "Y" ? true : false}
                                                            color="success"
                                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 26, display: item.GRP_USE_YN === "Y" ? "block" : "none" }}}
                                                        />} />
                                                </StyledTableCell>
                                                <StyledTableCell width="12%" align="center" className="b-table-cell">
                                                    <FormControlLabel control={<Checkbox
                                                        onChange={(e) => handlePermission("NEW_YN", item.MENU_CD, e.target.checked)}
                                                        checked={item.NEW_YN === "Y" ? true : false}
                                                        color="success"
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 26, display: item.GRP_NEW_YN === "Y" ? "block" : "none"} }}
                                                    />} />
                                                </StyledTableCell>
                                                <StyledTableCell width="12%" align="center" className="b-table-cell">
                                                    <FormControlLabel control={<Checkbox
                                                        onChange={(e) => handlePermission("SAVE_YN", item.MENU_CD, e.target.checked)}
                                                        checked={item.SAVE_YN === "Y" ? true : false}
                                                        color="success"
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 26, display: item.GRP_SAVE_YN === "Y" ? "block" : "none" } }}
                                                    />} />
                                                </StyledTableCell>
                                                <StyledTableCell width="12%" align="center" className="b-table-cell">
                                                    <FormControlLabel control={<Checkbox
                                                        onChange={(e) => handlePermission("DELETE_YN", item.MENU_CD, e.target.checked)}
                                                        checked={item.DELETE_YN === "Y" ? true : false}
                                                        color="success"
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 26, display: item.GRP_DELETE_YN === "Y" ? "block" : "none" } }}
                                                    />} />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                        <Stack flexDirection="row" gap={1} sx={{ marginTop: "20px" }}>
                            <Button
                                fullWidth
                                endIcon={isNullOrEmpty(empID) ? <CreateIcon /> : <UpdateIcon />}
                                color="success"
                                variant="contained"
                                size="large"
                                sx={{
                                    height: 45,
                                    width: isNullOrEmpty(empID) ? "100%" : "50%",
                                    textTransform: "none",
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    boxShadow: 'none',
                                }}
                                onClick={() => handleRegister("Q_USER")}
                            >
                                {isNullOrEmpty(empID) ? t('btn_register') : t('btn_update')}
                            </Button>
                            {!(isNullOrEmpty(empID)) &&
                                <Button
                                    fullWidth
                                    endIcon={<DeleteIcon />}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        height: 45,
                                        width: "50%",
                                        textTransform: "none",
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        boxShadow: 'none',
                                        color: "#d32f2f",
                                        background: "hsl(0 65% 95% / 1)",
                                        "&.MuiButtonBase-root:hover": {
                                            background: "hsl(0 65% 95% / 1)"
                                        }
                                    }}
                                    onClick={() => handleRegister("Q_USER_REMOVE")}
                                >
                                    {t('btn_delete')}
                                </Button>
                            }
                        </Stack>
                    </>
                }
            </Drawer.Body>
        </Drawer>
    )
}

export default UserRegSheet;