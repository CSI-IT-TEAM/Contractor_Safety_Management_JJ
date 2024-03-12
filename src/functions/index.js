import { ValidUserPermissionSelectURL, UserPermissionSelectURL } from "../api";
import { useLocation } from "react-router-dom";
import { UserDataSelectURL } from "../api";

//////Cancel Fetch API After Timeout
const Timeout = (time) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
};

/////Fetch Data
export const fetchData = async (url, dataConfig) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataConfig),
            // signal: Timeout(5).signal,
        });

        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

/////Fetch Post Data
export const fetchPostData = async (url, dataConfig) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataConfig),
        });

        return response.status === 200 ? true : false;
    } catch {
        return false;
    }
};

export const fetchPostFormData = async (url, dataConfig) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: dataConfig,
        });

        return response.status === 200 ? true : false;
    } catch {
        return false;
    }
};

/////Check Is null Of Empty
export const isNullOrEmpty = (value) => {
    if (value === null || value === "" || value === undefined) {
        return true;
    } else {
        return false;
    }
};

/////Fetch Data
export const getDateFormat = (value) => {
    let date = isNullOrEmpty(value) ? new Date() : value;
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let ymd =
        date.getFullYear().toString() +
        ((month > 9 ? "" : "0") + month).toString() +
        ((day > 9 ? "" : "0") + day).toString();

    return ymd;
};

export const getDateFormatString = (value) => {
    return value.replace(/(\d{4})(\d{2})(\d{2})/g, "$1/$2/$3");
};

export const getDateFormatYMD = (value) => {
    return value.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
};

export const compareDateTime = () => {
    // Let's suppose the variables time1 and time2 come from an input
    var time1 = "14:00";

    const date1 = new Date();
    const date2 = new Date(
        getDateFormat(date1).replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3") +
        " " +
        time1
    );

    // Verify if the first time is equal, more recent or less recent than the second
    if (date1.getTime() <= date2.getTime()) {
        return true;
    } else {
        return false;
    }
};

//////Get Valid Date
export const getDateAfter = () => {
    let isBeforeTime = compareDateTime() ? 1 : 2;
    let currentDate = new Date(
        new Date().getTime() + 24 * isBeforeTime * 60 * 60 * 1000
    );
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let ymd =
        year +
        ((month > 9 ? "" : "0") + month).toString() +
        ((day > 9 ? "" : "0") + day).toString();

    return new Date(ymd.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"));
};

/////Get Inspection Page Type
export const getPageType = (location, type) => {
    let _pageType = "0";
    let _result = type;

    switch (location.pathname) {
        case "/rsm/inspection":
            _pageType = "3";
            break;
        case "/dept/inspection":
            _pageType = "2";
            break;
        default:
            _pageType = "1";
            break;
    }

    if (type === "ADMIN") {
        switch (_pageType) {
            case "1":
                _result = "SCR";
                break;
            case "2":
                _result = "DEPT";
                break;
            case "3":
                _result = "RSM";
                break;
            default:
                break;
        }
    }

    return _result;
};

export const getPageIns = (location) => {
    let _pageType = "0";

    switch (location.pathname) {
        case "/rsm/inspection":
            _pageType = "3";
            break;
        case "/dept/inspection":
            _pageType = "2";
            break;
        default:
            _pageType = "1";
            break;
    }

    return _pageType;
};

export const getMaxBirthday = () => {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear() - 18;
    let ymd =
        year +
        ((month > 9 ? "" : "0") + month).toString() +
        ((day > 9 ? "" : "0") + day).toString();

    return new Date(ymd.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"));
};

export const getMaxBirthdayYear = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear() - 18;

    return year;
};

//////Timeout
export const handleTimeout = (timeout) => {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, timeout);
    });
};

//////Get Valid Date
export const getYesterday = () => {
    let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let ymd =
        year +
        ((month > 9 ? "" : "0") + month).toString() +
        ((day > 9 ? "" : "0") + day).toString();

    return new Date(ymd.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"));
};

/////Validate User Permission
export const getUserPermission = async (location) => {
    const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
    if (userData !== null && userData !== undefined) {
        let _fetchData = await fetchData(ValidUserPermissionSelectURL, {
            ARG_TYPE: "Q",
            ARG_USERNAME: userData.username,
            ARG_PASSWORD: userData.password,
            ARG_PATH_NAME: location.pathname,
            OUT_CURSOR: "",
        });

        if (_fetchData !== null && _fetchData.length > 0) {
            if (_fetchData[0].IS_PERMISSION > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

//////Validate User ID
export const validateUserID = async(userID) => {
    let _fetchData = await fetchData(UserDataSelectURL, {
        ARG_TYPE: "Q",
        ARG_EMPID: userID,
        OUT_CURSOR: ""
    });

    if (_fetchData !== null && _fetchData.length > 0) {
       return _fetchData[0].EMP_NM
    } else {
        return "";
    }
}

////// Convert Buffer Image to Base 64
export const arrayBufferToBase64 = (buffer) => {
    var base64Flag = "data:image/jpeg;base64,";
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return base64Flag + window.btoa(binary);
};

//////Validate User ID
export const getUserPermissOnPage = async(permissType, pathName) => {
    const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

    let _fetchData = await fetchData(UserPermissionSelectURL, {
        ARG_TYPE: "Q",
        ARG_EMPID: userData.username,
        ARG_PERMISS: permissType,
        ARG_PATH: pathName,
        OUT_CURSOR: ""
    });

    if (_fetchData !== null && _fetchData.length > 0) {
       return _fetchData[0].PERMISS === "Y" ? true : false;
    } else {
        return false;
    }
}