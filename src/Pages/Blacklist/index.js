import { Box, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import GroupsIcon from "@mui/icons-material/Groups";
import EmployeeBlacklistTab from "./Tabs/EmployeeBlacklistTab";
import ContractorBlacklistTab from "./Tabs/ContractorBlacklistTab";

import "./index.scss";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ padding: "15px 0" }}>{children}</Box>}
        </div>
    );
}

export default function BlacklistPage() {
    ///// Translate
    const { t } = useTranslation();
    ///// Tabs
    const [value, setValue] = React.useState("one");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Container
            maxWidth={false}
            sx={{
                marginTop: "15px",
                width: "100%",
                display: "flex",
                overflowX: "hidden",
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                }}
                direction={"column"}
                className="s-blacklist"
            >
                <Box>
                    <Box style={{ position: "relative" }}>
                        <Typography variant="h5" className="s-title">
                            {t("title_blacklist")}
                        </Typography>
                    </Box>
                </Box>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
                >
                    <Tab
                        className="s-tab"
                        icon={<AppRegistrationIcon />}
                        iconPosition="start"
                        value="one"
                        label={`${t("title_employee_blacklist")}`}
                        sx={{
                            fontWeight: 700,
                        }}
                    />
                    <Tab
                        className="s-tab"
                        icon={<GroupsIcon />}
                        iconPosition="start"
                        value="two"
                        label={`${t("title_contractor_blacklist")}`}
                        sx={{
                            fontWeight: 700,
                        }}
                    />
                </Tabs>
                <TabPanel value={value} index="one">
                    <EmployeeBlacklistTab />
                </TabPanel>
                <TabPanel value={value} index="two">
                    <ContractorBlacklistTab />
                </TabPanel>
            </Stack>
        </Container>
    );
}