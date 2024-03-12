import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import "./index.scss";
import { useEffect } from "react";
import { DatePicker, Uploader } from "rsuite";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import Sheet from "react-modal-sheet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import TryIcon from "@mui/icons-material/Try";
import ItemCheckTable from "../../components/EmployeeCheckTable";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { EmployeeListSelectURL, InspectChecklistSelectURL } from "../../api";
import {
  fetchData,
  getDateFormat,
  getPageIns,
  isNullOrEmpty,
} from "../../functions";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { InspectSearchParams } from "../../data/configParams";
import SendIcon from "@mui/icons-material/Send";
import { UploadEmployeeListSelectParams } from "../../data/uploadParams";
export default function InspectionPage() {
  const [VendorList, setVendorList] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [searchConfig, setSearchConfig] = useState(InspectSearchParams);
  /////Init Variables
  const { t } = useTranslation();
  const userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  const location = useLocation();

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

  const GetContractorList = async () => {
    console.log(userInfor);
    await fetchData(
      InspectChecklistSelectURL,
      seacrhParams(
        "Q_CONT",
        userInfor.plant_cd,
        getDateFormat(new Date()),
        userInfor.dept_cd,
        "",
        "",
        "",
        userInfor.Permission
      )
    ).then((result) => {
      console.log(result);
      setVendorList(result);
    });
  };

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
        }
        break;
      default:
        break;
    }
  };

  const handleSecurityClick = () => {
    const _REQ_NO = "";

    var ParamData = {
      TYPE: "Q",
      WORK_DATE: getDateFormat(new Date()),
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
    GetContractorList();
  }, []);

  useEffect(() => {
    console.log("Select Contractor Changed");
  }, [seacrhParams.CONT_CODE]);

  return (
    <Container
      maxWidth={false}
      sx={{
        marginTop: "15px",
        width: "100%",
        display: "flex",
      }}
    >
      <Sheet
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        detent="content-height"
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
                No Title
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
              <Box
                sx={{
                  padding: 2,
                }}
              >
                <ItemCheckTable data={EmployeeData} />
              </Box>
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
        className="s-inspectionv2"
        spacing={1}
      >
        <Box sx={{ position: "relative" }}>
          <Typography variant="h5" className="s-title">
            Safety Inspection In Workshop
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={12}>
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
              disabled
              value={new Date()}
              editable={false}
              open={false}
              cleanable={false}
              block
              size="lg"
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
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
              onChange={(e) => handleChangeSelect("VENDOR", e)}
              value={
                searchConfig?.CONT_CODE
                  ? VendorList.filter(
                      (item) => item.value === searchConfig?.CONT_CODE
                    )
                  : ""
              }
              options={VendorList}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Typography
              style={{
                fontWeight: 600,
                color: "#333",
                marginBottom: 3,
                fontSize: 16,
              }}
            >
              {t("frm_purpose")}
            </Typography>
            <Select
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
          <Grid item xs={12} md={12} lg={12}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Inspection Status
              </Typography>
              <Paper
                sx={{
                  padding: 1,
                  borderRadius: 3,
                }}
              >
                <Grid
                  container
                  spacing={1}
                  // component={Paper}
                  // elevation={3}
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <Alert severity="info">
                      <AlertTitle>Thông tin</AlertTitle>
                      Thông tin kiểm tra từ bảo vệ Long Hải, RSM và Workshop.
                      Nếu đã kiểm tra sẽ được đánh 1 dấu check.
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <Stack
                      spacing={1}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      sx={{
                        padding: 1,
                        backgroundColor: "#abf067",
                        borderRadius: 3,
                        minHeight: "70px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "black",
                        }}
                      >
                        Security Gate Check
                      </Typography>
                      <Stack spacing={1} alignItems={"end"}>
                        <CheckCircleIcon
                          sx={{
                            color: "green",
                            fontSize: "2rem",
                            borderRadius: "100%",
                            borderWidth: "2px",
                            borderColor: "white",
                            borderStyle: "solid",
                            backgroundColor: "white",
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          color="warning"
                          sx={{
                            textTransform: "none",
                            // color: "white",
                            // backgroundColor: "#fffacc",
                          }}
                          onClick={() => handleSecurityClick()}
                        >
                          Kiểm tra chi tiết
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6}>
                    <Stack
                      spacing={1}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      sx={{
                        padding: 1,
                        backgroundColor: "#dce320",
                        borderRadius: 3,
                        minHeight: "70px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        RSM Check
                      </Typography>
                      <CheckCircleIcon
                        sx={{
                          color: "green",
                          fontSize: "2rem",
                          borderRadius: "100%",
                          borderWidth: "2px",
                          borderColor: "white",
                          borderStyle: "solid",
                          backgroundColor: "white",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6}>
                    <Stack
                      spacing={1}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      sx={{
                        padding: 1,
                        backgroundColor: "#fad26e",
                        borderRadius: 3,
                        minHeight: "70px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        W/S Check
                      </Typography>

                      <HistoryToggleOffIcon
                        sx={{
                          color: "silver",
                          fontSize: "2rem",
                          borderRadius: "100%",
                          borderWidth: "2px",
                          borderColor: "white",
                          borderStyle: "solid",
                          backgroundColor: "white",
                        }}
                      />
                      {/*                       
                      <CheckCircleIcon
                        sx={{
                          color: "green",
                          fontSize: "2rem",
                          borderRadius: "100%",
                          borderWidth: "2px",
                          borderColor: "white",
                          borderStyle: "solid",
                          backgroundColor: "white",
                        }}
                      /> */}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={12} lg={12}>
            <Paper
              sx={{
                padding: 1,
                borderRadius: 3,
              }}
            >
              <ItemCheckTable data={[]} />
            </Paper>
          </Grid> */}
          <Grid item xs={12} md={12} lg={12}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Workshop Inspection
              </Typography>
              <Paper
                sx={{
                  padding: 1,
                  borderRadius: 3,
                }}
              >
                <Stack direction={"column"} spacing={1}>
                  <Alert severity="warning">
                    <AlertTitle>Cảnh báo</AlertTitle>
                    Bạn cần upload ít nhất 5 tấm ảnh và phải nhập nội dung nhận
                    xét.
                  </Alert>
                  <Uploader
                    action=""
                    accept="image/*"
                    draggable
                    autoUpload={false}
                    listType="picture-text"
                    multiple={true}
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
                  <TextField
                    className="b-input"
                    placeholder="Your Comments"
                    multiline
                    rows={2}
                    maxRows={5}
                  />
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
        <Box textAlign={"center"}>
          <Button
            variant="contained"
            onClick={() => alert("submit clicked!")}
            sx={{
              textTransform: "none",
            }}
            endIcon={<SendIcon />}
          >
            Confirm
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
