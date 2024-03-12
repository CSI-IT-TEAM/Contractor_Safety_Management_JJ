import {
    Box,
    Container,
    Typography,
    Stack,
    Tabs,
    Tab,
} from "@mui/material";
import React, { useState, useRef, useLayoutEffect} from "react";
import { useTranslation } from "react-i18next";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import GroupsIcon from '@mui/icons-material/Groups';

import RegisterTab from "./Tabs/ResgisterTab";
import GroupAuthTab from "./Tabs/GroupAuthTab";
import "./index.scss";

const height = window.innerHeight;

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ padding: "15px 0" }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AuthorityPage = () => {
    
    ////// Transldate
    const { t } = useTranslation();
    const refTop = useRef(null);
    const refMid = useRef(null);
    const [comHeight, setComHeight] = useState(0);

    ///// Tabs
    const [value, setValue] = React.useState("one");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useLayoutEffect(() => {
        setComHeight(height - refTop.current.offsetHeight - refMid.current.offsetHeight - 190)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container
            maxWidth={false}
            sx={{
                marginTop: "15px",
                width: "100%",
                display: "flex",
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                }}
                direction={"column"}
                className="s-authority"
            >
                <>
                    <Box ref={refTop} style={{ position: 'relative' }}>
                        <Typography variant="h5" className="s-title">
                            {t('title_user_authority')}
                        </Typography>
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <Tabs
                            ref={refMid}
                            value={value}
                            onChange={handleChange}
                            aria-label="wrapped label tabs example"
                            sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                        >
                            <Tab className="s-tab" icon={<AppRegistrationIcon />} iconPosition="start" value="one" label={t('btn_register')} wrapped />
                            <Tab className="s-tab" icon={<GroupsIcon />} iconPosition="start" value="two" label={t('group_authority')} wrapped />
                        </Tabs>
                        <TabPanel value={value} index="one">
                            <RegisterTab comHeight={comHeight < 700 ? 700 : comHeight} />
                        </TabPanel>
                        <TabPanel value={value} index="two">
                            <GroupAuthTab comHeight={comHeight < 700 ? 700 : comHeight} />
                        </TabPanel>
                    </Box>
                </>
            </Stack>
        </Container >
    );
}

export default AuthorityPage;