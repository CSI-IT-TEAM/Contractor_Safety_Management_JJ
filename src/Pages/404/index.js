import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import warningImage from "../../assets/images/signal/warning.png";
import "./index.scss";

const height = window.innerHeight - 120;

const ErrorPage = () => {

    ///// Translate
    const { t } = useTranslation();

    return (
        <>
            <Box className="s-error" sx={{ minHeight: height }}>
                <Container>
                    <Box className="s-error-thumb">
                        <img src={warningImage} alt="Warning" />
                    </Box>
                    <Box className="s-error-content">
                        <Typography variant="h3" className="s-error-title">{t('404_title')}</Typography>
                        <Typography variant="h1" className="s-error-sub">
                            <span>4</span>
                            <span>0</span>
                            <span>4</span>
                        </Typography>
                        <Typography variant="h5" className="s-error-desc">{t('404_desc')}</Typography>
                    </Box>
                </Container>
            </Box>
        </>
    );
}

export default ErrorPage;