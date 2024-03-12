import {
    Box,
    Button,
    Container,
    FormControlLabel,
    Grid,
    Stack,
    TextField,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    InputAdornment,
    Paper,
    TablePagination,
    FormControl,
    RadioGroup,
    Radio,
    Badge,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
    EmployeeSafetyTrainingParams,
} from "../../data/configParams";
import {
    UploadEmployeeSafetyTrainingParams,
} from "../../data/uploadParams";
import {
    fetchData,
    getUserPermissOnPage,
    isNullOrEmpty
} from "../../functions";
import {
    EmployeeSafetyTrainingSaveURL,
    EmployeeSafetyTrainingSelectURL,
} from "../../api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TableCell from "@mui/material/TableCell";
import dayjs from "dayjs";
import CreateIcon from "@mui/icons-material/Create";
import Swal from "sweetalert2";
import "./index.scss";
import { DateRangePicker, Placeholder } from "rsuite";
import Search from "@mui/icons-material/Search";
import EmptyCard from "../../components/Card/EmptyCard";
import { DatePicker } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";

const SafetyTrainPage = () => {
    const [date, setDate] = useState(new Date());
    const [rangeDate, setrangeDate] = useState([
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
    ]);
    const [EMPRegisterData, setEMPRegisterData] = useState(
        EmployeeSafetyTrainingParams
    );
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [EmployeeListData, setEmployeeListData] = useState([]);
    const [EmployeeListDataLocal, setEmployeeListDataLocal] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [fillterWord, setfillterWord] = useState("");

    const [rdStatus, setRdStatus] = useState("ALL");
    const [NormalCount, setNormalCount] = useState(0);
    const [ExpCount, setExpCount] = useState(0);

    /////Translation
    const { t } = useTranslation();
    const location = useLocation();
    const i18_Value =
        i18next.language !== null &&
            i18next.language !== undefined &&
            i18next.language !== ""
            ? i18next.language
            : "en";
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        {
            id: "SEQ",
            label: t("title_no"),
            minWidth: 20,
            fontweight: 600,
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "EMP_CITIZEN_ID",
            label: t("citizen_id"),
            minWidth: 80,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "EMP_NAME",
            label: t("emp_nm"),
            minWidth: 250,
            align: "left",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "TRAINING_DATE",
            label: t("title_training_date"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
        {
            id: "EXPIRED_DATE",
            label: t("title_expired_date"),
            minWidth: 170,
            align: "center",
            hBackgroundColor: "#072d7a",
            hColor: "white",
        },
    ];

    const HandleTextChange = (event) => {
        setEMPRegisterData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value,
            };
        });
    };
    const HandleDateChange = (event) => {
        setDate(event);
        setEMPRegisterData((prevData) => {
            return {
                ...prevData,
                TRAIN_DATE: dayjs(event).format("YYYYMMDD000000"),
            };
        });
    };

    const handleAddNewEmployee = async (e) => {
        e.preventDefault();
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

        let isValid = true;
        var formData = new FormData(e.target);
        for (var [key, value] of formData.entries()) {
            if (isNullOrEmpty(value)) {
                isValid = false;
            }
        }

        if (isValid) {
            Swal.fire({
                title: t("swal_are_you_want_to_add_new"),
                text: t("swal_register_warning"), //"You won't be able to revert this!"
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: t("btn_confirm"),
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(EmployeeSafetyTrainingSaveURL, {
                        method: "POST",
                        mode: "cors",
                        dataType: "json",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(
                            UploadEmployeeSafetyTrainingParams(EMPRegisterData)
                        ),
                    }).then((response) => {
                        response.json().then((result) => {
                            if (result.Result === "OK") {
                                Swal.fire(
                                    t("swal_success"),
                                    t("swal_your_data_uploaded"),
                                    "success"
                                ).then(async () => {
                                    setEMPRegisterData(EmployeeSafetyTrainingParams);
                                    await GetEmployeeListData();
                                });
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
                    });
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: t("swal_data_empty"),
                text: t("swal_checking_again"),
                footer: t("swal_red_fields_is_blank"),
            });
        }
    };

    const GetEmployeeListData = async () => {
        setisLoading(true);
        let dataConfig = {
            ARG_TYPE: "Q",
            ARG_TRAIN_DATE_FROM: rangeDate
                ? dayjs(rangeDate[0]).format("YYYYMMDD")
                : "",
            ARG_TRAIN_DATE_TO: rangeDate
                ? dayjs(rangeDate[1]).format("YYYYMMDD")
                : "",
            OUT_CURSOR: "",
        };
        await fetchData(EmployeeSafetyTrainingSelectURL, dataConfig)
            .then((result) => {
                if (result) {
                    setEmployeeListData(result);
                    setEmployeeListDataLocal(result);
                    setisLoading(false);

                    setNormalCount(result.filter((item) => item.STATUS === "NOR").length);
                    setExpCount(result.filter((item) => item.STATUS === "EXP").length);
                }
            })
            .catch(() => setisLoading(false));
    };

    const handleFindTextChange = (event) => {
        setfillterWord(event.target.value);
        let EmployeeListTemp = EmployeeListDataLocal;
        let EmployeeFilterList = EmployeeListTemp.filter(
            (item) =>
                item.EMP_CITIZEN_ID.includes(event.target.value) ||
                item.EMP_NAME.toUpperCase().includes(event.target.value.toUpperCase())
        );

        setNormalCount(
            EmployeeFilterList.filter((item) => item.STATUS === "NOR").length
        );
        setExpCount(
            EmployeeFilterList.filter((item) => item.STATUS === "EXP").length
        );

        setEmployeeListData(EmployeeFilterList);
    };

    const handleRDStatusChange = (event) => {
        setRdStatus(event.target.value);
        let data = EmployeeListDataLocal.filter(
            (item) =>
                item.EMP_CITIZEN_ID.includes(fillterWord) ||
                item.EMP_NAME.toUpperCase().includes(fillterWord.toUpperCase())
        ); // JSON.parse(localStorage.getItem("ReportData"));
        let newList = [];
        if (event.target.value === "EXP") {
            newList = data.filter((item) => item.STATUS === "EXP");
        } else if (event.target.value === "ALL") {
            newList = data;
        } else {
            newList = data.filter((item) => item.STATUS !== "DONE");
        }

        setEmployeeListData(newList);
    };

    const HandleRowClick = (item) => {
        setEMPRegisterData((prevData) => {
            return {
                ...prevData,
                TYPE: "U",
                EMP_CITIZEN_ID: item.EMP_CITIZEN_ID,
                EMP_NAME: item.EMP_NAME,
            };
        });
    };

    useEffect(() => {
        GetEmployeeListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangeDate]);

    return (
        <>
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
                    className="s-safety"
                >
                    <Box>
                        <Box style={{ position: "relative" }}>
                            <Typography variant="h5" className="s-title">
                                {t("title_safety_training_management")}
                            </Typography>
                        </Box>
                    </Box>
                    <Paper className="s-paper">
                        <Grid
                            container
                            spacing={1}
                            component={"form"}
                            onSubmit={handleAddNewEmployee}
                        >
                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >
                                    {t("title_training_date")}
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={dayjs(date)}
                                        onChange={(e) => HandleDateChange(e)}
                                        className="b-date-input"
                                        sx={{
                                            width: "100%",
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >
                                    {t("citizen_id")}
                                </Typography>
                                <TextField
                                    name="EMP_CITIZEN_ID"
                                    error={EMPRegisterData.EMP_CITIZEN_ID === ""}
                                    value={EMPRegisterData.EMP_CITIZEN_ID}
                                    inputProps={{ inputMode: "text", maxLength: 12 }}
                                    sx={{ background: "#f8f6f7" }}
                                    className="b-input bg-white"
                                    fullWidth
                                    placeholder={t("citizen_id")}
                                    onChange={(e) => HandleTextChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >
                                    {t("title_employee_name")}
                                </Typography>
                                <TextField
                                    error={EMPRegisterData.EMP_NAME === ""}
                                    name="EMP_NAME"
                                    value={EMPRegisterData.EMP_NAME}
                                    inputProps={{ inputMode: "text" }}
                                    sx={{ background: "#f8f6f7" }}
                                    className="b-input bg-white"
                                    fullWidth
                                    placeholder={t("emp_nm")}
                                    onChange={(e) => HandleTextChange(e)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={2}
                                md={2}
                                lg={2}
                                sx={{
                                    textAlign: "end",
                                }}
                            >
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: "#333",
                                        fontSize: 14,
                                    }}
                                ></Typography>
                                <Button
                                    type="submit"
                                    fullWidth
                                    endIcon={<CreateIcon />}
                                    color="success"
                                    variant="contained"
                                    size="large"
                                    className="btn-reg"
                                >
                                    {t("btn_register")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Typography variant="h5" className="s-title">
                        {t("title_employee_list")}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <Typography
                                style={{
                                    fontWeight: 600,
                                    color: "#333",
                                    marginBottom: 3,
                                    fontSize: 16,
                                }}
                            >
                                {t("frm_range_training_date")}
                            </Typography>
                            <DateRangePicker
                                value={rangeDate}
                                onChange={setrangeDate}
                                size="lg"
                                placeholder="Select a range date to view"
                                cleanable
                                block
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={i18_Value === "indo" ? 4 :5}>
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
                                placeholder={t(
                                    "plholder_input_emp_name_or_citizen_for_quickly_search"
                                )}
                                value={fillterWord}
                                InputProps={{
                                    endAdornment: fillterWord && (
                                        <InputAdornment position="end">
                                            <CloseIcon
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => setfillterWord("")}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleFindTextChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={i18_Value === "indo" ? 4 : 3}>
                            <Typography
                                style={{
                                    fontWeight: 600,
                                    color: "#333",
                                    marginBottom: 3,
                                    fontSize: 16,
                                }}
                            >
                                {t("frm_status")}
                            </Typography>
                            <Box
                                sx={{
                                    paddingX: 1,
                                    borderRadius: "10px",
                                    borderWidth: "1px",
                                    borderStyle: "dashed",
                                    borderColor: "#c4c4c4",
                                    width: "fit-content",
                                }}
                            >
                                <FormControl
                                    sx={{
                                        marginTop: "-10px",
                                    }}
                                >
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={rdStatus}
                                        onChange={handleRDStatusChange}
                                        sx={{
                                            marginTop: "10px",
                                        }}
                                    >
                                        <FormControlLabel
                                            value="ALL"
                                            control={<Radio defaultChecked sx={{ paddingRight: 0, '&.Mui-checked': { color: "green" } }} />}
                                            color="white"
                                            label={
                                                <Badge
                                                    anchorOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                    badgeContent={EmployeeListData?.length}
                                                    color="success"
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 500,
                                                            p: 0.5,
                                                            color: "#555",
                                                        }}
                                                    >
                                                        {t("title_all")}
                                                    </Typography>
                                                </Badge>
                                            }
                                        />
                                        <FormControlLabel
                                            value="NOR"
                                            control={<Radio sx={{ paddingRight: 0, '&.Mui-checked': { color: "navy" } }} />}
                                            color="white"
                                            label={
                                                <Badge
                                                    anchorOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                    badgeContent={NormalCount}
                                                    color="warning"
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 500,
                                                            p: 0.5,
                                                            color: "#555",
                                                        }}
                                                    >
                                                        {t("title_normal")}
                                                    </Typography>
                                                </Badge>
                                            }
                                        />
                                        <FormControlLabel
                                            value="EXP"
                                            control={<Radio sx={{ paddingRight: 0, '&.Mui-checked': { color: "#d32f2f" } }} />}
                                            label={
                                                <Badge
                                                    anchorOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                    badgeContent={ExpCount}
                                                    color="success"
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 500,
                                                            p: 0.5,
                                                            color: "#555",
                                                        }}
                                                    >
                                                        {t("title_expired")}
                                                    </Typography>
                                                </Badge>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <Typography className="p-none"
                                style={{
                                    fontWeight: 600,
                                    color: "#333",
                                    marginBottom: 3,
                                    fontSize: 16,
                                    opacity: 0,
                                }}
                            >
                                {t("frm_status")}
                            </Typography>
                            <Button
                                endIcon={<Search />}
                                variant="contained"
                                size="large"
                                fullWidth
                                className="btn-search"
                                onClick={async () => await GetEmployeeListData()}
                                sx={{
                                    color: "#004299",
                                    background: "hsl(210 79% 90% / 1)",
                                    "&.MuiButtonBase-root:hover": {
                                        background: "hsl(210 79% 90% / 1)"
                                    }
                                }}
                            >
                                {t("btn_search")}
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: "15px" }}>
                        {isLoading ? (
                            <Placeholder.Grid rows={20} columns={5} />
                        ) : EmployeeListData && EmployeeListData.length > 0 ? (
                            <Box>
                                <TableContainer
                                    sx={{
                                        maxHeight: 420,
                                        borderTopLeftRadius: "10px",
                                        borderTopRightRadius: "10px",
                                    }}
                                >
                                    <Table
                                        size="small"
                                        stickyHeader
                                        aria-label="sticky table"
                                    >
                                        <TableHead sx={{ minHeight: "200px" }}>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{
                                                            minWidth: column.minWidth,
                                                            backgroundColor: column.hBackgroundColor,
                                                            color: column.hColor,
                                                            fontSize: "18px",
                                                            fontFamily: "Calibri,sans-serif",
                                                            fontWeight: 600,
                                                            padding: "12px 15px",
                                                        }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {EmployeeListData.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            ).map((row) => {
                                                return (
                                                    <TableRow
                                                        key={row.SEQ}
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        sx={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => HandleRowClick(row)}
                                                    >
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell
                                                                    key={column.id}
                                                                    align={column.align}
                                                                    sx={{
                                                                        fontWeight: column.fontweight,
                                                                        padding: "10px 15px",
                                                                        backgroundColor:
                                                                            row["STATUS"] === "EXP"
                                                                                ? "#d32f2f"
                                                                                : "",
                                                                        color:
                                                                            row["STATUS"] === "EXP"
                                                                                ? "white"
                                                                                : "",
                                                                    }}
                                                                >
                                                                    {column.format &&
                                                                        typeof value === "number"
                                                                        ? column.format(value)
                                                                        : value}
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
                                    count={EmployeeListData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Box>
                        ) : (
                            <EmptyCard />
                        )}
                    </Box>
                </Stack>
            </Container>
        </>
    );
};

export default SafetyTrainPage;