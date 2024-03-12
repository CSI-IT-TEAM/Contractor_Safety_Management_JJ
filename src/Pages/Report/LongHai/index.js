import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "rsuite";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { ReportInOutListSelectParams } from "../../../data/configParams";
import { UploadReportInOutListSelectParams } from "../../../data/uploadParams";
import { fetchData } from "../../../functions";
import { ReportInOutListSelectURL } from "../../../api";
import SearchIcon from '@mui/icons-material/Search';

import { darken, lighten, styled } from "@mui/material/styles";

export default function LongHaiInOutReport() {
  const [SearchData, setSearchData] = useState(ReportInOutListSelectParams);
  const [Data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  ////// Transldate
  const { t } = useTranslation();
  function getRowId(row) {
    return row.SEQ;
  }
  const columns = [
    // { field: "SEQ", headerName: "ID", width: 90 },
    {
      field: "WORK_DATE",
      headerName: t("title_work_date"),
      width: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "EMP_NAME",
      headerName: t("frm_employee_name"),
      width: 200,
      editable: false,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "POS_NAME",
      headerName: t("title_employee_position"),
      width: 100,
      align: "center",
      editable: false,
      headerAlign: "center",
      valueGetter: (params) => t(`${params.row.POS_NAME}`),
      //   cellClassName: (params) => `super-app-theme--${params.row.POS_NAME}`,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "CONT_NAME",
      headerName: t("frm_vendor"),
      width: 250,
      editable: false,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "VISIT_PURPOSE",
      headerName: t("title_purpose"),
      width: 350,
      editable: false,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "SUPERVISOR_NAME",
      headerName: t("supervisor"),
      width: 180,
      align: "center",
      editable: false,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "DEPT_NM",
      headerName: t("frm_dept"),
      width: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "IN_TIME",
      headerAlign: "center",
      headerName: t("check_in"),
      // description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 90,
      align: "center",
      headerAlign: "center",
      //   valueGetter: (params) =>
      //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "OUT_TIME",
      headerName: t("check_out"),
      sortable: false,
      width: 90,
      align: "center",
      headerAlign: "center",
      //   valueGetter: (params) =>
      //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "VISITOR_ID",
      headerName: t("plholder_input_visitor_no"),
      sortable: false,
      width: 80,
      align: "center",
      headerAlign: "center",
      valueFormatter: ({ value }) => (value !== null ? `${value}` : null),
      //   valueGetter: (params) =>
      //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
      headerClassName: "super-app-theme--header",
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: "Phước", age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  const getBackgroundColor = (color, mode) =>
    mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--text_supervisor": {
      color: getBackgroundColor(theme.palette.info.main, theme.palette.mode),

      "&.Mui-selected": {
        backgroundColor: getBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode
        ),
      },
    },
  }));

  const handleDateChange = (event) => {
    let _date = event ? event : "";
    setSearchData((prevData) => {
      return {
        ...prevData,
        TYPE: "Q",
        WORK_DATE: event,
      };
    });
  };

  const GetReportInOutListData = async () => {
    setloading(true);
    const dataUpload = await UploadReportInOutListSelectParams(SearchData);
    await fetchData(ReportInOutListSelectURL, dataUpload)
      .then((result) => {
        setData(result);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
      });
  };

  useEffect(() => {
    GetReportInOutListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SearchData.WORK_DATE]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            width: "100%",
          }}
        >
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            sx={{
              width: "100%",
            }}
          >
            <GridToolbarColumnsButton
              sx={{
                textTransform: "none",
              }}
            />
            {/* <GridToolbarFilterButton /> */}
            <GridToolbarDensitySelector
              sx={{
                textTransform: "none",
              }}
            />
            <GridToolbarExport
              sx={{
                textTransform: "none",
              }}
            />
          </Stack>
          <GridToolbarQuickFilter />
        </Stack>
      </GridToolbarContainer>
    );
  }

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <Container maxWidth="full" sx={{ marginTop: "15px", width: "100%" }}>
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
            // zIndex: 10,
            paddingBottom: 2,
          }}
        >
          <Typography
            variant="h5"
            className="s-title"
            sx={{
              zIndex: 10,
            }}
          >
            {t("title_longhai_inout_report")}
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack>
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
                    cleanable={false}
                    size="lg"
                    showOneCalendar={false}
                    value={SearchData.WORK_DATE}
                    onChange={(e) => handleDateChange(e)}
                  />
                </Stack>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    minWidth: "100px",
                  }}
                  loading={loading}
                  endIcon={<SearchIcon />}
                  onClick={() => GetReportInOutListData()}
                >
                  {t("btn_search")}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <DataGrid
                // getRowHeight={() => "auto"}
                // getEstimatedRowHeight={() => 200}
                loading={loading}
                sx={{
                  //   boxShadow: 2,
                  //   border: 2,
                  //   borderColor: "primary.light",
                  // "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                  //   py: "8px",
                  // },
                  // "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                  //   py: "15px",
                  // },
                  // "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                  //   py: "22px",
                  // },
                  "& .MuiDataGrid-row:hover": {
                    color: "primary.main",
                    background: "#fffee3",
                  },
                  "& .super-app-theme--header": {
                    backgroundColor: "navy",
                    color: "white",
                  },
                  "& .super-app-theme--text_supervisor": {
                    // backgroundColor: "rgba(157, 255, 118, 0.49)",
                    color: "gold",
                    fontWeight: "600",
                  },
                }}
                // rowHeight={25}
                getRowId={getRowId}
                rows={Data}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                rowSelection={false}
                getCellClassName={(params) => {
                  if (params.field !== "POS_NAME" || params.value == null) {
                    return "";
                  }
                  return `super-app-theme--${params.row.POS_NAME}`;
                }}
                slots={{
                  toolbar: CustomToolbar,
                  loadingOverlay: LinearProgress,
                  noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
