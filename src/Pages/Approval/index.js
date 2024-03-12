import {
    Box,
    Container,
    Grid,
    Stack,
    Typography,
    Checkbox,
    FormControlLabel,
    Skeleton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { DatePicker } from "rsuite";
import { fetchData, fetchPostData } from "../../functions";
import {
    VendorRequestListSelectURL,
    RequestSelectURL,
    ResultSelectURL,
    RequestConfirmUpdateURL,
    GetSendEmailDataURL, 
    SendEmailURL
} from "../../api";
import {
    getDateFormat,
    isNullOrEmpty,
    handleTimeout,
    getYesterday,
    getUserPermissOnPage,
    getDateFormatYMD,
} from "../../functions";
import { RequestSearchParams, SendEmailParams } from "../../data/configParams";
import {
    UploadRequestConfirmUpdateParams,
    removeVietnamese,
} from "../../data/uploadParams";
import EmployeeCard from "../../components/Card/EmployeeCard";

import "./index.scss";
import ApproveCard from "../../components/Card/ApproveCard";
import EmptyCard from "../../components/Card/EmptyCard";

const width = window.innerWidth;

export default function ApprovalPage() {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;

    ///////Init Variable
    const [vendorList, setVendorList] = useState(null);

    const { t } = useTranslation();
    const location = useLocation();
    const [searchConfig, setSearchConfig] = useState(null);
    const [searchData, setSearchData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [selectedID, setSelectedID] = useState("");
    const [date, setDate] = useState(new Date());
    const [checked, setChecked] = useState(false);

    /////Loading
    const [loading, setLoading] = useState(true);

    //////Handle Date Changed
    const handleDateChange = async (dateFrom, dateTo) => {
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
        setSelectedID("");
        setSearchData((searchData) => []);
        setEmpData((empData) => []);

        let vendorData = await fetchData(VendorRequestListSelectURL, {
            ARG_TYPE: "Q_APPROVE",
            ARG_REQ_DATEF: dateFrom,
            ARG_REQ_DATET: dateTo,
            ARG_DEPT_CD: userData.username,
            OUT_CURSOR: "",
        });
        setVendorList((vendorList) => vendorData);

        if (vendorData != null && vendorData.length > 0) {
            setSearchConfig((searchConfig) => {
                return {
                    ...searchConfig,
                    CONT_CODE: vendorData[0].value,
                };
            });

            /////Auto Search
            handleSearch(vendorData[0].value, userData.Permission, dateFrom, dateTo);
        } else {
            setSearchData((searchData) => []);
            setEmpData((empData) => []);
            setSelectedID((selectedID) => "");
            setLoading((loading) => false);
        }
    };

    const handleDefault = async () => {
        setChecked(false);
        let _fetchData = await fetchData(VendorRequestListSelectURL, {
            ARG_TYPE: "Q_DATE",
            ARG_REQ_DATEF: "",
            ARG_REQ_DATET: "",
            ARG_DEPT_CD: "",
            OUT_CURSOR: "",
        });
        let _fetchDate =
            _fetchData !== null && _fetchData.length > 0
                ? new Date(getDateFormatYMD(_fetchData[0].YMD))
                : "";

        let _yesterday = isNullOrEmpty(_fetchDate) ? getYesterday() : _fetchDate;
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
        await handleDateChange(
            getDateFormat(_yesterday),
            getDateFormat(_yesterday)
        );
        setDate(_yesterday);
        setSearchData([]);
        setEmpData([]);
        setSelectedID("");
        setSearchConfig((searchConfig) => {
            return {
                ...searchConfig,
                DEPT_CD: userData.Permission,
                DATE_FROM: getDateFormat(_yesterday),
                DATET_TO: getDateFormat(_yesterday),
            };
        });
    };

    useEffect(() => {
        handleDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    //Handle Change Select
    const handleChangeSelect = (
        type,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        switch (type) {
            case "VENDOR":
                setSearchConfig((saveData) => {
                    return {
                        ...saveData,
                        CONT_CODE: event.value,
                    };
                });
                handleSearch(
                    event.value,
                    searchConfig.DEPT_CD,
                    searchConfig.DATE_FROM,
                    searchConfig.DATET_TO
                );
                break;
            case "START_END_YMD":
                let _date = event ? getDateFormat(event) : "";
                setDate((date) => event);
                setSearchConfig((saveData) => {
                    return {
                        ...saveData,
                        CONT_CODE: "",
                        DATE_FROM: _date,
                        DATET_TO: _date,
                    };
                });
                handleDateChange(_date, _date);
                break;
            default:
                break;
        }
    };

    ///////Handle Toggle Collapse
    const handleToggle = async (value) => {
        if (value !== selectedID) {
            setSelectedID((selectedID) => value);
            setEmpData((empData) => []);

            let _fetchData = await fetchData(ResultSelectURL, {
                ARG_TYPE: "Q_APPROVE",
                ARG_REQ_SEQ: value,
                OUT_CURSOR: "",
            });
            setEmpData((empData) => _fetchData);
        }
    };

    //////Handle Checkbox
    const handleSearchData = async (id, type, value) => {
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage(
            "SAVE_YN",
            location.pathname
        );
        if (!_validPermiss) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        let _allow_check = await IsAllowCheck(id, type);
        let _commentTxt = "";

        if (value === "D") {
            if (_allow_check) {
                const { value: text } = await Swal.fire({
                    title: t("swal_reject"),
                    input: "textarea",
                    inputAttributes: {
                        autocapitalize: "off",
                    },
                    inputPlaceholder: t("swal_comment"),
                    showCancelButton: true,
                    confirmButtonText: t("btn_confirm"),
                    confirmButtonColor: "seagreen",
                    cancelButtonColor: "#dc3741",
                    cancelButtonText: t("swal_cancel"),
                });

                if (text) {
                    _commentTxt = removeVietnamese(text);
                } else {
                    return;
                }
            }
        }

        if (_allow_check) {
            Swal.fire({
                title: t("title_confirm"),
                text: t("text_confirm"),
                position: "center",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "seagreen",
                cancelButtonColor: "#dc3741",
                confirmButtonText: "Yes",
            }).then(async (result) => {
                if (result.value) {
                    let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
                    let _item = searchData.filter((item) => item.REQ_NO === id);
                    let _updateData = _item[0];
                    let _qType =
                        type === "PIC_CONFIRM_YN" ? "DEPT_APPROVE" : "RSM_APPROVE";

                    let _uploadConfig = UploadRequestConfirmUpdateParams(_updateData);
                    _uploadConfig.ARG_CONFIRM_YN = value;
                    _uploadConfig.ARG_CONFIRM_ID = userData.username;
                    _uploadConfig.ARG_CONFIRM_NAME = userData.displayname;
                    _uploadConfig.ARG_CONFIRM_COMMENT = _commentTxt;
                    _uploadConfig.ARG_UPDATE_PROGRAM_ID = "CSM_SYSTEM";
                    _uploadConfig.ARG_DEPT_CD =
                        _updateData.DEPT_CD === "ADMIN" ? "RSM" : _updateData.DEPT_CD;
                    _uploadConfig.ARG_ROWID = _updateData.REQ_NO;
                    _uploadConfig.ARG_TYPE = _qType;

                    let _result = await fetchPostData(
                        RequestConfirmUpdateURL,
                        _uploadConfig
                    );
                    if (_result) {
                        /////Get Approve/Deny Email Data
                        let _sendToData = await fetchData(GetSendEmailDataURL, {
                            ARG_TYPE: "RSM",
                            ARG_REQ_NO: _updateData.REQ_NO,
                            ARG_CONFIRM_STATUS: value,
                            OUT_CURSOR: ""
                        });
                
                        let _mailData = await fetchData(GetSendEmailDataURL, {
                            ARG_TYPE: "INFOR",
                            ARG_REQ_NO: _updateData.REQ_NO,
                            ARG_CONFIRM_STATUS: "",
                            OUT_CURSOR: ""
                        });
                
                        if(_mailData !== null && _mailData.length > 0 && _sendToData !== null && _sendToData.length > 0){
                            _mailData = _mailData[0]
                            _sendToData = _sendToData[0].EMAIL
                            let _sendEmailPrams = SendEmailParams(_sendToData, _mailData, value === "Y" ? "CFM" : "DENY");
                        
                            /////Send Confirm Email
                            await fetchPostData(SendEmailURL, _sendEmailPrams);
                        }

                        setSearchData(
                            searchData.map((item) => {
                                if (item.REQ_NO === id) {
                                    let nextItem = item;
                                    switch (type) {
                                        case "PIC_CONFIRM_YN":
                                        case "RSM_CONFIRM_YN":
                                            nextItem = {
                                                ...nextItem,
                                                [type]: value,
                                            };
                                            break;
                                        default:
                                            break;
                                    }
                                    return nextItem;
                                } else {
                                    return item;
                                }
                            })
                        );
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
    };

    const IsAllowCheck = (id, type) => {
        let _result = false;
        let _item = searchData.filter((item) => item.REQ_NO === id);
        let _pic_confirm = _item[0].PIC_CONFIRM_YN;
        let _rsm_confirm = _item[0].RSM_CONFIRM_YN;

        if (
            (type === "PIC_CONFIRM_YN" && _pic_confirm === "N") ||
            (type === "RSM_CONFIRM_YN" && _rsm_confirm === "N")
        ) {
            _result = true;
        }

        return _result;
    };

    //////Handle Search
    const handleSearch = async (
        contCd = "",
        deptCd = "",
        dateFrom = "",
        dateTo = ""
    ) => {
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
        setSearchData((searchData) => []);
        setEmpData((empData) => []);
        setSelectedID((selectedID) => "");

        /////Loading State
        setLoading((loading) => true);

        let _fetchData = await fetchData(RequestSelectURL, {
            ARG_TYPE: "Q_APPROVE",
            ARG_CONT_CODE: isNullOrEmpty(contCd) ? searchConfig.CONT_CODE : contCd,
            ARG_DEPT_CD: isNullOrEmpty(deptCd) ? searchConfig.DEPT_CD : deptCd,
            ARG_REQ_DATEF: isNullOrEmpty(dateFrom)
                ? searchConfig.DATE_FROM
                : dateFrom,
            ARG_REQ_DATET: isNullOrEmpty(dateTo) ? searchConfig.DATET_TO : dateTo,
            OUT_CURSOR: "",
        });
        let _configData = _fetchData.map((item) => {
            let _data = RequestSearchParams(item);
            _data.ROWID = "";
            _data.USER_IS_CHIEF = userData.isChief;
            _data.USER_DEPT = userData.Permission;
            return _data;
        });
        setSearchData((searchData) => _configData);

        if (_fetchData) {
            handleTimeout(500).then(() => {
                setLoading((loading) => false);
            });
        } else {
            setLoading((loading) => false);
        }
    };

    //////Handle Checked
    const handleChecked = async (value) => {
        setLoading(true);
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

        if (value === true) {
            let _fetchData = await fetchData(RequestSelectURL, {
                ARG_TYPE: "Q_IMAPPROVE",
                ARG_CONT_CODE: "",
                ARG_DEPT_CD: searchConfig.DEPT_CD,
                ARG_REQ_DATEF: "",
                ARG_REQ_DATET: "",
                OUT_CURSOR: "",
            });

            let _configData = _fetchData.map((item) => {
                let _data = RequestSearchParams(item);
                _data.ROWID = "";
                _data.USER_IS_CHIEF = userData.isChief;
                _data.USER_DEPT = userData.Permission;
                return _data;
            });
            setSearchData((searchData) => _configData);
            setEmpData((empData) => []);
            if (_fetchData) {
                handleTimeout(500).then(() => {
                    setLoading((loading) => false);
                });
            } else {
                setLoading((loading) => false);
            }
        } else {
            await handleDateChange(searchConfig.DATE_FROM, searchConfig.DATET_TO);
        }

        setChecked((checked) => value);
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                marginTop: "15px",
                width: "100%",
                display: "flex",
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                }}
                direction={"column"}
                className="s-approval"
            >
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={2.5}>
                        <Box className="s-left">
                            <Box style={{ position: "relative" }}>
                                <Typography variant="h5" className="s-title">
                                    {t("title_request_approval")}
                                </Typography>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={12}>
                                    <FormControlLabel
                                        style={{
                                            margin: 0,
                                        }}
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(e) => handleChecked(e.target.checked)}
                                                sx={{
                                                    "& .MuiSvgIcon-root": { fontSize: 23 },
                                                    "&.Mui-checked": { color: "seagreen" },
                                                }}
                                                style={{ padding: 5 }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: 16,
                                                    marginLeft: 3,
                                                    backgroundColor: "#ffca02",
                                                    padding: "2px 5px",
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                {t("title_show_unapproved_list")}
                                            </Typography>
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={12}>
                                    <Typography
                                        style={{
                                            fontWeight: 600,
                                            color: "#333",
                                            marginBottom: 3,
                                            fontSize: 16,
                                            marginLeft: 3,
                                        }}
                                    >
                                        {t("title_start_work_date")}
                                    </Typography>
                                    <DatePicker
                                        disabled={checked}
                                        value={date}
                                        onChange={(e) => handleChangeSelect("START_END_YMD", e)}
                                        block
                                        size="lg"
                                        oneTap
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={12}>
                                    <Typography
                                        style={{
                                            fontWeight: 600,
                                            color: "#333",
                                            marginBottom: 3,
                                            fontSize: 16,
                                        }}
                                    >
                                        {t("frm_vendor")}
                                    </Typography>
                                    <Select
                                        isDisabled={checked}
                                        value={
                                            searchConfig?.CONT_CODE
                                                ? vendorList.filter(
                                                    (item) => item.value === searchConfig?.CONT_CODE
                                                )
                                                : ""
                                        }
                                        onChange={(e) => handleChangeSelect("VENDOR", e)}
                                        options={vendorList}
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
                                                background: isDisabled ? "#f8f6f7" : "#fff",
                                                borderColor: "#c4c4c4"
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
                    <Grid item xs={12} sm={12} md={12} lg={9.5}>
                        {!loading && (searchData === null || searchData.length === 0) && (
                            <Box sx={{ marginTop: 3 }}>
                                <EmptyCard />
                            </Box>
                        )}
                        {!loading && searchData !== null && searchData.length > 0 && (
                            <>
                                <Box>
                                    <Box className="b-card-header">
                                        <Stack className="b-top" flexDirection="row">
                                            <Box className="b-item b-item--first">
                                                {t("title_order")}
                                            </Box>
                                            <Box className="b-item b-item--sec">
                                                {t("frm_vendor")}
                                            </Box>
                                            <Box className="b-item b-item--eighth">
                                                {t("frm_purpose")}
                                            </Box>
                                            <Box className="b-item b-item--third">
                                                {t("frm_number_people")}
                                            </Box>
                                            <Box className="b-item b-item--fourth">
                                                {t("title_work_date")}
                                            </Box>
                                            <Box className="b-item b-item--nineth">
                                                {t("title_department_name")}
                                            </Box>
                                            <Box className="b-item b-item--sixth">
                                                <Box className="b-sub">{t("frm_pic")}</Box>
                                                <Stack
                                                    flexDirection="row"
                                                    className="b-border-top"
                                                    sx={{ width: "100%" }}
                                                >
                                                    <Box className="b-item--seventh b-sub b-border-right">
                                                        {t("frm_full_nm")}
                                                    </Box>
                                                    <Box className="b-item--seventh b-sub">
                                                        {t("frm_phone")}
                                                    </Box>
                                                </Stack>
                                            </Box>
                                            <Box className="b-item--fifth">
                                                <Box className="b-sub b-border-underline">
                                                    {t("tb_status")}
                                                </Box>
                                                <Stack flexDirection="row">
                                                    <Box className="b-item--seventh">
                                                        <Box className="b-sub">{t("title_rsm_dept")}</Box>
                                                        <Stack flexDirection="row" className="b-border-top">
                                                            <Box className="b-item--seventh b-sub b-border-right">
                                                                {t("title_approve")}
                                                            </Box>
                                                            <Box className="b-item--seventh b-sub">
                                                                {t("title_deny")}
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Box
                                        className={
                                            selectedID !== "" ? "b-table--active" : "b-table"
                                        }
                                    >
                                        {searchData.map((item, index) => {
                                            return (
                                                <ApproveCard
                                                    key={item.REQ_NO}
                                                    data={item}
                                                    selectItem={selectedID}
                                                    handleClick={handleToggle}
                                                    handleSelect={handleSearchData}
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </>
                        )}
                        {!loading &&
                            selectedID !== "" &&
                            empData !== null &&
                            empData.length > 0 && (
                                <>
                                    <Box style={{ position: "relative", marginTop: "15px" }}>
                                        <Typography variant="h5" className="s-title">
                                            {t("title_detail")}
                                        </Typography>
                                    </Box>
                                    <Box className="b-card-header--emp">
                                        <Stack className="b-top" flexDirection="row">
                                            <Box className="b-item b-item--first">
                                                {t("title_no")}
                                            </Box>
                                            <Box className="b-item b-item--sec">{t("emp_nm")}</Box>
                                            <Box className="b-item b-item--third">
                                                {t("citizen_id")}
                                            </Box>
                                            <Box className="b-item b-item--fourth">
                                                {t("birthday")}
                                            </Box>
                                            <Box className="b-item b-item--fifth">{t("gender")}</Box>
                                            <Box className="b-item b-item--sixth">
                                                {t("frm_position")}
                                            </Box>
                                            <Box className="b-item b-item--seventh">
                                                {t("secure_card")}
                                            </Box>
                                        </Stack>
                                    </Box>
                                </>
                            )}
                        {!loading && empData !== null && empData.length > 0 && (
                            <>
                                <Box
                                    className="b-table-control"
                                    sx={{ maxHeight: "368px", overflowY: "scroll" }}
                                >
                                    {empData.map((item, index) => (
                                        <EmployeeCard key={index} data={item} />
                                    ))}
                                </Box>
                            </>
                        )}
                        {loading && (
                            <>
                                <Box>
                                    <Grid container spacing={1}>
                                        <Grid item xs={1}>
                                            <Skeleton
                                                variant="rounded"
                                                height={isMobile ? 70 : 100}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Skeleton
                                                variant="rounded"
                                                height={isMobile ? 70 : 100}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Skeleton
                                                variant="rounded"
                                                height={isMobile ? 70 : 100}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Skeleton
                                                variant="rounded"
                                                height={isMobile ? 70 : 100}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Skeleton
                                                variant="rounded"
                                                height={isMobile ? 70 : 100}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ marginTop: isMobile ? "8px" : "10px" }}
                                        height={isMobile ? 30 : 40}
                                    />
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
}
