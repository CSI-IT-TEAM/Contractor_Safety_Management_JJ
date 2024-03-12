import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

const theme = createTheme({
    typography: {
        fontFamily: [
            "Open Sans",
            "Inconsolata",
            "Roboto",
            "Calibri",
            "sans-serif",
        ].join(","),
        fontSize: 15,
    },
});

i18next
.use(initReactI18next) // passes i18n down to react-i18next
.use(I18nextBrowserLanguageDetector)
.use(HttpApi)
.init({
    supportedLngs: ["vn", "en", "kr", "indo"],
    fallbackLng: "en",
    lng: "en", // default language
    detection: {
        order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
        // cache user language on
        caches: ["cookie"],
    },
    backend: {
        loadPath: "/assets/locales/{{lng}}/translation.json",
    },
    react: {
        useSuspense: false,
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();