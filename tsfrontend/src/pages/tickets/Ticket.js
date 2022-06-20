import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import {useEffect} from "react";
import CloseTicket from "./specialist/CloseTicket";
import SpreadTicket from "./spreader/SpreadTicket";
import Tasks from "./specialist/tasks/Tasks";
import UpperBar from "../UpperBar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

let dataid;
let nameInfo;
let basicInfo;
let aboutInfo;
let closeInfo;
let userInfo;
let specInfo;
let extraInfo;

export default function Ticket() {
    let roles = sessionStorage.getItem("role");
    dataid = sessionStorage.getItem("ticketid");
    let page = "Заявка: #" + dataid;

    const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, ticket: []
    });

    //Получение ответа от дочерних компонентов о загрузке
    function OnChanged(changed) {
        if (changed === true) {
            setLoaded({isLoaded: false})
            GetTicket();
        }
    }

    useEffect(() => {
        GetTicket();
    }, []);

    //POST запрос на получение данных о заявке
    async function GetTicket() {
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/ticket", dataid, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
            .then(response => {
                let data = response.data;
                console.log(data)
                FillData(data);
                setLoaded({
                    isLoaded: true,
                    ticket: data.ticket,
                });
            })
            .catch(function (error) {
                setLoaded({
                    isLoaded: false,
                    error
                })
                console.log('Error', error.message);
            });
    }

    //Разбивка информации на части
    function FillData(data) {
        nameInfo = (
            {id: dataid, name: data.ticket.name});

        basicInfo = ([
            {name: '№: ', info: dataid},
            {name: 'Название:', info: data.ticket.name},
            {name: 'Дата создания:', info: data.ticket.dateSent},
            {name: 'Срок выполнения:', info: data.ticket.deadline},
            {name: 'Тип проблемы:', info: data.ticket.problemType},
        ]);

        userInfo = ([
            {name: 'Фамилия:', info: data.user.surname},
            {name: 'Имя:', info: data.user.name},
            {name: 'Отчество:', info: data.user.patronymic},
            {name: 'Email:', info: data.user.email},
            {name: 'Телефон:', info: data.user.phoneNumber},
            {name: 'Должность:', info: data.user.post},
        ]);

        extraInfo = ([
            {name: 'IP адрес:', info: data.ticket.ip},
            {name: 'Браузер:', info: data.ticket.browser},
        ]);

        if (data.specialist != 0) {
            specInfo = ([
                {name: 'Фамилия:', info: data.specialist.surname},
                {name: 'Имя:', info: data.specialist.name},
                {name: 'Email:', info: data.specialist.email},
                {name: 'Телефон:', info: data.specialist.phoneNumber},
            ]);
        } else {
            specInfo = ([
                {name: 'Фамилия:', info: null},
                {name: 'Имя:', info: null},
                {name: 'Email:', info: null},
                {name: 'Телефон:', info: null},
            ]);
        }

        aboutInfo = (
            {name: 'Описание:', info: data.ticket.info});

        closeInfo = (
            {name: 'Причиная закрытия:', info: data.ticket.closeReason});

        //Перевод данных из БД в читаемую форму
        if (data.priority === "low") basicInfo.push({name: 'Приоритет:', info: "Низкий"});
        else if (data.priority === "medium") basicInfo.push({name: 'Приоритет:', info: "Средний"});
        else if (data.priority === "high") basicInfo.push({name: 'Приоритет:', info: "Высокий"});
        else if (data.priority === "critical") basicInfo.push({name: 'Приоритет:', info: "Критический"});

        if (data.status === "process") basicInfo.push({name: 'Статус:', info: "В обработке"});
        else if (data.status === "closed") basicInfo.push({name: 'Статус:', info: "Закрыта"});
        else if (data.status === "opened") basicInfo.push({name: 'Статус:', info: "Создана"});
    }

    //Отобразить кнопки по ролям
    function RenderButtons() {
        if (loaded.ticket.status === "closed") {
            return null;
        } else {
            if (roles === "specialist") {
                return (
                    <div>
                        <Divider align="center" sx={{mt: 2, mb: 3}}></Divider>
                        <Box display="flex" justifyContent="space-between">
                            <CloseTicket ticketID={loaded.ticket.id} onChanged={OnChanged}/>
                        </Box>
                    </div>
                );
            } else if (roles === "spreader") {
                return (
                    <div>
                        <Divider align="center" sx={{mt: 2, mb: 3}}></Divider>
                        <Box display="flex" justifyContent="space-between">
                            <CloseTicket ticketID={loaded.ticket.id} onChanged={OnChanged}/>
                            <SpreadTicket ticketID={loaded.ticket.id} ticketPriority={loaded.ticket.priority} onChanged={OnChanged}/>
                        </Box>
                    </div>
                );
            } else if (roles === "admin") {
                return (
                    <div>
                        <Divider align="center" sx={{mt: 2, mb: 3}}></Divider>
                        <Box display="flex" justifyContent="space-between">
                            <CloseTicket ticketID={loaded.ticket.id} onChanged={OnChanged}/>
                            <SpreadTicket ticketID={loaded.ticket.id} ticketPriority={loaded.ticket.priority} onChanged={OnChanged}/>
                        </Box>
                    </div>
                );
            }
        }
    }

    //Заголовок по статусу
    function CheckClosedOrNot() {
        if (loaded.ticket.status === "closed") {
            return " (ЗАКРЫТА)"
        }
    }

    //Отобразить информацию
    function PrintInfo({tempInfo}) {
        return (
            <div>
                <Grid item>
                    <Grid container>
                        {tempInfo.map((tempInf) => (
                            <React.Fragment key={tempInf.name}>
                                <Grid item xs={3}>
                                    <Typography component="h2" variant="h5" fontSize={16}>
                                        {tempInf.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography component="h2" variant="h5" color="text.secondary" fontSize={16}>
                                        {tempInf.info}
                                    </Typography>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Grid>
            </div>
        )
    }

    //Отобразить причину закрытия заявки (если есть)
    function RenderClosedInfo() {
        if (closeInfo.info !== null) {
            return (
                <div>
                    <Divider align="center" sx={{mt: 2, mb: 2}}></Divider>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={3}>
                                <Typography component="h2" variant="h5" fontSize={16}>
                                    {closeInfo.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography component="h2" variant="h5" color="text.secondary" fontSize={16}>
                                    {closeInfo.info}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }

    //Отобразить заявку
    function RenderTicket() {
        return (
            <div>
                <Paper sx={{mt: 4, mb: 4, ml: 5, mr: 5,}} elevation={0}>
                    <Typography component="h1" variant="h5" align="center" fontSize={24}>
                        Заявка # {nameInfo.id} - {nameInfo.name}{CheckClosedOrNot()}
                    </Typography>
                    <Divider textAlign={"center"} sx={{mt: 1, mb: 1}}><Typography color="text.secondary">Информация о заявке</Typography></Divider>
                    <PrintInfo tempInfo={basicInfo}/>
                    <Divider textAlign={"center"} sx={{mt: 2, mb: 2}}><Typography color="text.secondary"></Typography></Divider>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={3}>
                                <Typography component="h2" variant="h5" fontSize={16}>
                                    {aboutInfo.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography component="h2" variant="h5" color="text.secondary" fontSize={16}>
                                    {aboutInfo.info}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider textAlign={"center"} sx={{mt: 2, mb: 2}}><Typography color="text.secondary">Дополнительная информация</Typography></Divider>
                    <PrintInfo tempInfo={extraInfo}/>
                    <Divider textAlign={"center"} sx={{mt: 2, mb: 2}}><Typography color="text.secondary">Информация о пользователе</Typography></Divider>
                    <PrintInfo tempInfo={userInfo}/>
                    <Divider textAlign={"center"} sx={{mt: 2, mb: 2}}><Typography color="text.secondary">Информация о специалисте</Typography></Divider>
                    <PrintInfo tempInfo={specInfo}/>
                    <RenderClosedInfo/>
                    <RenderButtons/>
                </Paper>
            </div>
        );
    }

    //Верстка по ролям
    function RenderTasks() {
        if (roles === "worker") {
            return (
                <Grid container spacing={3} sx={{mt: 8, mb: 4}}>
                    <Grid item xs={9}>
                        <Paper elevation={24} sx={{p: 1, display: 'flex', flexDirection: 'column',  ml: 60}}>
                            <RenderTicket/>
                        </Paper>
                    </Grid>
                </Grid>
            );
        } else if (roles == "specialist") {
            return (
                <Grid container spacing={3} sx={{mt: 8, mb: 4}}>
                    <Grid item xs={7}>
                        <Paper elevation={24} sx={{display: 'flex', flexDirection: 'column', ml: 20}}>
                            <RenderTicket/>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Tasks ticket={loaded.ticket}/>
                    </Grid>
                </Grid>
            );
        } else if (roles == "spreader" || roles == "admin") {
            return (
                <Grid container spacing={3} sx={{mt: 8, mb: 4}}>
                    <Grid item xs={7}>
                        <Paper elevation={24} sx={{display: 'flex', flexDirection: 'column', ml: 20}}>
                            <RenderTicket/>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Tasks ticket={loaded.ticket}/>
                    </Grid>
                </Grid>
            );
        }
    }

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        if (loaded.isLoaded === true) {
            return (
                <div>
                    <UpperBar role={roles} page={page} />
                    <RenderTasks/>
                </div>
            );
        }
    }

    //Проверка на права доступа
    function CheckError() {
        if (loaded.error != null) {
            return <div>ОШИБКА ДОСТУПА</div>;
        }
        else {
            return (
                <RenderWhenLoaded/>
            );
        }
    }

    return (
        <div>
            <CssBaseline/>
            <CheckError/>
        </div>
    );
}