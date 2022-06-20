import {Link, Route, Router, useNavigate} from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Profile from "./pages/profile/Profile";
import Tickets from "./pages/tickets/Tickets"
import Ticket from "./pages/tickets/Ticket"
import UpperBar from "./pages/UpperBar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {useEffect} from "react";
import AdminManage from "./pages/admin/AdminManage";
import AdminProfile from "./pages/admin/AdminProfile";
import Stats from "./pages/stats/Stats";
import Box from "@mui/material/Box";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

export default function App() {
    let roles = sessionStorage.getItem("role")
    let navigate = useNavigate();

    useEffect(() => {
        MoveIfAutorized();
    }, []);

    function MoveIfAutorized() {
        if (roles === "worker" || roles === "specialist" || roles === "spreader" || roles === "admin")    {
            console.log("Yf")
            navigate("/tickets")
        }
    }

    var browser = navigator.in
    console.log(browser)

    return (
        <Router>
            <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/signup" component={SignUp}/>
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/tickets" component={Tickets}/>
            <Route exact path="/ticket" component={Ticket}/>
            <Route exact path="/admin" component={AdminManage}/>
            <Route exact path="/admin/user" component={AdminProfile}/>
            <Route exact path="/stats" component={Stats}/>
        </Router>,
        <div>
                <UpperBar role={"guest"} page={"Ticket System"} />
                <CssBaseline />
                <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
                        Добро пожаловать!
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        Перед вами Ticket System - система приема заявок от пользователей.
                    </Typography><br></br>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        Эта система отличается своей простотой - в ней нет ничего лишнего! Но одновременно эта система гибкая и удобная для специалистов, решающие проблемы.
                    </Typography><br></br>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        Чтобы начать работу, войдите в аккаунт, нажав на кнопку справа-вверху.
                    </Typography>
                 </Container>
            <Box component="footer" sx={{ mt: 35, mb: 5}}>
                <Container maxWidth="sm">
                    <Typography color="text.secondary" variant="body2" justifyContent="center" display="flex">
                        Ticket System - © Степан Иконников, 2022
                    </Typography>
                </Container>
            </Box>
        </div>
    );
}