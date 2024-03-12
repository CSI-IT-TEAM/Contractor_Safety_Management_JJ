
import { useState, useEffect } from 'react';
import { Box, Modal, TextField, InputAdornment, Stack, Button, Grid, Skeleton } from '@mui/material';
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { isNullOrEmpty, fetchData, handleTimeout } from '../../functions';
import { EmployeeSelectURL } from '../../api';
import EmployeeInfoCard from '../../components/Card/EmployeeInfoCard';
import EmptyCard from '../../components/Card/EmptyCard';

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';

const width = window.innerWidth;
const isMobile = width < 560 ? true : false;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? "95%" : 600,
    bgcolor: 'background.paper',
    paddingTop: 4,
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
};

const SelectEmpModal = ({ open, handleClose, vendorList, contList, handleChange }) => {
    ////// Init Variables
    const [search, setSearch] = useState("");
    const [list, setList] = useState([]);
    const [contractor, setContractor] = useState("");
    const [load, setLoad] = useState(false);
    let totalItem = list.length;
    let selectedItem = list.filter(item => item.SELECTED_YN === "Y").length;

    ////// Transldate
    const { t } = useTranslation();

    //////Handle Filter
    const handleFilter = (value) => {
        setSearch(search => value);
    }

    //////Handle Check
    const handleCheck = (id) => {
        let _result = false;

        if (contList !== null && contList.length > 0) {
            _result = contList.filter(item => item.EMP_CITIZEN_ID === id).length > 0
        }

        return _result;
    }

    /////Fetch Data
    const handleFetch = async () => {
        let posData = await fetchData(EmployeeSelectURL, {
            ARG_TYPE: "Q",
            ARG_CONT_CODE: isNullOrEmpty(contractor) ? "ALL" : contractor,
            OUT_CURSOR: "",
        });

        setList(list => []);
        setLoad(true);

        handleTimeout(500).then(() => {
            if (posData && posData !== null && posData.length > 0) {
                posData = posData.map((item) => {
                    if (handleCheck(item.EMP_CITIZEN_ID)) {
                        return {
                            ...item,
                            SELECTED_YN: "Y"
                        }
                    } else {
                        return item;
                    }
                })

                setList(list => posData);
            }
            setLoad(false);
        })
    }

    useEffect(() => {
        if (open) {
            handleFetch();
        }
        setSearch("")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractor]);

    //////Handle Selected
    const handleSelect = (id) => {
        setList(list => list.map((item) => {
            if (item.EMP_CITIZEN_ID === id) {
                return {
                    ...item,
                    SELECTED_YN: item.SELECTED_YN === "Y" ? "N" : "Y",
                }
            } else {
                return item;
            }
        }));
    }

    /////Handle Select All
    const handleSelectAll = () => {
        setList(list => list.map((item) => {
            return {
                ...item,
                SELECTED_YN: "Y",
            }
        }));
    }

    ///////Hanlde Add
    const handleAdd = () => {
        if (selectedItem > 0) {
            let _selectList = list.filter(item => item.SELECTED_YN === "Y");
            handleChange(_selectList);
        }
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ px: isMobile ? 1.5 : 2 }}>
                    <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ color: "#072d7a", fontWeight: 600, fontSize: "25px", marginBottom: "10px", textTransform: "capitalize" }}>{t('search_people')}</Box>
                        <Box sx={{ fontSize: "18px", color: "seagreen", cursor: "pointer" }} onClick={handleSelectAll}>
                            <span style={{ fontWeight: 700, color: "green", fontSize: "20px" }}>{selectedItem}/{totalItem}</span> Selected
                        </Box>
                    </Stack>
                    <CloseIcon
                        onClick={handleClose}
                        sx={{
                            fontSize: 26,
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            color: "#666",
                            transition: "all .4s ease",
                            cursor: "pointer",
                            "&:hover": { opacity: 0.8 },
                        }}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={7.5}>
                            <Select
                                className="bg-white"
                                value={contractor ? vendorList.filter(item => item.value === contractor) : ""}
                                onChange={(event) => setContractor(contractor => event.value)}
                                name="VENDOR"
                                placeholder={t('plholder_contractor')}
                                options={vendorList}
                                isSearchable={!isMobile}
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
                                    }),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4.5}>
                            <TextField
                                inputProps={{ inputMode: "text" }}
                                value={search}
                                InputProps={{
                                    endAdornment: isNullOrEmpty(search) ? (
                                        <InputAdornment position="end">
                                            <SearchIcon
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </InputAdornment>
                                    ) : (
                                        <InputAdornment position="end">
                                            <CloseIcon
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFilter("")}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={(event) => {
                                    handleFilter(event.target.value);
                                }}
                                className="b-input bg-gray"
                                fullWidth
                                placeholder={t('frm_quick_search')}
                            />
                        </Grid>
                    </Grid>
                    <Stack sx={{ marginTop: isMobile ? "5px" : "15px", height: "320px", overflowY: "scroll" }} className="b-control" gap={0.5}>
                        {load ?
                            <>
                                <Skeleton variant="rounded" sx={{ marginBottom: '8px' }} height={40} />
                                <Skeleton variant="rounded" sx={{ marginBottom: '8px' }} height={40} />
                                <Skeleton variant="rounded" sx={{ marginBottom: '8px' }} height={40} />
                                <Skeleton variant="rounded" sx={{ marginBottom: '8px' }} height={40} />
                                <Skeleton variant="rounded" sx={{ marginBottom: '8px' }} height={40} />
                                <Skeleton variant="rounded" sx={{ marginBottom: '8px' }} height={40} />
                            </>
                            :
                            <>
                                {list !== null && list.length > 0 && list.map((item) => {
                                    if (isNullOrEmpty(search)) {
                                        return (
                                            <EmployeeInfoCard key={item.EMP_CITIZEN_ID} data={item} handleSelect={handleSelect} />
                                        )
                                    }
                                    else if (
                                        item.EMP_CITIZEN_ID.includes(search) ||
                                        item.EMP_NAME.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return (
                                            <EmployeeInfoCard key={item.EMP_CITIZEN_ID} data={item} handleSelect={handleSelect} />
                                        )
                                    } else {
                                        return <></>
                                    }
                                })
                                }
                                {(list === null || list.length < 1 ||
                                    list.filter(item => item.EMP_CITIZEN_ID.includes(search) || item.EMP_NAME.toLowerCase().includes(search.toLowerCase())).length < 1) &&
                                    <EmptyCard size="mobile" />
                                }
                            </>
                        }
                    </Stack>
                </Box>
                <Stack flexDirection="row" alignItems="center" justifyContent="flex-end" gap={0.5}
                    sx={{ background: "#ebf0f0", marginTop: "10px", px: 1, py: 1.5, borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            height: 40,
                            minWidth: 100,
                            textTransform: "none",
                            fontWeight: '600',
                            fontSize: '16px',
                            boxShadow: 'none',
                        }}
                        onClick={() => handleAdd()}
                    >
                        {t('select')}
                    </Button>
                    <Button
                        variant="text"
                        size="large"
                        sx={{
                            height: 40,
                            minWidth: 100,
                            textTransform: "none",
                            fontWeight: '600',
                            fontSize: '16px',
                            boxShadow: 'none',
                            color: "#4f5357"
                        }}
                        onClick={handleClose}
                    >
                        {t('swal_cancel')}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}

export default SelectEmpModal;