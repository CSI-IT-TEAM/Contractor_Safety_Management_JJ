const baseURL = "http://10.10.100.73/";
//const baseURL = "http://172.30.30.41:3000/";

//R Procedures====================================================================
const LoginURL = baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_LOGIN_SELECT";
const RequestSelectURL = baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_SELECT";
const ResultSelectURL = baseURL + "LMES/PKG_RSM_CONTRACTOR.RESULT_LIST_SELECT";
const VendorListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VENDOR_LIST_SELECT";
const VendorRequestListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VENDOR_REQUEST_LIST_SELECT";
const UserMenuListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_MENU_SELECT";
const EmpPositionSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.EMP_POSITION_SELECT";
const InspectChecklistSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.INSPECT_CHECKLIST_SELECT";
const VendorListTimeLineSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VENDOR_LIST_TIMELINE_SELECT";
const EmpValidRegSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.EMP_VALID_REG_SELECT";
const InspectImgUploadSelectURL = 
  baseURL + "LMES/PKG_RSM_CONTRACTOR.INSPECT_IIMG_UPLOAD_SELECT";
const ValidUserPermissionSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VALID_USER_PERMISSION_SELECT";

const EmployeeListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.EMPLOYEE_LIST_SELECT";
const ItemInsListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.ITEM_INS_LIST_SELECT";
const UserDataSelectURL = baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_DATA_SELECT";

const ContractorUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VENDOR_UPDATE_SAVE";

const CoopImageExistCheck =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.COOP_IMAGE_EXIST_CHECK_SELECT";

const CoopImageListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.COOP_IMAGE_LIST_SELECT";
const EmployeeSafetyTrainingSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.EMP_SAFETY_TRAIN_LIST_SELECT";

const RequestCheckURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_CHECK_SELECT";

const UserGroupMenuSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_GROUP_MENU_SELECT";

 const ContBlacklistSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.CONT_BLACKLIST_LIST_SELECT";

 const EmployeeBlacklistSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.EMPLOYEE_BLACKLIST_LIST_SELECT";

 const UserPermissionSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_PERMISSION_SELECT";

 const HistorySelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.HISTORY_SELECT";

 const ReportInOutListSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.REPORT_INOUT_LIST_SELECT";

 const EmployeeSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.EMPLOYEE_SELECT";

 const GetSendEmailDataURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.SEND_EMAIL_INFOR_LIST_SELECT";

 const SendEmailURL = "http://172.30.10.120/send-email";

 const UserJobDegreeSelectURL = 
 baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_JOB_DEGREE_SELECT";

 //CUD Procedures====================================================================
const RequestCreateSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_CREATE_SAVE_V2";

const RequestCreateResultSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_CREATE_RESULT_SAVE/SAVE";

const RequestUpdateResultSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_UPDATE_RESULT_SAVE_V2/SAVE";

const RequestConfirmUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_CONFIRM_UPDATE/SAVE";

const RequestCreateInsertDASS =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_CREATE_INSERT_DASS/SAVE";

//Vendor Contractor Delete, Update

const ContractorDeleteURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VENDOR_DELETE_SAVE/SAVE";
const ResultItemSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.REQUEST_RESULT_ITEM_SAVE/SAVE";

const UserRegisterSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_REGISTER_SAVE/SAVE";

const InspecUploadImageURL = "http://172.30.10.120:9000/RSM_IMAGE_UPLOAD";

//const InspecUploadImageURL ="http://172.30.30.41:4000/RSM_IMAGE_UPLOAD";.

const UploadCoopImageURL = "http://172.30.10.120:9000/RSM_COOP_IMAGE_UPLOAD";

// const UploadCoopImageURL = "http://172.30.30.41:4000/RSM_COOP_IMAGE_UPLOAD";

const UploadRequestPaperWorkImageURL = "http://172.30.10.120:9000/RSM_REQUEST_PAPERWORK_IMAGE_UPLOAD";

const ContractorBlacklistUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.VENDOR_BLACKLIST_SAVE/SAVE";

const EmployeeBlacklistUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.EMPLOYEE_BLACKLIST_SAVE/SAVE";

const EmployeeSafetyTrainingSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.EMP_SAFETY_TRAINING_SAVE/SAVE";

const UserGroupMenuSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_GROUP_MENU_SAVE/SAVE";

const UserPermissionSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_PERMISSION_SAVE/SAVE";

  const WorkerResultUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.WORKER_RESULT_SAVE/SAVE";

  const HistorySaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.HISTORY_UPDATE/SAVE";

  const UserJobLicenseSaveURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_JOB_DEGREE_SAVE/SAVE";

export {
  LoginURL,
  RequestSelectURL,
  RequestCreateSaveURL,
  RequestCreateResultSaveURL,
  RequestUpdateResultSaveURL,
  RequestConfirmUpdateURL,
  VendorListSelectURL,
  VendorRequestListSelectURL,
  UserMenuListSelectURL,
  EmpPositionSelectURL,
  ContractorUpdateURL,
  ContractorDeleteURL,
  ResultSelectURL,
  ResultItemSaveURL,
  UserRegisterSaveURL,
  InspectChecklistSelectURL,
  VendorListTimeLineSelectURL,
  RequestCreateInsertDASS,
  InspecUploadImageURL,
  EmpValidRegSelectURL,
  InspectImgUploadSelectURL,
  ValidUserPermissionSelectURL,
  EmployeeListSelectURL,
  ItemInsListSelectURL,
  UserDataSelectURL,
  ContractorBlacklistUpdateURL,
  EmployeeBlacklistUpdateURL,
  UploadCoopImageURL,
  CoopImageExistCheck,
  CoopImageListSelectURL,
  EmployeeSafetyTrainingSelectURL,
  EmployeeSafetyTrainingSaveURL,
  RequestCheckURL,
  UserGroupMenuSelectURL,
  UserGroupMenuSaveURL,
  UserPermissionSaveURL,
  ContBlacklistSelectURL,
  EmployeeBlacklistSelectURL,
  UserPermissionSelectURL,
  UploadRequestPaperWorkImageURL,
  WorkerResultUpdateURL,
  HistorySelectURL,
  HistorySaveURL,
  ReportInOutListSelectURL,
  EmployeeSelectURL,
  GetSendEmailDataURL,
  SendEmailURL,
  UserJobDegreeSelectURL,
  UserJobLicenseSaveURL
};
