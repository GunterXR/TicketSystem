import axios from "axios";
import * as React from 'react';
import {useEffect} from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import UpperBar from "../UpperBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CreateTicket from "./user/CreateTicket";
import TicketsTable from "./TicketsTable";
import {useNavigate} from "react-router-dom";

//Заготовки для таблицы
let rows = [];
const columns = [
    { id: 'id', label: 'ID Заявки',},
    { id: 'name', label: 'Название', align: 'right',},
    { id: 'dateSent', label: 'Дата создания', align: 'right',},
    { id: 'deadLine', label: 'Срок выполнения', align: 'right',},
    { id: 'priority', label: 'Приоритет', align: 'right',},
    { id: 'status', label: 'Статус', align: 'right',},
];

export default function Tickets() {
    let navigate = useNavigate();
    let roles = sessionStorage.getItem("role")

    const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, tickets: []
    });

    useEffect(() => {
        GetTickets();
    }, []);

    //Получение ответа от дочерних компонентов о загрузке
    function OnChanged(changed) {
        if (changed === true) {
            setLoaded({isLoaded: false})
            GetTickets();
        }
    }

    //POST запрос на получение списка заявок по ролям
    async function GetTickets() {
        rows = [];
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/tickets", roles, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token},
        })
            .then(response => {
                console.log(response.data);
                response.data.map(ticket => (rows.push({id: ticket.id, name: ticket.name, dateSent: ticket.dateSent, deadLine: ticket.deadline, priority: ticket.priority, status: ticket.status})));
                setLoaded({
                    isLoaded: true,
                    tickets: response.data
                });
            })
            .catch(function (error) {
                setLoaded({
                    isLoaded: true,
                    error
                })
                console.log('Error', error.message);
            });
    }

    function MoveToSignIn() {
        navigate("/signin")
    }

    //Возможность создания заявки только у пользователя
    function RenderCreateTicket() {
        if (roles == "worker") {
            return <CreateTicket onChanged={OnChanged} />
        }
    }

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        return (
            <div>
                <UpperBar role={roles} page={"Заявки"} />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={12}>
                            <Paper elevation={24} sx={{ p: 1, display: 'flex', flexDirection: 'column',}}>
                                <div>
                                    <Paper elevation={0} sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                                        <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                            Заявки
                                        </Typography>
                                        <RenderCreateTicket />
                                        <TicketsTable columns={columns} rows={rows} isLoaded={loaded.isLoaded} />
                                    </Paper>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }

    //Проверка на права доступа
    function CheckError() {
        if (loaded.error != null && loaded.isLoaded == true) {
            return (<MoveToSignIn />);
        }
        else {
            return (
                <RenderWhenLoaded />
            );
        }
    }

    return (
        <div>
            <CheckError />
        </div>
    );
}

