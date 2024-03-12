import React, { useState } from "react";
import { Steps, DateRangePicker, Placeholder } from "rsuite";
import {
    Badge,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Popover,
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
    tableCellClasses,
    InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";
import EmptyCard from "../../components/Card/EmptyCard";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sheet from "react-modal-sheet";
import ImageGallery from "react-image-gallery";
import ItemCheckTable from "../../components/EmployeeCheckTable";
import styled from "styled-components";

import "./index.scss";
import { EmployeeListSelectURL, VendorListTimeLineSelectURL } from "../../api";
import {
    UploadEmployeeListSelectParams,
    UploadVendorListTimeLineParams,
} from "../../data/uploadParams";
import { fetchData, isNullOrEmpty } from "../../functions";
import {
    VendorListTimeLineParams,
} from "../../data/configParams";

import GppGoodIcon from "@mui/icons-material/GppGood";
import SearchIcon from '@mui/icons-material/Search';
import CollectionsIcon from "@mui/icons-material/Collections";
import VerifiedIcon from "@mui/icons-material/Verified";
import DoDisturbOffIcon from "@mui/icons-material/DoDisturbOff";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import CloseIcon from "@mui/icons-material/Close";

export default function TimeLinePage() {
    /////Init Variables
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("lg"));
    const [vendorRequestListData, setvendorRequestListData] = useState(
        VendorListTimeLineParams
    );
    const [isOpen, setisOpen] = useState(false);
    const [VendorList, setVendorList] = useState([]);
    const [VendorListLocal, setVendorListLocal] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [isLoading, setisLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [fillterWord, setfillterWord] = useState("");
    const [DeptImageList, setDeptImageList] = useState([]);
    const [StepClick, setStepClick] = useState(0);
    const [ContractorClick, setContractorClick] = useState("");
    const [Comment, setComment] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);

    //Component data for
    const [EmployeeData, setEmployeeData] = useState([]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#072d7a",
            textAlign: "center",
            borderRight: "1px solid rgba(255, 255, 255, 0.15)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: 700,
            fontFamily: "Calibri,sans-serif",
            textTransform: "capitalize",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: "1.1rem",
            backgroundColor: "#fff",
            padding: 0,
            fontWeight: 500,
            borderRight: "1px solid rgba(255, 255, 255, 0.15)",
        },
    }));

    const width = window.innerWidth;
    const isMobile = width < 560 ? true : false;

    ////// Transldate
    const { t } = useTranslation();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const columns = [
        {
            id: "WORK_DATE",
            label: t("title_work_date"),
            minWidth: 150,
            fontweight: 500,
            hBackgroundColor: "#072d7a",
            hColor: "white",
            align: "left",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "CONT_NAME",
            label: t("title_contractor"),
            minWidth: 350,
            fontweight: 500,
            hBackgroundColor: "#072d7a",
            hColor: "white",
            align: "left",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "VISIT_PURPOSE",
            label: t("title_total_people"),
            hBackgroundColor: "#072d7a",
            hColor: "white",
            minWidth: 350,
            fontweight: 400,
            align: "center",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "TOTAL_PEOPLE",
            label: t("title_total_people"),
            hBackgroundColor: "#072d7a",
            hColor: "white",
            minWidth: 80,
            fontweight: 400,
            align: "center",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "DEPT_CD",
            label: t("text_requester_dept"),
            hBackgroundColor: "#072d7a",
            hColor: "white",
            minWidth: 150,
            fontweight: 400,
            align: "left",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "SUPERVISOR_NAME",
            label: t("supervisor"),
            hBackgroundColor: "#072d7a",
            hColor: "white",
            minWidth: 200,
            fontweight: 400,
            align: "left",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "VISIT_START_DATE",
            label: t("title_visit_start_date"),
            hBackgroundColor: "#072d7a",
            hColor: "white",
            minWidth: 120,
            align: "center",
            type: "text",
            borderBottom: "none",
        },
        {
            id: "VISIT_END_DATE",
            label: t("title_visit_end_date"),
            hBackgroundColor: "#072d7a",
            hColor: "white",
            minWidth: 120,
            align: "center",
            type: "text",
        },
        {
            id: "STEP_1",
            label: `${t("title_requesting")}`,
            minWidth: 100,
            align: "center",
            fontweight: 400,
            type: "check",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "STEP_2",
            label: `${t("title_rsm_approval")}`,
            minWidth: 100,
            align: "center",
            fontweight: 400,
            type: "check",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "STEP_3",
            label: `${t("title_security_gate")}`,
            minWidth: 100,
            align: "center",
            fontweight: 400,
            type: "check",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            borderBottom: "none",
        },
        {
            id: "STEP_4",
            label: `${t("title_safety_inspection")}`,
            minWidth: 100,
            align: "center",
            fontweight: 400,
            type: "check",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            borderBottom: "none",
        },
        {
            id: "STEP_5",
            label: `${t("title_rsm_inspection")}`,
            minWidth: 100,
            align: "center",
            fontweight: 400,
            type: "check",
            hBackgroundColor: "#072d7a",
            hColor: "white",
            borderBottom: "none",
        },
    ];

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleFindTextChange = (value) => {
        setfillterWord(value);
        let VendorTmpList = VendorListLocal;
        let vendorFillterList = VendorTmpList.filter((item) =>
            item.CONT_NAME.toUpperCase().includes(value.toUpperCase())
        );
        setVendorList(vendorFillterList);
    };
    //Handle Change Select
    const handleChangeSelect = (type, event) => {
        switch (type) {
            case "WORK_DATE":
                let _date = event ? event : "";
                setDate(event);
                setvendorRequestListData((prevData) => {
                    return {
                        ...prevData,
                        TYPE: "Q",
                        WORK_DATE: _date, // getDateFormat(_date), A.nguyen muon doi sang monthly 2023-12-28
                    };
                });

                break;
            default:
                break;
        }
    };

    //get nhung vendor list duoc RSM phe duyet. (Tam thoi get all)
    const getVendorList = async (_isRefresh) => {
        setisLoading(true);
        const dataUpload = await UploadVendorListTimeLineParams(
            vendorRequestListData
        );
        await fetchData(VendorListTimeLineSelectURL, dataUpload)
            .then((result) => {
                setVendorList(result);
                setVendorListLocal(result);
                setisLoading(false);
            })
            .catch((error) => {
                setisLoading(false);
            });
    };

    const handleOpenGallery = (step_id, item) => {
        setContractorClick(item.CONT_NAME);
        setStepClick(step_id);
        const _REQ_NO = item["REQ_NO"];
        const _WORK_DATE = item["WORK_DATE"];
        const newVendorList = VendorListLocal.filter(
            (item) => item.REQ_NO === _REQ_NO && item.WORK_DATE === _WORK_DATE
        )[0];
        var img_list = [];
        if (step_id === "STEP_4") {
            setComment(newVendorList["STEP_4_INS_DESC"]);
            img_list = [
                {
                    original: newVendorList["STEP_4_IMG_1"],
                    thumbnail: newVendorList["STEP_4_IMG_1"],
                    // description: newVendorList["STEP_4_INS_DESC"],
                },
                {
                    original: newVendorList["STEP_4_IMG_2"],
                    thumbnail: newVendorList["STEP_4_IMG_2"],
                    // description: newVendorList["STEP_4_INS_DESC"],
                },
                {
                    original: newVendorList["STEP_4_IMG_3"],
                    thumbnail: newVendorList["STEP_4_IMG_3"],
                    //  description: newVendorList["STEP_4_INS_DESC"],
                },
                {
                    original: newVendorList["STEP_4_IMG_4"],
                    thumbnail: newVendorList["STEP_4_IMG_4"],
                    //description: newVendorList["STEP_4_INS_DESC"],
                },
                {
                    original: newVendorList["STEP_4_IMG_5"],
                    thumbnail: newVendorList["STEP_4_IMG_5"],
                    //description: newVendorList["STEP_4_INS_DESC"],
                },
            ];
        } else if (step_id === "STEP_5") {
            setComment(newVendorList["STEP_5_INS_DESC"]);
            switch (newVendorList["RSM_STEP5_IMG_COUNT"]) {
                case 0:
                    //setComment(newVendorList["STEP_5_INS_DESC"]);
                    break;
                case 1:
                    img_list = [
                        {
                            original: newVendorList["RSM_STEP_5_IMG_1"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_1"],
                            // description: newVendorList["STEP_5_INS_DESC"],
                        },
                    ];
                    break;
                case 2:
                    img_list = [
                        {
                            original: newVendorList["RSM_STEP_5_IMG_1"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_1"],
                            //  description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_2"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_2"],
                            // description: newVendorList["STEP_5_INS_DESC"],
                        },
                    ];
                    break;
                case 3:
                    img_list = [
                        {
                            original: newVendorList["RSM_STEP_5_IMG_1"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_1"],
                            //   description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_2"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_2"],
                            //   description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_3"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_3"],
                            //   description: newVendorList["STEP_5_INS_DESC"],
                        },
                    ];
                    break;
                case 4:
                    img_list = [
                        {
                            original: newVendorList["RSM_STEP_5_IMG_1"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_1"],
                            //   description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_2"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_2"],
                            //  description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_3"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_3"],
                            //  description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_4"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_4"],
                            //   description: newVendorList["STEP_5_INS_DESC"],
                        },
                    ];
                    break;
                default:
                    img_list = [
                        {
                            original: newVendorList["RSM_STEP_5_IMG_1"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_1"],
                            // description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_2"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_2"],
                            // description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_3"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_3"],
                            //description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_4"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_4"],
                            //description: newVendorList["STEP_5_INS_DESC"],
                        },
                        {
                            original: newVendorList["RSM_STEP_5_IMG_5"],
                            thumbnail: newVendorList["RSM_STEP_5_IMG_5"],
                            // description: newVendorList["STEP_5_INS_DESC"],
                        },
                    ];
                    break;
            }
        }

        setDeptImageList(img_list);
        setisOpen(true);
    };

    const handleSecurityClick = (item) => {
        setContractorClick(item.CONT_NAME);
        setStepClick(3);
        const _REQ_NO = item["REQ_NO"];

        var ParamData = {
            TYPE: "Q",
            WORK_DATE: item["WORK_DATE"].replaceAll("-", ""),
            REQ_NO: _REQ_NO,
        };

        fetchData(
            EmployeeListSelectURL,
            UploadEmployeeListSelectParams(ParamData)
        ).then((result) => {
            setEmployeeData(result);
        });

        // const newVendorList = VendorListLocal.filter(
        //   (item) => item.REQ_NO === _REQ_NO
        // )[0];
        setisOpen(true);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            getVendorList(true);
        }, 60000);
        return () => {
            clearTimeout(timeout);
        };
    });

    useEffect(() => {
        getVendorList(false);
        //   const timeout = setTimeout(() => {
        //     setCountdown(countdown - 1);
        //     if (countdown === 0) {
        //       getVendorList();
        //       setCountdown(5);
        //     }
        // }, 1000);
        // return () => {
        //     clearTimeout(timeout);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    return (
        <Container maxWidth="full" sx={{ marginTop: "15px", width: "100%" }}>
            <Sheet
                isOpen={isOpen}
                onClose={() => setisOpen(false)}
                detent="full-height"
            >
                <Sheet.Container>
                    <Sheet.Header>
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            sx={{
                                padding: 1,
                            }}
                        >
                            <Typography
                                width={"100%"}
                                variant="h5"
                                component={"div"}
                                sx={{
                                    textAlign: "center",
                                    color: "navy",
                                    fontWeight: 700,
                                }}
                            >
                                {ContractorClick}
                            </Typography>
                            <Button
                                sx={{
                                    color: "red",
                                    fontWeight: 700,
                                }}
                                onClick={() => setisOpen(false)}
                            >
                                X
                            </Button>
                        </Stack>
                    </Sheet.Header>
                    <Sheet.Content>
                        <Sheet.Scroller draggableAt="both">
                            {StepClick === "STEP_4" || StepClick === "STEP_5" ? (
                                <Grid container textAlign={"center"}>
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                    >
                                        <Typography
                                            variant="h5"
                                            textAlign="center"
                                            sx={{
                                                color: "white",
                                                fontSize: 22,
                                                fontWeight: 500,
                                                backgroundColor: "rgb(0 0 0 / 75%)",
                                                padding: "5px 0",
                                            }}
                                        >
                                            {Comment}
                                        </Typography>
                                        {DeptImageList.length ? (
                                            <ImageGallery
                                                autoPlay
                                                thumbnailPosition={"bottom"}
                                                useWindowKeyDown
                                                showGalleryFullscreenButton
                                                lazyLoad
                                                infinite
                                                useTranslate3D
                                                items={DeptImageList}
                                                showBullets
                                                showIndex
                                            />
                                        ) : (
                                            <Stack>
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        color: "silver",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {t("text_no_image")}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box
                                    sx={{
                                        padding: 2,
                                    }}
                                >
                                    <ItemCheckTable data={EmployeeData} />
                                </Box>
                            )}
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onClick={() => setisOpen(!isOpen)} />
            </Sheet>
            <Stack
                sx={{
                    width: "100%",
                }}
                direction={"column"}
                className="s-timeline-container"
            >
                <Box
                    sx={{
                        position: "sticky",
                        top: "71px",
                        backgroundColor: "white",
                        zIndex: 10,
                        paddingBottom: 2,
                        paddingTop: isMobile ? 2 : 0,
                    }}
                >
                    <Typography
                        variant="h5"
                        className="s-title"
                        sx={{
                            zIndex: 10,
                        }}
                    >
                        {t("title_timeline")}
                    </Typography>

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4} lg={2}>
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
                            <DateRangePicker
                                value={vendorRequestListData.WORK_DATE}
                                onChange={(e) => handleChangeSelect("WORK_DATE", e)}
                                block
                                showOneCalendar={isMobile}
                                size="lg"
                            />
                        </Grid>
                        <Grid item xs={12} md={8} lg={10}>
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
                                size="small"
                                placeholder={t("plholder_input_cont_name_for_quickly_search")} //"Nhập tên nhà thầu để tìm kiếm nhanh"
                                value={fillterWord}
                                onChange={(e) => handleFindTextChange(e.target.value)}
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
                            />
                        </Grid>
                    </Grid>
                </Box>
                {isLoading ? (
                    // <LinearProgress />
                    <Placeholder.Grid columns={10} rows={10} />
                ) : VendorListLocal.length > 0 ? (
                    <>
                        {!matches ? (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 1,
                                    type: "spring",
                                }}
                            >
                                <TableContainer
                                    sx={{
                                        maxHeight: "680px",
                                        borderTopLeftRadius: "10px",
                                        borderTopRightRadius: "10px",
                                        boxShadow: "rgba(0, 0, 0, 0.16) -1px 0px 0px",
                                    }}
                                    component={Box}
                                    elevation={9}
                                >
                                    <Table size="small" stickyHeader aria-label="sticky table">
                                        <TableHead sx={{ minHeight: "300px" }}>
                                            <TableRow>
                                                <StyledTableCell
                                                    rowSpan={2}
                                                    style={{
                                                        minWidth: "130px",
                                                    }}
                                                >
                                                    {t("title_work_date")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_contractor")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_purpose")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_total_people")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_req_dept")}
                                                </StyledTableCell>
                                                <StyledTableCell minWidth={200} rowSpan={2}>
                                                    {t("title_supervisor")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_visit_start_date")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_visit_end_date")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_requesting")}
                                                </StyledTableCell>
                                                <StyledTableCell rowSpan={2}>
                                                    {t("title_rsm_approval")}
                                                </StyledTableCell>
                                                <StyledTableCell colSpan={3}>
                                                    Inspection
                                                </StyledTableCell>
                                            </TableRow>
                                            <TableRow>
                                                {columns.map(
                                                    (column) =>
                                                        (column.id === "STEP_3" ||
                                                            column.id === "STEP_4" ||
                                                            column.id === "STEP_5") && (
                                                            <TableCell
                                                                key={column.id}
                                                                align={"center"}
                                                                style={{
                                                                    minWidth: column.minWidth,
                                                                    backgroundColor: column.hBackgroundColor
                                                                        ? column.hBackgroundColor
                                                                        : "#1976d2",
                                                                    color: "#ffffff",
                                                                    fontSize: "18px",
                                                                    fontWeight: 600,
                                                                    borderRight:
                                                                        "1px solid rgba(255, 255, 255, 0.15)",
                                                                    borderBottom: "none",
                                                                    fontFamily:
                                                                        '"Calibri", "Inconsolata", "Roboto", "Open Sans", sans-serif',
                                                                    top: "38px",
                                                                }}
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {VendorList.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            ).map((row) => {
                                                return (
                                                    <React.Fragment>
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            key={row.CONT_CODE}
                                                            sx={{
                                                                "& > *": { borderBottom: "unset" },
                                                                borderLeft: "1px solid rgba(224, 224, 224, 1)",
                                                            }}
                                                        //   onClick={() => HandleItemClick(row)}
                                                        >
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <TableCell
                                                                        className={
                                                                            column.id === "STEP_4"
                                                                                ? row["DEPT_COLOR_BLINK"]
                                                                                : ""
                                                                        }
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        sx={{
                                                                            fontSize: "1rem",
                                                                            fontWeight: column.fontweight,
                                                                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                                                                        }}
                                                                    >
                                                                        {column.type === "check" ? (
                                                                            value === "Y" ? (
                                                                                // <motion.div
                                                                                //   initial={{ opacity: 0, scale: 0 }}
                                                                                //   animate={{ opacity: 1, scale: 1 }}
                                                                                //   whileHover={{
                                                                                //     scale: 1.2,
                                                                                //     rotate: 360,
                                                                                //     transition: { duration: 0.5 },
                                                                                //   }}
                                                                                //   transition={{
                                                                                //     duration: 1,
                                                                                //     type: "spring",
                                                                                //   }}
                                                                                // >
                                                                                column.id === "STEP_4" ||
                                                                                    column.id === "STEP_5" ? (
                                                                                    <Stack
                                                                                        direction={"row"}
                                                                                        spacing={0.5}
                                                                                        alignItems={"center"}
                                                                                        justifyContent={"center"}
                                                                                    >
                                                                                        <Badge
                                                                                            badgeContent={
                                                                                                column.id === "STEP_4"
                                                                                                    ? row["STEP4_IMG_COUNT"]
                                                                                                    : row["RSM_STEP5_IMG_COUNT"]
                                                                                            }
                                                                                            sx={{ top: "5px" }}
                                                                                            color="error"
                                                                                        >
                                                                                            <CollectionsIcon
                                                                                                aria-owns={
                                                                                                    open
                                                                                                        ? "mouse-over-popover"
                                                                                                        : undefined
                                                                                                }
                                                                                                aria-haspopup="true"
                                                                                                onMouseEnter={handlePopoverOpen}
                                                                                                onMouseLeave={
                                                                                                    handlePopoverClose
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    handleOpenGallery(
                                                                                                        column.id,
                                                                                                        row
                                                                                                    )
                                                                                                }
                                                                                                sx={{
                                                                                                    cursor: "pointer",
                                                                                                    fontSize: "2rem",
                                                                                                    color: "navy",
                                                                                                }}
                                                                                            />
                                                                                        </Badge>
                                                                                    </Stack>
                                                                                ) : column.id === "STEP_3" ? (
                                                                                    <GppGoodIcon
                                                                                        aria-owns={
                                                                                            open
                                                                                                ? "mouse-over-popover"
                                                                                                : undefined
                                                                                        }
                                                                                        aria-haspopup="true"
                                                                                        onMouseEnter={handlePopoverOpen}
                                                                                        onMouseLeave={handlePopoverClose}
                                                                                        onClick={() =>
                                                                                            handleSecurityClick(row)
                                                                                        }
                                                                                        sx={{
                                                                                            cursor: "pointer",
                                                                                            fontSize: "2rem",
                                                                                            color: "green",
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <VerifiedIcon
                                                                                        sx={{
                                                                                            fontSize: "2rem",
                                                                                            color: "dodgerblue",
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            ) : // </motion.div>
                                                                                value === "D" ? (
                                                                                    <DoDisturbOffIcon
                                                                                        sx={{
                                                                                            fontSize: "2rem",
                                                                                            color: "red",
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <HistoryToggleOffIcon
                                                                                        sx={{
                                                                                            fontSize: "2rem",
                                                                                            color: "silver",
                                                                                        }}
                                                                                    />
                                                                                )
                                                                        ) : (
                                                                            value
                                                                        )}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    component="div"
                                    count={VendorList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </motion.div>
                        ) : (
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Stack spacing={2}>
                                        <Grid container spacing={1}>
                                            {VendorList.length > 0 &&
                                                VendorList.map((item, index) => {
                                                    return (
                                                        <Grid item xs={12} md={12} lg={12} key={index}>
                                                            <Paper
                                                                elevation={1}
                                                                sx={{
                                                                    padding: 2,
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        px: 1,
                                                                        py: 1,
                                                                    }}
                                                                >
                                                                    <Stack
                                                                        direction={"row"}
                                                                        alignItems={"center"}
                                                                        justifyContent={"space-between"}
                                                                        spacing={1}
                                                                    >
                                                                        <Stack>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: "bold",
                                                                                    fontSize: "1.5rem",
                                                                                }}
                                                                            >
                                                                                {item.CONT_NAME}
                                                                            </Typography>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: 400,
                                                                                    color: "navy",
                                                                                }}
                                                                            >
                                                                                {t("text_visit_start_date")}
                                                                                {": "}
                                                                                {item.VISIT_START_DATE} ~{" "}
                                                                                {t("text_visit_end_date")}
                                                                                {": "}
                                                                                {item.VISIT_END_DATE}
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Box
                                                                            sx={{
                                                                                textAlign: "center",
                                                                                borderWidth: "3px",
                                                                                borderStyle: "dashed",
                                                                                borderColor: "navy",
                                                                                borderRadius: "10px",
                                                                                backgroundColor: "navy",
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: 500,
                                                                                    fontSize: "0.8rem",
                                                                                    color: "white",
                                                                                    p: 1,
                                                                                }}
                                                                            >
                                                                                {t("text_requester_dept")}
                                                                                {":"} {item.DEPT_CD}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Stack>
                                                                </Box>
                                                                <Steps
                                                                    small={false}
                                                                    current={parseInt(item.STEP_NO)}
                                                                    currentStatus={`${item.ERROR_STATUS}`}
                                                                    vertical={matches}
                                                                >
                                                                    <Steps.Item
                                                                        title={t("title_requesting")}
                                                                        description={t(
                                                                            "title_contractor_infor_registration_apply"
                                                                        )}
                                                                    //icon={<PlusIcon style={{ fontSize: 20 }} />}
                                                                    />
                                                                    <Steps.Item
                                                                        title={t("title_rsm_approval")}
                                                                        description={t(
                                                                            "title_rsm_approve_infor_regstration"
                                                                        )}
                                                                    // icon={<CheckIcon style={{ fontSize: 20 }} />}
                                                                    />
                                                                    <Steps.Item
                                                                        title={t("title_security_gate")}
                                                                        description={t(
                                                                            "title_safety_inspection_in_security_gate"
                                                                        )}
                                                                    // icon={<ShieldIcon style={{ fontSize: 20 }} />}
                                                                    />
                                                                    <Steps.Item
                                                                        title={t("title_safety_inspection")}
                                                                        description={t(
                                                                            "title_department_safety_inspection"
                                                                        )}
                                                                    // icon={<CheckRoundIcon style={{ fontSize: 20 }} />}
                                                                    />
                                                                    <Steps.Item
                                                                        title={t("title_rsm_inspection")}
                                                                        description={t(
                                                                            "title_rsm_safety_inspection"
                                                                        )}
                                                                    // icon={<CheckRoundIcon style={{ fontSize: 20 }} />}
                                                                    />
                                                                </Steps>
                                                            </Paper>
                                                        </Grid>
                                                    );
                                                })}
                                        </Grid>
                                    </Stack>
                                </Grid>
                            </Grid>
                        )}
                        <Popover
                            id="mouse-over-popover"
                            sx={{
                                pointerEvents: "none",
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }}>Click here to view detail.</Typography>
                        </Popover>
                    </>
                ) : (
                    <EmptyCard />
                )}
            </Stack>
        </Container>
    );
}
