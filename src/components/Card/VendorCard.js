import { Box, Grid, Paper, TextField, Typography, Stack, Tooltip } from "@mui/material";
import Select, { components } from "react-select";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "rsuite";
import Swal from "sweetalert2";
import { isAfter } from "date-fns";
import {
    getDateFormatYMD,
    isNullOrEmpty,
    getMaxBirthdayYear,
    fetchData,
    getDateFormat
} from "../../functions";
import { EmpValidRegSelectURL, InspectChecklistSelectURL } from "../../api";

import thumb1 from "../../assets/images/signal/encrypted.png";
import thumb2 from "../../assets/images/signal/piercing.png";
import thumb3 from "../../assets/images/signal/expired.png";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ConstructionIcon from '@mui/icons-material/Construction';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import SpaIcon from '@mui/icons-material/Spa';
import CloseIcon from '@mui/icons-material/Close';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const Option = (props) => (
    <components.Option {...props} className="country-option">
        <img src={props.data.icon} alt="logo" className="country-logo" />
        {props.data.label}
    </components.Option>
);
const width = window.innerWidth;

const VendorCard = ({ data, posData, handleChange, handleThumb, isUpdate, isLast = false }) => {
    //////Desktop or Mobile
    const isMobile = width < 560 ? true : false;
    const { t } = useTranslation();

    /////Init Variable
    const [date, setDate] = useState(
        isNullOrEmpty(data.EMP_BIRTHDATE)
            ? null
            : new Date(getDateFormatYMD(data.EMP_BIRTHDATE))
    );
    const [name, setName] = useState(data.EMP_NAME);
    const [gender, setGender] = useState(data.EMP_GENDER);
    const [citizenID, setCitizenID] = useState(data.EMP_CITIZEN_ID);
    const [positionCD, setPositionCD] = useState(data.EMP_POSITION);
    const [focus, setFocus] = useState(false);
    const secureCard = data.SECURITY_CARD_YN;

    /////Date
    const [maxYear, setMaxYear] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [minDate, setMinDate] = useState(null);

    const handleOptions = () => {
        let _list = [];

        for (let iCount = 0; iCount < posData.length; iCount++) {
            _list.push({
                label:
                    posData[iCount].POS_NM_EN === "Worker"
                        ? t("worker")
                        : t("supervisor"),
                value: posData[iCount].POS_CD,
            });
        }

        return _list;
    };

    const handleDatePicker = async () => {
        let vendorData = await fetchData(EmpValidRegSelectURL, {
            ARG_TYPE: "Q_RANGE",
            ARG_DATE: "",
            ARG_SEX: data.EMP_GENDER ? "MALE" : "FEMALE",
            OUT_CURSOR: "",
        });

        if (vendorData !== null && vendorData.length > 0) {
            setMaxYear((maxYear) => vendorData[0].MAX_YEAR);
            setMaxDate((maxDate) => getDateFormatYMD(vendorData[0].MAX_YMD));
            setMinDate((minDate) => getDateFormatYMD(vendorData[0].MIN_YMD));
        }
    };

    useEffect(() => {
        if (data) {
            handleDatePicker();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.EMP_GENDER]);

    ///////Valid Emp Birthday
    const handleValidDate = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let startDate = new Date(minDate);
        let endDate =  new Date(maxDate);

        if(isNullOrEmpty(event)){
            setDate((date) => event);
            handleChange(data.ID, "EMP_BIRTHDATE", event, event);
        }
        else{
            let isDateInRange = event.getTime() >= startDate.getTime() && event.getTime() <= endDate.getTime();

            if(isDateInRange){
                setDate((date) => event);
                handleChange(data.ID, "EMP_BIRTHDATE", event, event);
            }
            else{
                setDate((date) => null);
                handleChange(data.ID, "EMP_BIRTHDATE", null, null);
                Swal.fire({
                    icon: "error",
                    position: "center",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: t("swal_invalid_birthday"),
                    text: t("swal_invalid_date"),
                });
            }
        }
    };

    //////Valid Emp Blacklist
    const handleValidBlacklist = async(event: React.ChangeEvent<HTMLInputElement>) => {
        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            {
                ARG_TYPE: "Q_BLACKLIST",
                ARG_PLANT: "",
                ARG_DATE: "",
                ARG_DEPT: "",
                ARG_CONT: "",
                ARG_REQ_NO: "",
                ARG_EMP_CITIZEN_ID: event.target.value,
                ARG_PERMISS: "",
                ARG_PAGE: "",
                OUT_CURSOR: "",
            }
        );

        let _cardStatus = await handleCardStatus(event.target.value);

        if(_fetchData && _fetchData.length > 0){
            let _validBlacklist = _fetchData[0].BLACKLIST_YN;

            if(_validBlacklist === "Y"){
                handleChange(data.ID, "EMP_CITIZEN_ID", event, event.target.value, _cardStatus);
            }else{
                setCitizenID((citizenID) => "");
                handleChange(data.ID, "EMP_CITIZEN_ID", event, "", _cardStatus);

                Swal.fire({
                    icon: "error",
                    position: "center",
                    title: t("title_something_wrong"),
                    text: t("swal_invalid_emp"),
                });
            }
        }
        else{
            setCitizenID((citizenID) => "");
            handleChange(data.ID, "EMP_CITIZEN_ID", event, "", _cardStatus);
        }
    }

    //////Valid Safety Training Card
    const handleCardStatus = async(empID) => {
        let _fetchData = await fetchData(
            InspectChecklistSelectURL,
            {
                ARG_TYPE: "Q_CARD_STATUS",
                ARG_PLANT: "",
                ARG_DATE: "",
                ARG_DEPT: "",
                ARG_CONT: "",
                ARG_REQ_NO: "",
                ARG_EMP_CITIZEN_ID: empID,
                ARG_PERMISS: "",
                ARG_PAGE: "",
                OUT_CURSOR: "",
            }
        );

        if(_fetchData && _fetchData.length > 0){
            let _cardStatus = _fetchData[0].SAFETY_CARD_STATUS;
            return _cardStatus;
        }else{
            return "N";
        }
    }

    const optionsPos = handleOptions();
    const optionsGender = [
        { value: true, label: t("male") },
        { value: false, label: t("female") },
    ];
    const optionsCard = [
        { value: "Y", label: t("secure_card"), icon: thumb1 },
        { value: "EXP", label: t("expired"), icon: thumb3 },
        { value: "N", label: t("empty"), icon: thumb2 },
    ];

    const SingleValue = ({ children, ...props }) => (
        <components.SingleValue {...props}>
            <img
                src={secureCard === "Y" ? optionsCard[0].icon : secureCard === "N" ? optionsCard[2].icon : optionsCard[1].icon}
                alt="s-logo"
                className="selected-logo"
            />
            {children}
        </components.SingleValue>
    );

    return (
        <Paper
            maxWidth="full"
            square={false}
            className="b-card-10"
            sx={{
                width: "100%",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                    marginBottom: isMobile ? "15px" : "10px",
                    flexDirection: isMobile ? "column" : "row",
                    position: "relative",
                }}
            >
                <Typography
                    style={{
                        fontWeight: 600,
                        color: "#333",
                        marginBottom: isMobile ? "5px" : 0
                    }}
                >
                    {t("frm_person")} {data.ID}
                </Typography>
                <Stack flexDirection="row" gap={0.5} sx={{flexWrap: "wrap"}}>
                    <Tooltip title={t('work_perform_degree')} arrow placement="top">
                        <Stack 
                            flexDirection="row" 
                            alignItems="center" 
                            justifyContent="center" 
                            className={((!isNullOrEmpty(data.LISCENT_IMG) && data.LISCENT_IMG.length > 0) || data.JOB_LIST.length > 0) ? "b-upload b-upload--blue" : "b-upload" }
                            onClick={() => handleThumb("LISCENT_IMG", data.ID)}>
                            <RecentActorsIcon sx={{fontSize: 22}} className="b-icon" />
                            {t('job')}
                        </Stack>
                    </Tooltip>
                    <Tooltip title={t('insurance_thumb')} arrow placement="top">
                        <Stack 
                            flexDirection="row" 
                            alignItems="center" 
                            justifyContent="center" 
                            className={!isNullOrEmpty(data.INSURANCE_IMG) && data.INSURANCE_IMG.length > 0 ? "b-upload b-upload--blue" : "b-upload" }
                            onClick={() => handleThumb("INSURANCE_IMG", data.ID)}>
                            <SpaIcon sx={{fontSize: 22}} className="b-icon" />
                            {t('insurance')}
                        </Stack>
                    </Tooltip>
                    <Tooltip title={t('workplan_thumb')} arrow placement="top">
                        <Stack 
                            flexDirection="row" 
                            alignItems="center" 
                            justifyContent="center" 
                            className={!isNullOrEmpty(data.WORK_PLAN_IMG) && data.WORK_PLAN_IMG.length > 0 ? "b-upload b-upload--blue" : "b-upload" }
                            onClick={() => handleThumb("WORK_PLAN_IMG", data.ID)}>
                            <ConstructionIcon sx={{fontSize: 22}} className="b-icon" />
                            {t('workplan_thumb')}
                        </Stack>
                    </Tooltip>
                    {isUpdate &&
                        <Tooltip title={t('btn_delete')} arrow placement="top">
                            <Stack sx={{marginLeft: "5px", }}
                                flexDirection="row" 
                                alignItems="center" 
                                justifyContent="center" 
                                className="b-upload b-delete"
                                onClick={() => handleChange(data.ID, "DELETE", null, null)}>
                                <CloseIcon sx={{fontSize: 26}} className="b-icon" />
                            </Stack>
                        </Tooltip>
                    }
                </Stack>
            </Box>
            <Grid container spacing={1}>
                <Grid item xs={5} sm={6} lg={2.4}>
                    <TextField
                        inputProps={{ inputMode: "text" }}
                        value={citizenID}
                        sx={{ background: "#f8f6f7" }}
                        onChange={(event) => {
                            setCitizenID((citizenID) => event.target.value);
                        }}
                        onBlur={(event) => handleValidBlacklist(event)}
                        label={t("frm_cccd")}
                        className="b-input bg-white"
                        fullWidth
                    />
                    {!data.EMP_CITIZEN_ID_VALID && isNullOrEmpty(citizenID) && (
                        <Typography className="b-validate">
                            <HighlightOffIcon sx={{ width: "17px", height: "17px" }} />
                            {t("frm_required")}
                        </Typography>
                    )}
                    {!data.EMP_CITIZEN_ID_VALID &&
                        !(citizenID.length === 16) &&
                        !isNullOrEmpty(citizenID) && (
                            <Typography className="b-validate">
                                <HighlightOffIcon sx={{ width: "17px", height: "17px" }} />
                                {t("frm_id_valid")}
                            </Typography>
                        )}
                </Grid>
                <Grid item xs={7} sm={6} md={6} lg={2.5}>
                    <TextField
                        inputProps={{ inputMode: "text" }}
                        value={name}
                        onChange={(event) => {
                            setName((name) => event.target.value);
                        }}
                        onBlur={(event) => handleChange(data.ID, "EMP_NAME", event)}
                        sx={{ background: "#f8f6f7" }}
                        label={t("frm_full_nm")}
                        className="b-input bg-white"
                        fullWidth
                        placeholder=""
                    />
                    {!data.EMP_NAME_VALID && (
                        <Typography className="b-validate">
                            <HighlightOffIcon sx={{ width: "17px", height: "17px" }} />
                            {t("frm_required")}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={5} sm={6} lg={1.3}>
                    <Select
                        menuShouldScrollIntoView={false}
                        menuPlacement={isLast ? "top" : "bottom"}
                        value={gender ? optionsGender[0] : optionsGender[1]}
                        onChange={(event) => {
                            setDate((date) => null);
                            setGender((gender) => event.value);
                        }}
                        onBlur={(event) =>
                            handleChange(data.ID, "EMP_GENDER", event, gender)
                        }
                        options={optionsGender}
                        classNames={{
                            control: (state) =>
                                state.isFocused ? "border-red-600" : "border-grey-300",
                        }}
                        styles={{
                            control: (base, { isDisabled, isFocused }) => ({
                                ...base,
                                padding: 5,
                                paddingBottom: 4,
                                borderRadius: 5,
                                fontSize: 17,
                                background: isDisabled ? "#EBEBEB" : "#fff",
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                        }}
                        placeholder={t("gender")}
                    />
                </Grid>
                <Grid item xs={7} sm={6} lg={2}>
                    <Box>
                        <DatePicker
                            value={date}
                            //oneTap
                            //open={false}
                            limitEndYear={
                                isNullOrEmpty(maxYear)
                                    ? getMaxBirthdayYear()
                                    : parseInt(maxYear)
                            }
                            //disabledDate={date => {isAfter(date, getMaxBirthday())}}
                            //disabledDate={allowedRange(minDate, maxDate)}
                            placement={isMobile ? "bottomEnd" : "topStart"}
                            onChange={(e) => handleValidDate(e)}
                            onOpen={() => setFocus(true)}
                            onClose={() => setFocus(false)}
                            cleanable={false}
                            block
                            size="lg"
                            placeholder={focus ? "yyyy-MM-dd" : t("frm_birthday")}
                            style={{ borderColor: "#333" }}
                        />
                    </Box>
                    {!data.EMP_BIRTHDATE_VALID && (
                        <Typography className="b-validate">
                            <HighlightOffIcon sx={{ width: "17px", height: "17px" }} />
                            {t("frm_required")}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={5} sm={6} lg={1.3}>
                    <Select
                        menuShouldScrollIntoView={false}
                        menuPlacement={isLast ? "top" : "bottom"}
                        value={
                            positionCD
                                ? optionsPos.filter((item) => item.value === positionCD)
                                : ""
                        }
                        onChange={(event) => setPositionCD((positionCD) => event.value)}
                        onBlur={(event) =>
                            handleChange(data.ID, "EMP_POSITION", event, positionCD)
                        }
                        name="VENDOR"
                        options={optionsPos}
                        classNames={{
                            control: (state) =>
                                state.isFocused ? "border-red-600" : "border-grey-300",
                        }}
                        styles={{
                            control: (base, { isDisabled, isFocused }) => ({
                                ...base,
                                padding: 5,
                                paddingBottom: 4,
                                borderRadius: 5,
                                fontSize: 17,
                                background: isDisabled ? "#EBEBEB" : "#fff",
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                        }}
                        placeholder={t("frm_position")}
                    />
                    {!data.EMP_POSITION_VALID && (
                        <Typography className="b-validate">
                            <HighlightOffIcon sx={{ width: "17px", height: "17px" }} />
                            {t("frm_required")}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={7} sm={6} lg={2.5}>
                    <Select
                        menuShouldScrollIntoView={false}
                        menuPlacement={isLast ? "top" : "bottom"}
                        isDisabled={true}
                        value={secureCard ?  optionsCard.filter((item) => item.value === secureCard) : ""}
                        options={optionsCard}
                        classNames={{
                            control: (state) =>
                                state.isFocused ? "border-red-600" : "border-grey-500",
                        }}
                        styles={{
                            control: (base, { isDisabled, isFocused }) => ({
                                ...base,
                                padding: 5,
                                paddingBottom: 4,
                                borderRadius: 5,
                                fontSize: 17,
                                background: isDisabled ? "#f8f6f7" : "#fff",
                                borderColor: isDisabled ? "#c4c4c4" : "#333",
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                            singleValue: (base) => ({
                                ...base,
                                display: "flex",
                                alignItems: "center",
                            }),
                        }}
                        components={{
                            Option,
                            SingleValue,
                        }}
                        placeholder={t("gender")}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default VendorCard;