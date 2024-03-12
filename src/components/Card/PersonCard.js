import {
    Box,
    Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getDateFormatString } from "../../functions";

import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import ConstructionIcon from '@mui/icons-material/Construction';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FaceIcon from '@mui/icons-material/Face';
import BeenhereIcon from '@mui/icons-material/Beenhere';

const PersonCard = ({ data }) => {
    /////Translate
    const { t } = useTranslation();

    return (
        <>
            <Box class="b-card-12">
                <Box class="b-icon">
                    {data.ORD}
                </Box>
                <Box class="b-content">
                    <Box class="text">
                        <Box className="b-title" sx={{ fontSize: 19, fontWeight: 700, marginBottom: '5px', color: '#072d7a', textTransform: 'capitalize' }}>
                            {data.EMP_NAME}
                        </Box>
                        <Stack flexDirection="row" sx={{ gap: '30px' }}>
                            <Stack sx={{ gap: '5px' }}>
                                <Box className="item">
                                    <CreditCardIcon sx={{ fontSize: 20, color: '#868e96' }} />
                                    <span>{data.EMP_CITIZEN_ID}</span>
                                </Box>
                                <Box className="item">
                                    <EventIcon sx={{ fontSize: 20, color: '#868e96' }} />
                                    <span>{getDateFormatString(data.EMP_BIRTHDATE)}</span> 
                                </Box>
                            </Stack>
                            <Stack sx={{ gap: '5px' }}>
                                <Box className="item">
                                    <FaceIcon sx={{ fontSize: 20, color: '#868e96' }} />
                                    <span>{data.EMP_GENDER}</span>
                                </Box>
                                <Box className="item">
                                    <ConstructionIcon sx={{ fontSize: 20, color: '#868e96' }} />
                                    {/* <span>{data.EMP_BIRTHDATE}</span> Worker */}
                                </Box>
                            </Stack>
                            <Stack sx={{ gap: '3px' }}>
                                <Box className="item">
                                    <VerifiedUserIcon sx={{ fontSize: 20, color: 'seagreen' }} />
                                    <span>Security Card</span>
                                </Box>
                                <Box className="item">
                                    <BeenhereIcon sx={{ fontSize: 20, color: 'seagreen' }} />
                                    <span>All Checked</span>
                                </Box>
                            </Stack>
                            {/* {data.SECURITY_CARD_YN === "Y" &&
                                <Stack sx={{ gap: '3px' }}>
                                    <Box className="item">
                                        <VerifiedUserIcon sx={{ fontSize: 20, color: 'seagreen' }} />
                                        <span>Security Card</span>
                                    </Box>
                                </Stack>
                            } */}
                        </Stack>
                    </Box>
                </Box>
                <Box class="b-info"><ConstructionIcon sx={{ fontSize: 20 }} />
                    {/* {data.POS_NM_EN} */}Group 1
                </Box>
            </Box>
        </>
    )
}

export default PersonCard;