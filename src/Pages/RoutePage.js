import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./Login";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/store/userSlice";
import LoadingPage from "./LoadingPage";
import TimeLinePage from "./Timeline";
import Header from "../components/Header/Header";
import { Box } from "@mui/material";
import RequireAuth from "../components/RequireAuth";

import HomePage from "./Request";
import ApprovalPage from "./Approval";
import InspectionChecklistPage from "./Inspection";
import ContractorMgntPage from "./Contractor";
import FormChangePass from "./User/FormChangePass";
import HomeDashboard from "./Home";
// import InspectionPage from "./Inspectionv2";
import SafetyTrainPage from "./SafetyTrain";
import AuthorityPage from "./Authority";
import ErrorPage from "./404";
import BlacklistPage from "./Blacklist";
import LongHaiInOutReport from "./Report/LongHai";

const width = window.innerWidth;

export default function RouterPage() {
  /////Init Variable
  const [open, setOpen] = useState(false);
  const [userData, setuserData] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen((open) => !open);
  };
  const location = useLocation();

  useEffect(() => {
    if (width > 1280 || width <= 1024) {
      setOpen((open) => false);
    } else {
      setOpen((open) => true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    //Checking for login or not
    let userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
    if (userInfor !== null && userInfor !== undefined) {
      setuserData(userInfor);
      dispatch(
        updateUser({
          username: userInfor.username, // State username với giá trị mặc định là "Guest"
          displayname: userInfor.displayname, // State display name
          Permission: userInfor.Permission,
          isAuth: userInfor.isAuth, // State
          isChief: userInfor.isChief,
          plant_cd: userInfor.plant_cd,
          avatar: userInfor.avatar, // State avatar
        })
      );
      if (userInfor.isAuth) {
        navigate(location.pathname);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////In case End-User Change Browser URL
  useEffect(() => {
    if (location.pathname === "/login") {
      let userInfor = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

      if (userInfor && userInfor.isAuth) {
        localStorage.removeItem("CONT_USER_INFOR");
        localStorage.removeItem("CONT_USER_PERMISS");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      {location.pathname !== "/login" && (
        <Header open={open} handleOpen={handleOpen} />
      )}
      <Box
        className={
          JSON.parse(localStorage.getItem("CONT_USER_INFOR")) &&
          JSON.parse(localStorage.getItem("CONT_USER_INFOR")).isAuth
            ? open
              ? "s-layout s-layout--active"
              : "s-layout"
            : null
        }
      >
        <Routes>
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/404" element={<ErrorPage />} />
          {/* <Route path="/dept/inspectionv2" element={<InspectionPage />} /> */}
          <Route path="/passwordchange/" element={<FormChangePass />} />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/approval" element={<ApprovalPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route
              path="/scr/inspection/"
              element={<InspectionChecklistPage />}
            />
          </Route>
          <Route element={<RequireAuth />}>
            <Route
              path="/dept/inspection/"
              element={<InspectionChecklistPage />}
            />
          </Route>
          <Route element={<RequireAuth />}>
            <Route
              path="/rsm/inspection/"
              element={<InspectionChecklistPage />}
            />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/timeline/" element={<TimeLinePage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/contractor/" element={<ContractorMgntPage />} />
          </Route>
          {/* <Route element={<RequireAuth />}> */}
          <Route path="/dashboard/" element={<HomeDashboard />} />
          {/* </Route> */}
          <Route element={<RequireAuth />}>
            <Route path="/safety" element={<SafetyTrainPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/authority" element={<AuthorityPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/blacklist" element={<BlacklistPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/report/inout" element={<LongHaiInOutReport />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Box>
      <Box
        onClick={handleOpen}
        className={
          open
            ? "s-overlay-header s-overlay-header--active"
            : "s-overlay-header"
        }
      ></Box>
    </>
  );
}
