import { decode as base64_decode, encode as base64_encode } from "base-64";
import moment from "moment";
import { Buffer, File } from "buffer";

export const removeVietnamese = (str, c = "-") => {
  try {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  } catch {
    return str;
  }
};

const UploadLoginParams = (data) => {
  return {
    ARG_TYPE: "Q",
    ARG_EMPID: data.EMPID,
    ARG_PASSWORD: base64_encode(data.PASSWORD),
    OUT_CURSOR: "",
  };
};

const UploadRegisterParams = (data) => {
  return {
    ARG_TYPE: "Q",
    ARG_EMPID: data.EMPID,
    ARG_PASSWORD: base64_encode(data.PASSWORD),
  };
};

//User Menu Select List Parameters
const UploadUserMenuListParams = (data) => {
  return {
    ARG_TYPE: "Q_VALID",
    ARG_EMPID: data.EMPID,
    OUT_CURSOR: "",
  };
};

const UploadRequestSelectParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    TYPE: "Q",
    ARG_CONT_CODE: data.CONT_CODE,
    ARG_DEPT_CD: userData.dept_cd,
    ARG_REQ_DATEF: data.REQ_DATEF,
    ARG_REQ_DATET: data.REQ_DATET,
    OUT_CURSOR: "",
  };
};

const UploadRequestCreateSaveParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_PLANT_CD: data.PLANT_CD,
    ARG_DEPT_CD: userData.dept_cd,
    ARG_VISIT_START_DATE: data.VISIT_START_DATE,
    ARG_VISIT_END_DATE: data.VISIT_END_DATE,
    ARG_VISIT_PURPOSE: removeVietnamese(data.VISIT_PURPOSE),
    ARG_VISIT_WORKPLACE: removeVietnamese(data.VISIT_WORKPLACE),
    ARG_CONT_CODE: data.CONT_CODE,
    ARG_CONT_NAME: data.CONT_NAME,
    ARG_CONT_ADDRESS: data.CONT_ADDRESS,
    ARG_CONT_PHONE: data.CONT_PHONE,
    ARG_CONT_EMAIL: data.CONT_EMAIL,
    ARG_SUPERVISOR_ID: data.SUPERVISOR_ID,
    ARG_SUPERVISOR_PHONE: data.SUPERVISOR_PHONE,
    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    CREATE_PROGRAM_ID: "CSM_REQUEST_SAVE",
    OUT_CURSOR: "",
  };
};

//Request Confirm Update Parameters
const UploadRequestConfirmUpdateParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: "",
    ARG_ROWID: data.ROWID,
    ARG_PLANT_CD: data.PLANT_CD,
    ARG_DEPT_CD: userData.dept_cd,
    ARG_CONFIRM_YN: data.CONFIRM_YN,
    ARG_CONFIRM_ID: data.CONFIRM_ID,
    ARG_CONFIRM_NAME: data.CONFIRM_NAME,
    ARG_CONFIRM_COMMENT: data.CONFIRM_COMMENT,
    ARG_UPDATE_PROGRAM_ID: data.UPDATE_PROGRAM_ID,
  };
};

//Request Create Result Parameters
const UploadRequestCreateResultSaveParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_ROWID: data.ROWID,
    ARG_REQ_NO: data.REQ_NO,
    ARG_EMP_CITIZEN_ID: data.EMP_CITIZEN_ID,
    ARG_VISIT_START_DATE:
      data.VISIT_START_DATE.length === 8
        ? data.VISIT_START_DATE
        : moment(data.VISIT_START_DATE).format("yyyymmdd"),
    ARG_VISIT_END_DATE:
      data.VISIT_END_DATE.length === 8
        ? data.VISIT_END_DATE
        : moment(data.VISIT_END_DATE).format("yyyymmdd"),
    ARG_HOLI_INCLUDE: data.HOLI_INCLUDE,
    ARG_EMP_NAME: data.EMP_NAME,
    ARG_EMP_BIRTHDATE: data.EMP_BIRTHDATE,
    ARG_EMP_GENDER: data.EMP_GENDER,
    ARG_EMP_POSITION: data.EMP_POSITION,
    ARG_SECURITY_CARD_YN: data.SECURITY_CARD_YN,
    ARG_INS_1_DATE: data.INS_1_DATE,
    ARG_INS_1_DT: data.INS_1_DT,
    ARG_INS_1_PIC_ID: data.INS_1_PIC_ID,
    ARG_INS_1_PIC_NAME: data.INS_1_PIC_NAME,
    ARG_INS_1_ITEM: data.INS_1_ITEM,
    ARG_INS_1_RESULT: data.INS_1_RESULT,

    ARG_INS_2_DATE: data.INS_2_DATE,
    ARG_INS_2_DT: data.INS_2_DT,
    ARG_INS_2_PIC_ID: data.INS_2_PIC_ID,
    ARG_INS_2_PIC_NAME: data.INS_2_PIC_NAME,
    ARG_INS_2_ITEM: data.INS_2_ITEM,
    ARG_INS_2_RESULT: data.INS_2_RESULT,

    ARG_INS_3_DATE: data.INS_3_DATE,
    ARG_INS_3_DT: data.INS_3_DT,
    ARG_INS_3_PIC_ID: data.INS_3_PIC_ID,
    ARG_INS_3_PIC_NAME: data.INS_3_PIC_NAME,
    ARG_INS_3_ITEM: data.INS_3_ITEM,
    ARG_INS_3_RESULT: data.INS_3_RESULT,

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: data.CREATE_PROGRAM_ID,
  };
};

//Vendor List Select Parameters
const UploadVendorListSelectParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: data.TYPE,
    ARG_DEPT_CD: userData.dept_cd,
    OUT_CURSOR: "",
  };
};

//Vendor Request List Select Parameters
const UploadVendorRequestListSelectParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: data.TYPE,
    ARG_REQ_DATEF: data.REQ_DATEF,
    ARG_REQ_DATET: data.REQ_DATET,
    ARG_DEPT_CD: userData.dept_cd,
    OUT_CURSOR: "",
  };
};

//Cac phong ban Dept, SCR va RSM se update : Request Update Result Parameters
const UploadRequestUpdateResultSaveParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_ROWID: data.ROWID,
    ARG_DEPT_CD: data.DEPT_CD,
    ARG_EMP_ID: data.EMP_ID,
    ARG_WORK_DATE: data.WORK_DATE,

    ARG_INS_1_DATE: data.INS_1_DATE,
    ARG_INS_1_DT: "", //lấy giờ server
    ARG_INS_1_PIC_ID: data.INS_1_PIC_ID,
    ARG_INS_1_PIC_NAME: data.INS_1_PIC_NAME,
    ARG_INS_1_ITEM: data.INS_1_ITEM,
    ARG_INS_1_RESULT: data.INS_1_RESULT,

    ARG_INS_2_DATE: data.INS_2_DATE,
    ARG_INS_2_DT: "", //lấy giờ server
    ARG_INS_2_PIC_ID: data.INS_2_PIC_ID,
    ARG_INS_2_PIC_NAME: data.INS_2_PIC_NAME,
    ARG_INS_2_ITEM: data.INS_2_ITEM,
    ARG_INS_2_RESULT: data.INS_2_RESULT,

    ARG_INS_3_DATE: data.INS_3_DATE,
    ARG_INS_3_DT: "", //lấy giờ server
    ARG_INS_3_PIC_ID: data.INS_3_PIC_ID,
    ARG_INS_3_PIC_NAME: data.INS_3_PIC_NAME,
    ARG_INS_3_ITEM: data.INS_3_ITEM,
    ARG_INS_3_RESULT: data.INS_3_RESULT,

    ARG_VISITOR_ID: data.VISITOR_ID,

    CREATOR: userData.dept_cd,
    CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: data.CREATE_PROGRAM_ID,
  };
};

//Contractor Save Parameters
const UploadContractorSaveParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_ROWID: data.ROWID,
    ARG_CONT_NAME: removeVietnamese(data.CONT_NAME),
    ARG_CONT_ADDRESS: removeVietnamese(data.CONT_ADDRESS),
    ARG_CONT_EMAIL: data.CONT_EMAIL,
    ARG_CONT_PHONE: data.CONT_PHONE,
    ARG_CONT_PIC: removeVietnamese(data.CONT_PIC),
    ARG_CONT_PIC_PHONE: data.CONT_PIC_PHONE,
    ARG_CONT_DESC: removeVietnamese(data.CONT_DESC),
    ARG_CREATOR: userData.dept_cd,
    ARG_CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: data.CREATE_PROGRAM_ID,
    OUT_CURSOR: "",
  };
};

//Upload Contractor Delete Parameters
const UploadContractorDeleteParams = (data) => {
  return {
    ARG_ROWID: data.ROWID,
  };
};

//Result item save Parameters
const UploadResultItemSaveParams = (data) => {
  return {
    ARG_TYPE: data?.TYPE,
    ARG_DEPT_CD: data?.DEPT_CD,
    ARG_REQ_NO: data?.REQ_NO,
    ARG_EMP_CITIZEN_ID: data?.EMP_CITIZEN_ID,
    ARG_WORK_DATE: data?.WORK_DATE,
    ARG_ITEM_CODE: data?.ITEM_CODE,
    ARG_ITEM_RESULT: data?.ITEM_RESULT,
    ARG_ITEM_COMMENT: data?.ITEM_COMMENT,
    ARG_INS_IMAGE_PATH: "",
    ARG_CREATOR: data?.CREATOR,
    ARG_CREATE_PC: data?.CREATE_PC,
    ARG_CREATE_PROGRAM_ID: data?.CREATOR_PROGRAM_ID,
  };
};

const UploadVendorListTimeLineParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: "Q",
    ARG_START_DATE: moment(data.WORK_DATE[0]).format("YYYYMMDD"),
    ARG_END_DATE: moment(data.WORK_DATE[1]).format("YYYYMMDD"),
    ARG_DEPT_CD: userData.dept_cd,
    OUT_CURSOR: "",
  };
};

const InspecUploadImageSaveParams = (data, FileList) => {
  let _formData = new FormData();

  _formData.append("ARG_TYPE", "U");
  _formData.append("ARG_REQ_NO", data.REQ_NO);
  _formData.append("ARG_WORK_DATE", data.WORK_DATE);
  _formData.append("ARG_INS_SEQ", data.INS_SEQ);

  _formData.append(
    data.IMG_HAS_YN_1 === "Y" ? "ARG_IMG1" : "NO_IMAGE",
    data.IMG_HAS_YN_1 === "Y" ? FileList[0].blobFile : new Blob(),
    data.IMG_HAS_YN_1 === "Y" ? FileList[0].blobFile.name : ""
  );
  _formData.append(
    data.IMG_HAS_YN_2 === "Y" ? "ARG_IMG2" : "NO_IMAGE",
    data.IMG_HAS_YN_2 === "Y" ? FileList[1].blobFile : new Blob(),
    data.IMG_HAS_YN_2 === "Y" ? FileList[1].blobFile.name : ""
  );
  _formData.append(
    data.IMG_HAS_YN_3 === "Y" ? "ARG_IMG3" : "NO_IMAGE",
    data.IMG_HAS_YN_3 === "Y" ? FileList[2].blobFile : new Blob(),
    data.IMG_HAS_YN_3 === "Y" ? FileList[2].blobFile.name : ""
  );
  _formData.append(
    data.IMG_HAS_YN_4 === "Y" ? "ARG_IMG4" : "NO_IMAGE",
    data.IMG_HAS_YN_4 === "Y" ? FileList[3].blobFile : new Blob(),
    data.IMG_HAS_YN_4 === "Y" ? FileList[3].blobFile.name : ""
  );
  _formData.append(
    data.IMG_HAS_YN_5 === "Y" ? "ARG_IMG5" : "NO_IMAGE",
    data.IMG_HAS_YN_5 === "Y" ? FileList[4].blobFile : new Blob(),
    data.IMG_HAS_YN_5 === "Y" ? FileList[4].blobFile.name : ""
  );

  _formData.append("ARG_INS_DESC", data.INS_DESC);
  _formData.append("ARG_CREATOR", data.CREATOR);
  _formData.append("ARG_CREATE_PC", data.CREATE_PC);
  _formData.append("ARG_CREATE_PROGRAM_ID", data.CREATE_PROGRAM_ID);

  return _formData;
};

const UploadEmployeeListSelectParams = (data) => {
  return {
    ARG_TYPE: data.TYPE,
    ARG_WORK_DATE: data.WORK_DATE,
    ARG_REQ_NO: data.REQ_NO,
    OUT_CURSOR: "",
  };
};

const UploadItemInsListSelectParams = (data) => {
  return {
    ARG_TYPE: data.TYPE,
    ARG_WORK_DATE: data.WORK_DATE,
    ARG_REQ_NO: data.REQ_NO,
    ARG_EMP_CITIZEN_ID: data.EMP_CITIZEN_ID,
    OUT_CURSOR: "",
  };
};

const UploadContractorBlacklistUpdateParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  return {
    ARG_TYPE: data.TYPE,
    ARG_BLACKLIST_DATE: moment(data.WORK_DATE).format("YYYYMMDDHHmmss"),
    ARG_CONT_CODE: data.CONT_CODE,
    ARG_CONT_NAME: data.CONT_NAME,
    ARG_REASON: data.REASON,

    ARG_CREATOR: userData.dept_cd,
    ARG_CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: "",
  };
};

const UploadEmployeeBlacklistUpdateParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: data?.TYPE,
    ARG_BLACKLIST_DATE: data?.BLACKLIST_DATE,
    ARG_EMP_CODE: data?.EMP_CODE,
    ARG_EMP_NAME: data?.EMP_NAME,
    ARG_REASON: data?.REASON,

    ARG_CREATOR: userData.dept_cd,
    ARG_CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: data?.CREATOR_PROGRAM_ID,
  };
};

const UploadCoopImageExistCheck = (data) => {
  return {
    ARG_TYPE: data.TYPE,
    ARG_COOP_DATE: data.COOP_DATE,
    ARG_CONT_CODE: data.CONT_CODE,
    OUT_CURSOR: "",
  };
};

const UploadCoopImageParams = (data, File) => {
  let _formData = new FormData();
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  _formData.append("ARG_TYPE", "U");
  _formData.append("ARG_COOP_DATE", data.COOP_DATE);
  _formData.append("ARG_CONT_CODE", data.CONT_CODE);
  _formData.append("ARG_IMAGE", File.blobFile, File.blobFile.name);

  _formData.append("ARG_CREATOR", userData.dept_cd);
  _formData.append(
    "ARG_CREATE_PC",
    userData.username + "|" + userData.Permission
  );
  _formData.append("ARG_CREATE_PROGRAM_ID", "COOP_IMAGE");

  return _formData;
};

const UploadCoopImagesListSelectParams = (data) => {
  return {
    ARG_TYPE: data.TYPE,
    ARG_COOP_DATE: data.COOP_DATE,
    ARG_CONT_CODE: data.CONT_CODE,
    OUT_CURSOR: "",
  };
};

const UploadEmployeeSafetyTrainingParams = (data) => {
  return {
    ARG_TYPE: data.TYPE,
    ARG_EMP_CITIZEN_ID: data.EMP_CITIZEN_ID,
    ARG_EMP_NAME: data.EMP_NAME,
    ARG_TRAIN_DATE: data.TRAIN_DATE,
    ARG_IMAGE_PATH: data.IMAGE_PATH,
    ARG_CREATOR: data.CREATOR,
    ARG_CREATE_PC: data.CREATE_PC,
    ARG_CREATE_PROGRAM_ID: data.CREATE_PROGRAM_ID,
  };
};

const UploadUserRegAuthorityParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  return {
    ARG_TYPE: "",
    ARG_EMPID: "",
    ARG_PASSWORD: "",
    ARG_GROUP_CD: "",
    ARG_MENU_CD: "",
    ARG_PERMISS: "",
    ARG_USE_YN: "",
    ARG_CREATOR: userData.dept_cd,
    ARG_CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: "",
  };
};

//////// User Permission Upload Params
const UploadUserPermissionParams = () => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  return {
    ARG_TYPE: "",
    ARG_EMPID: "",
    ARG_MENU_CD: "",
    ARG_PERMISS: "",
    ARG_USE_YN: "",
    ARG_NEW_YN: "",
    ARG_SAVE_YN: "",
    ARG_DELETE_YN: "",
    ARG_CREATOR: userData.dept_cd,
    ARG_CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: "",
  };
};

const UploadContBlackListSelectParams = (data) => {
  return {
    ARG_TYPE: "Q",
    ARG_DATEF: data.DATEF ? moment(data.DATEF).format("YYYYMMDD") : "19991231",
    ARG_DATET: data.DATET ? moment(data.DATET).format("YYYYMMDD") : "99991231",
    OUT_CURSOR: "",
  };
};

const UploadEmployeeBlackListSelectParams = (data) => {
  return {
    ARG_TYPE: "",
    ARG_DATEF: data.DATEF ? moment(data.DATEF).format("YYYYMMDD") : "19991231",
    ARG_DATET: data.DATET ? moment(data.DATET).format("YYYYMMDD") : "99991231",
    OUT_CURSOR: "",
  };
};

const UploadRequestPaperWorkImageParams = (data, File) => {
  // TODO: Use post form data instead
  // Link Image like this: http://172.30.10.120:9000/RSM_IMG_UPLOAD/1704433328798-20240105111111111111IAI-one.png
  let _formData = new FormData();
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  _formData.append("ARG_TYPE", "U");
  _formData.append("ARG_INS_DATE", data.INS_DATE);
  _formData.append("ARG_EMP_CITIZEN_ID", data.EMP_CITIZEN_ID);
  _formData.append("ARG_IMAGE_DIV", data.IMAGE_DIV); //industrial accident insurance (IAI), Work Plan (WKP), License (LSC)
  _formData.append("ARG_IMAGE", File.blobFile, File.blobFile.name);
  _formData.append("ARG_CREATOR", userData.dept_cd);
  _formData.append(
    "ARG_CREATE_PC",
    userData.username + "|" + userData.Permission
  );
  _formData.append("ARG_CREATE_PROGRAM_ID", "REQUEST_PAPERWORK_IMAGE");

  return _formData;
};

const UploadWorkerResultUpdateParams = (data) => {
  const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));

  return {
    ARG_TYPE: "",
    ARG_IS_VACATION: "",
    ARG_REQ_NO: data.REQ_NO,
    ARG_WORK_DATE: data.WORK_DATE,
    ARG_EMP_CITIZEN_ID: data.EMP_CITIZEN_ID,
    ARG_CREATOR: userData.dept_cd,
    ARG_CREATE_PC: userData.username + "|" + userData.Permission,
    ARG_CREATE_PROGRAM_ID: "CSMS_SYSTEM_UPDATE",
  };
};

const UploadReportInOutListSelectParams = (data) => {
  return {
    ARG_TYPE: data.TYPE,
    ARG_WORK_DATEF: moment(data.WORK_DATE[0]).format("YYYYMMDD"),
    ARG_WORK_DATET: moment(data.WORK_DATE[1]).format("YYYYMMDD"),
    OUT_CURSOR: "",
  };
};

const UploadUserWorkLicesnseParams = () => {
    const userData = JSON.parse(localStorage.getItem("CONT_USER_INFOR"));
  
    return {
      ARG_TYPE: "",
      ARG_PLANT_CD: "",
      ARG_REQ_NO: "",
      ARG_EMP_CITIZEN_ID: "",
      ARG_JOB_CODE: "",
      ARG_JOB_DESC: "",
      ARG_LICENSE_CODE: "",
      ARG_LICENSE_DESC: "",
      ARG_CREATOR: userData.dept_cd,
      ARG_CREATE_PC: userData.username + "|" + userData.Permission,
      ARG_CREATE_PROGRAM_ID: "CSMS_SYSTEM",
    };
  };

export {
  UploadLoginParams,
  UploadRegisterParams,
  UploadUserMenuListParams,
  UploadRequestSelectParams,
  UploadRequestConfirmUpdateParams,
  UploadRequestCreateSaveParams,
  UploadRequestCreateResultSaveParams,
  UploadVendorListSelectParams,
  UploadVendorRequestListSelectParams,
  UploadRequestUpdateResultSaveParams,
  UploadContractorSaveParams,
  UploadContractorDeleteParams,
  UploadResultItemSaveParams,
  UploadVendorListTimeLineParams,
  InspecUploadImageSaveParams,
  UploadEmployeeListSelectParams,
  UploadItemInsListSelectParams,
  UploadContractorBlacklistUpdateParams,
  UploadEmployeeBlacklistUpdateParams,
  UploadCoopImageParams,
  UploadCoopImageExistCheck,
  UploadCoopImagesListSelectParams,
  UploadEmployeeSafetyTrainingParams,
  UploadUserRegAuthorityParams,
  UploadUserPermissionParams,
  UploadContBlackListSelectParams,
  UploadEmployeeBlackListSelectParams,
  UploadRequestPaperWorkImageParams,
  UploadWorkerResultUpdateParams,
  UploadReportInOutListSelectParams,
  UploadUserWorkLicesnseParams
};
