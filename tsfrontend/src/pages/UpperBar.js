import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {useNavigate} from "react-router-dom";

export default function UpperBar({role, page}) {
    let navigate = useNavigate();

    function ExitAccount() {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("radio");
        sessionStorage.removeItem("radioUser");
        navigate("/signin");
    }

    function UpperBarName() {
        return(
            <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                {page}
            </Typography>
        );
    }

    function ExitAccountButton() {
        return(
            <Button variant="outlined" onClick={ExitAccount} sx={{ my: 1, mx: 1.5 }}>
                Выйти
            </Button>
        );
    }

    function TicketsButton() {
        return(
            <Link variant="button" color="text.primary" href="/tickets" sx={{ my: 1, mx: 1.5 }}>
                Заявки
            </Link>
        );
    }

    function ProfileButton() {
        return(
            <Link variant="button" color="text.primary" href="/profile" sx={{ my: 1, mx: 1.5 }}>
                Профиль
            </Link>
        );
    }

    function StatsButton() {
        return(
            <Link variant="button" color="text.primary" href="/stats" sx={{ my: 1, mx: 1.5 }}>
                Статистика
            </Link>
        );
    }

    function BarRole() {
        //Полоса гостя
        if (role === "guest") {
            return (
                <Toolbar>
                    <UpperBarName />
                    <Button href="/signin" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Войти
                    </Button>
                </Toolbar>
            )
        }
        //Полоса пользователя и специалиста
        else if (role === "worker" || role === "specialist") {
            return (
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <UpperBarName />
                    <TicketsButton />
                    <ProfileButton />
                    <ExitAccountButton />
                </Toolbar>
            )
        }
        //Полоса распределителя
        else if (role === "spreader") {
            return (
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <UpperBarName />
                    <TicketsButton />
                    <StatsButton />
                    <ProfileButton />
                    <ExitAccountButton />
                </Toolbar>
            )
        }
        //Полоса администратора
        else if (role === "admin") {
            return (
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <UpperBarName />
                    <TicketsButton />
                    <StatsButton />
                    <Link variant="button" color="text.primary" href="/admin" sx={{ my: 1, mx: 1.5 }}>
                        Администрирование
                    </Link>
                    <ProfileButton />
                    <ExitAccountButton />
                </Toolbar>
            )
        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
            <BarRole />
            </AppBar>
        </React.Fragment>
    );
}