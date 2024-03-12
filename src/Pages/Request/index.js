import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Stack,
    TextField,
    Typography,
    Skeleton,
    InputAdornment,
    Fab,
    Tooltip
} from "@mui/material";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import {
    EmployeeParams,
    RequestCreateSaveParams,
    RequestCreateResultSaveParams,
    HistorySelectParams,
    SendEmailParams
} from "../../data/configParams";
import {
    UploadRequestCreateSaveParams,
    UploadRequestCreateResultSaveParams,
    UploadRequestPaperWorkImageParams,
    removeVietnamese,
    UploadUserWorkLicesnseParams
} from "../../data/uploadParams";
import { regValid } from "../../data/configValidate";
import { fetchData, fetchPostData, getDateFormat, isNullOrEmpty, getDateAfter, handleTimeout, validateUserID, getUserPermissOnPage, fetchPostFormData, getDateFormatYMD } from "../../functions";
import {
    VendorListSelectURL, EmpPositionSelectURL, RequestCreateSaveURL, RequestCreateResultSaveURL, RequestCreateInsertDASS, RequestCheckURL,
    UploadRequestPaperWorkImageURL, HistorySelectURL, HistorySaveURL, GetSendEmailDataURL, SendEmailURL, UserJobLicenseSaveURL
} from "../../api";
import { isBefore } from 'date-fns';

import "./index.scss";
import Select from "react-select";
import Swal from "sweetalert2";
import { List, AutoSizer } from "react-virtualized";
import VendorCard from "../../components/Card/VendorCard";
import UpdateSheet from "./UpdateSheet";
import SelectEmpModal from "./SelectEmpModal";
import UploadThumbModal from "../../components/Modal/UploadThumb";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreateIcon from "@mui/icons-material/Create";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import UpdateIcon from '@mui/icons-material/Update';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const width = window.innerWidth;
const height = window.innerHeight;

export default function HomePage() {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;
    const refTop = useRef(null);
    const refMid = useRef(null);

    ////// Init Variable
    const [contList, setContList] = useState([]);
    const [vendorList, setVendorList] = useState(null);
    const [holiday, setHoliday] = useState(false);
    const [posList, setPosList] = useState([]);
    const [saveData, setSaveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comHeight, setComHeight] = useState(0);

    ///// Modal
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [modalData, setModalData] = useState(null);

    ////// Transldate
    const { t } = useTranslation();
    const location = useLocation();
    const i18_Value =
        i18next.language !== null &&
            i18next.language !== undefined &&
            i18next.language !== ""
            ? i18next.language
            : "en";
    const [date, setDate] = useState([getDateAfter(), getDateAfter()]);
    const [vendorNumber, setVendorNumber] = useState(5);

    /////Validate
    const [valid, setValid] = useState(regValid);
    const [checked, setChecked] = useState(false);

    /////History
    const [history, setHistory] = useState(false);
    const [updateData, setUpdateData] = useState(null);

    ////Employee List
    const [openModal, setOpenModal] = useState(false);

    /////Handle Search Update
    const handleSearchUpdate = async (reqNo) => {
        setContList((contList) => []);
        let _fetchConfig = HistorySelectParams();
        _fetchConfig.ARG_TYPE = "Q_BASE";
        _fetchConfig.ARG_REQ_NO = reqNo;

        /////Fetch Data
        let posData = await fetchData(HistorySelectURL, _fetchConfig);
        _fetchConfig.ARG_TYPE = "Q_EMP";
        let empData = await fetchData(HistorySelectURL, _fetchConfig);

        if (posData !== null && posData.length > 0) {
            setUpdateData(updateData => posData[0]);

            ///////Top Data
            let _saveParams = RequestCreateSaveParams();
            _saveParams.PLANT_CD = posData[0].PLANT_CD;
            _saveParams.DEPT_CD = posData[0].DEPT_CD;
            _saveParams.REQ_NO = posData[0].REQ_NO;
            _saveParams.VISIT_START_DATE = posData[0].VISIT_START_DATE;
            _saveParams.VISIT_END_DATE = posData[0].VISIT_END_DATE;
            _saveParams.VISIT_PURPOSE = posData[0].VISIT_PURPOSE;
            _saveParams.VISIT_WORKPLACE = isNullOrEmpty(posData[0].VISIT_WORKPLACE) ? "" : posData[0].VISIT_WORKPLACE;
            _saveParams.CONT_CODE = posData[0].CONT_CODE;
            _saveParams.CONT_ADDRESS = posData[0].CONT_ADDRESS;
            _saveParams.CONT_PHONE = posData[0].CONT_PHONE;
            _saveParams.CONT_EMAIL = posData[0].CONT_EMAIL;
            _saveParams.SUPERVISOR_ID = posData[0].SUPERVISOR_ID;
            _saveParams.SUPERVISOR_NM = posData[0].SUPERVISOR_NM;
            _saveParams.SUPERVISOR_PHONE = posData[0].SUPERVISOR_PHONE;
            setSaveData(saveData => _saveParams);

            //////Set Valid To True
            setValid(valid => regValid);

            //////Holiday Y/N
            setHoliday(holiday => posData[0].HOLIDAY_YN === "Y");

            //////Employee Number
            setVendorNumber(vendorNumber => posData[0].EMP_QTY);

            setDate([new Date(getDateFormatYMD(posData[0].VISIT_START_DATE)), new Date(getDateFormatYMD(posData[0].VISIT_END_DATE))]);

        } else {
            setUpdateData(updateData => null);
            handleDefault();
        }

        ///////Employee List
        if (empData !== null && empData.length > 0) {
            let _newList = empData.map((item) => {
                let obj = EmployeeParams();
                obj.ID = item.ORD;
                obj.EMP_CITIZEN_ID = item.EMP_CITIZEN_ID;
                obj.EMP_NAME = item.EMP_NAME;
                obj.EMP_BIRTHDATE = item.EMP_BIRTHDATE;
                obj.EMP_GENDER = item.EMP_GENDER === "Male";
                obj.EMP_POSITION = item.EMP_POSITION;
                obj.SECURITY_CARD_YN = item.SECURITY_CARD_YN;
                obj.EMP_CITIZEN_ID_VALID = true;
                obj.EMP_NAME_VALID = true;
                obj.EMP_BIRTHDATE_VALID = true;
                obj.EMP_POSITION_VALID = true;
                obj.INSURANCE_IMG = isNullOrEmpty(item.IAI_IMAGE_PATH) ? [] : [item.IAI_IMAGE_PATH];
                obj.WORK_PLAN_IMG = isNullOrEmpty(item.WKP_IMAGE_PATH) ? [] : [item.WKP_IMAGE_PATH];
                obj.LISCENT_IMG = isNullOrEmpty(item.LSC_IMAGE_PATH) ? [] : [item.LSC_IMAGE_PATH];
                obj.JOB_LIST = [];
                obj.JOB_DESC = "";
                obj.DEGREE_LIST = [];
                obj.DEGREE_DESC = "";

                return obj;
            });
            setContList((contList) => _newList);
        }

        /////Close Sheet
        handleHistory();
    }

    //////Handle Add New Employee
    const handleAdd = () => {
        let _max_iDx = Math.max.apply(Math, contList.map(function (o) { return o.ID; }))
        let obj = EmployeeParams(_max_iDx + 1);
        setContList(contList => [...contList, obj]);
        setVendorNumber(vendorNumber => vendorNumber + 1);
    }

    //////Handle Search People
    const handleSearchPeople = (list) => {
        if(list.length > 0){
            setLoading(loading => true);

            let _newList = list.map((item, index) => {
                let obj = EmployeeParams();
                obj.ID = index + 1;
                obj.EMP_CITIZEN_ID = item.EMP_CITIZEN_ID;
                obj.EMP_NAME = item.EMP_NAME;
                obj.EMP_BIRTHDATE = item.EMP_BIRTHDATE;
                obj.EMP_GENDER = item.EMP_GENDER === "Male";
                obj.EMP_POSITION = item.EMP_POSITION;
                obj.SECURITY_CARD_YN = item.SECURITY_CARD_YN;
                obj.EMP_CITIZEN_ID_VALID = true;
                obj.EMP_NAME_VALID = true;
                obj.EMP_BIRTHDATE_VALID = true;
                obj.EMP_POSITION_VALID = true;
                obj.INSURANCE_IMG = isNullOrEmpty(item.IAI_IMAGE_PATH) ? [] : [item.IAI_IMAGE_PATH];
                obj.WORK_PLAN_IMG = isNullOrEmpty(item.WKP_IMAGE_PATH) ? [] : [item.WKP_IMAGE_PATH];
                obj.LISCENT_IMG = isNullOrEmpty(item.LSC_IMAGE_PATH) ? [] : [item.LSC_IMAGE_PATH];
    
                return obj;
            });

            setVendorNumber(vendorNumber => list.length);
            setContList((contList) => _newList);

            handleTimeout(500).then(() => {
                setLoading(loading => false);
            })
        }
    }

    //////Handle Update
    const handleUpdate = async () => {
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("SAVE_YN", location.pathname);
        if (!_validPermiss) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        ///////Check Valid Start/End Date
        let _validate = handleValidate("emp");
        let _req_no = saveData.REQ_NO;

        let _fetchConfig = HistorySelectParams();
        _fetchConfig.ARG_TYPE = "Q_VALID";
        _fetchConfig.ARG_REQ_NO = _req_no;

        /////Fetch Data
        let posData = await fetchData(HistorySelectURL, _fetchConfig);
        _fetchConfig.ARG_TYPE = "Q_DATE";
        let dateData = await fetchData(HistorySelectURL, _fetchConfig);

        if (posData === null || posData.length < 1) {
            Swal.fire({
                icon: "warning",
                position: "center",
                title: t("swal_warn"),
                text: t("swal_invalid_update") + ": " + getDateFormatYMD(getDateFormat(getDateAfter())),
            });
            return;
        }

        //////Start/End Date
        let _dateFrom = "", _dateTo = "";

        if (dateData !== null && dateData.length > 0) {
            _dateFrom = dateData[0].VISIT_START_DATE;
            _dateTo = dateData[0].VISIT_END_DATE;
        }

        if (_validate && !isNullOrEmpty(_dateFrom) && !isNullOrEmpty(_dateTo)) {
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
                    Swal.fire({
                        title: "Please wait!",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    //////Upload Paper Work Image First
                    getPostsEmpPaperWork(_req_no).then(async (res) => {
                        if (res) {
                            let _deleteData = await fetchPostData(HistorySaveURL, {
                                ARG_TYPE: "Q",
                                ARG_REQ_NO: _req_no,
                                ARG_DATEF: _dateFrom,
                                ARG_DATET: _dateTo,
                            });
                            if (_deleteData) {
                                //////Upload Empolyee List
                                getPosts(_req_no, _dateFrom, _dateTo).then(async (res) => {
                                    if (res) {
                                        //////Upload Empolyee Work Perform & License
                                        getPostsWorkLicense(saveData.PLANT_CD, _req_no).then(async (res) => {
                                            if(res){
                                                /////Get Confirm Email Data
                                                let _sendToData = await fetchData(GetSendEmailDataURL, {
                                                    ARG_TYPE: "",
                                                    ARG_REQ_NO: _req_no,
                                                    ARG_CONFIRM_STATUS: "",
                                                    OUT_CURSOR: ""
                                                });

                                                let _mailData = await fetchData(GetSendEmailDataURL, {
                                                    ARG_TYPE: "INFOR",
                                                    ARG_REQ_NO: _req_no,
                                                    ARG_CONFIRM_STATUS: "",
                                                    OUT_CURSOR: ""
                                                });
                                    
                                                if(_mailData !== null && _mailData.length > 0 && _sendToData !== null && _sendToData.length > 0){
                                                    _mailData = _mailData[0];
                                                    _sendToData = _sendToData[0].EMAIL;
                                                    let _sendEmailPrams = SendEmailParams(_sendToData, _mailData, "REQ");
                                                
                                                    /////Send Confirm Email
                                                    let _sendMail = await fetchPostData(SendEmailURL, _sendEmailPrams);

                                                    if (_sendMail) {
                                                        Swal.close();
                                                        Swal.fire({
                                                            position: "center",
                                                            icon: "success",
                                                            title: t("title_reg_success"),
                                                            showConfirmButton: false,
                                                            timer: 1500,
                                                        }).then(() => {
                                                            handleDefault();
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
                                                }
                                            }else{
                                                Swal.close();
                                                Swal.fire({
                                                    icon: "error",
                                                    position: "center",
                                                    title: t("title_update_fail"),
                                                    text: t("text_please_check_again"),
                                                });
                                            }
                                        })
                                    }
                                    else {
                                        Swal.close();
                                        Swal.fire({
                                            icon: "error",
                                            position: "center",
                                            title: t("title_update_fail"),
                                            text: t("text_please_check_again"),
                                        });
                                    }
                                })
                            } else {
                                Swal.close();
                                Swal.fire({
                                    icon: "error",
                                    position: "center",
                                    title: t("title_update_fail"),
                                    text: t("text_please_check_again"),
                                });
                            }
                        } else {
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                position: "center",
                                title: t("title_update_fail"),
                                text: t("text_please_check_again"),
                            });
                        }
                    });
                }
            })
        }
    }

    //////Handle Open/Close
    const handleClose = () => setOpen(false);
    const handleHistory = () => setHistory(false);

    useLayoutEffect(() => {
        if (!isMobile && localStorage.getItem("CONT_USER_INFOR") !== null && JSON.parse(localStorage.getItem("CONT_USER_INFOR")).Permission !== "SCR") {
            if (width <= 767) {
                setComHeight(height - refTop.current.offsetHeight)
            }
            else {
                setComHeight(height - refTop.current.offsetHeight - refMid.current.offsetHeight - 90)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /////Handle Emp List
    const handleShowList = (value) => {
        setLoading(loading => true);
        setModalData(modalData => null);

        handleTimeout(500).then(() => {
            setContList((contList) => []);

            if (isNullOrEmpty(value)) {
                setVendorNumber((vendorNumber) => 1);
                let obj = EmployeeParams(1);
                setContList((contList) => {
                    return [...contList, obj];
                });
            }

            for (var i = 0; i < value; i++) {
                let obj = EmployeeParams(i + 1);

                setContList((contList) => {
                    return [...contList, obj];
                });
            }

            setLoading(loading => false);
        })
    };

    //Button Register Click events
    const handleRegister = () => {
        let _validate = handleValidate();

        if (_validate) {
            handleShowList(vendorNumber);
        }
    };

    const handleDefault = async () => {
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

        setVendorNumber(5);
        setContList((contList) => []);
        if (!isMobile) handleShowList(5);
        setHoliday(false);
        setChecked(false);
        setDate((date) => [getDateAfter(), getDateAfter()]);
        setUpdateData(updateData => null);

        let vendorData = await fetchData(VendorListSelectURL, {
            ARG_TYPE: "Q_REQ",
            ARG_DEPT_CD: userData.Permission === "ADMIN" ? userData.Permission : userData.dept_cd,
            OUT_CURSOR: ""
        });
        setVendorList(vendorList => vendorData);

        let posData = await fetchData(EmpPositionSelectURL, {
            ARG_TYPE: "",
            OUT_CURSOR: "",
        });
        setPosList((posList) => (posData ? posData : []));

        let _saveParams = RequestCreateSaveParams(userData.plant_cd, userData.Permission, userData.username);
        _saveParams.PLANT_CD = userData.plant_cd;
        _saveParams.DEPT_CD = userData.Permission;
        _saveParams.VISIT_START_DATE = getDateFormat(getDateAfter());
        _saveParams.VISIT_END_DATE = getDateFormat(getDateAfter());
        _saveParams.CREATE_PROGRAM_ID = "CSM_SYSTEM";
        setSaveData(saveData => _saveParams);
    }

    useEffect(() => {
        handleDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    //Handle Change Select
    const handleChangeSelect = async (type, event: React.ChangeEvent<HTMLInputElement>) => {
        switch (type) {
            case "VENDOR":
                handleSetValidate("CONT_CODE", true);
                if (!checked) setChecked(true);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        CONT_CODE: event.value,
                        CONT_NAME: event.label,
                        CONT_ADDRESS: event.CONT_ADDRESS,
                        CONT_PHONE: event.CONT_PHONE,
                        CONT_EMAIL: event.CONT_EMAIL,
                    }
                })
                break;
            case "START_END_YMD":
                setDate(date => event);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        VISIT_START_DATE: event ? getDateFormat(event[0]) : "",
                        VISIT_END_DATE: event ? getDateFormat(event[1]) : "",
                    }
                })
                break;
            case "PURPOSE":
                handleSetValidate("VISIT_PURPOSE", isNullOrEmpty(event.target.value) ? false : true);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        VISIT_PURPOSE: event.target.value,
                    }
                })
                break;
            case "VISIT_WORKPLACE":
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        VISIT_WORKPLACE: event.target.value,
                    }
                })
                break;
            case "SUPERVISOR_PHONE":
                handleSetValidate("SUPERVISOR_PHONE", isNullOrEmpty(event.target.value) ? false : true);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        SUPERVISOR_PHONE: event.target.value,
                    }
                })
                break;
            case "SUPERVISOR_ID":
                handleSetValidate("SUPERVISOR_ID", isNullOrEmpty(event.target.value) ? false : true);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        SUPERVISOR_ID: event.target.value,
                    }
                })
                break;
            case "SUPERVISOR_ID_VALID":
                const _fetchData = await validateUserID(event.target.value);

                if (isNullOrEmpty(_fetchData)) {
                    handleSetValidate("SUPERVISOR_ID", false);
                    setSaveData(saveData => {
                        return {
                            ...saveData,
                            SUPERVISOR_NM: "",
                        }
                    })
                }
                else {
                    handleSetValidate("SUPERVISOR_ID", true);
                    setSaveData(saveData => {
                        return {
                            ...saveData,
                            SUPERVISOR_NM: _fetchData,
                        }
                    })
                }
                break;
            default:
                break;
        }
    }

    ///////Handle Event On Key Down
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const _fetchData = await validateUserID(saveData.SUPERVISOR_ID);

            if (isNullOrEmpty(_fetchData)) {
                handleSetValidate("SUPERVISOR_ID", false);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        SUPERVISOR_NM: "",
                    }
                })
            }
            else {
                handleSetValidate("SUPERVISOR_ID", true);
                setSaveData(saveData => {
                    return {
                        ...saveData,
                        SUPERVISOR_NM: _fetchData,
                    }
                })
            }
        }
    }

    ///////Handle Validate
    const handleValidate = (type = "") => {
        let _result = true;

        if (isNullOrEmpty(saveData.CONT_CODE)) {
            handleSetValidate("CONT_CODE", false);
            _result = false;
        } else {
            handleSetValidate("CONT_CODE", true);
        }

        if (isNullOrEmpty(saveData.VISIT_PURPOSE)) {
            handleSetValidate("VISIT_PURPOSE", false);
            _result = false;
        } else {
            handleSetValidate("VISIT_PURPOSE", true);
        }

        if (isNullOrEmpty(vendorNumber) || vendorNumber < 0) {
            handleSetValidate("VENDOR_NUMBER", false);
            _result = false;
        } else {
            handleSetValidate("VENDOR_NUMBER", true);
        }

        if (isNullOrEmpty(saveData.SUPERVISOR_ID)) {
            handleSetValidate("SUPERVISOR_ID", false);
            _result = false;
        } else {
            handleSetValidate("SUPERVISOR_ID", true);
        }

        if (isNullOrEmpty(saveData.SUPERVISOR_PHONE)) {
            handleSetValidate("SUPERVISOR_PHONE", false);
            _result = false;
        } else {
            handleSetValidate("SUPERVISOR_PHONE", true);
        }

        if (type === "emp") {
            let _item = contList.filter(
                (item) =>
                    isNullOrEmpty(item.EMP_NAME) ||
                    isNullOrEmpty(item.EMP_BIRTHDATE) ||
                    isNullOrEmpty(item.EMP_CITIZEN_ID) ||
                    !(item.EMP_CITIZEN_ID.length === 16) ||
                    isNullOrEmpty(item.EMP_POSITION)
            );
            if (_item !== null && _item.length > 0) {
                _result = false;
            }
            setContList(
                contList.map((item) => {
                    let nextItem = item;

                    nextItem = {
                        ...nextItem,
                        EMP_NAME_VALID: !isNullOrEmpty(item.EMP_NAME),
                        EMP_CITIZEN_ID_VALID: !(isNullOrEmpty(item.EMP_CITIZEN_ID) || !(item.EMP_CITIZEN_ID.length === 16)),
                        EMP_BIRTHDATE_VALID: !isNullOrEmpty(item.EMP_BIRTHDATE),
                        EMP_POSITION_VALID: !isNullOrEmpty(item.EMP_POSITION),
                    };
                    return nextItem;
                })
            );
        }

        return _result;
    };

    const handleSetValidate = (name, value) => {
        setValid((prevData) => {
            return {
                ...prevData,
                [name]: {
                    validate: value,
                },
            };
        });
    };

    //Handle Employee List
    const handleEmpList = (
        id,
        type,
        event,
        value = "",
        cardStatus = ""
    ) => {
        if (type === "DELETE") {
            setLoading(loading => true);

            if (contList.length === 1) {
                let _listData = EmployeeParams(1);
                setLoading(loading => true);
                handleTimeout(300).then(() => {
                    setContList(contList => []);
                    setContList(contList => [...contList, _listData]);
                    setLoading(loading => false);
                })
            } else {
                let _listData = contList.filter(item => item.ID !== id);
                setContList(contList => _listData);
                setVendorNumber(vendorNumber => vendorNumber - 1);

                handleTimeout(50).then(() => {
                    setLoading(loading => false);
                });
            }
        }
        else {
            setContList(
                contList.map((item) => {
                    if (item.ID === id) {
                        let nextItem = item;

                        switch (type) {
                            case "EMP_NAME":
                                nextItem = {
                                    ...nextItem,
                                    EMP_NAME: event.target.value,
                                    EMP_NAME_VALID: !isNullOrEmpty(event.target.value),
                                };
                                break;
                            case "EMP_CITIZEN_ID":
                                nextItem = {
                                    ...nextItem,
                                    EMP_CITIZEN_ID: value,
                                    EMP_CITIZEN_ID_VALID: !(isNullOrEmpty(value) || !(value.length === 16)),
                                    SECURITY_CARD_YN: cardStatus,
                                };
                                break;
                            case "SECURITY_CARD_YN":
                                nextItem = {
                                    ...nextItem,
                                    SECURITY_CARD_YN: value,
                                };
                                break;
                            case "EMP_GENDER":
                                nextItem = {
                                    ...nextItem,
                                    EMP_GENDER: value,
                                    EMP_BIRTHDATE: "",
                                    EMP_BIRTHDATE_VALID: false,
                                };
                                break;
                            case "EMP_BIRTHDATE":
                                nextItem = {
                                    ...nextItem,
                                    EMP_BIRTHDATE: !isNullOrEmpty(value) ? getDateFormat(value) : "",
                                    EMP_BIRTHDATE_VALID: !isNullOrEmpty(value) ? true : false,
                                };
                                break;
                            case "EMP_POSITION":
                                nextItem = {
                                    ...nextItem,
                                    EMP_POSITION: value,
                                    EMP_POSITION_VALID: true,
                                };
                                break;
                            case "INSURANCE_IMG":
                            case "WORK_PLAN_IMG":
                            case "LISCENT_IMG":
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
        }

    };

    ///////Handle Row Height
    const handleRowHeight = () => {
        let _result = 135;

        if (contList.length === 1) {
            _result = 210;
        }

        if (width <= 1024 && width >= 991) {
            _result = 240;

            if (contList.length === 1) {
                _result = 320;
            }
        }

        if (width <= 768 && width >= 575) {
            _result = 290;

            if (contList.length === 1) {
                _result = 370;
            }
        }

        return _result;
    }

    ////////Button Upload
    async function getPosts(_req_no, _dateFrom = "", _dateTo = "") {
        let _count = 0;

        for (let iCount = 0; iCount < contList.length; iCount++) {
            try {
                let _empConfig = RequestCreateResultSaveParams();
                _empConfig.REQ_NO = _req_no;
                _empConfig.VISIT_START_DATE = isNullOrEmpty(_dateFrom) ? saveData.VISIT_START_DATE : _dateFrom;
                _empConfig.VISIT_END_DATE = isNullOrEmpty(_dateTo) ? saveData.VISIT_END_DATE : _dateTo;
                _empConfig.HOLI_INCLUDE = holiday ? "Y" : "N";
                _empConfig.EMP_NAME = removeVietnamese(contList[iCount].EMP_NAME);
                _empConfig.EMP_BIRTHDATE = contList[iCount].EMP_BIRTHDATE;
                _empConfig.EMP_GENDER = contList[iCount].EMP_GENDER ? "Male" : "Female";
                _empConfig.EMP_CITIZEN_ID = contList[iCount].EMP_CITIZEN_ID;
                _empConfig.EMP_POSITION = contList[iCount].EMP_POSITION;
                _empConfig.SECURITY_CARD_YN = contList[iCount].SECURITY_CARD_YN;
                _empConfig.CREATE_PROGRAM_ID = "CSM_SYSTEM";

                let uploadConfig = UploadRequestCreateResultSaveParams(_empConfig);

                let _result = await fetchPostData(RequestCreateResultSaveURL, uploadConfig);

                if (_result) {
                    _count++;
                }
            }
            catch {
                break;
            }
        }
        return _count === contList.length ? true : false;
    };

    //////Button Upload
    async function getPostsWorkLicense(_plant_cd, _req_no) {
        let _count = 0;
        let _newList = contList.filter(item => (item.JOB_LIST).length > 0)

        if(_newList.length > 0){
            for (let iCount = 0; iCount < _newList.length; iCount++) {
                try {
                    let _empConfig = UploadUserWorkLicesnseParams();
                    _empConfig.ARG_TYPE = "S";
                    _empConfig.ARG_PLANT_CD = _plant_cd;
                    _empConfig.ARG_REQ_NO = _req_no;
                    _empConfig.ARG_EMP_CITIZEN_ID = _newList[iCount].EMP_CITIZEN_ID;
                    _empConfig.ARG_JOB_CODE = (_newList[iCount].JOB_LIST).join(';');
                    _empConfig.ARG_JOB_DESC = removeVietnamese(_newList[iCount].JOB_DESC);
                    _empConfig.ARG_LICENSE_CODE = (_newList[iCount].DEGREE_LIST).join(';');
                    _empConfig.ARG_LICENSE_DESC = removeVietnamese(_newList[iCount].DEGREE_DESC);
    
                    let _result = await fetchPostData(UserJobLicenseSaveURL, _empConfig);
    
                    if (_result) {
                        _count++;
                    }
                }
                catch {
                    break;
                }
            }
            return _count === _newList.length ? true : false;
        }else{
            return true;
        }
    };

    ////////Button Upload
    async function getPostsEmpPaperWork(_req_no) {
        let _count = 0;
        let _empID = "";
        let _totalImage = 0;

        ////////Total Upload Image
        for (let iCount = 0; iCount < contList.length; iCount++) {
            if (contList[iCount].INSURANCE_IMG !== null && contList[iCount].INSURANCE_IMG.length > 0 &&
                typeof contList[0].INSURANCE_IMG[0] !== 'string') {
                _totalImage++;
            }

            if (contList[iCount].WORK_PLAN_IMG !== null && contList[iCount].WORK_PLAN_IMG.length > 0 &&
                typeof contList[0].WORK_PLAN_IMG[0] !== 'string') {
                _totalImage++;
            }

            if (contList[iCount].LISCENT_IMG !== null && contList[iCount].LISCENT_IMG.length > 0 &&
                typeof contList[0].LISCENT_IMG[0] !== 'string') {
                _totalImage++;
            }
        }

        for (let iCount = 0; iCount < contList.length; iCount++) {
            try {
                _empID = contList[iCount].EMP_CITIZEN_ID;

                //////Accident Insurance
                if (contList[iCount].INSURANCE_IMG !== null && contList[iCount].INSURANCE_IMG.length > 0 &&
                    typeof contList[0].INSURANCE_IMG[0] !== 'string') {
                    let _uploadImgConfig = {
                        INS_DATE: _req_no,
                        EMP_CITIZEN_ID: _empID,
                        IMAGE_DIV: "IAI",
                    };
                    let uploadConfig = UploadRequestPaperWorkImageParams(_uploadImgConfig, contList[iCount].INSURANCE_IMG[0]);
                    let _result = await fetchPostFormData(UploadRequestPaperWorkImageURL, uploadConfig);

                    if (_result) {
                        _count++;
                    }
                }
                //////Work Plan
                if (contList[iCount].WORK_PLAN_IMG !== null && contList[iCount].WORK_PLAN_IMG.length > 0 &&
                    typeof contList[0].WORK_PLAN_IMG[0] !== 'string') {
                    let _uploadImgConfig = {
                        INS_DATE: _req_no,
                        EMP_CITIZEN_ID: _empID,
                        IMAGE_DIV: "WKP",
                    };
                    let uploadConfig = UploadRequestPaperWorkImageParams(_uploadImgConfig, contList[iCount].WORK_PLAN_IMG[0]);
                    let _result = await fetchPostFormData(UploadRequestPaperWorkImageURL, uploadConfig);

                    if (_result) {
                        _count++;
                    }
                }
                //////Liscense
                if (contList[iCount].LISCENT_IMG !== null && contList[iCount].LISCENT_IMG.length > 0 &&
                    typeof contList[0].LISCENT_IMG[0] !== 'string') {
                    let _uploadImgConfig = {
                        INS_DATE: _req_no,
                        EMP_CITIZEN_ID: _empID,
                        IMAGE_DIV: "LSC",
                    };
                    let uploadConfig = UploadRequestPaperWorkImageParams(_uploadImgConfig, contList[iCount].LISCENT_IMG[0]);
                    let _result = await fetchPostFormData(UploadRequestPaperWorkImageURL, uploadConfig);

                    if (_result) {
                        _count++;
                    }
                }
            }
            catch {
                break;
            }
        }

        return _count === _totalImage ? true : false;
    };

    function toFindDuplicates(arry) {

        let resultToReturn = false;

        for (let i = 0; i < arry.length; i++) { // nested for loop
            for (let j = 0; j < arry.length; j++) {
                // prevents the element from comparing with itself
                if (i !== j) {
                    // check if elements' values are equal
                    if (arry[i].EMP_CITIZEN_ID === arry[j].EMP_CITIZEN_ID) {
                        // duplicate element present                                
                        resultToReturn = true;
                        // terminate inner loop
                        break;
                    }
                }
            }
            // terminate outer loop                                                                      
            if (resultToReturn) {
                break;
            }
        }

        return resultToReturn;
    }

    ///////Upload Register Data
    const handleUpload = async () => {
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("NEW_YN", location.pathname);
        if (!_validPermiss) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        ///////Check Valid Start/End Date
        let _validVisitDate = await handleValidVisitDate();
        if (!_validVisitDate) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("title_reg_fail"),
                text: t("swal_invalid_visit_date"),
            });
            return;
        }

        ///////Check Citizen ID
        let _validCitizenID = toFindDuplicates(contList);
        if (_validCitizenID) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("swal_duplicate"),
                text: t("swal_retype"),
            });
            return;
        }

        let _validate = handleValidate("emp");
        
        if (_validate && _validVisitDate) {
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
                    Swal.fire({
                        title: "Please wait!",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    let _isConnect = await fetchData(EmpPositionSelectURL, {
                        ARG_TYPE: "",
                        OUT_CURSOR: ""
                    });

                    if (_isConnect && _isConnect.length > 0) {
                        let requestConfig = UploadRequestCreateSaveParams(saveData);
                        let _fetchData = await fetchData(RequestCreateSaveURL, requestConfig);

                        if (_fetchData && _fetchData !== null && _fetchData.length > 0) {
                            let _req_no = _fetchData[0].REQ_NO;

                            //////Upload Paper Work Image First
                            getPostsEmpPaperWork(_req_no).then(async (res) => {
                                if (res) {
                                    //////Upload Empolyee List
                                    getPosts(_req_no).then(async (res) => {
                                        if (res) {
                                            //////Upload Empolyee Work Perform & License
                                            getPostsWorkLicense(saveData.PLANT_CD, _req_no).then(async (res) => {
                                                if(res){
                                                    /////Get Confirm Email Data
                                                    let _sendToData = await fetchData(GetSendEmailDataURL, {
                                                        ARG_TYPE: "",
                                                        ARG_REQ_NO: _req_no,
                                                        ARG_CONFIRM_STATUS: "",
                                                        OUT_CURSOR: ""
                                                    });

                                                    let _mailData = await fetchData(GetSendEmailDataURL, {
                                                        ARG_TYPE: "INFOR",
                                                        ARG_REQ_NO: _req_no,
                                                        ARG_CONFIRM_STATUS: "",
                                                        OUT_CURSOR: ""
                                                    });
                                        
                                                    if(_mailData !== null && _mailData.length > 0 && _sendToData !== null && _sendToData.length > 0){
                                                        _mailData = _mailData[0]
                                                        _sendToData = _sendToData[0].EMAIL
                                                        let _sendEmailPrams = SendEmailParams(_sendToData, _mailData, "REQ");
                                                    
                                                        /////Send Confirm Email
                                                        let _sendMail = await fetchPostData(SendEmailURL, _sendEmailPrams);

                                                        if (_sendMail) {
                                                            Swal.close();
                                                            Swal.fire({
                                                                position: "center",
                                                                icon: "success",
                                                                title: t("title_reg_success"),
                                                                showConfirmButton: false,
                                                                timer: 1500,
                                                            }).then(() => {
                                                                handleDefault();
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
                                                    }
                                                }
                                                else{
                                                    Swal.close();
                                                    Swal.fire({
                                                        icon: "error",
                                                        position: "center",
                                                        title: t("title_reg_fail"),
                                                        text: t("text_please_check_again"),
                                                    });
                                                }
                                            })
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
                                } else {
                                    Swal.close();
                                    Swal.fire({
                                        icon: "error",
                                        position: "center",
                                        title: t("title_reg_fail"),
                                        text: t("text_please_check_again"),
                                    });
                                }
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
                }
            })
        }
    }

    /////Check Valid Start-End Date
    const handleValidVisitDate = async () => {
        let _fetchData = await fetchData(RequestCheckURL, {
            ARG_TYPE: "Q",
            ARG_VISIT_START_DATE: saveData.VISIT_START_DATE,
            ARG_VISIT_END_DATE: saveData.VISIT_END_DATE,
            ARG_HOLI_INCLUDE: holiday ? "Y" : "N",
            OUT_CURSOR: ""
        });

        if (_fetchData !== null && _fetchData.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    //////Row Rendered Of React-Virtualized
    const rowRenderer = ({
        index, // Index of row
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        key, // Unique key within array of rendered rows
        parent, // Reference to the parent List (instance)
        style, // Style object to be applied to row (to position it);
    }) => (
        <Box key={key} style={style} sx={{ margin: '1px', paddingRight: '2px' }}>
            <VendorCard data={contList[index]}
                posData={posList}
                handleChange={handleEmpList}
                handleThumb={handleEmployeeImage}
                isUpdate={!isNullOrEmpty(updateData)}
                isLast={index === contList.length - 1 && contList.length > 1}
            />
        </Box>
    );

    //////Handle Employee Card Image
    const handleEmployeeImage = async (type, id) => {
        let _currentItem = contList.filter(item => item.ID === id);
        setModalData(modalData => _currentItem[0]);
        setModalType(modalType => type);
        setOpen(true);
    }

    const handleJobLicense = (id, jobList, jobDesc, licenseList, licenseDesc, thumbList) => {
        setContList(
            contList.map((item) => {
                if (item.ID === id) {
                    let nextItem = item;
                    nextItem = {
                        ...nextItem,
                        "LISCENT_IMG": thumbList,
                        "JOB_LIST": jobList,
                        "JOB_DESC": jobDesc,
                        "DEGREE_LIST": licenseList,
                        "DEGREE_DESC": licenseDesc,
                    };
                    return nextItem;
                } else {
                    return item;
                }
            })
        );
    }

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
                className="s-register"
            >
                {!isMobile &&
                    <>
                        <Box ref={refTop}>
                            <Box style={{ position: 'relative' }}>
                                <Typography variant="h5" className="s-title">
                                    {t('title_contract_reg')}
                                </Typography>
                                {isNullOrEmpty(updateData) &&
                                    <Box sx={{ position: 'absolute', top: -1, right: 0, }}>
                                        <Tooltip title={t('title_history_list')} arrow placement="left">
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                height: 40,
                                                width: 42,
                                                minWidth: "auto",
                                                textTransform: "none",
                                                fontWeight: '600',
                                                fontSize: '16px',
                                                boxShadow: 'none',
                                                padding: 0,
                                                background: "#b4c4e4",
                                                color: "#3f51b5",
                                                borderRadius: "50%",
                                                "&:hover": {
                                                    background: "#1c366b",
                                                    color: "#fff"
                                                }
                                            }}
                                            onClick={() => setHistory(true)}
                                        >
                                            <ManageHistoryIcon sx={{ fontSize: 24 }} />
                                        </Button>
                                    </Tooltip>
                                    </Box>
                                }
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6} md={6} lg={i18_Value === "indo" ? 5 : 6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >{t('frm_vendor')}</Typography>
                                            <Select
                                                isDisabled={!isNullOrEmpty(updateData)}
                                                className="bg-white"
                                                value={saveData?.CONT_CODE ? vendorList.filter(item => item.value === saveData?.CONT_CODE) : ""}
                                                onChange={(e) => handleChangeSelect("VENDOR", e)}
                                                name="VENDOR"
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
                                                        borderColor: "#b8b6b7",
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        zIndex: 9999,
                                                        fontSize: 17,
                                                    }),
                                                }}
                                            />
                                            {!valid.CONT_CODE.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={i18_Value === "indo" ? 7 : 6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >{t('frm_address')}</Typography>
                                            <TextField
                                                inputProps={{ inputMode: 'text' }}
                                                value={saveData ? saveData.CONT_ADDRESS : ""}
                                                sx={{ background: "#f8f6f7" }}
                                                className="b-input"
                                                disabled
                                                fullWidth
                                                placeholder={t('plholder_address')}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <LocationOnIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={6} lg={i18_Value === "indo" ? 5 : 6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >{t('frm_phone')}</Typography>
                                            <TextField
                                                inputProps={{ inputMode: 'text' }}
                                                value={saveData ? saveData.CONT_PHONE : ""}
                                                sx={{ background: "#f8f6f7" }}
                                                className="b-input"
                                                disabled
                                                fullWidth
                                                placeholder="000-000-00000"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <CallIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={8} md={6} lg={i18_Value === "indo" ? 7 : 6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >Email</Typography>
                                            <TextField
                                                inputProps={{ inputMode: 'text' }}
                                                value={saveData ? saveData.CONT_EMAIL : ""}
                                                sx={{ background: "#f8f6f7" }}
                                                className="b-input"
                                                disabled
                                                fullWidth
                                                placeholder={t('plholder_email')}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <EmailIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={6} lg={i18_Value === "indo" ? 5 : 6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >{t('frm_number_people')}</Typography>
                                            <TextField
                                                name="VENDOR_NUMBER"
                                                disabled={!isNullOrEmpty(updateData)}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                value={vendorNumber}
                                                sx={{ background: "#f8f6f7" }}
                                                onChange={(event) => {
                                                    setVendorNumber(event.target.value);
                                                    handleSetValidate("VENDOR_NUMBER", isNullOrEmpty(event.target.value) ? false : true);
                                                }}
                                                onFocus={(e) => {
                                                    setVendorNumber("");
                                                }}
                                                onBlur={(event) => handleShowList(event.target.value)}
                                                className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                                fullWidth
                                                placeholder={t('plholder_number_people')}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <GroupIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {!valid.VENDOR_NUMBER.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                                        </Grid>
                                        <Grid item xs={8} md={6} lg={i18_Value === "indo" ? 7 : 6}>
                                            <Box style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                                <Typography
                                                    style={{
                                                        fontWeight: 600,
                                                        color: '#333',
                                                        marginBottom: 3,
                                                        fontSize: 16,
                                                    }}
                                                >{t('frm_strat_end')}</Typography>
                                                <FormControlLabel
                                                    style={{
                                                        margin: 0,
                                                    }}
                                                    control={<Checkbox
                                                        //disabled={!isNullOrEmpty(updateData)}
                                                        checked={holiday}
                                                        onChange={(e) => setHoliday(holiday => e.target.checked)}
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, '&.Mui-checked': { color: '#3f51b5', } }}
                                                        style={{ padding: 5 }} />}
                                                    label={
                                                        <Typography
                                                            sx={{
                                                                paddingX: 1,
                                                                borderRadius: "5px",
                                                                fontWeight: "600",
                                                                fontSize: 15,
                                                                color: '#3f51b5',
                                                                fontStyle: 'italic',
                                                                padding: 0,
                                                            }}
                                                        >
                                                            {t('include_holiday')}
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                            <DateRangePicker
                                                disabled={!isNullOrEmpty(updateData)}
                                                value={date}
                                                onChange={(e) => handleChangeSelect("START_END_YMD", e)}
                                                disabledDate={date => isBefore(date, getDateAfter())}
                                                block
                                                showOneCalendar
                                                className={isNullOrEmpty(updateData) ? "" : "bg-disable"}
                                                size="lg" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4} md={3} lg={3.5}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                    textTransform: 'capitalize'
                                                }}
                                            >{t('frm_pic')}</Typography>
                                            <TextField
                                                inputProps={{ inputMode: 'text' }}
                                                disabled={!isNullOrEmpty(updateData)}
                                                value={saveData ? saveData.SUPERVISOR_ID : ""}
                                                sx={{ background: "#f8f6f7" }}
                                                className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                                fullWidth
                                                onChange={(event) => {
                                                    handleChangeSelect("SUPERVISOR_ID", event);
                                                }}
                                                onBlur={(event) => {
                                                    handleChangeSelect("SUPERVISOR_ID_VALID", event);
                                                }}
                                                onKeyDown={handleKeyDown}
                                                placeholder={t('emp_id')}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <PersonIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {!valid.SUPERVISOR_ID.validate && isNullOrEmpty(saveData?.SUPERVISOR_ID) &&
                                                <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                                            }
                                            {!valid.SUPERVISOR_ID.validate && !isNullOrEmpty(saveData?.SUPERVISOR_ID) &&
                                                <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_id_required')}</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={4} md={5} lg={5}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                    textTransform: 'capitalize',
                                                    opacity: 0
                                                }}
                                            >Name</Typography>
                                            <TextField
                                                inputProps={{ inputMode: 'text' }}
                                                value={saveData ? saveData.SUPERVISOR_NM : ""}
                                                sx={{ background: "#f8f6f7" }}
                                                className="b-input"
                                                fullWidth
                                                disabled
                                                placeholder="Full Name"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <PermContactCalendarIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {!valid.SUPERVISOR_ID.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                                        </Grid>
                                        <Grid item xs={4} md={4} lg={3.5}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                    textTransform: 'capitalize',
                                                    opacity: 0,
                                                }}
                                            >Phone Number</Typography>
                                            <TextField
                                                type='number'
                                                disabled={!isNullOrEmpty(updateData)}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                value={saveData ? saveData.SUPERVISOR_PHONE : ""}
                                                sx={{ background: "#f8f6f7" }}
                                                className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                                fullWidth
                                                onChange={(event) => {
                                                    handleChangeSelect("SUPERVISOR_PHONE", event);
                                                }}
                                                placeholder={t('frm_phone')}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <PhoneIphoneIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {!valid.SUPERVISOR_PHONE.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginTop: 5,
                                                    fontSize: 16,
                                                }}
                                            >{t('frm_purpose')}</Typography>
                                            <TextField
                                                disabled={!isNullOrEmpty(updateData)}
                                                inputProps={{ inputMode: 'text' }}
                                                value={saveData ? saveData.VISIT_PURPOSE : ""}
                                                sx={{ background: "#f8f6f7", }}
                                                onChange={(event) => {
                                                    handleChangeSelect("PURPOSE", event)
                                                }}
                                                rows={4}
                                                multiline={true}
                                                className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                                fullWidth
                                                placeholder={t('plholder_purpose')}
                                            />
                                            {!valid.VISIT_PURPOSE.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    marginTop: 5,
                                                    fontSize: 16,
                                                }}
                                            >{t('work_pos')}</Typography>
                                            <TextField
                                                disabled={!isNullOrEmpty(updateData)}
                                                inputProps={{ inputMode: 'text' }}
                                                value={saveData ? saveData.VISIT_WORKPLACE : ""}
                                                sx={{ background: "#f8f6f7", }}
                                                onChange={(event) => {
                                                    handleChangeSelect("VISIT_WORKPLACE", event)
                                                }}
                                                rows={4}
                                                multiline={true}
                                                className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                                fullWidth
                                                placeholder={t('plholder_work_loc')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box ref={refMid} style={{ position: 'relative', marginTop: 10, }}>
                                <Typography variant="h5" className="s-title">
                                    {t('title_list')}
                                </Typography>
                                {!isNullOrEmpty(updateData) &&
                                    <Box sx={{ position: 'absolute', top: -1, right: 0, }}>
                                        <Tooltip title={t('add')} arrow placement="top">
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    height: 40,
                                                    width: 42,
                                                    minWidth: "auto",
                                                    textTransform: "none",
                                                    fontWeight: '600',
                                                    fontSize: '16px',
                                                    boxShadow: 'none',
                                                    padding: 0,
                                                    background: "#b4c4e4",
                                                    color: "#3f51b5",
                                                    borderRadius: "50%",
                                                    "&:hover": {
                                                        background: "#1c366b",
                                                        color: "#fff"
                                                    }
                                                }}
                                                onClick={() => handleAdd()}
                                            >
                                                <PersonAddIcon sx={{ fontSize: 24 }} />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                }
                                {isNullOrEmpty(updateData) && 
                                    <>
                                        <Stack flexDirection="row" alignItems="center" gap={1} sx={{ position: 'absolute', top: -1, right: 0, }}>
                                            <Tooltip title={t('search_people')} arrow placement="top">
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    sx={{
                                                        height: 40,
                                                        width: 42,
                                                        minWidth: "auto",
                                                        textTransform: "none",
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        boxShadow: 'none',
                                                        padding: 0,
                                                        background: "#b4c4e4",
                                                        color: "#3f51b5",
                                                        borderRadius: "50%",
                                                        "&:hover": {
                                                            background: "#1c366b",
                                                            color: "#fff"
                                                        }
                                                    }}
                                                    onClick={() => setOpenModal(true)}
                                                >
                                                    <PersonSearchIcon sx={{ fontSize: 24 }} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title={t('add')} arrow placement="top">
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    sx={{
                                                        height: 40,
                                                        width: 42,
                                                        minWidth: "auto",
                                                        textTransform: "none",
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        boxShadow: 'none',
                                                        padding: 0,
                                                        background: "#b4c4e4",
                                                        color: "#3f51b5",
                                                        borderRadius: "50%",
                                                        "&:hover": {
                                                            background: "#1c366b",
                                                            color: "#fff"
                                                        }
                                                    }}
                                                    onClick={() => handleAdd()}
                                                >
                                                    <PersonAddIcon sx={{ fontSize: 24 }} />
                                                </Button>
                                            </Tooltip>
                                        </Stack>
                                    </>
                                }
                            </Box>
                        </Box>
                        <Box style={{ marginTop: 5, height: `${comHeight < 467 ? 400 : (comHeight - 50)}px` }}>
                            {!loading &&
                                <AutoSizer>
                                    {({ height, width }) => {
                                        return (
                                            <List
                                                height={height}
                                                rowHeight={handleRowHeight}
                                                rowRenderer={rowRenderer}
                                                rowCount={contList.length}
                                                width={width}
                                                overscanRowCount={5}
                                            />
                                        );
                                    }}
                                </AutoSizer>
                            }
                            {loading &&
                                <Box>
                                    <Skeleton variant="rounded" sx={{ marginBottom: isMobile ? '8px' : '10px' }} height={isMobile ? 40 : 80} />
                                    <Skeleton variant="rounded" sx={{ marginBottom: isMobile ? '8px' : '10px' }} height={isMobile ? 40 : 80} />
                                    <Skeleton variant="rounded" sx={{ marginBottom: isMobile ? '8px' : '10px' }} height={isMobile ? 40 : 80} />
                                    <Skeleton variant="rounded" sx={{ marginBottom: isMobile ? '8px' : '10px' }} height={isMobile ? 40 : 80} />
                                    <Skeleton variant="rounded" sx={{ marginBottom: isMobile ? '8px' : '10px' }} height={isMobile ? 40 : 80} />
                                </Box>
                            }
                        </Box>
                        {!loading &&
                            <Stack flexDirection="row" justifyContent="flex-end" gap={1} sx={{ marginY: "10px" }}>
                                <Button
                                    fullWidth
                                    endIcon={isNullOrEmpty(updateData) ? <CreateIcon /> : <UpdateIcon />}
                                    color="success"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        height: 40,
                                        maxWidth: 140,
                                        textTransform: "none",
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        boxShadow: 'none',
                                    }}
                                    onClick={() => {
                                        if (isNullOrEmpty(updateData)) {
                                            handleUpload();
                                        }
                                        else {
                                            handleUpdate();
                                        }
                                    }}
                                >
                                    {isNullOrEmpty(updateData) ? t('btn_register') : t('update')}
                                </Button>
                                {!(isNullOrEmpty(updateData)) &&
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            height: 40,
                                            maxWidth: 140,
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
                                        onClick={() => {
                                            setUpdateData(updateData => null);
                                            handleDefault();
                                        }}
                                    >
                                        {t('swal_cancel')}
                                    </Button>
                                }
                            </Stack>
                        }
                    </>
                }
                {isMobile &&
                    <>
                        <Typography variant="h5" className="s-title">
                            {t('title_contract_reg')}
                        </Typography>
                        <Grid container spacing={1} sx={{ marginBottom: '10px' }}>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('frm_vendor')}</Typography>
                                <Select
                                    isDisabled={!isNullOrEmpty(updateData)}
                                    value={saveData?.CONT_CODE ? vendorList.filter(item => item.value === saveData?.CONT_CODE) : ""}
                                    onChange={(e) => handleChangeSelect("VENDOR", e)}
                                    name="VENDOR"
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
                                            borderColor: "#b8b6b7",
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999,
                                            fontSize: 17,
                                        }),
                                    }}
                                />
                                {!valid.CONT_CODE.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
                            {checked &&
                                <>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                color: '#333',
                                                marginBottom: 3,
                                                fontSize: 16,
                                            }}
                                        >{t('frm_address')}</Typography>
                                        <TextField
                                            inputProps={{ inputMode: 'text' }}
                                            value={saveData ? saveData.CONT_ADDRESS : ""}
                                            sx={{ background: "#f8f6f7" }}
                                            className="b-input"
                                            disabled
                                            fullWidth
                                            placeholder={t('plholder_address')}
                                        />
                                    </Grid>
                                    <Grid item xs={5} md={6} lg={4}>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                color: '#333',
                                                marginBottom: 3,
                                                fontSize: 16,
                                            }}
                                        >{t('frm_phone')}</Typography>
                                        <TextField
                                            inputProps={{ inputMode: 'text' }}
                                            value={saveData ? saveData.CONT_PHONE : ""}
                                            sx={{ background: "#f8f6f7" }}
                                            className="b-input"
                                            disabled
                                            fullWidth
                                            placeholder="000-000-00000"
                                        />
                                    </Grid>
                                    <Grid item xs={7} md={6} lg={4}>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                color: '#333',
                                                marginBottom: 3,
                                                fontSize: 16,
                                            }}
                                        >Email</Typography>
                                        <TextField
                                            inputProps={{ inputMode: 'text' }}
                                            value={saveData ? saveData.CONT_EMAIL : ""}
                                            sx={{ background: "#f8f6f7" }}
                                            className="b-input"
                                            disabled
                                            fullWidth
                                            placeholder="exampale@email.com"
                                        />
                                    </Grid>
                                </>
                            }
                            <Grid item xs={12} md={4} lg={checked ? 4 : 6}>
                                <Box style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <Typography
                                        style={{
                                            fontWeight: 600,
                                            color: '#333',
                                            marginBottom: 3,
                                            fontSize: 16,
                                        }}
                                    >{t('frm_strat_end')}</Typography>
                                    <FormControlLabel
                                        style={{
                                            margin: 0,
                                        }}
                                        control={<Checkbox
                                            //disabled={!isNullOrEmpty(updateData)}
                                            checked={holiday}
                                            onChange={(e) => setHoliday(holiday => e.target.checked)}
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, '&.Mui-checked': { color: '#3f51b5', } }}
                                            style={{ padding: 5 }} />}
                                        label={
                                            <Typography
                                                sx={{
                                                    paddingX: 1,
                                                    borderRadius: "5px",
                                                    fontWeight: "600",
                                                    fontSize: 16,
                                                    color: '#3f51b5',
                                                    fontStyle: 'italic',
                                                    padding: 0,
                                                }}
                                            >
                                                {t('include_holiday')}
                                            </Typography>
                                        }
                                    />
                                </Box>
                                <DateRangePicker
                                    disabled={!isNullOrEmpty(updateData)}
                                    value={date}
                                    onChange={(e) => handleChangeSelect("START_END_YMD", e)}
                                    disabledDate={date => isBefore(date, getDateAfter())}
                                    block
                                    showOneCalendar
                                    className={isNullOrEmpty(updateData) ? "" : "bg-disable"}
                                    size="lg" />
                            </Grid>
                            <Grid item xs={6} md={3} lg={3.5}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                        textTransform: 'capitalize'
                                    }}
                                >{t('frm_pic')}</Typography>
                                <TextField
                                    disabled={!isNullOrEmpty(updateData)}
                                    inputProps={{ inputMode: 'text' }}
                                    value={saveData ? saveData.SUPERVISOR_ID : ""}
                                    sx={{ background: "#f8f6f7" }}
                                    className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                    fullWidth
                                    onChange={(event) => {
                                        handleChangeSelect("SUPERVISOR_ID", event);
                                    }}
                                    onBlur={(event) => {
                                        handleChangeSelect("SUPERVISOR_ID_VALID", event);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('emp_id')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PersonIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {!valid.SUPERVISOR_ID.validate && isNullOrEmpty(saveData?.SUPERVISOR_ID) &&
                                    <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                                }
                                {!valid.SUPERVISOR_ID.validate && !isNullOrEmpty(saveData?.SUPERVISOR_ID) &&
                                    <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_id_required')}</Typography>
                                }
                            </Grid>
                            <Grid item xs={6} md={4} lg={3.5}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                        textTransform: 'capitalize',
                                        opacity: 0,
                                    }}
                                >Phone Number</Typography>
                                <TextField
                                    disabled={!isNullOrEmpty(updateData)}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    value={saveData ? saveData.SUPERVISOR_PHONE : ""}
                                    sx={{ background: "#f8f6f7" }}
                                    className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                    fullWidth
                                    onChange={(event) => {
                                        handleChangeSelect("SUPERVISOR_PHONE", event);
                                    }}
                                    placeholder={t('frm_phone')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PhoneIphoneIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {!valid.SUPERVISOR_PHONE.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={5} lg={5}>
                                <TextField
                                    inputProps={{ inputMode: 'text' }}
                                    value={saveData ? saveData.SUPERVISOR_NM : ""}
                                    sx={{ background: "#f8f6f7" }}
                                    className="b-input"
                                    fullWidth
                                    disabled
                                    placeholder="Full Name"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PermContactCalendarIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {!valid.SUPERVISOR_ID.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={6} lg={12}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('frm_purpose')}</Typography>
                                <TextField
                                    disabled={!isNullOrEmpty(updateData)}
                                    inputProps={{ inputMode: 'text' }}
                                    value={saveData ? saveData.VISIT_PURPOSE : ""}
                                    sx={{ background: "#f8f6f7", }}
                                    onChange={(event) => {
                                        handleChangeSelect("PURPOSE", event)
                                    }}
                                    rows={2}
                                    multiline={true}
                                    className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                    fullWidth
                                    placeholder={t('plholder_purpose')}
                                />
                                {!valid.VISIT_PURPOSE.validate && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginTop: 5,
                                        fontSize: 16,
                                    }}
                                >{t('work_pos')}</Typography>
                                <TextField
                                    disabled={!isNullOrEmpty(updateData)}
                                    inputProps={{ inputMode: 'text' }}
                                    value={saveData ? saveData.VISIT_WORKPLACE : ""}
                                    sx={{ background: "#f8f6f7", }}
                                    onChange={(event) => {
                                        handleChangeSelect("VISIT_WORKPLACE", event)
                                    }}
                                    rows={2}
                                    multiline={true}
                                    className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                    fullWidth
                                    placeholder={t('plholder_work_loc')}
                                />
                            </Grid>
                            <Grid item xs={6} md={6} lg={6}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('frm_number_people')}</Typography>
                                <TextField
                                    disabled={!isNullOrEmpty(updateData)}
                                    name="VENDOR_NUMBER"
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    value={vendorNumber}
                                    sx={{ background: "#f8f6f7" }}
                                    onChange={(event) => {
                                        setVendorNumber(event.target.value);
                                        handleSetValidate("VENDOR_NUMBER", isNullOrEmpty(event.target.value) ? false : true);
                                    }}
                                    onFocus={(e) => {
                                        setVendorNumber("");
                                        setContList(contList => []);
                                    }}
                                    className={isNullOrEmpty(updateData) ? "b-input bg-white" : "b-input"}
                                    fullWidth
                                    placeholder={t('plholder_number_people')}
                                />
                                {!valid.VENDOR_NUMBER.validate &&
                                    <Typography className='b-validate'>
                                        <HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}
                                    </Typography>
                                }
                            </Grid>
                            <Grid item xs={6} md={2} lg={6} style={{ display: 'flex', alignItems: `${valid.VENDOR_NUMBER.validate ? 'flex-end' : 'center'}` }}>
                                {isNullOrEmpty(updateData) &&
                                    <Button
                                        endIcon={<ArrowForwardIcon />}
                                        fullWidth
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        sx={{
                                            minHeight: 47,
                                            textTransform: "none",
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            boxShadow: 'none',
                                        }}
                                        onClick={handleRegister}
                                    >
                                        {t('continue')}
                                    </Button>
                                }
                                {!isNullOrEmpty(updateData) &&
                                    <Button
                                        fullWidth
                                        endIcon={<PersonAddIcon />}
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        sx={{
                                            height: 47,
                                            textTransform: "none",
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            boxShadow: 'none',
                                        }}
                                        onClick={() => handleAdd()}
                                    >
                                        {t('add')}
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                        {contList != null && contList.length > 0 &&
                            <Box style={{ marginTop: '5px' }}>
                                <Grid container spacing={1}>
                                    {
                                        contList.map((item, index) => (
                                            <Grid item xs={12} sm={12} md={12} lg={12} key={item.ID}>
                                                <VendorCard
                                                    data={item}
                                                    posData={posList}
                                                    handleChange={handleEmpList}
                                                    handleThumb={handleEmployeeImage}
                                                    isUpdate={!isNullOrEmpty(updateData)} />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                                <Stack flexDirection="row" justifyContent="flex-end" gap={1} sx={{ marginTop: "10px", paddingBottom: "15px" }}>
                                    <Button
                                        fullWidth
                                        endIcon={isNullOrEmpty(updateData) ? <CreateIcon /> : <UpdateIcon />}
                                        color="success"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            height: 47,
                                            width: "50%",
                                            textTransform: "none",
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            boxShadow: 'none',
                                        }}
                                        onClick={() => {
                                            if (isNullOrEmpty(updateData)) {
                                                handleUpload();
                                            }
                                            else {
                                                handleUpdate();
                                            }
                                        }}
                                    >
                                        {isNullOrEmpty(updateData) ? t('btn_register') : t('update')}
                                    </Button>
                                    {!(isNullOrEmpty(updateData)) &&
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                height: 47,
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
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                                setUpdateData(updateData => null);
                                                handleDefault();
                                            }}
                                        >
                                            {t('swal_cancel')}
                                        </Button>
                                    }
                                </Stack>
                            </Box>
                        }
                    </>
                }
            </Stack>
            {isMobile &&
                <>
                    <Stack gap={1} sx={{ position: "fixed", bottom: 70, right: 10, zIndex: 99 }}>
                        <Fab sx={{background: "#3f51b5"}}
                            size="large"
                            color="primary"
                            aria-label="add"
                            onClick={() => setHistory(true)}
                        >
                            <ManageHistoryIcon />
                        </Fab>
                        <Fab sx={{background: "#3f51b5"}}
                            size="large"
                            color="primary"
                            aria-label="add"
                            onClick={() => setOpenModal(true)}
                        >
                            <PersonSearchIcon />
                        </Fab>
                    </Stack>
                    
                </>
            }
            <UpdateSheet open={history} handleClose={handleHistory} handleSelect={handleSearchUpdate} />
            <UploadThumbModal open={open} type={modalType} data={modalData} handleChange={handleEmpList} handleJobLicense={handleJobLicense} handleClose={handleClose} />
            <SelectEmpModal open={openModal} handleClose={() => setOpenModal(false)} vendorList={vendorList} contList={contList} handleChange={handleSearchPeople} />
        </Container>
    );
}