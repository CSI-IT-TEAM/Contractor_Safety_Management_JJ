import {
    Container,
    Grid,
    Box,
    Typography,
    Stack,
    Button,
    TextField,
    Paper,
    TableContainer,
    TableHead,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    InputAdornment,
    Badge,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@mui/icons-material/Search";
import {
    ContractorBlacklistUpdateURL,
    ContractorDeleteURL,
    ContractorUpdateURL,
    CoopImageExistCheck,
    CoopImageListSelectURL,
    UploadCoopImageURL,
    VendorListSelectURL,
} from "../../api";
import {
    ContractorBlacklistUpdateParams,
    ContractorSaveParams,
} from "../../data/configParams";
import {
    UploadContractorBlacklistUpdateParams,
    UploadContractorDeleteParams,
    UploadContractorSaveParams,
    UploadCoopImageExistCheck,
    UploadCoopImageParams,
    UploadCoopImagesListSelectParams,
    UploadVendorListSelectParams,
} from "../../data/uploadParams";
import { fetchData, fetchPostFormData, getUserPermissOnPage, isNullOrEmpty } from "../../functions";
import Swal from "sweetalert2";
import {
    Drawer,
    IconButton,
    Message,
    Modal,
    Placeholder,
    Tooltip,
    Uploader,
    Whisper,
} from "rsuite";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { motion } from "framer-motion";
import dayjs from "dayjs";

import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EmptyCard from "../../components/Card/EmptyCard";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

const width = window.innerWidth;

export default function ContractorMgntPage() {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;
    const sheetWidth = isMobile ? 0.9 * width : 600;

    /////Init Variables
    const [VendorList, setVendorList] = useState([]);
    const [VendorListLocal, setVendorListLocal] = useState([]);
    const [NewVendorCode, setNewVendorCode] = useState("");
    const [isUpdating, setisUpdating] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [VendorDataList, setVendorDataList] = useState(ContractorSaveParams);
    const [VendorBlacklistData, setVendorBlacklistData] = useState(
        ContractorBlacklistUpdateParams
    );
    const [isSubmited, setIsSubmited] = useState(false);
    const [fillterWord, setfillterWord] = useState("");
    const [isOpen, setisOpen] = useState(false);
    const [VendorSelect, setVendorSelect] = useState([]);
    const [isError, setisError] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [drawOpen, setdrawOpen] = useState(false);
    const [thumbList, setThumbList] = useState([]);
    const [thumbList2, setThumbList2] = useState([]);
    const [CoopImagesList, setCoopImagesList] = useState([]);
    const [tabValue, settabValue] = useState("VIEW");
    const [CoopDate, setCoopDate] = useState(dayjs(new Date()));
    const [Modalopen, setModalOpen] = React.useState(false);
    const handleTabChange = (event, newValue) => {
        settabValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR")); //useSelector(selectUser);
    ////// Transldate
    const { t } = useTranslation();
    const location = useLocation();

    const tooltip = (row) => {
        return (
            <Tooltip>
                <Typography>
                    {t("text_add_to_blacklist_date")} <b>{row.BLACKLIST_DATE}</b>
                </Typography>
                <Typography>
                    {t("text_reason")} <b>{row.BLACKLIST_REASON}</b>
                </Typography>
            </Tooltip>
        );
    };

    const cont_columns = [
        {
            id: "CONT_NAME",
            label: t("frm_vendor"),
            minWidth: 170,
            fontweight: 500,
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_ADDRESS",
            label: "Address",
            minWidth: isMobile ? 200 : 100,
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_EMAIL",
            label: t("frm_email"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "CONT_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
        {
            id: "PIC",
            label: t("frm_pic"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 1,
            colCount: 2,
        },
        {
            id: "BLACKLIST_TIMES",
            label: t("frm_blacklist_times"),
            minWidth: 120,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            rowCount: 2,
            colCount: 1,
        },
    ];

    const cont_body_columns = [
        {
            id: "CONT_NAME",
            label: t("frm_vendor"),
            minWidth: 170,
            fontweight: 500,
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "CONT_ADDRESS",
            label: "Address",
            minWidth: 100,
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "CONT_EMAIL",
            label: t("frm_email"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "CONT_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "CONT_PIC",
            label: t("frm_full_nm"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "CONT_PIC_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "BLACKLIST_TIMES",
            label: t("frm_blacklist_times"),
            minWidth: 120,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
    ];

    const cont_child_columns = [
        {
            id: "CONT_PIC",
            label: t("frm_full_nm"),
            minWidth: 170,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "CONT_PIC_PHONE",
            label: t("frm_phone"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
    ];

    const getVendorList = async () => {
        setisLoading(true);
        await fetchData(
            VendorListSelectURL,
            UploadVendorListSelectParams({
                TYPE: "Q",
                DEPT_CD: userData.dept_cd,
            })
        )
            .then((result) => {
                setVendorList(result);
                setVendorListLocal(result);
                setisLoading(false);
            })
            .catch((error) => setisLoading(false));
    };

    const handleFindTextChange = (value) => {
        setfillterWord(value);
        let VendorTmpList = VendorListLocal;
        let vendorFillterList = VendorTmpList.filter((item) =>
            item.CONT_NAME.toUpperCase().includes(value.toUpperCase())
        );
        setVendorList(vendorFillterList);
    };

    const handleTextChange = (event, rowid) => {
        //Nếu là trường hợp Update
        if (rowid) {
            const myVendorList = [...VendorList];
            const newVendor = myVendorList.find((a) => a.ROWID === rowid);
            switch (event.target.name) {
                case "CONT_NAME":
                    newVendor.CONT_NAME = event.target.value;
                    if (event.target.value) {
                        setisUpdating(false);
                    } else {
                        setisUpdating(true);
                    }
                    break;
                case "CONT_ADDRESS":
                    newVendor.CONT_ADDRESS = event.target.value;
                    break;
                case "CONT_EMAIL":
                    newVendor.CONT_EMAIL = event.target.value;
                    break;
                case "CONT_PHONE":
                    newVendor.CONT_PHONE = event.target.value;
                    break;
                case "CONT_PIC":
                    newVendor.CONT_PIC = event.target.value;
                    break;
                case "CONT_PIC_PHONE":
                    newVendor.CONT_PIC_PHONE = event.target.value;
                    break;
                case "CONT_DESC":
                    newVendor.CONT_DESC = event.target.value;
                    break;
                default:
                    break;
            }
            // setVendorDataList(newVendor);
            setVendorList(myVendorList);
        }
        //Ngược lại là trường hợp thêm mới
        else {
            //....
            setVendorDataList((prevData) => {
                return {
                    ...prevData,
                    [event.target.name]: event.target.value,
                };
            });
        }
    };

    const handleAddNew = async(e) => {
        e.preventDefault();
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("NEW_YN", location.pathname);
        if(!_validPermiss){
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        setisUpdating(false);
        let isValid = true;
        var formData = new FormData(e.target);
        for (var [key, value] of formData.entries()) {
            if (key === "CONT_NAME" && value === "") {
                isValid = false;
            }
        }

        if (isValid) {
            //Saving Executable
            let DataUpload = UploadContractorSaveParams(VendorDataList);
            fetch(ContractorUpdateURL, {
                method: "POST",
                mode: "cors",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DataUpload),
            })
                .then((response) => {
                    response.json().then((result) => {
                        if (result) {
                            //Image checking has or not.
                            if (thumbList.length > 0) {
                                const newContCode = result[0].CONT_CODE;
                                //Prepairing for Upload Co-Op Images.
                                //Check existing images
                                const DataUpload1 = UploadCoopImageExistCheck({
                                    TYPE: "Q",
                                    COOP_DATE: dayjs(CoopDate).format("YYYYMMDD"),
                                    CONT_CODE: newContCode,
                                });

                                fetch(CoopImageExistCheck, {
                                    method: "POST",
                                    mode: "cors",
                                    dataType: "json",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(DataUpload1),
                                }).then((response) => {
                                    response.json().then((resultE) => {
                                        if (resultE) {
                                            let _Uploadresult = false;
                                            thumbList.map((item) => {
                                                let _uploadConfig = UploadCoopImageParams(
                                                    {
                                                        TYPE: "Q",
                                                        COOP_DATE: dayjs(CoopDate).format("YYYYMMDD"),
                                                        CONT_CODE: newContCode,
                                                    },
                                                    item
                                                );
                                                _Uploadresult = fetchPostFormData(
                                                    UploadCoopImageURL,
                                                    _uploadConfig
                                                );
                                            });
                                            if (_Uploadresult) {
                                                Swal.fire(
                                                    t("swal_success"),
                                                    t("swal_your_data_and_coop_image_uploaded"),
                                                    "success"
                                                ).then(() => {
                                                    setTimeout(async () => {
                                                        await getVendorList();
                                                        setVendorDataList(ContractorSaveParams);
                                                        setThumbList([]);
                                                    }, 500);
                                                });
                                            }
                                        }
                                    });
                                });
                            } else {
                                Swal.fire(
                                    t("swal_success"),
                                    t("swal_your_data_uploaded"),
                                    "success"
                                ).then(() => {
                                    setTimeout(async () => {
                                        await getVendorList();
                                        //setVendorDataList(ContractorSaveParams);
                                    }, 500);
                                });
                            }
                        } else {
                            Swal.fire(
                                t("swal_failed"),
                                t("swal_networking_error"),
                                "error"
                            ).then(() => {
                                setTimeout(() => { }, 500);
                            });
                        }
                    });
                })
                .catch((error) => { });
        } else {
            Swal.fire({
                icon: "error",
                title: t("swal_data_empty"),
                text: t("swal_checking_again"),
                footer: t("swal_red_fields_is_blank"),
            });
        }
    };

    const handleContUpdate = async(event, rowid) => {
        event.preventDefault();
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("SAVE_YN", location.pathname);
        if(!_validPermiss){
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }

        setisError(false);
        let isValid = true;
        var formData = new FormData(event.target);
        for (var [key, value] of formData.entries()) {
            if (key === "CONT_NAME" && value === "") {
                isValid = false;
            }
        }
        if (isValid) {
            setisOpen(false);
            const VendorUpdate = VendorList.find((a) => a.ROWID === rowid);
            VendorUpdate.CREATOR = userData.Permission;
            VendorUpdate.CREATE_PC = userData.username;
            VendorUpdate.CREATE_PROGRAM_ID = "VENDOR_UPDATE_SAVE";

            let DataUpload = UploadContractorSaveParams(VendorUpdate);
            fetch(ContractorUpdateURL, {
                method: "POST",
                mode: "cors",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DataUpload),
            })
                .then((response) => {
                    response.json().then((result) => {
                        if (result) {
                            //Image checking has or not.
                            if (thumbList2.length > 0) {
                                const newContCode = VendorSelect.CONT_CODE;
                                //Prepairing for Upload Co-Op Images.
                                //Check existing images
                                const DataUpload1 = UploadCoopImageExistCheck({
                                    TYPE: "Q",
                                    COOP_DATE: dayjs(CoopDate).format("YYYYMMDD"),
                                    CONT_CODE: newContCode,
                                });

                                fetch(CoopImageExistCheck, {
                                    method: "POST",
                                    mode: "cors",
                                    dataType: "json",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(DataUpload1),
                                }).then((response) => {
                                    response.json().then((resultE) => {
                                        if (resultE) {
                                            let _Uploadresult = false;
                                            thumbList2.map((item) => {
                                                let _uploadConfig = UploadCoopImageParams(
                                                    {
                                                        TYPE: "Q",
                                                        COOP_DATE: dayjs(CoopDate).format("YYYYMMDD"),
                                                        CONT_CODE: newContCode,
                                                    },
                                                    item
                                                );
                                                _Uploadresult = fetchPostFormData(
                                                    UploadCoopImageURL,
                                                    _uploadConfig
                                                );
                                            });
                                            if (_Uploadresult) {
                                                Swal.fire(
                                                    t("swal_success"),
                                                    t("swal_your_data_and_coop_image_uploaded"),
                                                    "success"
                                                ).then(() => {
                                                    setTimeout(async () => {
                                                        setisUpdating(false);
                                                        setVendorSelect([]);
                                                        setThumbList2([]);
                                                    }, 500);
                                                });
                                            }
                                        }
                                    });
                                });
                            } else {
                                Swal.fire(
                                    t("swal_success"),
                                    t("swal_your_data_uploaded"),
                                    "success"
                                ).then(() => {
                                    setTimeout(() => {
                                        setisUpdating(false);
                                        setVendorSelect([]);
                                        setThumbList2([]);
                                    }, 500);
                                });
                            }
                        } else {
                            Swal.fire(
                                t("swal_failed"),
                                t("swal_networking_error"),
                                "error"
                            ).then(() => {
                                setTimeout(() => {
                                    setisUpdating(false);
                                    setVendorSelect([]);
                                }, 500);
                            });
                        }
                    });
                })
                .catch((error) => {
                    setisOpen(false);
                    setisUpdating(false);
                    setVendorSelect([]);
                    console.error(error);
                });
        } else {
            setisError(true);
            // Swal.fire({
            //   icon: "error",
            //   title: t("swal_data_empty"),
            //   text: t("swal_checking_again"),
            //   footer: t("swal_red_fields_is_blank"),
            // });
        }
    };

    const HandleContDelete = async(rowid) => {
        ///////Check User Permission
        let _validPermiss = await getUserPermissOnPage("DELETE_YN", location.pathname);
        if(!_validPermiss){
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("invalid_permiss"),
                text: t("text_invalid_permission"),
            });
            return;
        }
        setisOpen(false);
        setisUpdating(false);
        Swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_delete_warning"), //"You won't be able to revert this!"
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                let DataUpload = UploadContractorDeleteParams({ ROWID: rowid });
                console.log(DataUpload);
                fetch(ContractorDeleteURL, {
                    method: "POST",
                    mode: "cors",
                    dataType: "json",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(DataUpload),
                }).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: t("swal_deleted"),
                            text: t("swal_delete_success"), // "Your file has been deleted.",
                            icon: "success",
                        }).then(() => {
                            setTimeout(async () => {
                                await getVendorList();
                            }, 500);
                        });
                    }
                });
            }
        });
    };

    const HandleContAddRemoveBlacklist = async(Type, vendorData) => {
        switch (Type) {
            case "S":
                ///////Check User Permission
                let _createPermiss = await getUserPermissOnPage("NEW_YN", location.pathname);
                if(!_createPermiss){
                    Swal.fire({
                        icon: "error",
                        position: "center",
                        title: t("invalid_permiss"),
                        text: t("text_invalid_permission"),
                    });
                    return;
                }

                Swal.fire({
                    title: t("swal_are_you_sure"),
                    text: t("swal_add_blacklist_warning"), //"You won't be able to revert this!"
                    icon: "warning",
                    input: "textarea",
                    inputAttributes: {
                        autocapitalize: "off",
                    },
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: t("btn_yes"),
                    cancelButtonText: t("swal_cancel"),
                }).then((result) => {
                    if (result.isConfirmed) {
                        setisOpen(false);

                        if (result.value) {
                            const DataUpload = UploadContractorBlacklistUpdateParams({
                                TYPE: "S", //S add, D: remove
                                WORK_DATE: new Date(),
                                CONT_CODE: vendorData.CONT_CODE,
                                CONT_NAME: vendorData.CONT_NAME,
                                REASON: result.value,
                            });

                            fetch(ContractorBlacklistUpdateURL, {
                                method: "POST",
                                mode: "cors",
                                dataType: "json",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(DataUpload),
                            }).then((response) => {
                                if (response.status === 200) {
                                    Swal.fire(
                                        t("swal_success"),
                                        t("swal_add_blacklist_success"),
                                        "success"
                                    ).then(() => {
                                        setTimeout(async () => await getVendorList(), 500);
                                    });
                                } else {
                                    Swal.fire(
                                        t("swal_failed"),
                                        t("swal_networking_error"),
                                        "error"
                                    ).then(() => {
                                        setTimeout(() => {
                                            setisUpdating(false);
                                            setVendorSelect([]);
                                        }, 500);
                                    });
                                }
                            });
                        } else {
                            Swal.fire(
                                t("swal_failed"),
                                t("swal_forgot_input_reason"),
                                "error"
                            ).then(() => {
                                setTimeout(() => { }, 500);
                            });
                        }
                    }
                });
                break;
            case "D":
                ///////Check User Permission
                let _deletePermiss = await getUserPermissOnPage("NEW_YN", location.pathname);
                if(!_deletePermiss){
                    Swal.fire({
                        icon: "error",
                        position: "center",
                        title: t("invalid_permiss"),
                        text: t("text_invalid_permission"),
                    });
                    return;
                }

                Swal.fire({
                    title: t("swal_are_you_sure"),
                    text: t("swal_remove_blacklist_warning"), //"You won't be able to revert this!"
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: t("btn_yes"),
                    cancelButtonText: t("swal_cancel"),
                }).then((result) => {
                    if (result.isConfirmed) {
                        setisOpen(false);

                        const DataUpload = UploadContractorBlacklistUpdateParams({
                            TYPE: "D", //S add, D: remove
                            WORK_DATE: new Date(),
                            CONT_CODE: vendorData.CONT_CODE,
                            CONT_NAME: vendorData.CONT_NAME,
                            REASON: "iwannaremove",
                        });

                        fetch(ContractorBlacklistUpdateURL, {
                            method: "POST",
                            mode: "cors",
                            dataType: "json",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(DataUpload),
                        }).then((response) => {
                            if (response.status === 200) {
                                Swal.fire(
                                    t("swal_success"),
                                    t("swal_remove_blacklist_success"),
                                    "success"
                                ).then(() => {
                                    setTimeout(async () => await getVendorList(), 500);
                                });
                            } else {
                                Swal.fire(
                                    t("swal_failed"),
                                    t("swal_networking_error"),
                                    "error"
                                ).then(() => {
                                    setTimeout(() => {
                                        setisUpdating(false);
                                        setVendorSelect([]);
                                    }, 500);
                                });
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
    };

    const handleUploadAttachment = (item) => {
        if (item) {
            console.log(item);
        } else {
            console.log("New");
        }
    };

    const HandleItemClick = (item) => {
        setThumbList2([]);
        setisOpen(true);
        setVendorSelect(item);
    };

    const HandleViewCoopImages = (_CONT_CODE) => {
        fetchData(
            CoopImageListSelectURL,
            UploadCoopImagesListSelectParams({
                TYPE: "Q",
                COOP_DATE: dayjs(CoopDate).format("YYYYMMDD"),
                CONT_CODE: VendorSelect.CONT_CODE,
            })
        )
            .then((result) => {
                if (result && result.length > 0) {
                    setCoopImagesList(result);
                    setModalOpen(true);
                }
            })
            .catch((error) => console.error);
    };

    useEffect(() => {
        getVendorList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmited]);

    return (
        <Container
            maxWidth="full"
            sx={{
                marginTop: "15px",
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                    position: "relative",
                }}
                direction={"column"}
                className="s-contractor"
            >
                <Box style={{ position: "relative" }}>
                    <Typography variant="h5" className="s-title">
                        {t("title_contractor_mgnt")}
                    </Typography>
                </Box>
                <Box
                >
                    <Grid
                        container
                        spacing={1}
                        component={"form"}
                        onSubmit={handleAddNew}
                    >
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12} lg={6}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: "#333",
                                            fontSize: "16px",
                                            marginBottom: "3px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {t("frm_vendor")}
                                    </Typography>
                                    <TextField
                                        name="CONT_NAME"
                                        multiline
                                        maxRows={3}
                                        value={VendorDataList.CONT_NAME}
                                        error={VendorDataList.CONT_NAME === ""}
                                        placeholder={t("plholder_vendor")}
                                        fullWidth
                                        size="small"
                                        className="b-input"
                                        onChange={(e) => handleTextChange(e, "")}
                                    ></TextField>
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: "#333",
                                            fontSize: "16px",
                                            marginBottom: "3px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {t("frm_address")}
                                    </Typography>
                                    <TextField
                                        name="CONT_ADDRESS"
                                        value={VendorDataList.CONT_ADDRESS}
                                        className="b-input"
                                        multiline
                                        maxRows={3}
                                        fullWidth
                                        placeholder={t("plholder_address")}
                                        size="small"
                                        onChange={(e) => handleTextChange(e, "")}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: "#333",
                                            fontSize: "16px",
                                            marginBottom: "3px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {t("frm_email")}
                                    </Typography>
                                    <TextField
                                        name="CONT_EMAIL"
                                        value={VendorDataList.CONT_EMAIL}
                                        className="b-input"
                                        fullWidth
                                        placeholder={t("frm_email")}
                                        size="small"
                                        onChange={(e) => handleTextChange(e, "")}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: "#333",
                                            fontSize: "16px",
                                            marginBottom: "3px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {t("frm_phone")}
                                    </Typography>
                                    <TextField
                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                        name="CONT_PHONE"
                                        value={VendorDataList.CONT_PHONE}
                                        className="b-input"
                                        fullWidth
                                        placeholder={t("plholder_phone")}
                                        size="small"
                                        onChange={(e) => handleTextChange(e, "")}
                                    />
                                </Grid>
                                {isMobile ? (
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: "#333",
                                                fontSize: "16px",
                                                marginBottom: "3px",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {t("frm_pic")}
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    name="CONT_PIC"
                                                    value={VendorDataList.CONT_PIC}
                                                    className="b-input"
                                                    fullWidth
                                                    placeholder={t("frm_full_nm")}
                                                    size="small"
                                                    onChange={(e) => handleTextChange(e, "")}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                    name="CONT_PIC_PHONE"
                                                    value={VendorDataList.CONT_PIC_PHONE}
                                                    className="b-input"
                                                    fullWidth
                                                    placeholder={t('frm_phone')}
                                                    size="small"
                                                    onChange={(e) => handleTextChange(e, "")}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <>
                                        <Grid item xs={6} sm={6} md={6} lg={6}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    color: "#333",
                                                    fontSize: "16px",
                                                    marginBottom: "3px",
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {t("frm_pic")}
                                            </Typography>
                                            <TextField
                                                name="CONT_PIC"
                                                value={VendorDataList.CONT_PIC}
                                                className="b-input"
                                                fullWidth
                                                placeholder={t("frm_full_nm")}
                                                size="small"
                                                onChange={(e) => handleTextChange(e, "")}
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6} lg={6}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    color: "#333",
                                                    fontSize: "16px",
                                                    marginBottom: "3px",
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {t("frm_pic_phone")}
                                            </Typography>
                                            <TextField
                                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                name="CONT_PIC_PHONE"
                                                value={VendorDataList.CONT_PIC_PHONE}
                                                className="b-input"
                                                fullWidth
                                                placeholder="000-000-00000"
                                                size="small"
                                                onChange={(e) => handleTextChange(e, "")}
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Stack spacing={1.2}>
                                <Stack>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: "#333",
                                            fontSize: "16px",
                                            marginBottom: "3px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {t("frm_description")}
                                    </Typography>
                                    <TextField
                                        name="CONT_DESC"
                                        multiline
                                        rows={5}
                                        value={VendorDataList.CONT_DESC}
                                        placeholder={t("plholder_description")}
                                        fullWidth
                                        size="small"
                                        className="b-input b-comment"
                                        onChange={(e) => handleTextChange(e, "")}
                                    ></TextField>
                                </Stack>
                                <Badge
                                    badgeContent={`${thumbList.length} Images`}
                                    color="primary"
                                >
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="large"
                                        endIcon={<ImageIcon />}
                                        sx={{
                                            textTransform: "none",
                                            minWidth: "100px",
                                            textAlign: "center",
                                            color: "#3f51b5",
                                            borderColor: "#3f51b5"
                                        }}
                                        onClick={() => {
                                            setVendorSelect([]);
                                            setdrawOpen(!drawOpen);
                                            handleUploadAttachment(null);
                                        }}
                                    >
                                        {t("btn_attach_coop_image")}
                                    </Button>
                                </Badge>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} textAlign={"right"}>
                            <Stack direction={"row"} spacing={2} justifyContent={"end"} sx={{position: isMobile ? "relative" : "absolute", top: "4px", right: 0}}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    color="success"
                                    endIcon={<AddIcon />}
                                    sx={{
                                        textTransform: "none",
                                        minWidth: "100px",
                                        textAlign: "center",
                                        boxShadow: "none",
                                    }}
                                    type="submit"
                                //   onClick={() => handleAddNew()}
                                >
                                    {t("btn_save_new_contractor")}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Typography variant="h5" className="s-title">
                    {t("title_contractor_list")}
                </Typography>
                <Box>
                    <Stack direction={"row"} spacing={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={t("plholder_input_cont_name_for_quickly_search")} //"Nhập tên nhà thầu để tìm kiếm nhanh"
                            value={fillterWord}
                            onChange={(e) => handleFindTextChange(e.target.value)}
                            sx={{ fontSize: "16px" }}
                            InputProps={{
                                endAdornment: !isMobile ? <></> : isNullOrEmpty(fillterWord) ? (
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
                        />
                        {!isMobile && 
                            <Button
                                variant="contained"
                                endIcon={<Search />}
                                sx={{
                                    textTransform: "none",
                                    boxShadow: "none",
                                    minWidth: "150px",
                                    color: "#004299",
                                    background: "hsl(210 79% 90% / 1)",
                                    "&.MuiButtonBase-root:hover": {
                                        background: "hsl(210 79% 90% / 1)"
                                    }
                                }}
                                onClick={async () => await getVendorList()}
                            >
                                {t("btn_search")}
                            </Button>
                        }
                    </Stack>
                </Box>
                {isLoading ? (
                    <Placeholder.Grid rows={5} columns={6} />
                ) : VendorListLocal && VendorListLocal.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            type: "spring",
                        }}
                    >
                        {/* <Message
                            closable
                            type="info"
                        >
                            <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                                <Stack flexDirection="row" alignItems="center">
                                    <InfoIcon sx={{color: "#1976d2"}} />
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            paddingRight: "5px"
                                        }}
                                    >
                                        {t("title_information")}
                                    </Typography>
                                </Stack>
                                <Stack flexDirection="row" alignItems="center" gap={1}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "white",
                                        background: "#d32f2f",
                                        maxWidth: "200px",
                                        padding: 1,
                                        borderRadius: "5px",
                                        fontWeight: 500
                                    }}
                                    component={Paper}
                                >
                                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                        <NoEncryptionGmailerrorredIcon
                                            sx={{
                                                color: "white",
                                                marginRight: "5px",
                                            }}
                                        />
                                        {t("text_blacklist_contractor")}
                                    </Stack>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "black",
                                        background: "white",
                                        maxWidth: "200px",
                                        padding: 1,
                                        borderRadius: "5px",
                                        fontWeight: 500
                                    }}
                                    component={Paper}
                                >
                                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                        <HolidayVillageIcon
                                            sx={{
                                                color: "black",
                                            }}
                                        />
                                        {t("text_normal_contractor")}
                                    </Stack>
                                </Typography>
                                </Stack>
                            </Stack>
                        </Message> */}
                        <hr
                            style={{
                                border: 0,
                                borderBottom: "1px dashed #ccc",
                                background: "#999",
                            }}
                        />
                        {(VendorList === null || VendorList.length < 1) &&
                            <EmptyCard />
                        } 
                        {VendorList !== null && VendorList.length > 0 &&
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
                                        {cont_columns.map((column) => (
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
                                                    fontFamily: "Calibri,sans-serif"
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        {cont_child_columns.map((column) => (
                                            <TableCell
                                                key={column.id}
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
                                                    fontFamily: "Calibri,sans-serif"
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {VendorList.slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    ).map((row) => {
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
                                                onClick={() => HandleItemClick(row)}
                                            >
                                                {cont_body_columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            sx={{
                                                                padding: "10px",
                                                                fontWeight: column.fontweight,
                                                                background:
                                                                    row["BLACKLIST_TIMES"] >= 1 ? "#d32f2f" : "",
                                                                color:
                                                                    row["BLACKLIST_TIMES"] >= 1
                                                                        ? "white"
                                                                        : "black",
                                                            }}
                                                        >
                                                            {column.format && typeof value === "number" ? (
                                                                column.format(value)
                                                            ) : column.id === "BLACKLIST_TIMES" ? (
                                                                value >= 1 ? (
                                                                    <Whisper
                                                                        full
                                                                        placement="left"
                                                                        controlId="control-id-hover"
                                                                        trigger="hover"
                                                                        speaker={tooltip(row)}
                                                                        style={{
                                                                            minWidth: "500px",
                                                                        }}
                                                                    >
                                                                        <NoEncryptionGmailerrorredIcon />
                                                                    </Whisper>
                                                                ) : (
                                                                    value
                                                                )
                                                            ) : (
                                                                value
                                                            )}
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
                            count={VendorListLocal.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                            </>
                        }
                        
                    </motion.div>
                ) : (
                    <Grid item xs={12} md={12} lg={12}>
                        <EmptyCard type={"empty"} />
                    </Grid>
                )}
                <Drawer
                    // backdrop="static"
                    size="40rem"
                    placement={"bottom"}
                    open={isOpen}
                    onClose={() => setisOpen(false)}
                >
                    <Drawer.Header closeButton={false} className="s-drawer--header">
                        <Drawer.Title>
                            <Typography
                                width={"100%"}
                                variant="h5"
                                component={"div"}
                                sx={{
                                    color: "navy",
                                    fontWeight: 700,
                                    fontSize: isMobile ? "23px" : "25px",
                                    textAlign: isMobile ? "left" : "center",
                                }}
                            >
                                {t("title_contractor_detail_list")}
                            </Typography>
                        </Drawer.Title>
                        <Drawer.Actions>
                            <IconButton
                                sx={{
                                    color: "red",
                                    textTransform: "none",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                }}
                                icon={<CloseIcon />}
                                onClick={async () => {
                                    setisOpen(false);
                                    if (VendorSelect) {
                                        await getVendorList();
                                    }
                                }}
                            ></IconButton>
                        </Drawer.Actions>
                    </Drawer.Header>
                    <Drawer.Body className="s-drawer--reg">
                        <Box
                            sx={{
                                width: "100%",
                            }}
                            component={"form"}
                            onSubmit={(e) => handleContUpdate(e, VendorSelect.ROWID)}
                        >
                            <Stack spacing={1}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={8} md={8} lg={7}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        fontSize: "16px",
                                                        textTransform: "capitalize",
                                                        marginBottom: "3px",
                                                    }}
                                                >
                                                    {t("frm_vendor")}
                                                </Typography>
                                                <TextField
                                                    name="CONT_NAME"
                                                    multiline
                                                    maxRows={3}
                                                    value={VendorSelect.CONT_NAME}
                                                    error={VendorSelect.CONT_NAME === ""}
                                                    helperText={
                                                        VendorSelect.CONT_NAME === ""
                                                            ? t("swal_red_fields_is_blank")
                                                            : ""
                                                    }
                                                    placeholder={t("plholder_vendor")}
                                                    fullWidth
                                                    size="small"
                                                    className="b-input"
                                                    onChange={(e) =>
                                                        handleTextChange(e, VendorSelect.ROWID)
                                                    }
                                                ></TextField>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={6}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        fontSize: "16px",
                                                        textTransform: "capitalize",
                                                        marginBottom: "3px",
                                                    }}
                                                >
                                                    {t("frm_address")}
                                                </Typography>
                                                <TextField
                                                    name="CONT_ADDRESS"
                                                    value={VendorSelect.CONT_ADDRESS}
                                                    className="b-input"
                                                    multiline
                                                    maxRows={3}
                                                    fullWidth
                                                    placeholder={t("plholder_address")}
                                                    size="small"
                                                    onChange={(e) =>
                                                        handleTextChange(e, VendorSelect.ROWID)
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        fontSize: "16px",
                                                        textTransform: "capitalize",
                                                        marginBottom: "3px",
                                                    }}
                                                >
                                                    {t("frm_email")}
                                                </Typography>
                                                <TextField
                                                    name="CONT_EMAIL"
                                                    value={VendorSelect.CONT_EMAIL}
                                                    className="b-input"
                                                    fullWidth
                                                    placeholder={t("frm_email")}
                                                    size="small"
                                                    onChange={(e) =>
                                                        handleTextChange(e, VendorSelect.ROWID)
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        fontSize: "16px",
                                                        textTransform: "capitalize",
                                                        marginBottom: "3px",
                                                    }}
                                                >
                                                    {t("frm_phone")}
                                                </Typography>
                                                <TextField
                                                    inputProps={{
                                                        inputMode: "numeric",
                                                        pattern: "[0-9]*",
                                                    }}
                                                    name="CONT_PHONE"
                                                    value={VendorSelect.CONT_PHONE}
                                                    className="b-input"
                                                    fullWidth
                                                    placeholder={t("plholder_phone")}
                                                    size="small"
                                                    onChange={(e) =>
                                                        handleTextChange(e, VendorSelect.ROWID)
                                                    }
                                                />
                                            </Grid>
                                            {isMobile ? (
                                                <Grid item xs={12}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: "#333",
                                                            fontSize: "16px",
                                                            textTransform: "capitalize",
                                                            marginBottom: "3px",
                                                        }}
                                                    >
                                                        {t("frm_pic")}
                                                    </Typography>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                name="CONT_PIC"
                                                                value={VendorSelect.CONT_PIC}
                                                                className="b-input"
                                                                fullWidth
                                                                placeholder={t("plholder_pic")}
                                                                size="small"
                                                                onChange={(e) =>
                                                                    handleTextChange(e, VendorSelect.ROWID)
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                inputProps={{
                                                                    inputMode: "numeric",
                                                                    pattern: "[0-9]*",
                                                                }}
                                                                name="CONT_PIC_PHONE"
                                                                value={VendorSelect.CONT_PIC_PHONE}
                                                                className="b-input"
                                                                fullWidth
                                                                placeholder={t("plholder_pic_phone")}
                                                                size="small"
                                                                onChange={(e) =>
                                                                    handleTextChange(e, VendorSelect.ROWID)
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: "#333",
                                                                fontSize: "16px",
                                                                textTransform: "capitalize",
                                                                marginBottom: "3px",
                                                            }}
                                                        >
                                                            {t("frm_pic")}
                                                        </Typography>
                                                        <TextField
                                                            name="CONT_PIC"
                                                            value={VendorSelect.CONT_PIC}
                                                            className="b-input"
                                                            fullWidth
                                                            placeholder={t("plholder_pic")}
                                                            size="small"
                                                            onChange={(e) =>
                                                                handleTextChange(e, VendorSelect.ROWID)
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: "#333",
                                                                fontSize: "16px",
                                                                textTransform: "capitalize",
                                                                marginBottom: "3px",
                                                            }}
                                                        >
                                                            {t("frm_pic_phone")}
                                                        </Typography>
                                                        <TextField
                                                            inputProps={{
                                                                inputMode: "numeric",
                                                                pattern: "[0-9]*",
                                                            }}
                                                            name="CONT_PIC_PHONE"
                                                            value={VendorSelect.CONT_PIC_PHONE}
                                                            className="b-input"
                                                            fullWidth
                                                            placeholder={t("plholder_pic_phone")}
                                                            size="small"
                                                            onChange={(e) =>
                                                                handleTextChange(e, VendorSelect.ROWID)
                                                            }
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        fontSize: "16px",
                                                        textTransform: "capitalize",
                                                        marginBottom: "3px",
                                                    }}
                                                >
                                                    {t("frm_description")}
                                                </Typography>
                                                <TextField
                                                    name="CONT_DESC"
                                                    multiline
                                                    sx={{ display: "flex" }}
                                                    rows={isMobile ? 4 : 6}
                                                    value={VendorSelect.CONT_DESC}
                                                    className="b-input"
                                                    fullWidth
                                                    placeholder={t("plholder_description")}
                                                    size="small"
                                                    onChange={(e) =>
                                                        handleTextChange(e, VendorSelect.ROWID)
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={5}>
                                        <Stack
                                            spacing={1}
                                            sx={{
                                                height: "100%",
                                            }}
                                        >
                                            <Stack spacing={0.2}>
                                                <Stack
                                                    direction={isMobile ? "column" : "row"}
                                                    spacing={isMobile ? 1 : 0.5}
                                                    alignItems={isMobile ? "flex-start" : "center"}
                                                    justifyContent={"space-between"}
                                                >
                                                    <Box sx={{width : "100%"}}>
                                                        <Typography
                                                            style={{
                                                                fontWeight: 600,
                                                                color: "#333",
                                                                marginBottom: 3,
                                                                fontSize: 16,
                                                            }}
                                                        >
                                                            {t("title_coop_date")}
                                                        </Typography>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                value={CoopDate}
                                                                onChange={setCoopDate}
                                                                className="b-input b-dateinput"
                                                                sx={{width : "100%"}}
                                                            />
                                                        </LocalizationProvider>
                                                    </Box>
                                                    <Button
                                                        endIcon={
                                                            <ImageIcon
                                                                sx={{
                                                                    fontSize: "1.5rem",
                                                                }}
                                                            />
                                                        }
                                                        variant="outlined"
                                                        sx={{
                                                            alignSelf: "end",
                                                            textAlign: "end",
                                                            textTransform: "none",
                                                            color: "#3f51b5",
                                                            borderColor: "#3f51b5",
                                                            minHeight: "47px",
                                                            width: "100%",
                                                        }}
                                                        onClick={() =>
                                                            HandleViewCoopImages(VendorSelect.CONT_CODE)
                                                        }
                                                    >
                                                        {t("title_coop_image")}
                                                    </Button>
                                                    {thumbList2.length > 0 ? (
                                                        <Button
                                                            endIcon={
                                                                <RemoveCircleOutlineIcon
                                                                    sx={{
                                                                        fontSize: "1.5rem",
                                                                    }}
                                                                />
                                                            }
                                                            variant="contained"
                                                            sx={{
                                                                alignSelf: "end",
                                                                textAlign: "end",
                                                                textTransform: "none",
                                                                color: "#fff",
                                                                borderColor: "#d32f2f",
                                                                minHeight: "47px",
                                                                minWidth: "120px",
                                                                background: "#d32f2f",
                                                            }}
                                                            onClick={() =>
                                                                setThumbList2([])
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    ) : null}
                                                </Stack>
                                            </Stack>
                                            {thumbList2.length === 0 ? (
                                                <Uploader
                                                    action=""
                                                    accept="image/*"
                                                    draggable
                                                    autoUpload={false}
                                                    listType="picture-text"
                                                    multiple={true}
                                                    fileList={thumbList2}
                                                    onChange={setThumbList2}
                                                    style={{
                                                        height: "100%",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            minHeight: "340px",
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
                                            ) : (
                                                thumbList2.length > 0 && (
                                                    <ImageGallery
                                                        style={{
                                                            minHeight: "90vh",
                                                        }}
                                                        autoPlay
                                                        thumbnailPosition={"right"}
                                                        useWindowKeyDown
                                                        showGalleryFullscreenButton
                                                        lazyLoad
                                                        infinite
                                                        useTranslate3D
                                                        items={thumbList2.map((item, index) => {
                                                            return {
                                                                original: URL.createObjectURL(item.blobFile),
                                                                thumbnail: URL.createObjectURL(item.blobFile),
                                                            };
                                                        })}
                                                        showBullets={false}
                                                        showIndex
                                                    />
                                                )
                                                // <Stack>
                                                //   <img
                                                //     alt="Coop Registration Number"
                                                //     style={{
                                                //       width: "100%",
                                                //     }}
                                                //     src={URL.createObjectURL(item.blobFile)}
                                                //   />
                                                // </Stack>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <hr
                                        style={{
                                            border: 0,
                                            borderBottom: "1px dashed #ccc",
                                            background: "#999",
                                        }}
                                    />
                                    <Stack direction={"row"} spacing={1} justifyContent={"end"}>
                                        {(userData.Permission === "ADMIN" ||
                                            userData.Permission === "RSM") &&
                                            VendorSelect.BLACKLIST_TIMES >= 1 ? (
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="error"
                                                endIcon={<EventBusyIcon />}
                                                sx={{
                                                    textTransform: "none",
                                                    minWidth: "100px",
                                                    textAlign: "center",
                                                    padding: !isMobile ? "10px 20px" : "10px 15px",
                                                }}
                                                onClick={() => {
                                                    HandleContAddRemoveBlacklist("D", VendorSelect);
                                                }}
                                            >
                                                {t("btn_remove_from_blacklist")}
                                            </Button>
                                        ) : (
                                            userData.Permission !== "DEPT" && (
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    endIcon={<AutoStoriesIcon />}
                                                    sx={{
                                                        textTransform: "none",
                                                        minWidth: "100px",
                                                        textAlign: "center",
                                                        background: "#3d3d3d",
                                                        '&:hover': { background: "black",},
                                                        padding: !isMobile ? "10px 20px" : "10px 15px",
                                                    }}
                                                    onClick={() => {
                                                        HandleContAddRemoveBlacklist("S", VendorSelect);
                                                    }}
                                                >
                                                    {t("btn_add_to_blacklist")}
                                                </Button>
                                            )
                                        )}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            color="warning"
                                            endIcon={<UpdateIcon />}
                                            sx={{
                                                textTransform: "none",
                                                minWidth: "100px",
                                                textAlign: "center",
                                                padding: !isMobile ? "10px 20px" : "10px 15px",
                                                color: "#ed6c02",
                                                boxShadow: "none",
                                                background: "hsl(27 98% 92% / 1)",
                                                "&.MuiButtonBase-root:hover": {
                                                    background: "hsl(27 98% 92% / 1)"
                                                }
                                            }}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            endIcon={<DeleteIcon />}
                                            sx={{
                                                textTransform: "none",
                                                minWidth: "100px",
                                                textAlign: "center",
                                                padding: !isMobile ? "10px 20px" : "10px 15px",
                                                color: "#d32f2f",
                                                boxShadow: "none",
                                                background: "hsl(0 65% 95% / 1)",
                                                "&.MuiButtonBase-root:hover": {
                                                    background: "hsl(0 65% 95% / 1)"
                                                }
                                            }}
                                            onClick={() => {
                                                HandleContDelete(VendorSelect.ROWID);
                                            }}
                                        >
                                            {t("btn_delete")}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Stack>
                        </Box>
                    </Drawer.Body>
                </Drawer>
            </Stack>

            {VendorSelect.CONT_NAME ? (
                //Update
                <Drawer
                    size={isMobile ? sheetWidth : "md"}
                    placement={"right"}
                    open={drawOpen}
                    onClose={() => setdrawOpen(false)}
                >
                    <Drawer.Header className="s-drawer--header">
                        <Drawer.Title>
                            <Typography
                                width={"100%"}
                                variant="h5"
                                component={"div"}
                                sx={{
                                    color: "navy",
                                    fontWeight: 700,
                                    fontSize: isMobile ? "23px" : "25px",
                                    textAlign: isMobile ? "left" : "center",
                                }}
                            >
                                {t("title_upload_coop_image")}
                            </Typography>
                        </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body className="s-drawer--reg">
                        <Stack
                            spacing={1}
                            sx={{
                                height: "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    alignSelf: "center",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                }}
                            >
                                {VendorSelect.CONT_NAME}
                            </Typography>
                            <Stack spacing={0.2}>
                                <Stack
                                    direction={"row"}
                                    spacing={1}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                >
                                    <Box>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                color: "#333",
                                                marginBottom: 3,
                                                fontSize: 16,
                                            }}
                                        >
                                            {t("title_coop_date")}
                                        </Typography>
                                        <DatePicker
                                            value={new Date()}
                                            cleanable={false}
                                            editable={false}
                                            size="lg"
                                            oneTap
                                            style={{
                                                minWidth: "200px",
                                            }}
                                        />
                                    </Box>
                                    {thumbList2.length > 0 && (
                                        <Button
                                            endIcon={<DeleteIcon />}
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                textTransform: "none",
                                            }}
                                            onClick={() => setThumbList([])}
                                        >
                                            {t("btn_delete")}
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                            {thumbList2.length === 0 ? (
                                <Uploader
                                    action=""
                                    accept="image/*"
                                    draggable
                                    autoUpload={false}
                                    listType="picture-text"
                                    multiple={true}
                                    fileList={thumbList2}
                                    onChange={setThumbList2}
                                >
                                    <div
                                        style={{
                                            height: "70vh",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "3px dashed #3e79f0",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        <CloudUploadIcon sx={{ fontSize: 55, color: "#005abc" }} />
                                        <span>{t("plholder_upload_img")}</span>
                                    </div>
                                </Uploader>
                            ) : (
                                thumbList.length > 0 && (
                                    <ImageGallery
                                        style={{
                                            minHeight: "90vh",
                                        }}
                                        autoPlay
                                        thumbnailPosition={"right"}
                                        useWindowKeyDown
                                        showGalleryFullscreenButton
                                        lazyLoad
                                        infinite
                                        useTranslate3D
                                        items={thumbList2.map((item, index) => {
                                            return {
                                                original: URL.createObjectURL(item.blobFile),
                                                thumbnail: URL.createObjectURL(item.blobFile),
                                            };
                                        })}
                                        showBullets={false}
                                        showIndex
                                    />
                                )
                            )}
                        </Stack>
                    </Drawer.Body>
                </Drawer>
            ) : (
                <Drawer
                    size={isMobile ? sheetWidth : "md"}
                    placement={"right"}
                    open={drawOpen}
                    onClose={() => setdrawOpen(false)}
                >
                    <Drawer.Header className="s-drawer--header">
                        <Drawer.Title>
                            <Typography
                                width={"100%"}
                                variant="h5"
                                component={"div"}
                                sx={{
                                    color: "navy",
                                    fontWeight: 700,
                                    textAlign: "center",
                                    fontSize: isMobile ? "23px" : "25px",
                                }}
                            >
                                {t("title_upload_coop_image")}
                            </Typography>
                        </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body className="s-drawer--reg">
                        <Stack
                            spacing={1}
                            sx={{
                                height: "100%",
                            }}
                        >
                            <Stack spacing={0.2}>
                                <Stack
                                    direction={"row"}
                                    spacing={1}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                >
                                    <Box>
                                        <Typography
                                            style={{
                                                fontWeight: 600,
                                                color: "#333",
                                                marginBottom: 3,
                                                fontSize: 16,
                                            }}
                                        >
                                            {t("title_coop_date")}
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={CoopDate}
                                                onChange={setCoopDate}
                                                className="b-input"
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    {thumbList.length > 0 && (
                                        <Button
                                            endIcon={<DeleteIcon />}
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                textTransform: "none",
                                            }}
                                            onClick={() => setThumbList([])}
                                        >
                                            {t("btn_delete")}
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                            {thumbList.length === 0 ? (
                                <Uploader
                                    action=""
                                    accept="image/*"
                                    draggable
                                    autoUpload={false}
                                    listType="picture-text"
                                    multiple={true}
                                    fileList={thumbList}
                                    onChange={setThumbList}
                                >
                                    <div
                                        style={{
                                            height: "70vh",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "3px dashed #3e79f0",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        <CloudUploadIcon sx={{ fontSize: 55, color: "#005abc" }} />
                                        <span>{t("plholder_upload_img")}</span>
                                    </div>
                                </Uploader>
                            ) : (
                                thumbList.length > 0 && (
                                    <ImageGallery
                                        style={{
                                            minHeight: "90vh",
                                        }}
                                        autoPlay
                                        thumbnailPosition={"right"}
                                        useWindowKeyDown
                                        showGalleryFullscreenButton
                                        lazyLoad
                                        infinite
                                        useTranslate3D
                                        items={thumbList.map((item, index) => {
                                            return {
                                                original: URL.createObjectURL(item.blobFile),
                                                thumbnail: URL.createObjectURL(item.blobFile),
                                            };
                                        })}
                                        showBullets={false}
                                        showIndex
                                    />
                                )
                            )}
                        </Stack>
                    </Drawer.Body>
                </Drawer>

                //Modal Coop Pictures by Contractor
            )}
            <Modal size={"lg"} open={Modalopen} onClose={() => setModalOpen(false)}>
                <Modal.Header>
                    <Modal.Title>
                        <Typography
                            width={"100%"}
                            variant="h5"
                            component={"div"}
                            sx={{
                                color: "navy",
                                fontWeight: 700,
                                textAlign: "center",
                                fontSize: isMobile ? "23px" : "25px",
                            }}
                        >
                            {t("title_view_coop_image")}
                        </Typography>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Placeholder.Paragraph rows={100} /> */}
                    <Stack alignItems={"center"}>
                        <ImageGallery
                            style={{
                                width: "100%",
                            }}
                            autoPlay
                            thumbnailPosition={"bottom"}
                            useWindowKeyDown
                            showGalleryFullscreenButton
                            // lazyLoad
                            infinite
                            useTranslate3D
                            items={CoopImagesList.map((item, index) => {
                                return {
                                    original: item.IMAGE_PATH,
                                    thumbnail: item.IMAGE_PATH,
                                    description: item.COOP_DATE,
                                };
                            })}
                            showBullets={true}
                            showIndex
                        />
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalOpen(false)}
                        variant="outlined"
                        color="primary"
                    >
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}