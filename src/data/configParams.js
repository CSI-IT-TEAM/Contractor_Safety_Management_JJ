import moment from "moment";
import { startOfMonth } from "date-fns";
import { getDateFormat, isNullOrEmpty } from "../functions";

//Login Parameters
const LoginParams = () => {
  return {
    TYPE: "Q",
    EMPID: "",
    PASSWORD: "",
  };
};

//User Menu Select List Parameters
const UserMenuListParams = () => {
  return {
    TYPE: "Q",
    EMPID: "",
  };
};

const EmployeeParams = (id) => {
  return {
    ID: id,
    EMP_CITIZEN_ID: "",
    EMP_NAME: "",
    EMP_BIRTHDATE: "",
    EMP_GENDER: true,
    EMP_POSITION: "P001",
    SECURITY_CARD_YN: "Y",
    EMP_CITIZEN_ID_VALID: true,
    EMP_NAME_VALID: true,
    EMP_BIRTHDATE_VALID: true,
    EMP_POSITION_VALID: true,
    INSURANCE_IMG: [],
    WORK_PLAN_IMG: [],
    LISCENT_IMG: [],
    JOB_LIST: [],
    JOB_DESC: "",
    DEGREE_LIST: [],
    DEGREE_DESC: "",
  };
};

const RequestSelectParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "Q",
    CONT_CODE: "",
    DEPT_CD: userData.dept_cd,
    REQ_DATEF: "",
    REQ_DATET: "",
  };
};

//Vendor List Select Parameters
const VendorListSelectParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "Q",
    DEPT_CD: userData.dept_cd,
  };
};

//Vendor Request List Select Parameters
const VendorRequestListSelectParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "Q",
    REQ_DATEF: "",
    REQ_DATET: "",
    DEPT_CD: userData.dept_cd,
  };
};

//Request Create Parameters
const RequestCreateSaveParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    PLANT_CD: "",
    DEPT_CD: "",
    REQ_NO: "",
    VISIT_START_DATE: "",
    VISIT_END_DATE: "",
    VISIT_PURPOSE: "",
    VISIT_WORKPLACE: "",
    CONT_CODE: "",
    CONT_NAME: "",
    CONT_ADDRESS: "",
    CONT_PHONE: "",
    CONT_EMAIL: "",
    SUPERVISOR_ID: "",
    SUPERVISOR_NM: "",
    SUPERVISOR_PHONE: "",
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

//Request Confirm Update Parameters
const RequestConfirmUpdateParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_ROWID: "",
    ARG_PLANT_CD: "",
    ARG_DEPT_CD: userData.dept_cd,
    ARG_CONFIRM_YN: "",
    ARG_CONFIRM_ID: "",
    ARG_CONFIRM_NAME: "",
    ARG_CONFIRM_COMMENT: "",
    ARG_UPDATE_PROGRAM_ID: "",
  };
};

//Request Create Result Parameters
const RequestCreateResultSaveParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ROWID: "",
    REQ_NO: "",
    EMP_CITIZEN_ID: "",
    VISIT_START_DATE: "",
    VISIT_END_DATE: "",
    HOLI_INCLUDE: "",
    EMP_NAME: "",
    EMP_BIRTHDATE: "",
    EMP_GENDER: "",
    EMP_POSITION: "",
    SECURITY_CARD_YN: "",
    INS_1_DATE: "",
    INS_1_DT: "",
    INS_1_PIC_ID: "",
    INS_1_PIC_NAME: "",
    INS_1_ITEM: "",
    INS_1_RESULT: "",

    INS_2_DATE: "",
    INS_2_DT: "",
    INS_2_PIC_ID: "",
    INS_2_PIC_NAME: "",
    INS_2_ITEM: "",
    INS_2_RESULT: "",

    INS_3_DATE: "",
    INS_3_DT: "",
    INS_3_PIC_ID: "",
    INS_3_PIC_NAME: "",
    INS_3_ITEM: "",
    INS_3_RESULT: "",

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

//Request Create Result Parameters
const RequestUpdateResultSaveParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ROWID: "",
    DEPT_CD: userData.dept_cd,

    INS_1_DATE: "",
    INS_1_DT: "",
    INS_1_PIC_ID: "",
    INS_1_PIC_NAME: "",
    INS_1_ITEM: "",
    INS_1_RESULT: "",

    ARG_INS_2_DATE: "",
    ARG_INS_2_DT: "",
    ARG_INS_2_PIC_ID: "",
    ARG_INS_2_PIC_NAME: "",
    ARG_INS_2_ITEM: "",
    ARG_INS_2_RESULT: "",

    ARG_INS_3_DATE: "",
    ARG_INS_3_DT: "",
    ARG_INS_3_PIC_ID: "",
    ARG_INS_3_PIC_NAME: "",
    ARG_INS_3_ITEM: "",
    ARG_INS_3_RESULT: "",

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: "",
  };
};

//Contractor Save Parameters
const ContractorSaveParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ROWID: "",
    CONT_NAME: "",
    CONT_ADDRESS: "",
    CONT_EMAIL: "",
    CONT_PHONE: "",
    CONT_PIC: "",
    CONT_PIC_PHONE: "",
    CONT_DESC: "",
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "VENDOR_UPDATE_SAVE",
  };
};
//Contractor Delete Parameters
const ContractorDeleteParams = () => {
  return {
    ROWID: "",
  };
};

const RequestSearchParams = (data) => {
  return {
    ROWID: data.ROWID,
    PLANT_CD: data.PLANT_CD,
    DEPT_CD: data.DEPT_CD,
    DEPT_NM: data.DEPT_NM,
    REQ_NO: data.REQ_NO,
    REQ_DATE: data.REQ_DATE,
    VISIT_PURPOSE: data.VISIT_PURPOSE,
    VISIT_START_DATE: data.VISIT_START_DATE,
    VISIT_END_DATE: data.VISIT_END_DATE,
    CONT_CODE: data.CONT_CODE,
    CONT_NAME: data.CONT_NAME,
    PIC_CONFIRM_YN: data.PIC_CONFIRM_YN,
    RSM_CONFIRM_YN: data.RSM_CONFIRM_YN,
    EMP_QTY: data.EMP_QTY,
    SUPERVISOR_NM: data.SUPERVISOR_NM,
    SUPERVISOR_PHONE: data.SUPERVISOR_PHONE,
    ORD: data.ORD,
    USER_IS_CHIEF: "",
    USER_DEPT: "",
  };
};

//Result item save Parameters
const ResultItemSaveParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "",
    DEPT_CD: userData.dept_cd,
    REQ_NO: "",
    EMP_CITIZEN_ID: "",
    WORK_DATE: "",
    ITEM_CODE: "",
    ITEM_RESULT: "",
    ITEM_COMMENT: "",
    INS_IMAGE_PATH: "",
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
    ITEM_PICTURE: null, //Blob files.
  };
};

const InspectSearchParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    PLANT_CD: "",
    DATE: "",
    DEPT_CD: isNullOrEmpty(userData.dept_cd) ? "" : userData.dept_cd,
    PERMISSION: isNullOrEmpty(userData.Permission) ? "" : userData.Permission,
    CONT_CODE: "",
    REQ_NO: "",
    EMP_CITIZEN_ID: "",
  };
};

const VendorListTimeLineParams = () => {
  return {
    TYPE: "",
    WORK_DATE: [startOfMonth(new Date()), new Date()],
  };
};

const InspecUploadImageParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "",
    REQ_NO: "",
    INS_SEQ: "",
    IMG_HAS_YN_1: "N", // HAS IMAGE: Y, ELSE N
    IMG_HAS_YN_2: "N", // HAS IMAGE: Y, ELSE N
    IMG_HAS_YN_3: "N", // HAS IMAGE: Y, ELSE N
    IMG_HAS_YN_4: "N", // HAS IMAGE: Y, ELSE N
    IMG_HAS_YN_5: "N", // HAS IMAGE: Y, ELSE N
    WORK_DATE: "",
    INS_DESC: "",
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

const EmployeeListSelectParams = () => {
  return {
    TYPE: "",
    WORK_DATE: getDateFormat(new Date()),
    REQ_NO: "",
  };
};

const ContractorBlacklistUpdateParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "",
    BLACKLIST_DATE: "",
    CONT_CODE: "",
    CONT_NAME: "",
    REASON: "",

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

const EmployeeBlacklistUpdateParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "",
    BLACKLIST_DATE: "",
    EMP_CODE: "",
    EMP_NAME: "",
    REASON: "",

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

const CoopImageParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  return {
    TYPE: "",
    COOP_DATE: "",
    CONT_CODE: "",
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

const CoopImagesListSelectParams = () => {
  return {
    TYPE: "",
    COOP_DATE: getDateFormat(new Date()),
    CONT_CODE: "",
  };
};

const EmployeeSafetyTrainingParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  return {
    TYPE: "U",
    EMP_CITIZEN_ID: "",
    EMP_NAME: "",
    TRAIN_DATE: moment(new Date()).format("YYYYMMDDHHmmss"),
    IMAGE_PATH: "",
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

const ContBlackListSelectParams = () => {
  return {
    TYPE: "",
    DATEF: new Date(new Date().getFullYear(), 0, 1),
    DATET: new Date(),
  };
};

const EmployeeBlackListSelectParams = () => {
  return {
    TYPE: "",
    DATEF: new Date(new Date().getFullYear(), 0, 1),
    DATET: new Date(),
  };
};

const RequestPaperWorkImageParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  return {
    TYPE: "",
    INS_DATE: "",
    EMP_CITIZEN_ID: "",
    IMAGE_DIV: "",

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};
const WorkerResultUpdateParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "",
    IS_VACATION: "",
    REQ_NO: "",
    WORK_DATE: "",
    EMP_CITIZEN_ID: "",

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "",
  };
};

const HistorySelectParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: "",
    ARG_DATE: "",
    ARG_CONT_CODE: "",
    ARG_REQ_NO: "",
    ARG_DEPT_CD: userData.dept_cd,
    ARG_PERMISS: userData.Permission,
    OUT_CURSOR: "",
  };
};

const ReportInOutListSelectParams = () => {
  return {
    TYPE: "Q",
    WORK_DATE: [startOfMonth(new Date()), new Date()],
  };
};

const SendEmailParams = (emailList, sendData, type) => {
    let emailSubject = "", header = "", footer = "";

    switch(type) {
        //////Request Contractor
        case "REQ":
            emailSubject = "Contractor Request";
            header = "Halo, departemen RSM.<br />" + 
                    "Departemen " + sendData.DEPT_CD + ", baru saja menerima permintaan pekerjaan dari kontraktor.<br />";
            footer = "- Jenis Pekerjaan: " + sendData.VISIT_PURPOSE + "<br/>" +
                    "- Tempat kerja: " + sendData.VISIT_WORKPLACE + "<br/>" +
                    "- Surel pemohon: " + sendData.EMAIL + "<br />";
            break;
        //////RSM Approve
        case "CFM":
            emailSubject = "Contractor Approved";
            header = "Selamat siang.<br />" + 
                    "Telah dikonfirmasi bahwa RSM telah meminta kontraktor untuk bekerja.<br />";
            footer = "- Jenis Pekerjaan: " + sendData.VISIT_PURPOSE + "<br/>" + 
                    "- Tempat kerja: " + sendData.VISIT_WORKPLACE + "<br/>";
            break;
        //////RSM Deny
        case "DENY":
            emailSubject = "Contractor Denied";
            header = "Selamat siang.<br />" + 
                    "Pihak RSM pun menolak untuk meminta kontraktor untuk bekerja.<br />" +
                    "Alasan penolakan: " + sendData.RSM_CONFIRM_COMMENT+ " <br />";
            break;
        default:
            break;
    }

    return {
        "to": emailList,
        "subject": emailSubject,
        "html":
            "<html>" +
            "<head><style>.text{ font-family: 'Consolas', Times, serif; font-size: '14'; }</style></head>" +
            "<body class='text'>" +
            header +
            "Informasi lebih lanjut:<br />" +
            "- Nama: " + sendData.CONT_NAME + "<br />" +
            "- Alamat: " + sendData.CONT_ADDRESS + "<br />" +
            "- Perwakilan: " + sendData.CONT_PIC + "<br />" +
            "- Nomor telepon: " + sendData.CONT_PIC_PHONE + "<br />" +
            "- Total orang yang akan bergabung: " + sendData.TOTAL_PEOPLE + " Rakyat<br />" +
            "- Dari " + sendData.VISIT_START_DATE + " sampai " + sendData.VISIT_END_DATE + "<br/>" +
            footer +
            "Silakan kunjungi link ini <a href='http://172.30.10.120:3090'>Contractor Safety Management</a> untuk memeriksa dan memastikan informasi.<br />" +
            "Terima kasih." + 
            "</body>" +
            "</html>"
    }
}

export {
  LoginParams,
  UserMenuListParams,
  EmployeeParams,
  RequestSelectParams,
  RequestCreateSaveParams,
  RequestConfirmUpdateParams,
  RequestCreateResultSaveParams,
  RequestUpdateResultSaveParams,
  VendorListSelectParams,
  VendorRequestListSelectParams,
  ContractorSaveParams,
  ContractorDeleteParams,
  RequestSearchParams,
  ResultItemSaveParams,
  InspectSearchParams,
  VendorListTimeLineParams,
  InspecUploadImageParams,
  EmployeeListSelectParams,
  ContractorBlacklistUpdateParams,
  EmployeeBlacklistUpdateParams,
  CoopImagesListSelectParams,
  EmployeeSafetyTrainingParams,
  ContBlackListSelectParams,
  EmployeeBlackListSelectParams,
  RequestPaperWorkImageParams,
  WorkerResultUpdateParams,
  HistorySelectParams,
  ReportInOutListSelectParams,
  SendEmailParams
};
