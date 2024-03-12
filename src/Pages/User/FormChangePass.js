import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import "./index.scss";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoginURL, UserRegisterSaveURL } from "../../api";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/store/userSlice";
const userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
const FormChangePass = () => {
  /////// Translate Lang
  const { t } = useTranslation();
  const langCookie = i18next.language;
  const [lang, setLang] = useState(langCookie);
  const [showPassword, setShowPassword] = React.useState(false);
  const [Password, setPassword] = useState("");
  const [PasswordNew, setPasswordNew] = useState("");
  const [PasswordNewConfirm, setPasswordNewConfirm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setLang(i18next.language);
  }, [langCookie]);

  //////// Handle Set Controlled Data
  const handleChange = (event) => {
    switch (event.target.name) {
      case "PASSWORD":
        setPassword(event.target.value);
        break;
      case "PASSWORD_NEW":
        setPasswordNew(event.target.value);
        break;
      case "PASSWORD_NEW_CONFIRM":
        setPasswordNewConfirm(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  ////// Cancel Fetch API After Timeout
  const Timeout = (time) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
  };

  const arrayBufferToBase64 = (buffer) => {
    var base64Flag = "data:image/jpeg;base64,";
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return base64Flag + window.btoa(binary);
  };

  const HandleChangePass = () => {
    // console.log(empData.PASSWORD);
    // return;
    const userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
    if (base64_encode(Password) !== userInfor.password) {
      Swal.fire(
        t("title_wrong_password1"),
        t("title_old_password_incorrect"),
        "error"
      );
    } else {
      if (!PasswordNew || !PasswordNewConfirm) {
        Swal.fire(t("title_new_password_can_be_empty"), "", "error");
      } else if (PasswordNewConfirm !== PasswordNew) {
        Swal.fire(
          t("title_password_must_be_same_as_old_password"),
          t("title_please_checking_new_password"),
          "error"
        );
      } else {
        //Call Update Password.
        Swal.fire({
          title: t("title_change_password_question"),
          text: t("title_new_password_will_applied"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: t("btn_confirm"),
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(UserRegisterSaveURL, {
              method: "POST",
              mode: "cors",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ARG_TYPE: "S",
                ARG_EMPID: userInfor.username, //user name
                ARG_PASSWORD: base64_encode(PasswordNew), //password
              }),
              signal: Timeout(5).signal,
            }).then((response) => {
              response.json().then(async (result) => {
                if (result.Result === "OK") {
                  fetch(LoginURL, {
                    method: "POST",
                    mode: "cors",
                    dataType: "json",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ARG_TYPE: "Q",
                      ARG_EMPID: userInfor.username, //user name
                      ARG_PASSWORD: base64_encode(PasswordNew), //password
                      OUT_CURSOR: "",
                    }),
                    signal: Timeout(5).signal,
                  }).then((response) => {
                    response.json().then(async (result) => {
                      if (result.length > 0) {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: t("title_password_change_success"),
                          showConfirmButton: false,
                          timer: 1500,
                        }).then((rs) => {
                          setPassword("");
                          setPasswordNew("");
                          setPasswordNewConfirm("");
                          //Register Success
                          let Infor = {
                            username: userInfor.username, // State username với giá trị mặc định là "Guest"
                            password: base64_encode(PasswordNew),
                            displayname: result[0].EMP_NM, // State display name
                            plant_cd: result[0].PLANT_CD,
                            avatar:
                              userInfor.username === "LONGHAI"
                                ? null
                                : result[0].PHOTO.data, // State avatar
                            Permission: result[0].DEPT_NM,
                            isAuth: true,
                            isChief: result[0].IS_CHIEF === "Y" ? true : false,
                          };
                          localStorage.setItem(
                            "CONT_USER_INFOR",
                            JSON.stringify(Infor)
                          );
                          dispatch(updateUser(Infor));
                        });
                      }
                    });
                  });
                } else {
                  Swal.fire(
                    t("title_error"),
                    t("title_password_change_unsuccessful"),
                    "error"
                  );
                }
              });
            });
          }
        });
      }
    }
  };

  return (
    <Container
      maxWidth="full"
      className="s-user-container"
      sx={{
        padding: 2,
        maxWidth: "600px"
      }}
    >
      <Paper
        fullWidth
        sx={{
          p: 2,
        }}
      >
        <Stack fullWidth spacing={2} p={2}>
          <Typography variant="h5" className="s-title">
            User Password Change
          </Typography>
          <Box
            sx={{
              maxWidth: "500px",
              alignSelf: "center",
            }}
          >
            <Stack fullWidth spacing={2} p={2} justifyContent={"center"}>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label={t("frm_password")}
                id="passWord"
                className="b-input"
                placeholder={t("frm_password_placeholder")}
                value={Password}
                onChange={handleChange}
                name="PASSWORD"
                color="info"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type={showPassword ? "text" : "password"}
                label={t("frm_new_password")}
                id="passWord_new"
                className="b-input"
                placeholder={t("frm_new_password_placeholder")}
                value={PasswordNew}
                onChange={handleChange}
                name="PASSWORD_NEW"
                color="info"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <TextField
                type={showPassword ? "text" : "password"}
                label={t("frm_confirm_password")}
                id="passWord_new_Confirm"
                className="b-input"
                placeholder={t("frm_confirm_password_placeholder")}
                value={PasswordNewConfirm}
                onChange={handleChange}
                name="PASSWORD_NEW_CONFIRM"
                color="info"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <Box
                className="s-form-bot"
                sx={{
                  textAlign: "center",
                }}
              >
                <Button
                  sx={{
                    textTransform: "none",
                  }}
                  variant="contained"
                  size="large"
                  onClick={() => HandleChangePass()}
                >
                  {t("btn_change_password")}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default FormChangePass;
