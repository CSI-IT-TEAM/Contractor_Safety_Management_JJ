import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  Stack,
  Grid,
  Button,
  Paper,
  Collapse,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import "./index.scss";
import {
  LoginURL,
  UserRegisterSaveURL,
  UserMenuListSelectURL,
} from "../../api";
import { fetchData } from "../../functions";

import {
  UploadLoginParams,
  UploadRegisterParams,
} from "../../data/uploadParams";
import { LoginParams } from "../../data/configParams";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { updateUser, updatePermiss } from "../../redux/store/userSlice";

const height = window.innerHeight - 50 + "px";

const LoginPage = () => {
  const [isReg, setisReg] = useState(false);
  const [LoginData, setLoginData] = useState(LoginParams);
  const [RegData, setRegData] = useState(LoginParams);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //Text On Change Event
  const handleTextChange = (event) => {
    if (!isReg) {
      setLoginData((prevData) => {
        return {
          ...prevData,
          [event.target.name]: event.target.value,
        };
      });
    } else {
      setRegData((prevData) => {
        return {
          ...prevData,
          [event.target.name]: event.target.value,
        };
      });
    }
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let isValid = true;
    if (!isReg) {
      isValid = !(LoginData.EMPID === "" || LoginData.PASSWORD === "");
    } else {
      isValid = !(RegData.EMPID === "" || RegData.PASSWORD === "");
    }

    if (isValid) {
      let _downloadData = await fetchData(UserMenuListSelectURL, {
        ARG_TYPE: "Q_VALID",
        ARG_EMPID: LoginData.EMPID.toUpperCase(),
        OUT_CURSOR: "",
      });

      if (_downloadData !== null && _downloadData.length > 0) {
        var result = [];
        for (var i in _downloadData) result.push(_downloadData[i]);

        localStorage.setItem("CONT_USER_PERMISS", JSON.stringify(result));
      } else {
        localStorage.setItem("CONT_USER_PERMISS", JSON.stringify([]));
      }

      fetch(LoginURL, {
        method: "POST",
        mode: "cors",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(UploadLoginParams(LoginData)),
      }).then((response) => {
        response.json().then(async (result) => {
          if (result.length > 0) {
            let pwd = await result[0].PASSWORD;
            let isExist = await result[0].IS_EXIST;
            //Case 1: this use not yet registered.
            if (isExist === 0 && !pwd) {
              Swal.fire({
                icon: "error",
                title: t("title_wrong_user_or_password"),
                text: t("text_please_check_again"),
              });
              //Begin Register
              //case : Chưa đăng ký
              // fetch(UserRegisterSaveURL, {
              //     method: "POST",
              //     mode: "cors",
              //     dataType: "json",
              //     headers: {
              //         "Content-Type": "application/json",
              //     },
              //     body: JSON.stringify(UploadRegisterParams(LoginData)),
              // }).then((response) => {
              //     response.json().then(async (rs) => {
              //         // console.log(result);
              //         if (rs.Result === "OK") {
              //             //If Register is successful, then login again.
              //             fetch(LoginURL, {
              //                 method: "POST",
              //                 mode: "cors",
              //                 dataType: "json",
              //                 headers: {
              //                     "Content-Type": "application/json",
              //                 },
              //                 body: JSON.stringify(UploadLoginParams(LoginData)),
              //             }).then((response) => {
              //                 response.json().then(async (result) => {
              //                     if (result.length > 0) {
              //                         Swal.fire({
              //                             position: "center",
              //                             icon: "success",
              //                             title: t("title_login_success"),
              //                             showConfirmButton: false,
              //                             timer: 1500,
              //                         }).then((rs) => {
              //                             let Infor = {
              //                                 username: LoginData.EMPID, // State username với giá trị mặc định là "Guest"
              //                                 password: base64_encode(LoginData.PASSWORD),
              //                                 displayname: result[0].EMP_NM, // State display name
              //                                 plant_cd: result[0].PLANT_CD,
              //                                 dept_cd: result[0].DEPT_CD,
              //                                 avatar:
              //                                     LoginData.EMPID === "LONGHAI"
              //                                         ? null
              //                                         : result[0].PHOTO.data, // State avatar
              //                                 Permission: result[0].DEPT_NM,
              //                                 isAuth: true,
              //                                 isChief:
              //                                     result[0].IS_CHIEF === "Y" ? true : false,
              //                             };
              //                             localStorage.setItem(
              //                                 "CONT_USER_INFOR",
              //                                 JSON.stringify(Infor)
              //                             );
              //                             dispatch(updateUser(Infor));
              //                             navigate("/");
              //                         });
              //                     }
              //                 });
              //             });
              //         } else {
              //             alert("Network Error!");
              //         }
              //     });
              // });

              //End Register
            } else if (isExist === 1 && !pwd) {
              Swal.fire({
                icon: "error",
                title: t("title_wrong_user_or_password"),
                text: t("text_please_check_again"),
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "success",
                title: t("title_login_success"),
                showConfirmButton: false,
                timer: 1500,
              }).then((rs) => {
                let Infor = {
                  username: LoginData.EMPID.toUpperCase(), // State username với giá trị mặc định là "Guest"
                  password: base64_encode(LoginData.PASSWORD),
                  displayname: result[0].EMP_NM, // State display name
                  plant_cd: result[0].PLANT_CD,
                  dept_cd: result[0].DEPT_CD,
                  avatar:
                    LoginData.EMPID.toUpperCase() === "LONGHAI"
                      ? null
                      : result[0].PHOTO.data, // State avatar
                  Permission: result[0].DEPT_NM,
                  isAuth: true,
                  isChief: result[0].IS_CHIEF === "Y" ? true : false,
                };
                localStorage.setItem("CONT_USER_INFOR", JSON.stringify(Infor));
                dispatch(updateUser(Infor));
                if (LoginData.EMPID.toUpperCase() === "LONGHAI") {
                  navigate("/scr/inspection");
                } else {
                  navigate("/");
                }
              });
            }
          }
        });
      });
    } else {
      dispatch(
        updateUser({
          username: "Guest 1", // State username với giá trị mặc định là "Guest"
          displayname: "Guest 1", // State display name
          avatar: null, // State avatar
          Permission: "GUEST",
          isAuth: false, // State
        })
      );
      Swal.fire({
        icon: "error",
        title: "Thiếu dữ liệu...",
        text: "Hãy kiểm tra lại, dữ liệu không được để trống!",
      });
    }
  };
  ////// Transldate
  const { t } = useTranslation();

  useEffect(() => {
    let userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
    if (userInfor !== null && userInfor !== undefined) {
      setLoginData((prevData) => {
        return {
          ...prevData,
          EMPID: userInfor.username,
          PASSWORD: base64_decode(userInfor.password),
        };
      });
    }
  }, []);

  return (
    <Box
      className="s-home-login"
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Box className="b-box">
        <Box className="s-home-login__form">
          <Box className="b-thumb">
            <Typography variant="h2" className="p-name">
              CSG
            </Typography>
          </Box>
          <Typography variant="h4" className="p-title">
            Contractor Safety Management System
          </Typography>
          <Box component={"form"} onSubmit={(e) => HandleSubmit(e)}>
            {/* <Slide direction="right" in={isReg}>
                <Collapse in={isReg}>
                  <Box
                    sx={{
                      padding: 2,
                    }}
                  >
                    <Stack spacing={2} alignItems={"center"}>
                      <TextField
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        className="b-input"
                        placeholder={t("plholder_userID")}
                        name="EMPID"
                        color="info"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ paddingLeft: 1.5 }}
                            >
                              <PersonOutlineOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                      />
                      <TextField
                        type="password"
                        className="b-input"
                        placeholder={t("plholder_password")}
                        name="PASSWORD"
                        color="info"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ paddingLeft: 1.5 }}
                            >
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                      />
                      <TextField
                        type="password"
                        className="b-input"
                        placeholder={t("plholder_re_password")}
                        name="REPASSWORD"
                        color="info"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ paddingLeft: 1.5 }}
                            >
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                      />

                      <Stack
                        sx={{
                          width: "100%",
                        }}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"end"}
                      >
                        <Button
                          onClick={() => setisReg(!isReg)}
                          variant="standard"
                          size="small"
                          sx={{
                            textTransform: "none",
                            color: "white",
                          }}
                        >
                          {t("btn_register_login")}
                        </Button>
                      </Stack>
                      <Box className="s-mid">
                        <Button
                          type="submit"
                          sx={{
                            textTransform: "none",
                            fontSize: "1.2rem",
                          }}
                          variant="contained"
                          size="large"
                          color="primary"
                          startIcon={<LoginIcon />}
                        >
                          {t("btn_register")}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </Collapse>
              </Slide> */}
            {/* <Slide direction="left" in={!isReg}> */}
            {/* <Collapse in={!isReg}> */}
            <Box
              sx={{
                padding: 2,
              }}
            >
              <Stack spacing={2} alignItems={"center"}>
                <TextField
                  // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  autoComplete="false"
                  className="b-input"
                  placeholder={t("plholder_userID")}
                  name="EMPID"
                  value={LoginData.EMPID}
                  onChange={handleTextChange}
                  color="info"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ paddingLeft: 1.5 }}
                      >
                        <PersonOutlineOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <TextField
                  type="password"
                  className="b-input"
                  placeholder={t("plholder_password")}
                  name="PASSWORD"
                  value={LoginData.PASSWORD}
                  onChange={handleTextChange}
                  color="info"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ paddingLeft: 1.5 }}
                      >
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                {/* <Stack
                        sx={{
                          width: "100%",
                        }}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"end"}
                      >
                        <Button
                          onClick={() => setisReg(!isReg)}
                          variant="standard"
                          size="small"
                          sx={{
                            textTransform: "none",
                            color: "white",
                          }}
                        >
                          {t("btn_login_register")}
                        </Button>
                      </Stack> */}
                <Box className="s-mid">
                  <Button
                    type="submit"
                    sx={{
                      textTransform: "none",
                      fontSize: "1.2rem",
                    }}
                    variant="contained"
                    size="large"
                    color="primary"
                    startIcon={<LoginIcon />}
                  >
                    {t("btn_login")}
                  </Button>
                </Box>
              </Stack>
            </Box>
            {/* </Collapse> */}
            {/* </Slide> */}
          </Box>
        </Box>
      </Box>
      {/* <Typography
        sx={{
          color: "white",
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        © 2023 Changshin Vietnam co.,ltd. All Rights Reserved.
      </Typography> */}
    </Box>
  );
};

export default LoginPage;
