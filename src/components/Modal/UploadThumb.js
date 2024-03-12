import { Button, Box, Stack, TextField, Typography, Grid } from "@mui/material";
import { Modal, Uploader } from "rsuite";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { isNullOrEmpty, fetchData } from "../../functions";
import { useEffect, useState } from "react";
import { UserJobDegreeSelectURL } from "../../api";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const UploadThumbModal = ({ open, type, data, handleChange, handleJobLicense, handleClose }) => {
    ////// Transldate
    const { t } = useTranslation();
    const [thumbList, setThumbList] = useState([]);
    const [preview, setPreview] = useState([]);

    ///// Job & Liscense Data
    const [jobOption, setJobOption] = useState([]);
    const [licenseOption, setLicenseOption] = useState([]);
    const [job, setJob] = useState([]);
    const [license, setLicense] = useState([]);
    const [jobDesc, setJobDesc] = useState("");
    const [licenseDesc, setLicenseDesc] = useState("");
    const [valid, setValid] = useState(true);
   
    const handleTitle = () => {
        let _result = "";
        switch (type) {
            case "INSURANCE_IMG":
                _result = "insurance_thumb";
                break;
            case "WORK_PLAN_IMG":
                _result = "workplan_thumb";
                break;
            case "LISCENT_IMG":
                _result = "work_perform_degree";
                break;
            default:
                break;
        }
        return _result;
    }
    let _modalTitlte = t(handleTitle());

    /////Handle Submit
    const handleSubmit = () => {
        if(type === "LISCENT_IMG"){
            handleJobLicense(data.ID, job, jobDesc, license, licenseDesc, thumbList);
            handleClose();
        }
        else{
            if (thumbList.length < 1) return;
            handleChange(data.ID, type, null, thumbList);
            handleClose();
        }
    }

    ///////Reload Data
    useEffect(() => {
        if(open){
            let _thumbList = isNullOrEmpty(data) ? [] : type === "INSURANCE_IMG" ? data.INSURANCE_IMG : type === "WORK_PLAN_IMG" ? data.WORK_PLAN_IMG : data.LISCENT_IMG;

            if(_thumbList !== null && _thumbList.length > 0 && typeof _thumbList[0] === 'string' && _thumbList[0].includes("http")){
                setThumbList(thumbList => []);
                setPreview(preview => _thumbList);
            }else{
                setThumbList(thumbList => _thumbList);
                setPreview(preview => []);
            }

            setJob(job => data.JOB_LIST);
            setLicense(license => data.DEGREE_LIST);
            setJobDesc(jobDesc => data.JOB_DESC);
            setLicenseDesc(licenseDesc => data.DEGREE_DESC);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (thumbList.length > 0) {
            setPreview(preview => []);
        }
    }, [thumbList]);

    ///////Download Job Data
    const handleDefault = async () => {
        let _firstOption = await fetchData(UserJobDegreeSelectURL, {
            ARG_TYPE: "Q",
            ARG_GROUP: "G001",
            OUT_CURSOR: ""
        });
        let _secondOption = await fetchData(UserJobDegreeSelectURL, {
            ARG_TYPE: "Q",
            ARG_GROUP: "G002",
            OUT_CURSOR: ""
        })

        if (_firstOption !== null && _firstOption.length > 0) {
            _firstOption = _firstOption.map(item => {
                return {
                    ...item,
                    label: t(item.label)
                }
            });
            setJobOption(jobOption => _firstOption);
        } else {
            setJobOption(jobOption => []);
        }

        if (_secondOption !== null && _secondOption.length > 0) {
            _secondOption = _secondOption.map(item => {
                return {
                    ...item,
                    label: t(item.label)
                }
            });
            setLicenseOption(liscenseOption => _secondOption);
        } else {
            setLicenseOption(liscenseOption => []);
        }
    }

    ///////Reload Data
    useEffect(() => {
        if(open){
            handleDefault();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSelect = (type, e) => {
        let _list = [], _descList = [];

        switch(type){
            case "JOB_LIST":
                _list = e.map(item => {
                    return item.value
                });
                _descList = jobOption.filter(item => _list.includes(item.value) && item.DESC_YN === "Y");
                if(_descList.length === 0) setJobDesc(jobDesc => "");
                setJob(job => _list);
                break;
            case "DEGREE_LIST":
                _list = e.map(item => {
                    return item.value
                });
                _descList = licenseOption.filter(item => _list.includes(item.value) && item.DESC_YN === "Y");
                if(_descList.length === 0) setLicenseDesc(licenseDesc => "");
                setLicense(license => _list);
                break;
            default:
                break;
        }
    }

    const isExistDesc = (type) => {
        let _list = [];
        let _result = false;

        switch(type){
            case "JOB_LIST":
                _list = jobOption.filter(item => job.includes(item.value) && item.DESC_YN === "Y");
                if(_list.length > 0) _result = true;
                break;
            case "DEGREE_LIST":
                _list = licenseOption.filter(item => license.includes(item.value) && item.DESC_YN === "Y");
                if(_list.length > 0) _result = true;
                break;
            default:
                break;
        }

        return _result;
    }

    return (
        <Modal backdrop="static" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title style={{ fontSize: "24px", fontWeight: 600, textTransform: "capitalize", color: "#072d7a" }}>{_modalTitlte}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {type === "LISCENT_IMG" ? (
                    <>
                        <Grid container spacing={1} sx={{marginBottom: "10px"}}>
                            <Grid item xs={12}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('work')}</Typography>
                                <Select
                                    className="bg-white"
                                    closeMenuOnSelect={false}
                                    value={job.length > 0 ? jobOption.filter(item => job.includes(item.value)) : ""}
                                    onChange={(e) => handleSelect("JOB_LIST", e)}
                                    isMulti
                                    options={jobOption}
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
                                            background: isDisabled ? "#f8f6f7" : "#fff",
                                            borderColor: "#b8b6b7",
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999,
                                            fontSize: 17,
                                            width: "calc(100% - 2px)",
                                            left: "1px",
                                        }),
                                    }}
                                />
                                {!valid && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography> }
                            </Grid>
                            {isExistDesc("JOB_LIST") &&
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ inputMode: 'text' }}
                                        value={jobDesc}
                                        sx={{ background: "#f8f6f7" }}
                                        onChange={(event) => {
                                            setJobDesc(desc => event.target.value)
                                        }}
                                        rows={2}
                                        multiline={true}
                                        className="b-input bg-white"
                                        fullWidth
                                        placeholder={t('job_description')}
                                    />
                                </Grid>
                            }
                            <Grid item xs={12}>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: '#333',
                                        marginBottom: 3,
                                        fontSize: 16,
                                    }}
                                >{t('liscent_thumb')}</Typography>
                                <Select
                                    className="bg-white"
                                    closeMenuOnSelect={false}
                                    value={license.length > 0 ? licenseOption.filter(item => license.includes(item.value)) : ""}
                                    onChange={(e) => handleSelect("DEGREE_LIST", e)}
                                    isMulti
                                    options={licenseOption}
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
                                            background: isDisabled ? "#f8f6f7" : "#fff",
                                            borderColor: "#b8b6b7",
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999,
                                            fontSize: 17,
                                            width: "calc(100% - 2px)",
                                            left: "1px",
                                        }),
                                    }}
                                />
                                {!valid && <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography> }
                            </Grid>
                            {isExistDesc("DEGREE_LIST") &&
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ inputMode: 'text' }}
                                        value={licenseDesc}
                                        sx={{ background: "#f8f6f7" }}
                                        onChange={(event) => {
                                            setLicenseDesc(desc => event.target.value)
                                        }}
                                        rows={2}
                                        multiline={true}
                                        className="b-input bg-white"
                                        fullWidth
                                        placeholder={t('job_description')}
                                    />
                                </Grid>
                            }
                        </Grid>
                        <Uploader
                            action=""
                            accept="image/*"
                            draggable
                            autoUpload={false}
                            listType="picture-text"
                            disabled={thumbList.length >= 1}
                            fileList={thumbList}
                            onChange={setThumbList}
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
                                    cursor: "pointer",
                                }}
                            >
                                <CloudUploadIcon
                                    sx={{ fontSize: 55, color: "#005abc" }}
                                />
                                <span>{t("plholder_upload_img")}</span>
                            </div>
                        </Uploader>
                        {preview.length > 0 &&
                            <Box sx={{ border: "1px solid #e5e5ea", borderRadius: "5px", overflow: "hidden", marginTop: "10px" }}>
                                <Stack flexDirection="row">
                                    <Box sx={{ width: "50px", height: "50px" }}>
                                        <img src={preview[0]} alt="" />
                                    </Box>
                                    <Box sx={{ padding: "5px 12px", color: "#575757" }}>
                                        Upload Image File
                                    </Box>
                                </Stack>
                            </Box>
                        }
                    </>
                ) : (
                    <>
                        <Uploader
                            action=""
                            accept="image/*"
                            draggable
                            autoUpload={false}
                            listType="picture-text"
                            disabled={thumbList.length >= 1}
                            fileList={thumbList}
                            onChange={setThumbList}
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
                                    cursor: "pointer",
                                }}
                            >
                                <CloudUploadIcon
                                    sx={{ fontSize: 55, color: "#005abc" }}
                                />
                                <span>{t("plholder_upload_img")}</span>
                            </div>
                        </Uploader>
                        {preview.length > 0 &&
                            <Box sx={{ border: "1px solid #e5e5ea", borderRadius: "5px", overflow: "hidden", marginTop: "10px" }}>
                                <Stack flexDirection="row">
                                    <Box sx={{ width: "50px", height: "50px" }}>
                                        <img src={preview[0]} alt="" />
                                    </Box>
                                    <Box sx={{ padding: "5px 12px", color: "#575757" }}>
                                        Upload Image File
                                    </Box>
                                </Stack>
                            </Box>
                        }
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} appearance="primary" sx={{ background: "seagreen", color: "#fff", fontWeight: 600, marginRight: "5px", "&:hover": { background: "green" } }}>
                    Ok
                </Button>
                <Button onClick={handleClose} appearance="subtle" sx={{ background: "#d32f2f", color: "#fff", fontWeight: 600, textTransform: "capitalize", "&:hover": { background: "red" } }}>
                    {t('swal_cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UploadThumbModal;