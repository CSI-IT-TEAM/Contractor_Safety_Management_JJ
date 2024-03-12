import {
    Box,
    Container,
    Typography,
    Stack,
    Grid,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Button,
    TextField,
    Skeleton,
    Divider,
} from "@mui/material";
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import Sheet from "react-modal-sheet";
import { DatePicker } from "rsuite";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ImageGallery from "react-image-gallery";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Uploader } from "rsuite";
import {
    InspectChecklistSelectURL,
    ResultItemSaveURL,
    RequestUpdateResultSaveURL,
    InspecUploadImageURL,
    InspectImgUploadSelectURL,
    EmployeeBlacklistUpdateURL,
    WorkerResultUpdateURL,
} from "../../api";
import {
    InspectSearchParams,
    InspecUploadImageParams,
} from "../../data/configParams";
import {
    UploadResultItemSaveParams,
    InspecUploadImageSaveParams,
    UploadWorkerResultUpdateParams
} from "../../data/uploadParams";
import {
    fetchData,
    fetchPostData,
    getDateFormat,
    isNullOrEmpty,
    getPageIns,
    fetchPostFormData,
    handleTimeout,
    getUserPermission,
    getPageType,
    getDateFormatYMD,
    getUserPermissOnPage,
} from "../../functions";
import {
    removeVietnamese,
    UploadRequestUpdateResultSaveParams,
    UploadEmployeeBlacklistUpdateParams,
} from "../../data/uploadParams";

import "./index.scss";
import EmptyCard from "../../components/Card/EmptyCard";
import ChecklistCard from "../../components/Card/ChecklistCard";
import InspectEmpCard from "../../components/Card/InspectEmpCard";
import InspecRow from "../../components/Table/InspecRow";
import InspecHeader from "../../components/Table/InspecHeader";
import TextInput from "../../components/Input/Text/TextInput";
import FilterInput from "../../components/Input/Filter/FilterInput";

import Fab from "@mui/material/Fab";
import FilterIcon from "@mui/icons-material/Filter";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SyncIcon from "@mui/icons-material/Sync";
import CreateIcon from "@mui/icons-material/Create";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import moment from "moment";

const width = window.innerWidth;
const height = window.innerHeight;

export default function InspectionChecklistPage() {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;
    const sheetHeight = height * 0.9;

    /////Init Variables
    const { t } = useTranslation();
    const refTop = useRef(null);
    const [comHeight, setComHeight] = useState(0);

    /////Open Sheet
    const [isOpen, setOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    /////Variables
    const [checklist, setChecklist] = useState([]);
    const [vendorList, setVendorList] = useState(null);
    const [purposeList, setPurposeList] = useState(null);
    const [statusList, setStatusList] = useState(null);
    const [searchConfig, setSearchConfig] = useState(null);
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [visitorID, setvisitorID] = useState("");
    //////Selected Employee
    const [selectedID, setSelectedID] = useState("");
    const [selectedName, setSelectedName] = useState("");

    //////Upload Images
    const [thumbList, setThumbList] = useState([]);
    const [selectedReq, setSelectedReq] = useState("");
    const [isUpload, setIsUpload] = useState(false);
    const [upComment, setUpComment] = useState("");
    const [validComment, setValidComment] = useState(true);

    /////Location
    const [sTitle, setsTitle] = useState("Safety inspection in Security Gate");
    const [fIcon, setFIcon] = useState(false);
    const [userPermiss, setUserPermiss] = useState(true);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [disableReg, setDisableReg] = useState(false);

    //Phuoc Version
    const [EmpSelectData, setEmpSelectData] = useState([]);
    const location = useLocation();

    /////Filter Data
    const [search, setSearch] = useState("");

    /////Page Location
    const pageLocation = getPageIns(location);

    const RouterChecking = (location) => {
        switch (location) {
            case "/rsm/inspection":
                setsTitle("RSM");
                setFIcon((fIcon) => true);
                break;
            case "/dept/inspection":
                setsTitle("Workshop");
                setFIcon((fIcon) => true);
                break;
            default:
                setsTitle("Security Gate");
                setFIcon((fIcon) => false);
                break;
        }
    };

    useLayoutEffect(() => {
        setComHeight(height - refTop.current.offsetHeight - 110);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNAClick = () => {
        const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

        if (
            pageLocation === "1" &&
            userData.Permission === "SCR" &&
            EmpSelectData.CHECKED_YN !== "Y" && !(EmpSelectData.IS_VACATION === "Y")
        ) {
            setChecklist(
                checklist.map((item) => {
                    let nextItem = item;
                    nextItem = {
                        ...nextItem,
                        ITEM_RESULT: item.ITEM_RESULT === "" ? "NA" : item.ITEM_RESULT,
                    };
                    return nextItem;
                })
            );
        }
    };

    const onChange = useCallback((value, prevValue) => {
        setSearchData(searchData => searchData.map((item, index) => {
            return item.DISTINCT_ROW === value ? {
                ...item,
                SELECTED_YN: "Y"
            } : item.DISTINCT_ROW === prevValue ? {
                ...item,
                SELECTED_YN: "N"
            }: item;
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    ///////Handle Toggle Collapse
    const handleToggle = async (
        item,
        distinctRow,
        reqNo,
        citizenID,
        isCheckbox = false
    ) => {
        ////// Check Out
        if(distinctRow.includes("CHECK_OUT") && item.CHECKED_YN === "Y"){
            handleEmpAddInforCheck("CHECK_OUT", !isNullOrEmpty(item.INS_1_OUT_DT), item);
        }else{
            setEmpSelectData(EmpSelectData => item);
            setvisitorID(visitorID => isNullOrEmpty(item.VISITOR_ID) ? "" : item.VISITOR_ID);
            onChange(distinctRow.replace("_CHECK_OUT",""), selectedID);
            setSelectedID((selectedID) => distinctRow.replace("_CHECK_OUT",""));
    
            // if (distinctRow !== selectedID) {
            let _fetchData = await fetchData(
                InspectChecklistSelectURL,
                seacrhParams(
                    "Q_EMP_CHECKLIST",
                    searchConfig.PLANT_CD,
                    searchConfig.DATE,
                    searchConfig.DEPT_CD,
                    searchConfig.CONT_CODE,
                    reqNo,
                    citizenID,
                    searchConfig.PERMISSION,
                    getPageIns(location) !== "2" ? "1" : getPageIns(location)
                )
            );
    
            if (_fetchData && _fetchData.length > 0) {
                setChecklist(
                    checklist.map((item) => {
                        let nextItem = item;
                        let matchItem = _fetchData.filter(
                            (data) => data.ITEM_CODE === nextItem.ITEM_CODE
                        )[0];
    
                        nextItem = {
                            ...nextItem,
                            COL_QTY: pageLocation === "1" ? nextItem.COL_QTY : matchItem.COL_QTY,
                            ROW_NO: pageLocation === "1" ? nextItem.ROW_NO : matchItem.ROW_NO,
                            REQ_NO: reqNo,
                            EMP_CITIZEN_ID: citizenID,
                            WORK_DATE: searchConfig.DATE,
                            INS_SEQ: matchItem.INS_SEQ,
                            ITEM_RESULT: isNullOrEmpty(matchItem.ITEM_RESULT) ? "" : matchItem.ITEM_RESULT,
                            ITEM_RS_TEMP: matchItem.ITEM_RS_TEMP,
                            ITEM_COMMENT: isNullOrEmpty(matchItem.ITEM_COMMENT) ? "" : matchItem.ITEM_COMMENT,
                            INS_IMAGE_PATH: isNullOrEmpty(matchItem.INS_IMAGE_PATH) ? "" : matchItem.INS_IMAGE_PATH,
                        };
    
                        return nextItem;
                    })
                );
            } else {
                Swal.fire({
                    icon: "error",
                    position: "center",
                    title: t("title_something_wrong"),
                    text: t("text_connect_again"),
                });
            }
            // }
        }
    };

    /////////Mobile Version
    const handleToggleMobile = async (item, distinctRow, reqNo, citizenID) => {
        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams(
                "Q_EMP_CHECKLIST",
                searchConfig.PLANT_CD,
                searchConfig.DATE,
                searchConfig.DEPT_CD,
                searchConfig.CONT_CODE,
                reqNo,
                citizenID,
                searchConfig.PERMISSION,
                getPageIns(location) !== "2" ? "1" : getPageIns(location)
            )
        );

        if (_fetchData !== null && _fetchData.length > 0) {
            setChecklist(
                checklist.map((item) => {
                    let nextItem = item;
                    let matchItem = _fetchData.filter(
                        (data) => data.ITEM_CODE === nextItem.ITEM_CODE
                    )[0];

                    nextItem = {
                        ...nextItem,
                        REQ_NO: reqNo,
                        EMP_CITIZEN_ID: citizenID,
                        WORK_DATE: searchConfig.DATE,
                        INS_SEQ: matchItem.INS_SEQ,
                        ITEM_RESULT:
                            isNullOrEmpty(matchItem.ITEM_RESULT) &&
                                getPageIns(location) === "1"
                                ? ""
                                : matchItem.ITEM_RESULT,
                        ITEM_RS_TEMP: matchItem.ITEM_RS_TEMP,
                        ITEM_COMMENT: isNullOrEmpty(matchItem.ITEM_COMMENT)
                            ? ""
                            : matchItem.ITEM_COMMENT,
                        INS_IMAGE_PATH: isNullOrEmpty(matchItem.INS_IMAGE_PATH)
                            ? ""
                            : matchItem.INS_IMAGE_PATH,
                    };

                    return nextItem;
                })
            );

            setOpen((open) => true);
            setEmpSelectData(EmpSelectData => item);
            setvisitorID(visitorID => isNullOrEmpty(item.VISITOR_ID) ? "" : item.VISITOR_ID);

            let _selectName = searchData.filter(
                (item) => item.DISTINCT_ROW === distinctRow
            )[0].EMP_NAME;
            onChange(distinctRow, selectedID);
            setSelectedID((selectedID) => distinctRow);
            setSelectedName((selectedID) => _selectName);
        } else {
            setSelectedID((selectedID) => "");
            setSelectedName((selectedID) => "");
            setEmpSelectData(EmpSelectData => []);
            setvisitorID(visitorID => "");

            Swal.fire({
                icon: "error",
                position: "center",
                title: t("title_something_wrong"),
                text: t("text_connect_again"),
            });
        }
    };

    const onChangeCheck = useCallback((id, type, value) => {
        setChecklist(checklist => checklist.map((item, index) => {
            return item.ITEM_CODE === id ? {
                ...item,
                [type]: value,
            }: item;
        }));
    }, [])

    //////Handle Change Checklist
    const handleChecklist = async (id, type, value) => {
        ///////Check User Permission
        let _validPermission = await getUserPermissOnPage(
            "SAVE_YN",
            location.pathname
        );

        /////Security Checked Y/N
        let _currentItem = searchData.filter(
            (item) => item.DISTINCT_ROW === selectedID
        );
        if (
            (getPageIns(location) !== "2" &&
                _currentItem &&
                _currentItem.length > 0 &&
                _currentItem[0].CHECKED_YN === "Y")
            || _currentItem[0].IS_VACATION === "Y"
        ) {
            return;
        } else if (
            getPageIns(location) === "2" &&
            _currentItem &&
            _currentItem.length > 0 &&
            _currentItem[0].WORKSHOP_YN === "Y"
        ) {
            return;
        }

        if (_validPermission) {
            onChangeCheck(id, type, value);
        }
    };

    //Handle Change Select
    const handleChangeSelect = (type, event) => {
        switch (type) {
            case "VENDOR":
                if (searchConfig.CONT_CODE !== event.value) {
                    setSearchConfig((saveData) => {
                        return {
                            ...saveData,
                            CONT_CODE: event.value,
                        };
                    });
                    handleSearch(
                        searchConfig.PLANT_CD,
                        searchConfig.DATE,
                        event.value,
                        searchConfig.PERMISSION,
                        "CONT"
                    );
                }
                break;
            case "PURPOSE":
                if (searchConfig.REQ_NO !== event.value) {
                    setSearchConfig((saveData) => {
                        return {
                            ...saveData,
                            REQ_NO: event.value,
                        };
                    });
                    handleSearch(
                        searchConfig.PLANT_CD,
                        searchConfig.DATE,
                        searchConfig.CONT_CODE,
                        searchConfig.PERMISSION,
                        "PURPOSE",
                        event.value
                    );
                }
                break;
            default:
                break;
        }
    };

    const seacrhParams = (
        type = "",
        plant = "",
        date = "",
        dept = "",
        contract = "",
        reqNo = "",
        empCitizenID = "",
        permission = "",
        pageIns = ""
    ) => {
        return {
            ARG_TYPE: type,
            ARG_PLANT: plant,
            ARG_DATE: date,
            ARG_DEPT: dept,
            ARG_CONT: contract,
            ARG_REQ_NO: reqNo,
            ARG_EMP_CITIZEN_ID: empCitizenID,
            ARG_PERMISS: permission,
            ARG_PAGE: isNullOrEmpty(pageIns) ? getPageIns(location) : pageIns,
            OUT_CURSOR: "",
        };
    };

    //////Handle Search
    const handleSearch = async (
        plant = "",
        date = "",
        contract = "",
        permission = "",
        type = "",
        req_no = ""
    ) => {
        setSelectedID((selectedID) => "");
        setSearch("");
        setSearchData((searchData) => []);
        setLoading((loading) => true);

        if (type === "CONT") {
            //////Purpose List
            let _purposeData = await fetchData(
                InspectChecklistSelectURL,
                seacrhParams(
                    "Q_PURPOSE",
                    isNullOrEmpty(plant) ? searchConfig.PLANT_CD : plant,
                    date,
                    searchConfig.DEPT_CD,
                    isNullOrEmpty(contract) ? searchConfig.CONT_CODE : contract,
                    isNullOrEmpty(req_no) ? searchConfig.REQ_NO : req_no,
                    "",
                    isNullOrEmpty(permission) ? searchConfig.PERMISSION : permission,
                    getPageIns(location)
                )
            );
            setPurposeList((purposeList) => _purposeData);
            setSearchConfig((searchData) => {
                return {
                    ...searchData,
                    REQ_NO: _purposeData.length > 0 ? _purposeData[0].value : "",
                };
            });

            //////Status List
            let _statusData = await fetchData(
                InspectChecklistSelectURL,
                seacrhParams(
                    "Q_INSP_STATUS",
                    isNullOrEmpty(plant) ? searchConfig.PLANT_CD : plant,
                    date,
                    searchConfig.DEPT_CD,
                    isNullOrEmpty(contract) ? searchConfig.CONT_CODE : contract,
                    _purposeData.length > 0 ? _purposeData[0].value : "",
                    "",
                    isNullOrEmpty(permission) ? searchConfig.PERMISSION : permission,
                    getPageIns(location)
                )
            );
            setStatusList((statusList) => _statusData);

            //////Search Data
            let _fetchData = await fetchData(InspectChecklistSelectURL, {
                ARG_TYPE: "Q_SEARCH",
                ARG_PLANT: isNullOrEmpty(plant) ? searchConfig.PLANT_CD : plant,
                ARG_DATE: date,
                ARG_DEPT: searchConfig.DEPT_CD,
                ARG_CONT: isNullOrEmpty(contract) ? searchConfig.CONT_CODE : contract,
                ARG_REQ_NO: _purposeData.length > 0 ? _purposeData[0].value : "",
                ARG_EMP_CITIZEN_ID: "",
                ARG_PERMISS: isNullOrEmpty(permission)
                    ? searchConfig.PERMISSION
                    : permission,
                ARG_PAGE: getPageIns(location),
                OUT_CURSOR: "",
            });
            setSearchData((searchData) => _fetchData);
            setSelectedReq((selectedReq) =>
                _purposeData.length > 0 ? _purposeData[0].value : ""
            );

            //////Auto Select First
            await handleToggle(
                _fetchData[0],
                _fetchData[0].DISTINCT_ROW,
                _fetchData[0].REQ_NO,
                _fetchData[0].EMP_CITIZEN_ID
            );
            setEmpSelectData(EmpSelectData => _fetchData[0]);
            setvisitorID(visitorID => isNullOrEmpty(_fetchData[0].VISITOR_ID) ? "" : _fetchData[0].VISITOR_ID);
            setSelectedID((selectedID) => _fetchData[0].DISTINCT_ROW);

            handleTimeout(500).then(() => {
                setLoading((loading) => false);
            });
        } else {
            setSelectedReq((selectedReq) => req_no);
            //////Status List
            let _statusData = await fetchData(
                InspectChecklistSelectURL,
                seacrhParams(
                    "Q_INSP_STATUS",
                    isNullOrEmpty(plant) ? searchConfig.PLANT_CD : plant,
                    date,
                    searchConfig.DEPT_CD,
                    isNullOrEmpty(contract) ? searchConfig.CONT_CODE : contract,
                    isNullOrEmpty(req_no) ? searchConfig.REQ_NO : req_no,
                    "",
                    isNullOrEmpty(permission) ? searchConfig.PERMISSION : permission,
                    getPageIns(location)
                )
            );
            setStatusList((statusList) => _statusData);

            //////Search Data
            let _fetchData = await fetchData(InspectChecklistSelectURL, {
                ARG_TYPE: "Q_SEARCH",
                ARG_PLANT: isNullOrEmpty(plant) ? searchConfig.PLANT_CD : plant,
                ARG_DATE: date,
                ARG_DEPT: searchConfig.DEPT_CD,
                ARG_CONT: isNullOrEmpty(contract) ? searchConfig.CONT_CODE : contract,
                ARG_REQ_NO: isNullOrEmpty(req_no) ? searchConfig.REQ_NO : req_no,
                ARG_EMP_CITIZEN_ID: "",
                ARG_PERMISS: isNullOrEmpty(permission)
                    ? searchConfig.PERMISSION
                    : permission,
                ARG_PAGE: getPageIns(location),
                OUT_CURSOR: "",
            });
            setSearchData((searchData) => _fetchData);

            //////Auto Select First
            await handleToggle(
                _fetchData[0],
                _fetchData[0].DISTINCT_ROW,
                _fetchData[0].REQ_NO,
                _fetchData[0].EMP_CITIZEN_ID
            );
            setEmpSelectData(EmpSelectData => _fetchData[0]);
            setvisitorID(visitorID => isNullOrEmpty(_fetchData[0].VISITOR_ID) ? "" : _fetchData[0].VISITOR_ID);
            setSelectedID((selectedID) => _fetchData[0].DISTINCT_ROW);

            handleTimeout(500).then(() => {
                setLoading((loading) => false);
            });
        }
    };

    const handleDefault = async (defaultDate = "") => {
        setLoading((loading) => true);
        let _userPermiss = await getUserPermission(location);
        setUserPermiss((userPermiss) => _userPermiss);
        setSearch("");

        setSelectedID((selectedID) => "");
        setSearchData((searchData) => []);

        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
        let _data = InspectSearchParams();
        _data.PLANT_CD = userData.plant_cd;
        _data.DATE = isNullOrEmpty(defaultDate)
            ? getDateFormat(new Date())
            : defaultDate;

        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams("Q", _data.PLANT_CD, _data.DATE)
        );
        setChecklist((checklist) => _fetchData);

        //////Contractor List
        let _contData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams(
                pageLocation === "1" ? "Q_CONT_ALL" : "Q_CONT",
                _data.PLANT_CD,
                _data.DATE,
                _data.DEPT_CD,
                "",
                "",
                "",
                _data.PERMISSION
            )
        );

        setVendorList((vendorList) => _contData);
        _data.CONT_CODE = _contData.length > 0 ? _contData[0].value : "";

        //////Purpose List
        let _purposeData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams(
                "Q_PURPOSE",
                _data.PLANT_CD,
                _data.DATE,
                _data.DEPT_CD,
                _data.CONT_CODE,
                "",
                "",
                _data.PERMISSION,
                getPageIns(location)
            )
        );
        setPurposeList((purposeList) => _purposeData);
        _data.REQ_NO = _purposeData.length > 0 ? _purposeData[0].value : "";
        setSearchConfig((searchData) => _data);
        setSelectedReq((selectedReq) => _data.REQ_NO);

        //////Status List
        let _statusData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams(
                "Q_INSP_STATUS",
                _data.PLANT_CD,
                _data.DATE,
                _data.DEPT_CD,
                _data.CONT_CODE,
                _data.REQ_NO,
                "",
                _data.PERMISSION,
                getPageIns(location)
            )
        );
        setStatusList((statusList) => _statusData);

        //////Default Select Employee
        let _empData = await fetchData(InspectChecklistSelectURL, {
            ARG_TYPE: "Q_SEARCH",
            ARG_PLANT: _data.PLANT_CD,
            ARG_DATE: _data.DATE,
            ARG_DEPT: _data.DEPT_CD,
            ARG_CONT: _data.CONT_CODE,
            ARG_REQ_NO: _data.REQ_NO,
            ARG_EMP_CITIZEN_ID: "",
            ARG_PERMISS: _data.PERMISSION,
            ARG_PAGE: getPageIns(location),
            OUT_CURSOR: "",
        });
        setSearchData((searchData) => _empData);

        if (_empData !== null && _empData.length > 0) {
            let _checkData = await fetchData(
                InspectChecklistSelectURL,
                seacrhParams(
                    "Q_EMP_CHECKLIST",
                    _data.PLANT_CD,
                    _data.DATE,
                    _data.DEPT_CD,
                    _empData[0].CONT_CODE,
                    _empData[0].REQ_NO,
                    _empData[0].EMP_CITIZEN_ID,
                    _data.PERMISSION,
                    getPageIns(location) !== "2" ? "1" : getPageIns(location)
                )
            );

            const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
            let _defaultCheck =
                getPageIns(location) === "1" && userData.Permission === "SCR"
                    ? true
                    : false;

            let _checklistData = _fetchData.map((item) => {
                let nextItem = item;
                let matchItem = _checkData.filter(
                    (data) => data.ITEM_CODE === nextItem.ITEM_CODE
                )[0];
                let _pagePos = getPageIns(location);

                nextItem = {
                    ...nextItem,
                    COL_QTY: _pagePos === "1" ? nextItem.COL_QTY : matchItem.COL_QTY,
                    ROW_NO: _pagePos === "1" ? nextItem.ROW_NO : matchItem.ROW_NO,
                    REQ_NO: _empData[0].REQ_NO,
                    EMP_CITIZEN_ID: _empData[0].EMP_CITIZEN_ID,
                    WORK_DATE: _data.DATE,
                    INS_SEQ: matchItem.INS_SEQ,
                    ITEM_RESULT:
                        isNullOrEmpty(matchItem.ITEM_RESULT) && getPageIns(location) === "1"
                            ? _defaultCheck
                                ? ""
                                : ""
                            : matchItem.ITEM_RESULT,
                    ITEM_RS_TEMP: matchItem.ITEM_RS_TEMP,
                    ITEM_COMMENT: isNullOrEmpty(matchItem.ITEM_COMMENT)
                        ? ""
                        : matchItem.ITEM_COMMENT,
                    INS_IMAGE_PATH: isNullOrEmpty(matchItem.INS_IMAGE_PATH)
                        ? ""
                        : matchItem.INS_IMAGE_PATH,
                };
                return nextItem;
            });

            setChecklist((checklist) => _checklistData);
            setSelectedID((selectedID) => _empData[0].DISTINCT_ROW);
            setEmpSelectData(EmpSelectData => _empData[0]);
            setvisitorID(visitorID => isNullOrEmpty(_empData[0].VISITOR_ID) ? "" : _empData[0].VISITOR_ID);
        }

        handleTimeout(500).then(() => {
            setLoading((loading) => false);
        });
    };

    useEffect(() => {
        setLoading((loading) => true);
        RouterChecking(location.pathname);
        handleDefault();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    //////Handle Change Date
    const handleChangeDate = async (event) => {
        let _ymd = getDateFormat(event);
        handleDefault(_ymd);

        let _validReg = await isValidReg(_ymd);
        setDisableReg((disableReg) => !_validReg);
    };

    //////Handle Upload Checklist Data
    async function getPosts() {
        let _count = 0;
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

        for (let iCount = 0; iCount < checklist.length; iCount++) {
            try {
                let _config = {
                    TYPE: "Q",
                    DEPT_CD: getPageType(location, searchConfig.PERMISSION),
                    REQ_NO: checklist[iCount].REQ_NO,
                    EMP_CITIZEN_ID: checklist[iCount].EMP_CITIZEN_ID,
                    WORK_DATE: checklist[iCount].WORK_DATE,
                    ITEM_CODE: checklist[iCount].ITEM_CODE,
                    ITEM_RESULT: checklist[iCount].ITEM_RESULT,
                    ITEM_COMMENT: removeVietnamese(checklist[iCount].ITEM_COMMENT),
                    CREATOR: userData.dept_cd,
                    CREATE_PC: userData.username + "|" + userData.Permission,
                    CREATOR_PROGRAM_ID: "CSM_SYSTEM",
                };
                let _uploadConfig = UploadResultItemSaveParams(_config);
                let _result = await fetchPostData(ResultItemSaveURL, _uploadConfig);

                if (_result) {
                    _count++;
                }
            } catch {
                break;
            }
        }
        return _count === checklist.length ? true : false;
    }

    const handleUpload = async () => {
        setOpen((open) => false);
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
        //let _validSubmit = await handleValidateSubmit(checklist[0].REQ_NO);

        //////Check Employee Vacation Status
        if (getPageIns(location) === "1" && EmpSelectData !== null && EmpSelectData.length > 0 && EmpSelectData.IS_VACATION === "Y") {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: t("swal_warn"),
                text: t("swal_vacation"),
                showConfirmButton: true,
                confirmButtonColor: "seagreen",
            });
            return;
        }

        ///////Check User Permission
        let _validPermission = await getUserPermissOnPage(
            "SAVE_YN",
            location.pathname
        );

        if (!_validPermission) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: t("swal_submit"),
                text: t("swal_no_permission"),
                showConfirmButton: true,
                confirmButtonColor: "seagreen",
            });
            return;
        }

        // if (getPageIns(location) === "2") { //!_validSubmit &&
        //   Swal.fire({
        //     position: "center",
        //     icon: "warning",
        //     title: t("swal_submit"),
        //     text: t("sewal_submit_desc"),
        //     showConfirmButton: true,
        //     confirmButtonColor: "seagreen",
        //   });
        //   return;
        // }

        Swal.fire({
            title: t("title_confirm"),
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

                getPosts().then(async (res) => {
                    if (res) {
                        /////////Update Table Result
                        let _updateConfig = {
                            ROWID: checklist[0].REQ_NO,
                            DEPT_CD: getPageType(location, searchConfig.PERMISSION),
                            EMP_ID: checklist[0].EMP_CITIZEN_ID,
                            WORK_DATE: checklist[0].WORK_DATE,

                            INS_1_DATE: searchConfig.DATE,
                            INS_1_DT: "", //lấy giờ server
                            INS_1_PIC_ID: userData.username,
                            INS_1_PIC_NAME: userData.displayname,
                            INS_1_ITEM: "",
                            INS_1_RESULT: "",

                            INS_2_DATE: searchConfig.DATE,
                            INS_2_DT: "", //lấy giờ server
                            INS_2_PIC_ID: userData.username,
                            INS_2_PIC_NAME: userData.displayname,
                            INS_2_ITEM: "",
                            INS_2_RESULT: "",

                            INS_3_DATE: searchConfig.DATE,
                            INS_3_DT: "", //lấy giờ server
                            INS_3_PIC_ID: userData.username,
                            INS_3_PIC_NAME: userData.displayname,
                            INS_3_ITEM: "",
                            INS_3_RESULT: "",

                            VISITOR_ID: visitorID,

                            CREATE_PROGRAM_ID: "CSM_SYSTEM",
                        };
                        let _updateResultConfig =
                            UploadRequestUpdateResultSaveParams(_updateConfig);
                        let _result = await fetchPostData(
                            RequestUpdateResultSaveURL,
                            _updateResultConfig
                        );

                        if (_result) {
                            Swal.close();
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: t("title_reg_success"),
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(() => {
                                setSearchData(
                                    searchData.map((item) => {
                                        let nextItem = item;
                                        if (nextItem.DISTINCT_ROW === selectedID) {
                                            if (getPageIns(location) === "1") {
                                                nextItem = {
                                                    ...nextItem,
                                                    CHECKED_YN: "Y",
                                                    VISITOR_ID: visitorID,
                                                    CHECK_IN: moment(new Date()).format("HH:mm A"),
                                                };
                                            } else if (getPageIns(location) === "2") {
                                                nextItem = {
                                                    ...nextItem,
                                                    WORKSHOP_YN: "Y",
                                                };
                                            }
                                        }
                                        return nextItem;
                                    })
                                );
                            });
                        } else {
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                position: "center",
                                title: t("title_reg_fail"),
                                text: t("text_please_check_again"),
                            });
                        }
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
            } else {
                if (isMobile) {
                    setOpen((open) => true);
                }
            }
        });
    };

    ///////Handle Upload Image Modal
    const handleUploadModal = async () => {
        setIsUpload((isUpload) => false);
        setThumbList((thumbList) => []);
        setUpComment((upComment) => "");
        setUploadOpen((uploadOpen) => true);
    };

    const handleSearchImageModal = async (pageType = "") => {
        setIsUpload((isUpload) => false);
        setThumbList((thumbList) => []);
        setUpComment((upComment) => "");

        ////Default Req No
        let _fetchData = await fetchData(InspectImgUploadSelectURL, {
            ARG_TYPE: "Q",
            ARG_DATE: searchConfig.DATE,
            ARG_REQ: selectedReq,
            ARG_DEPT: pageType,
            OUT_CURSOR: "",
        });

        if (_fetchData != null && _fetchData.length > 0) {
            setIsUpload((isUpload) => true);
            setThumbList((thumbList) => _fetchData);
            setUpComment((upComment) => _fetchData[0].INS_DESC);
            setValidComment((validComment) => true);
            setUploadOpen((uploadOpen) => true);
        } else {
            setIsUpload((isUpload) => false);
            setThumbList((thumbList) => []);
            setUpComment((upComment) => "");
        }
    };

    //////Validate Submit
    const handleValidateSubmit = async (reqNo) => {
        if (fIcon) {
            let _thumbData = await fetchData(InspectImgUploadSelectURL, {
                ARG_TYPE: "Q",
                ARG_DATE: searchConfig.DATE,
                ARG_REQ: reqNo,
                ARG_DEPT: searchConfig.PERMISSION,
                OUT_CURSOR: "",
            });

            if (_thumbData != null && _thumbData.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    //////Validate Permission
    const handleValidatePermission = async (type = "") => {
        ///////Check User Permission
        let userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
        let _result = false;

        if (type === "thumb") {
            switch (userData.Permission) {
                case "ADMIN":
                    _result = true;
                    break;
                case "SCR":
                    if (sTitle === "Security Gate") _result = true;
                    break;
                case "DEPT":
                    if (sTitle === "Workshop") _result = true;
                    break;
                case "RSM":
                    if (sTitle === "RSM" || sTitle === "Workshop") _result = true;
                    break;
                default:
                    break;
            }
        } else {
            switch (userData.Permission) {
                case "ADMIN":
                    if (sTitle === "Security Gate") _result = true;
                    break;
                case "SCR":
                    if (sTitle === "Security Gate") _result = true;
                    break;
                default:
                    break;
            }
        }

        return _result;
    };

    ///////Upload Images
    const handleUploadImg = async () => {
        setUploadOpen((uploadOpen) => false);

        if (
            (getPageIns(location) === "2" &&
                (thumbList === null || thumbList.length < 1)) ||
            isNullOrEmpty(upComment)
        ) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: t("swal_submit"),
                text: t("swal_submit_img_desc"),
                showConfirmButton: true,
                confirmButtonColor: "seagreen",
            }).then(() => {
                setUploadOpen((uploadOpen) => true);
            });
            return;
        }

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

        Swal.fire({
            title: t("title_confirm"),
            text: t("text_confirm_upload"),
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

                let _uploadData = InspecUploadImageParams();
                _uploadData.CREATE_PROGRAM_ID = "CSM_SYSTEM";
                _uploadData.WORK_DATE = searchConfig.DATE;
                _uploadData.INS_SEQ = getPageIns(location);
                _uploadData.REQ_NO = selectedReq;
                _uploadData.INS_DESC = removeVietnamese(upComment);

                _uploadData.IMG_HAS_YN_1 = !isNullOrEmpty(thumbList[0]) ? "Y" : "N";
                _uploadData.IMG_HAS_YN_2 = !isNullOrEmpty(thumbList[1]) ? "Y" : "N";
                _uploadData.IMG_HAS_YN_3 = !isNullOrEmpty(thumbList[2]) ? "Y" : "N";
                _uploadData.IMG_HAS_YN_4 = !isNullOrEmpty(thumbList[3]) ? "Y" : "N";
                _uploadData.IMG_HAS_YN_5 = !isNullOrEmpty(thumbList[4]) ? "Y" : "N";

                let _uploadConfig = InspecUploadImageSaveParams(_uploadData, thumbList);
                let _result = await fetchPostFormData(
                    InspecUploadImageURL,
                    _uploadConfig
                );
                Swal.close();

                if (_result) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: t("title_reg_success"),
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        setSearchData(
                            searchData.map((item) => {
                                let nextItem = item;
                                if (nextItem.REQ_NO === selectedReq) {
                                    nextItem = {
                                        ...nextItem,
                                        WORKSHOP_YN:
                                            getPageIns(location) === "2" ? "Y" : nextItem.WORKSHOP_YN,
                                        RSM_YN:
                                            getPageIns(location) === "3" ? "Y" : nextItem.RSM_YN,
                                    };
                                }
                                return nextItem;
                            })
                        );
                        setStatusList(
                            statusList.map((item) => {
                                let nextItem = item;
                                nextItem = {
                                    ...nextItem,
                                    WORKSHOP_YN:
                                        getPageIns(location) === "2" ? "Y" : nextItem.WORKSHOP_YN,
                                    RSM_YN: getPageIns(location) === "3" ? "Y" : nextItem.RSM_YN,
                                };
                                return nextItem;
                            })
                        );

                        setUploadOpen((uploadOpen) => false);
                        setThumbList((thumbList) => []);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        position: "center",
                        title: t("title_connect_fail"),
                        text: t("text_connect_again"),
                    });
                }
            } else {
                setUploadOpen((uploadOpen) => true);
            }
        });
    };

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
            borderBottom: "none",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: isMobile ? 15 : 16,
            backgroundColor: "#fff",
            padding: 0,
            fontWeight: 500,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
    }));

    const disableUploadImgBtn = () => {
        let _result = false;

        if (isUpload || isNullOrEmpty(upComment)) {
            _result = true;
        } else if (getPageIns(location) === "2") {
            if (thumbList.length !== 5) {
                _result = true;
            }
        }

        return _result;
    };

    //////Handle Comment
    const handleUpComment = (event) => {
        setUpComment((upComment) => event.target.value);

        if (isNullOrEmpty(event.target.value)) {
            setValidComment((validComment) => false);
        } else {
            setValidComment((validComment) => true);
        }
    };

    //////Handle Disable Submit Button
    const handleDiasableSubmit = () => {
        let _result = false;
        if (getPageIns(location) === "2") {
            const wsChecklist = checklist.filter(
                (item) => item.ITEM_RS_TEMP === "OK"
            );
            if (wsChecklist !== null && wsChecklist.length > 0) {
                for (let iCount = 0; iCount < wsChecklist.length; iCount++) {
                    if (isNullOrEmpty(wsChecklist[iCount].ITEM_RESULT)) {
                        _result = true;
                        break;
                    }
                }
            }
        } else {
            if (checklist !== null && checklist.length > 0) {
                for (let iCount = 0; iCount < checklist.length; iCount++) {
                    if (isNullOrEmpty(checklist[iCount].ITEM_RESULT)) {
                        _result = true;
                        break;
                    }
                }
            }
        }

        /////Security Checked Y/N
        let _currentItem = searchData.filter(
            (item) => item.DISTINCT_ROW === selectedID
        );
        if (
            getPageIns(location) !== "2" &&
            _currentItem &&
            _currentItem.length > 0 &&
            _currentItem[0].CHECKED_YN === "Y"
        ) {
            _result = true;
        } else if (
            getPageIns(location) === "2" &&
            _currentItem &&
            _currentItem.length > 0 &&
            _currentItem[0].WORKSHOP_YN === "Y"
        ) {
            _result = true;
        }

        setDisableSubmit((disableSubmit) => _result);
    };

    useEffect(() => {
        handleDiasableSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checklist]);

    //////Handle Register Blacklist
    const handleBlacklist = async (empID, empName, isCheck, date) => {
        let _isCheck = isCheck === "Y" ? true : false;
        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams(
                "Q_CHECK_BLACKLIST",
                "",
                isNullOrEmpty(date) ? "" : date,
                "",
                "",
                "",
                empID,
                "",
                ""
            )
        );

        //////////If Blacklist Request is existed
        if (_isCheck) {
            if (_fetchData !== null && _fetchData.length > 0) {
                Swal.fire({
                    title: t("blacklist_reason"),
                    showCancelButton: false,
                    confirmButtonColor: "seagreen",
                    confirmButtonText: t("btn_confirm"),
                    html: `
                        <p class="s-modal--label">${t("date")}</p>
                        <div class="s-modal--div">
                            <svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" focusable="false" class="rs-picker-toggle-caret rs-icon" aria-label="calendar" data-category="legacy"><path d="M1 4v8.5a.5.5 0 00.5.5H8c0-.128.049-.256.146-.354.555-.555.854-1.6.854-3.146a.5.5 0 01.621-.485l.119.03A2.623 2.623 0 0012.999 6.5V4h-12zm3-2h6V0h1v2h1.5A1.5 1.5 0 0114 3.5v3a3.623 3.623 0 01-4.015 3.603c-.064 1.245-.335 2.212-.831 2.898H12.5a.5.5 0 00.5-.5v-2a.5.5 0 011 0v2a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5H3v-2h1v2zm5 4V5h1v1h2v1h-2v1H9V7H7v2h1v1H7v2H6v-2H4v2H3v-2H1V9h2V7H1V6h2V5h1v1h2V5h1v1h2zM6 9V7H4v2h2z"></path></svg>
                            <input disabled class="swal2-input s-modal--input" value=${_fetchData[0].YMD
                        } />
                        </div>
                        <p class="s-modal--label">${t("title_comment")}</p>
                        <textarea disabled rows="4" class="s-modal--textarea">${_fetchData[0].BLACKLIST_REASON
                        }</textarea>
                    `,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    position: "center",
                    title: t("title_connect_fail"),
                    text: t("text_connect_again"),
                });
            }
        } else {
            if (_fetchData !== null && _fetchData.length > 0) {
                Swal.fire({
                    icon: "error",
                    position: "center",
                    title: "Warning",
                    text: t("swal_no_blacklist"),
                });
            } else {
                ///////Check User Permission
                let _validPermiss = await getUserPermissOnPage(
                    "NEW_YN",
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
                    let _commentTxt = await removeVietnamese(text);
                    let _config = {
                        TYPE: "Q",
                        BLACKLIST_DATE: "",
                        EMP_CODE: empID,
                        EMP_NAME: empName,
                        REASON: _commentTxt,
                        CREATOR_PROGRAM_ID: "CSM_SYSTEM",
                    };
                    let _uploadConfig = UploadEmployeeBlacklistUpdateParams(_config);
                    let insSeq = await getNextBlacklistSeq(empID);

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
                            Swal.fire({
                                title: "Please wait!",
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                            });
                            let _postResult = await fetchPostData(
                                EmployeeBlacklistUpdateURL,
                                _uploadConfig
                            );

                            if (_postResult) {
                                Swal.close();
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: t("title_reg_success"),
                                    showConfirmButton: false,
                                    timer: 1500,
                                }).then(() => {
                                    /////Update State
                                    setSearchData(
                                        searchData.map((item) => {
                                            let nextItem = item;
                                            if (nextItem.EMP_CITIZEN_ID === empID) {
                                                nextItem = {
                                                    ...nextItem,
                                                    BLIST_1ST_SEQ:
                                                        insSeq === "1" ? "Y" : nextItem.BLIST_1ST_SEQ,
                                                    BLIST_1ST_YMD:
                                                        insSeq === "1"
                                                            ? getDateFormat()
                                                            : nextItem.BLIST_1ST_YMD,
                                                    BLIST_2ND_SEQ:
                                                        insSeq === "2" ? "Y" : nextItem.BLIST_2ND_SEQ,
                                                    BLIST_2ND_YMD:
                                                        insSeq === "2"
                                                            ? getDateFormat()
                                                            : nextItem.BLIST_2ND_YMD,
                                                    BLIST_3RD_SEQ:
                                                        insSeq === "3" ? "Y" : nextItem.BLIST_3RD_SEQ,
                                                    BLIST_3RD_YMD:
                                                        insSeq === "3"
                                                            ? getDateFormat()
                                                            : nextItem.BLIST_3RD_YMD,
                                                };
                                            }
                                            return nextItem;
                                        })
                                    );
                                });
                            } else {
                                Swal.close();
                                Swal.fire({
                                    icon: "error",
                                    position: "center",
                                    title: t("title_reg_fail"),
                                    text: t("text_please_check_again"),
                                });
                            }
                        }
                    });
                } else {
                    return;
                }
            }
        }
    };

    ///////Next Blacklist Sequence
    const getNextBlacklistSeq = async (empID) => {
        let _result = "1";
        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams("Q_BLACKLIST_NEXT", "", "", "", "", "", empID, "", "")
        );
        if (_fetchData && _fetchData.length > 0) {
            _result = _fetchData[0].NEXT_SEQ + "";
        }
        return _result;
    };

    ///////Valid Register
    const isValidReg = async (date) => {
        let _result = false;

        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            seacrhParams("Q_TODAY", "", date, "", "", "", "", "", "")
        );
        if (_fetchData && _fetchData.length > 0) {
            _result = _fetchData[0].TODAY_YN === "Y" ? true : false;
        }

        return _result;
    };

    /////Handle Filter
    const handleFilter = (value) => {
        setSearch((search) => value);
    };

    const handleEmpAddInforCheck = async (name, value, itemConfig = null) => {
        let _configData = null;

        if (isMobile) {
            setOpen((open) => false);
        }

        let _validReg = await isValidReg(searchConfig?.DATE);
        if (!_validReg) {
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("title_something_wrong"),
                text: t("swal_invalid_update"),
            });
            return;
        }

        switch (name) {
            case "VACATION":
                Swal.fire({
                    title: t("title_vacation_confirm"),
                    text: t("title_vacation_confirm_desc"),
                    position: "center",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "seagreen",
                    cancelButtonColor: "#dc3741",
                    confirmButtonText: "Yes",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        _configData = UploadWorkerResultUpdateParams(EmpSelectData)
                        _configData.ARG_TYPE = "VACATION";
                        _configData.ARG_IS_VACATION = value ? "N" : "Y";

                        let _res = fetchPostData(WorkerResultUpdateURL, _configData);
                        if (_res) {
                            setSearchData((current) =>
                                searchData.map((obj) => {
                                    if (obj.DISTINCT_ROW === EmpSelectData.DISTINCT_ROW) {
                                        return {
                                            ...obj,
                                            IS_VACATION: value === true ? "N" : "Y",
                                        };
                                    }
                                    return obj;
                                })
                            );
                            setEmpSelectData(EmpSelectData => {
                                return {
                                    ...EmpSelectData,
                                    IS_VACATION: value === true ? "N" : "Y",
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                position: "center",
                                title: t("title_something_wrong"),
                                text: t("text_connect_again"),
                            });
                        }
                    } else {
                        if (isMobile) {
                            setOpen((open) => true);
                        }
                    }
                });
                break;
            case "CHECK_OUT":
                let _selectItem = itemConfig === null ? EmpSelectData : itemConfig;

                Swal.fire({
                    title: t("title_checkout_confirm"),
                    text: t("title_checkout_confirm_desc") + " " + _selectItem.EMP_NAME,
                    position: "center",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "seagreen",
                    cancelButtonColor: "#dc3741",
                    confirmButtonText: "Yes",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        _configData = UploadWorkerResultUpdateParams(_selectItem)
                        _configData.ARG_TYPE = "CHECKOUT";
                        let _res = fetchPostData(WorkerResultUpdateURL, _configData);

                        if (_res) {
                            setSearchData((current) =>
                                searchData.map((obj) => {
                                    if (obj.DISTINCT_ROW === _selectItem.DISTINCT_ROW) {
                                        return {
                                            ...obj,
                                            INS_1_OUT_DT:
                                                value === true
                                                    ? null
                                                    : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                                            CHECK_OUT: value === true ? null : moment(new Date()).format("HH:mm A"),
                                        };
                                    }
                                    return obj;
                                })
                            );
                            if(itemConfig === null){
                                setEmpSelectData(EmpSelectData => {
                                    return {
                                        ...EmpSelectData,
                                        INS_1_OUT_DT:
                                            value === true
                                                ? null
                                                : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                                    }
                                });
                            }
                        } else {
                            Swal.fire({
                                icon: "error",
                                position: "center",
                                title: t("title_something_wrong"),
                                text: t("text_connect_again"),
                            });
                        }
                    } else {
                        if (isMobile) {
                            setOpen((open) => true);
                        }
                    }
                });
                break;
            default:
                break;
        }
    };

    const handleVisitorTextChange = (value) => {
        setvisitorID(visitorID => value);
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
                className="s-inspection"
            >
                <Box ref={refTop} sx={{ position: "relative" }}>
                    <Typography variant="h5" className="s-title">
                        {sTitle === "Workshop"
                            ? t("title_daily_checklist")
                            : sTitle === "RSM"
                                ? t("title_rsm_daily_checklist")
                                : t("title_guard_checklist")}
                    </Typography>
                    {localStorage.getItem("CONT_USER_INFOR") !== null &&
                        pageLocation === "1" &&
                        (JSON.parse(localStorage.getItem("CONT_USER_INFOR")).Permission ===
                            "SCR" ||
                            JSON.parse(localStorage.getItem("CONT_USER_INFOR")).Permission ===
                            "ADMIN") && (
                            <Button
                                fullWidth
                                endIcon={<CreateIcon />}
                                variant="contained"
                                color="success"
                                size="large"
                                disabled={disableReg ? true : disableSubmit}
                                sx={{
                                    height: 40,
                                    maxWidth: 150,
                                    textTransform: "none",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    boxShadow: "none",
                                    background: "linear-gradient(90deg,#427642,seagreen)",
                                    position: "absolute",
                                    top: "5px",
                                    right: 0,
                                    display: isMobile
                                        ? "none"
                                        : isNullOrEmpty(selectedID)
                                            ? "none"
                                            : "flex",
                                }}
                                onClick={handleUpload}
                            >
                                {t("btn_submit")}
                            </Button>
                        )}
                    {localStorage.getItem("CONT_USER_INFOR") !== null &&
                        pageLocation === "2" &&
                        (JSON.parse(localStorage.getItem("CONT_USER_INFOR")).Permission ===
                            "RSM" ||
                            JSON.parse(localStorage.getItem("CONT_USER_INFOR")).Permission ===
                            "DEPT" ||
                            JSON.parse(localStorage.getItem("CONT_USER_INFOR")).Permission ===
                            "ADMIN") && (
                            <Button
                                fullWidth
                                endIcon={<CreateIcon />}
                                variant="contained"
                                color="success"
                                size="large"
                                disabled={disableReg ? true : disableSubmit}
                                sx={{
                                    height: 40,
                                    maxWidth: 150,
                                    textTransform: "none",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    boxShadow: "none",
                                    background: "linear-gradient(90deg,#427642,seagreen)",
                                    position: "absolute",
                                    top: "5px",
                                    right: 0,
                                    display: isMobile
                                        ? "none"
                                        : isNullOrEmpty(selectedID)
                                            ? "none"
                                            : "flex",
                                }}
                                onClick={handleUpload}
                            >
                                {t("btn_submit")}
                            </Button>
                        )}
                </Box>
                {!isMobile && (
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={pageLocation === "1" ? 6.5 : 5.5} xl={pageLocation === "1" ? 6.5 : 5.5}>
                                <Box className="s-left">
                                    <Grid container spacing={1}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            md={4}
                                            lg={4}
                                            xl={pageLocation === "1" ? 4.5 : 4}
                                        >
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#333",
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {t("title_work_date")}
                                            </Typography>
                                            <DatePicker
                                                value={
                                                    searchConfig?.DATE
                                                        ? new Date(getDateFormatYMD(searchConfig?.DATE))
                                                        : new Date()
                                                }
                                                onChange={(e) => handleChangeDate(e)}
                                                cleanable={false}
                                                oneTap
                                                block
                                                size="lg"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={8}
                                            md={8}
                                            lg={8}
                                            xl={pageLocation === "1" ? 7.5 : 8}
                                        >
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
                                                        state.isFocused
                                                            ? "border-red-600"
                                                            : "border-grey-300",
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
                                        {pageLocation === "1" && (
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4.5}>
                                                <Typography
                                                    style={{
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        marginBottom: 3,
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {t("title_quick_search")}
                                                </Typography>
                                                <FilterInput data={search} handleUpdate={handleFilter} />
                                            </Grid>
                                        )}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={pageLocation === "1" ? 8 : 12}
                                            lg={pageLocation === "1" ? 8 : 12}
                                            xl={pageLocation === "1" ? 7.5 : 12}
                                        >
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#333",
                                                    marginBottom: 3,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {t("title_purpose")}
                                            </Typography>
                                            <Select
                                                value={
                                                    searchConfig?.REQ_NO
                                                        ? purposeList.filter(
                                                            (item) => item.value === searchConfig?.REQ_NO
                                                        )
                                                        : ""
                                                }
                                                onChange={(e) => handleChangeSelect("PURPOSE", e)}
                                                options={purposeList}
                                                classNames={{
                                                    control: (state) =>
                                                        state.isFocused
                                                            ? "border-red-600"
                                                            : "border-grey-300",
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
                                    {!loading &&
                                        pageLocation !== "1" &&
                                        statusList !== null &&
                                        statusList.length > 0 && (
                                            <>
                                                <Typography variant="h5" className="s-sub">
                                                    {t("title_insp")}
                                                </Typography>
                                                <Grid container spacing={0.5}>
                                                    <Grid item xs={4}>
                                                        <Box
                                                            className={
                                                                statusList[0].SCR_YN === "Y"
                                                                    ? "b-status b-status--empty"
                                                                    : "b-status b-status--red b-status--empty"
                                                            }
                                                        >
                                                            <Stack
                                                                flexDirection="row"
                                                                alignItems="center"
                                                                gap={0.5}
                                                            >
                                                                <Box className="b-icon">
                                                                    {statusList[0].SCR_YN === "Y" && (
                                                                        <CheckCircleIcon sx={{ fontSize: 26 }} />
                                                                    )}
                                                                    {statusList[0].SCR_YN === "N" && (
                                                                        <HourglassBottomIcon
                                                                            sx={{ fontSize: 22 }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                            <Box sx={{ opacity: 0.95 }}>{t("text-gate")}</Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Box
                                                            className={
                                                                statusList[0].WORKSHOP_YN === "Y"
                                                                    ? "b-status"
                                                                    : "b-status b-status--red"
                                                            }
                                                            onClick={() => handleSearchImageModal("DEPT")}
                                                        >
                                                            <Stack
                                                                flexDirection="row"
                                                                alignItems="center"
                                                                gap={0.5}
                                                            >
                                                                <Box className="b-icon">
                                                                    {statusList[0].WORKSHOP_YN === "Y" && (
                                                                        <CheckCircleIcon sx={{ fontSize: 26 }} />
                                                                    )}
                                                                    {statusList[0].WORKSHOP_YN === "N" && (
                                                                        <HourglassBottomIcon
                                                                            sx={{ fontSize: 22 }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                            <Box sx={{ opacity: 0.95 }}>{t("text-dept")}</Box>
                                                        </Box>
                                                    </Grid>
                                                    {pageLocation === "3" && (
                                                        <Grid item xs={4}>
                                                            <Box
                                                                className={
                                                                    statusList[0].RSM_YN === "Y"
                                                                        ? "b-status"
                                                                        : "b-status b-status--red"
                                                                }
                                                                onClick={() => handleSearchImageModal("RSM")}
                                                            >
                                                                <Stack
                                                                    flexDirection="row"
                                                                    alignItems="center"
                                                                    gap={0.5}
                                                                >
                                                                    <Box className="b-icon">
                                                                        {statusList[0].RSM_YN === "Y" && (
                                                                            <CheckCircleIcon sx={{ fontSize: 26 }} />
                                                                        )}
                                                                        {statusList[0].RSM_YN === "N" && (
                                                                            <HourglassBottomIcon
                                                                                sx={{ fontSize: 22 }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Stack>
                                                                <Box sx={{ opacity: 0.95 }}>
                                                                    {t("text-rsm")}
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </>
                                        )}
                                    <Box sx={{ marginTop: "15px" }}>
                                        {!loading &&
                                            (searchData === null || searchData.length < 1) && (
                                                <EmptyCard />
                                            )}
                                        {!loading &&
                                            searchData !== null &&
                                            searchData.length > 0 &&
                                            pageLocation === "1" && (
                                                <>
                                                    <Box className="b-card-header--security">
                                                        <Stack className="b-top" flexDirection="row">
                                                            <Box className="b-item b-item--first">
                                                                {t("emp_nm")}
                                                            </Box>
                                                            <Box className="b-item b-item--sec">
                                                                {t("citizen_id")}
                                                            </Box>
                                                            <Box className="b-item b-item--third">
                                                                {t("frm_position")}
                                                            </Box>
                                                            <Box className="b-item b-item--fourth">
                                                                {t("check_in")}
                                                            </Box>
                                                            <Box className="b-item b-item--fourth">
                                                                {t("check_out")}
                                                            </Box>
                                                            <Box className="b-item b-item--fourth">
                                                                {t("plholder_input_visitor_no")}
                                                            </Box>
                                                            <Box className="b-item b-item--fifth">
                                                                {t("title_checked")}
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    <Stack>
                                                        <Box
                                                            className="b-table-control"
                                                            sx={{
                                                                overflowY: "scroll",
                                                                maxHeight: "470px",
                                                            }}
                                                        >
                                                            {searchData.map((item) => {
                                                                if (isNullOrEmpty(search)) {
                                                                    return (
                                                                        <InspectEmpCard
                                                                            key={item.DISTINCT_ROW}
                                                                            data={item}
                                                                            handleClick={handleToggle}
                                                                        />
                                                                    );
                                                                } else {
                                                                    if (
                                                                        item.EMP_CITIZEN_ID.includes(search) ||
                                                                        (!isNullOrEmpty(item.VISITOR_ID) && item.VISITOR_ID.includes(search)) ||
                                                                        item.EMP_NAME.toLowerCase().includes(search.toLowerCase())
                                                                    ) {
                                                                        return (
                                                                            <InspectEmpCard
                                                                                key={item.DISTINCT_ROW}
                                                                                data={item}
                                                                                handleClick={handleToggle}
                                                                            />
                                                                        );
                                                                    } else {
                                                                        return <></>;
                                                                    }
                                                                }
                                                            })}
                                                        </Box>
                                                    </Stack>
                                                </>
                                            )}

                                        {!loading &&
                                            searchData !== null &&
                                            searchData.length > 0 &&
                                            pageLocation === "2" && (
                                                <>
                                                    <Box className="b-card-header--search">
                                                        <Stack className="b-top" flexDirection="row">
                                                            <Box className="b-item b-item--first">
                                                                {t("title_no")}
                                                            </Box>
                                                            <Box className="b-item b-item--sec">
                                                                {t("emp_nm")}
                                                            </Box>
                                                            <Box className="b-item b-item--third">
                                                                {t("citizen_id")}
                                                            </Box>
                                                            <Box className="b-item b-item--fourth">
                                                                {t("frm_position")}
                                                            </Box>
                                                            <Box className="b-item b-item--fifth">
                                                                {t("title_checked")}
                                                            </Box>
                                                            <Box className="b-item b-item--sixth">
                                                                {t("title_workshop_checked")}
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    <Stack>
                                                        <Box
                                                            className="b-table-control"
                                                            sx={{
                                                                overflowY: "scroll",
                                                                maxHeight: "425px",
                                                            }}
                                                        >
                                                            {searchData.map((item) => {
                                                                if (isNullOrEmpty(search)) {
                                                                    return (
                                                                        <InspectEmpCard
                                                                            key={item.DISTINCT_ROW}
                                                                            data={item}
                                                                            handleClick={() =>
                                                                                handleToggle(
                                                                                    item,
                                                                                    item.DISTINCT_ROW,
                                                                                    item.REQ_NO,
                                                                                    item.EMP_CITIZEN_ID,
                                                                                    item.CHECKED_YN === "Y"
                                                                                )
                                                                            }
                                                                        />
                                                                    );
                                                                } else {
                                                                    if (
                                                                        item.EMP_CITIZEN_ID.includes(search) ||
                                                                        item.EMP_NAME.toLowerCase().includes(search.toLowerCase())
                                                                    ) {
                                                                        return (
                                                                            <InspectEmpCard
                                                                                key={item.DISTINCT_ROW}
                                                                                data={item}
                                                                                handleClick={() =>
                                                                                    handleToggle(
                                                                                        item,
                                                                                        item.DISTINCT_ROW,
                                                                                        item.REQ_NO,
                                                                                        item.EMP_CITIZEN_ID,
                                                                                        item.CHECKED_YN === "Y"
                                                                                    )
                                                                                }
                                                                            />
                                                                        );
                                                                    } else {
                                                                        return <></>;
                                                                    }
                                                                }
                                                            })}
                                                        </Box>
                                                    </Stack>
                                                </>
                                            )}
                                        {!loading &&
                                            searchData !== null &&
                                            searchData.length > 0 &&
                                            pageLocation === "3" && (
                                                <>
                                                    <Box className="b-card-header--flag">
                                                        <Stack className="b-top" flexDirection="row">
                                                            <Box className="b-item b-item--first">
                                                                {t("emp_nm")}
                                                            </Box>
                                                            <Box className="b-item b-item--sec">
                                                                {t("citizen_id")}
                                                            </Box>
                                                            <Box className="b-item b-item--third">
                                                                {t("frm_position")}
                                                            </Box>
                                                            <Box className="b-item b-item--fourth">
                                                                {t("title_checked")}
                                                            </Box>
                                                            <Box className="b-item b-item--fifth">
                                                                <Box className="b-sub b-border-underline">
                                                                    {t("blacklist")}
                                                                </Box>
                                                                <Stack
                                                                    flexDirection="row"
                                                                    sx={{ width: "100%", height: "50%" }}
                                                                >
                                                                    <Box className="b-item--sixth b-border-right">
                                                                        1st
                                                                    </Box>
                                                                    <Box className="b-item--sixth b-border-right">
                                                                        2nd
                                                                    </Box>
                                                                    <Box className="b-item--sixth">3rd</Box>
                                                                </Stack>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    <Box
                                                        className="b-table-control"
                                                        sx={{
                                                            overflowY: "scroll",
                                                            maxHeight: "405px",
                                                        }}
                                                    >
                                                        {searchData.map((item) => {
                                                            return (
                                                                <InspectEmpCard
                                                                    key={item.DISTINCT_ROW}
                                                                    data={item}
                                                                    handleClick={handleToggle}
                                                                    handleBlacklist={handleBlacklist}
                                                                    isBlacklist={true}
                                                                />
                                                            );
                                                        })}
                                                    </Box>
                                                </>
                                            )}
                                        {loading && (
                                            <Box>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={2}>
                                                        <Skeleton
                                                            variant="rounded"
                                                            height={isMobile ? 70 : 100}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4}>
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
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={pageLocation === "1" ? 5.5 : 6.5} xl={pageLocation === "1" ? 5.5 : 6.5}>
                                <Box className="s-right">
                                    {pageLocation === "1" && (
                                        <>
                                            <Divider textAlign="right">
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color: "#3f51b5",
                                                        fontFamily: '"Calibri", "Inconsolata", "Roboto", "Open Sans", sans-serif',
                                                        fontSize: 19,
                                                    }}
                                                >
                                                    {EmpSelectData.EMP_NAME} -{" "}
                                                    {EmpSelectData.EMP_CITIZEN_ID}
                                                </Typography>
                                            </Divider>
                                            <Box
                                                sx={{
                                                    padding: 1,
                                                }}
                                            >
                                                <Grid container>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={12}
                                                        lg={12}
                                                        sx={{
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        <Stack
                                                            direction={"row"}
                                                            spacing={1}
                                                            justifyContent={"flex-end"}
                                                        >
                                                            {EmpSelectData.CHECKED_YN === "Y" &&
                                                                <>
                                                                    <Box onClick={() => handleEmpAddInforCheck("CHECK_OUT", !isNullOrEmpty(EmpSelectData.INS_1_OUT_DT))}
                                                                        className={!isNullOrEmpty(EmpSelectData.INS_1_OUT_DT) ? "b-status" : "b-status b-status--gray"}
                                                                        sx={{ width: "200px" }}>
                                                                        <Stack
                                                                            flexDirection="row"
                                                                            alignItems="center"
                                                                            gap={0.5}
                                                                        >
                                                                            <Box className="b-icon">
                                                                                <TransferWithinAStationIcon sx={{ fontSize: 26 }} />
                                                                            </Box>
                                                                        </Stack>
                                                                        <Box sx={{ opacity: 0.95 }}>
                                                                            {t("text_check_out")}
                                                                        </Box>
                                                                    </Box>
                                                                    <Divider
                                                                        orientation="vertical"
                                                                        variant="middle"
                                                                        flexItem
                                                                    ></Divider>
                                                                </>
                                                            }
                                                            <TextInput
                                                                id={EmpSelectData.EMP_CITIZEN_ID}
                                                                value={visitorID}
                                                                defaultDate={EmpSelectData.VISITOR_ID}
                                                                handleChange={handleVisitorTextChange} />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6}></Grid>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}

                                    {!loading && isNullOrEmpty(selectedID) && (
                                        <Box className="s-overlay">
                                            <SyncIcon
                                                sx={{ fontSize: 40, color: "white" }}
                                                className="b-icon"
                                            />
                                            <Typography className="b-title">
                                                Please select a person
                                            </Typography>
                                        </Box>
                                    )}
                                    {!loading && pageLocation !== "3" && (
                                        <Box sx={{
                                            overflow: "hidden",
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                                            borderTopLeftRadius: "10px",
                                            borderTopRightRadius: "10px",
                                        }}>
                                            <TableContainer
                                                className="b-table-control"
                                                sx={{
                                                    maxHeight: `${pageLocation === "1" ? (comHeight < 700 ? 610 : comHeight - 90) : (comHeight < 700 ? 700 : comHeight)}px`,
                                                }}
                                            >
                                                <Table
                                                    stickyHeader
                                                    size="small"
                                                    aria-label="a dense table"
                                                    className="b-table"
                                                >
                                                    <InspecHeader handleNAClick={handleNAClick} />
                                                    <TableBody className="b-table-body">
                                                        {checklist !== null &&
                                                            checklist.length > 0 &&
                                                            checklist.map((item, index) => {
                                                                return (
                                                                    <InspecRow
                                                                        key={index}
                                                                        data={item}
                                                                        handleChecklist={handleChecklist}
                                                                    />
                                                                );
                                                            })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}
                                    {!loading && pageLocation === "3" && (
                                        <TableContainer
                                            className="b-table-control"
                                            sx={{
                                                maxHeight: `${comHeight < 700 ? 700 : comHeight}px`,
                                            }}
                                        >
                                            <Table
                                                stickyHeader
                                                size="small"
                                                aria-label="a dense table"
                                                className="b-table"
                                            >
                                                <TableHead className="b-table-head">
                                                    <TableRow>
                                                        <StyledTableCell width="7%" align="center">
                                                            {t("title_order")}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            width="44%"
                                                            align="center"
                                                            colSpan={2}
                                                        >
                                                            {t("title_inspect")}
                                                        </StyledTableCell>
                                                        <StyledTableCell width="18%" align="center">
                                                            {t("title_checked_res")}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            width="31%"
                                                            align="center"
                                                            className="b-border-none"
                                                        >
                                                            {t("title_comment")}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody className="b-table-body">
                                                    {checklist !== null &&
                                                        checklist.length > 0 &&
                                                        checklist.map((item, index) => {
                                                            return (
                                                                <InspecRow
                                                                    key={index}
                                                                    data={item}
                                                                    handleChecklist={handleChecklist}
                                                                />
                                                            );
                                                        })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                    {loading && (
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
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
                {isMobile && (
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >
                                    {t("title_work_date")}
                                </Typography>
                                <DatePicker
                                    value={
                                        searchConfig?.DATE
                                            ? new Date(getDateFormatYMD(searchConfig?.DATE))
                                            : new Date()
                                    }
                                    onChange={(e) => handleChangeDate(e)}
                                    cleanable={false}
                                    oneTap
                                    block
                                    size="lg"
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >
                                    {t("title_purpose")}
                                </Typography>
                                <Select
                                    value={
                                        searchConfig?.REQ_NO
                                            ? purposeList.filter(
                                                (item) => item.value === searchConfig?.REQ_NO
                                            )
                                            : ""
                                    }
                                    onChange={(e) => handleChangeSelect("PURPOSE", e)}
                                    options={purposeList}
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
                        {statusList != null && statusList.length > 0 && (
                            <Box sx={{ marginTop: "10px" }}>
                                <Grid container spacing={0.5}>
                                    <Grid item xs={4}>
                                        <Box
                                            className={
                                                statusList[0].SCR_YN === "Y"
                                                    ? "b-status b-status--empty"
                                                    : "b-status b-status--red b-status--empty"
                                            }
                                        >
                                            <Stack flexDirection="row" alignItems="center" gap={0.5}>
                                                <Box className="b-icon">
                                                    {statusList[0].SCR_YN === "Y" && (
                                                        <CheckCircleIcon sx={{ fontSize: 23 }} />
                                                    )}
                                                    {statusList[0].SCR_YN === "N" && (
                                                        <HourglassBottomIcon sx={{ fontSize: 20 }} />
                                                    )}
                                                </Box>
                                            </Stack>
                                            <Box sx={{ opacity: 0.95 }}>{t("text-gate")}</Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box
                                            className={
                                                statusList[0].WORKSHOP_YN === "Y"
                                                    ? "b-status"
                                                    : "b-status b-status--red"
                                            }
                                            onClick={() => handleSearchImageModal("DEPT")}
                                        >
                                            <Stack flexDirection="row" alignItems="center" gap={0.5}>
                                                <Box className="b-icon">
                                                    {statusList[0].WORKSHOP_YN === "Y" && (
                                                        <CheckCircleIcon sx={{ fontSize: 23 }} />
                                                    )}
                                                    {statusList[0].WORKSHOP_YN === "N" && (
                                                        <HourglassBottomIcon sx={{ fontSize: 20 }} />
                                                    )}
                                                </Box>
                                            </Stack>
                                            <Box sx={{ opacity: 0.95 }}>{t("text-dept")}</Box>
                                        </Box>
                                    </Grid>
                                    {pageLocation === "3" && (
                                        <Grid item xs={4}>
                                            <Box
                                                className={
                                                    statusList[0].RSM_YN === "Y"
                                                        ? "b-status"
                                                        : "b-status b-status--red"
                                                }
                                                onClick={() => handleSearchImageModal("RSM")}
                                            >
                                                <Stack
                                                    flexDirection="row"
                                                    alignItems="center"
                                                    gap={0.5}
                                                >
                                                    <Box className="b-icon">
                                                        {statusList[0].RSM_YN === "Y" && (
                                                            <CheckCircleIcon sx={{ fontSize: 23 }} />
                                                        )}
                                                        {statusList[0].RSM_YN === "N" && (
                                                            <HourglassBottomIcon sx={{ fontSize: 20 }} />
                                                        )}
                                                    </Box>
                                                </Stack>
                                                <Box sx={{ opacity: 0.95 }}>{t("text-rsm")}</Box>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )}
                        {!loading && (searchData === null || searchData.length < 1) && (
                            <Box sx={{ marginTop: 3 }}>
                                <EmptyCard />
                            </Box>
                        )}
                        {!loading &&
                            searchData !== null &&
                            searchData.length > 0 &&
                            pageLocation !== "3" && (
                                <Box sx={{ marginTop: "10px" }}>
                                    <Box className="b-card-header--search b-card-header--mobile">
                                        <Stack className="b-top" flexDirection="row">
                                            <Box className="b-item b-item--sec">{t("emp_nm")}</Box>
                                            <Box className="b-item b-item--third">
                                                {t("citizen_id")}
                                            </Box>
                                            <Box className="b-item b-item--fourth">
                                                {t("frm_position")}
                                            </Box>
                                            <Box className="b-item b-item--first">
                                                {t("title_checked")}
                                            </Box>
                                        </Stack>
                                    </Box>
                                    {searchData.map((item) => {
                                        return (
                                            <InspectEmpCard
                                                key={item.DISTINCT_ROW}
                                                data={item}
                                                handleClick={handleToggleMobile}
                                                isMobile={true}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        {!loading &&
                            searchData !== null &&
                            searchData.length > 0 &&
                            pageLocation === "3" && (
                                <>
                                    <Box
                                        className="b-card-header--flag"
                                        sx={{ marginTop: "10px" }}
                                    >
                                        <Stack className="b-top" flexDirection="row">
                                            <Box className="b-item b-item--first">{t("emp_nm")}</Box>
                                            <Box className="b-item b-item--sec">
                                                {t("citizen_id")}
                                            </Box>
                                            <Box className="b-item b-item--third">
                                                {t("frm_position")}
                                            </Box>
                                            <Box className="b-item b-item--fourth">
                                                {t("title_checked")}
                                            </Box>
                                            <Box className="b-item b-item--fifth"></Box>
                                        </Stack>
                                    </Box>
                                    {searchData.map((item) => {
                                        return (
                                            <InspectEmpCard
                                                key={item.DISTINCT_ROW}
                                                data={item}
                                                handleClick={handleToggleMobile}
                                                handleBlacklist={handleBlacklist}
                                                isBlacklist={true}
                                                isMobile={true}
                                            />
                                        );
                                    })}
                                </>
                            )}
                        {loading && (
                            <Box sx={{ marginTop: "10px" }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={2}>
                                        <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Skeleton variant="rounded" height={isMobile ? 70 : 100} />
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
                        )}
                    </>
                )}
            </Stack>

            {fIcon &&
                handleValidatePermission("thumb") &&
                searchData !== null &&
                searchData.length > 0 && (
                    <Fab
                        sx={{ position: "fixed", bottom: 16, right: 16 }}
                        size="large"
                        color="primary"
                        aria-label="add"
                        onClick={() => handleUploadModal()}
                    >
                        <FilterIcon />
                    </Fab>
                )}

            <Sheet
                isOpen={uploadOpen}
                detent="content-height"
                onClose={() => setUploadOpen(false)}
            >
                <Sheet.Container>
                    <Sheet.Header>
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            sx={{
                                padding: "15px 8px 12px",
                            }}
                        >
                            <Typography
                                width={"100%"}
                                variant="h5"
                                component={"div"}
                                onClick={() => setUploadOpen(false)}
                                sx={{
                                    textAlign: isMobile ? "left" : "center",
                                    color: "navy",
                                    fontSize: isMobile ? 22 : 26,
                                    fontWeight: 700,
                                    paddingLeft: "5px",
                                }}
                            >
                                {t("title_upload_img")}
                            </Typography>
                            <CloseIcon
                                onClick={() => setUploadOpen(false)}
                                sx={{
                                    fontSize: isMobile ? 26 : 30,
                                    color: "#666",
                                    transition: "all .4s ease",
                                    cursor: "pointer",
                                    "&:hover": { opacity: 0.8 },
                                }}
                            />
                        </Stack>
                    </Sheet.Header>
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <Box style={{ padding: "0 10px" }}>
                                {isUpload && !isNullOrEmpty(thumbList[0].PATH_NM) && (
                                    <>
                                        <ImageGallery
                                            autoPlay
                                            thumbnailPosition={"bottom"}
                                            useWindowKeyDown
                                            showGalleryFullscreenButton
                                            lazyLoad
                                            infinite
                                            useTranslate3D
                                            items={thumbList.map((item, index) => {
                                                return {
                                                    original: item.PATH_NM,
                                                    thumbnail: item.PATH_NM,
                                                };
                                            })}
                                            showBullets
                                            showIndex
                                        />
                                    </>
                                )}
                                {!isUpload && (
                                    <Uploader
                                        action=""
                                        accept="image/*"
                                        acceptType={["jpg", "gif", "png", "JPG"]}
                                        draggable
                                        autoUpload={false}
                                        listType="picture-text"
                                        multiple={true}
                                        fileList={thumbList}
                                        onChange={setThumbList}
                                    >
                                        <div
                                            style={{
                                                height: 150,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "3px dashed #3e79f0",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <CloudUploadIcon
                                                sx={{ fontSize: 55, color: "#005abc" }}
                                            />
                                            <span>{t("plholder_upload_img")}</span>
                                        </div>
                                    </Uploader>
                                )}
                            </Box>
                        </Sheet.Scroller>
                        <Box sx={{ padding: "10px 10px 0" }}>
                            <TextField
                                inputProps={{ inputMode: "text" }}
                                value={upComment}
                                disabled={isUpload}
                                sx={{ background: "#f8f6f7" }}
                                onChange={(event) => {
                                    handleUpComment(event);
                                }}
                                rows={3}
                                multiline={true}
                                className="b-input bg-white"
                                fullWidth
                                placeholder={t("title_comment")}
                            />
                            {!validComment && (
                                <Typography className="b-validate" sx={{
                                    fontSize: "14px",
                                    fontStyle: "italic",
                                    fontWeight: 600,
                                    color: "red",
                                    marginTop: "5px",
                                    gap: "3px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    fontFamily: "Mulish, Nunito, sans-serif"
                                }}>
                                    <HighlightOffIcon sx={{ width: "17px", height: "17px" }} />
                                    {t("frm_required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ padding: "10px" }}>
                            {!isUpload && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    disabled={disableReg ? true : disableUploadImgBtn()}
                                    sx={{
                                        height: 45,
                                        textTransform: "none",
                                        fontWeight: "600",
                                        fontSize: "17px",
                                        boxShadow: "none",
                                        background: "linear-gradient(90deg,#427642,seagreen)",
                                        display: "flex",
                                    }}
                                    onClick={handleUploadImg}
                                >
                                    Upload
                                </Button>
                            )}
                        </Box>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop
                    onTap={async () => {
                        setUploadOpen(false);
                    }}
                />
            </Sheet>
            <Sheet
                isOpen={isOpen}
                detent="content-height"
                onClose={() => setOpen(false)}
            >
                <Sheet.Container>
                    <Sheet.Header
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <CloseIcon
                            onClick={() => setOpen(false)}
                            sx={{
                                fontSize: isMobile ? 26 : 30,
                                color: "#666",
                                transition: "all .4s ease",
                                cursor: "pointer",
                                "&:hover": { opacity: 0.8 },
                                textAlign: "right",
                                paddingTop: "3px",
                                paddingRight: "3px"
                            }}
                        />
                    </Sheet.Header>
                    <Sheet.Content>
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                position: "relative",
                                marginBottom: "10px",
                                padding: "0 5px",
                            }}
                        >
                            <Typography
                                onClick={() => setOpen(false)}
                                sx={{
                                    fontSize: 20,
                                    fontWeight: "700",
                                    color: "#072d7a",
                                    textTransform: "capitalize",
                                    cursor: "pointer",
                                }}
                            >
                                {selectedName}
                            </Typography>
                            {localStorage.getItem("CONT_USER_INFOR") !== null &&
                                pageLocation === "1" &&
                                (JSON.parse(localStorage.getItem("CONT_USER_INFOR"))
                                    .Permission === "SCR" ||
                                    JSON.parse(localStorage.getItem("CONT_USER_INFOR"))
                                        .Permission === "ADMIN") && (
                                    <Button
                                        fullWidth
                                        endIcon={<CreateIcon />}
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        disabled={disableReg ? true : disableSubmit}
                                        sx={{
                                            height: 35,
                                            maxWidth: 140,
                                            textTransform: "none",
                                            fontWeight: "600",
                                            fontSize: "15px",
                                            boxShadow: "none",
                                            background: "linear-gradient(90deg,#427642,seagreen)",
                                            display: "flex",
                                        }}
                                        onClick={handleUpload}
                                    >
                                        {t("btn_submit")}
                                    </Button>
                                )}
                            {localStorage.getItem("CONT_USER_INFOR") !== null &&
                                pageLocation === "2" &&
                                (JSON.parse(localStorage.getItem("CONT_USER_INFOR"))
                                    .Permission === "RSM" ||
                                    JSON.parse(localStorage.getItem("CONT_USER_INFOR"))
                                        .Permission === "DEPT" ||
                                    JSON.parse(localStorage.getItem("CONT_USER_INFOR"))
                                        .Permission === "ADMIN") && (
                                    <Button
                                        fullWidth
                                        endIcon={<CreateIcon />}
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        disabled={disableReg ? true : disableSubmit}
                                        sx={{
                                            height: 35,
                                            maxWidth: 140,
                                            textTransform: "none",
                                            fontWeight: "600",
                                            fontSize: "15px",
                                            boxShadow: "none",
                                            background: "linear-gradient(90deg,#427642,seagreen)",
                                            display: "flex",
                                        }}
                                        onClick={handleUpload}
                                    >
                                        {t("btn_submit")}
                                    </Button>
                                )}
                        </Stack>
                        {pageLocation === "1" &&
                            <Stack
                                direction={"row"}
                                spacing={1}
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ marginBottom: "10px" }}
                            >
                                <Box sx={{paddingLeft: "10px"}}>
                                    <TextInput
                                        id={EmpSelectData.EMP_CITIZEN_ID}
                                        value={visitorID}
                                        defaultDate={EmpSelectData.VISITOR_ID}
                                        handleChange={handleVisitorTextChange} />
                                </Box>
                                {/* {EmpSelectData.CHECKED_YN === "N" &&
                                    <Box onClick={() => handleEmpAddInforCheck("VACATION", EmpSelectData.IS_VACATION === "Y")}
                                        className={EmpSelectData.IS_VACATION === "Y" ? "b-status b-status--crimson" : "b-status b-status--gray"}
                                        sx={{ width: "130px" }}>
                                        <Stack
                                            flexDirection="row"
                                            alignItems="center"
                                            gap={0.5}
                                        >
                                            <Box className="b-icon">
                                                <SentimentVeryDissatisfiedIcon sx={{ fontSize: 26 }} />
                                            </Box>
                                        </Stack>
                                        <Box sx={{ opacity: 0.95 }}>
                                            {t("text_vacation")}
                                        </Box>
                                    </Box>
                                } */}
                                {EmpSelectData.CHECKED_YN === "Y" &&
                                    <Box onClick={() => handleEmpAddInforCheck("CHECK_OUT", !isNullOrEmpty(EmpSelectData.INS_1_OUT_DT))}
                                        className={!isNullOrEmpty(EmpSelectData.INS_1_OUT_DT) ? "b-status" : "b-status b-status--gray"}
                                        sx={{ width: "160px" }}>
                                        <Stack
                                            flexDirection="row"
                                            alignItems="center"
                                            gap={0.5}
                                        >
                                            <Box className="b-icon">
                                                <TransferWithinAStationIcon sx={{ fontSize: 26 }} />
                                            </Box>
                                        </Stack>
                                        <Box sx={{ opacity: 0.95 }}>
                                            {t("text_check_out")}
                                        </Box>
                                    </Box>
                                }
                            </Stack>
                        }
                        <Table size="small" aria-label="a dense table" className="b-table">
                            {pageLocation !== "3" && (
                                <TableHead className="b-table-head">
                                    <TableRow>
                                        <StyledTableCell width="50%" align="center" rowSpan={2}>
                                            {t("title_inspect")}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            width="39%"
                                            align="center"
                                            colSpan={3}
                                            className="b-border-bottom"
                                        >
                                            {t("tb_status")}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            width="11%"
                                            align="center"
                                            rowSpan={2}
                                            className="b-border-none"
                                        ></StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell width="13%" align="center">
                                            OK
                                        </StyledTableCell>
                                        <StyledTableCell width="13%" align="center">
                                            NO
                                        </StyledTableCell>
                                        <StyledTableCell width="13%" align="center">
                                            N/A
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            )}
                            {pageLocation === "3" && (
                                <TableHead className="b-table-head">
                                    <TableRow>
                                        <StyledTableCell width="60%" align="center">
                                            {t("title_inspect")}
                                        </StyledTableCell>
                                        <StyledTableCell width="29%" align="center">
                                            {t("title_checked_res")}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            width="11%"
                                            align="center"
                                            className="b-border-none"
                                        ></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            )}
                        </Table>
                        <Sheet.Scroller>
                            <Box style={{ height: sheetHeight }}>
                                {checklist !== null &&
                                    checklist.length > 0 &&
                                    checklist.map((item, index) => (
                                        <ChecklistCard
                                            key={index}
                                            data={item}
                                            handleCheck={handleChecklist}
                                            validPermiss={userPermiss}
                                        />
                                    ))}
                            </Box>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop
                    onTap={async () => {
                        setOpen(false);
                    }}
                />
            </Sheet>
        </Container>
    );
}