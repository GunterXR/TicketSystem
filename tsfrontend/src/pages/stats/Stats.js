import React, {PureComponent, useEffect} from 'react';
import axios from "axios";
import MonthChart from "./charts/MonthChart";
import YearChart from "./charts/YearChart";
import PriorityChart from "./charts/PriorityChart";
import StatusChart from "./charts/StatusChart";
import UpperBar from "../UpperBar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

let dataMonth = [];
let dataYear = [];

export default function Stats() {
    let roles = sessionStorage.getItem("role");
    let currentDate = new Date().toLocaleString('ru-RU');
    let month = currentDate.substring(3, 5);
    let year = currentDate.substring(6, 10);
    let monthName;

    const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, stats: []
    });

    useEffect(() => {
        GetStats();
    }, []);

    //Отображение месяца нормальным языком
    switch (month) {
        case "01":
            monthName = "Январь";
            break;
        case "02":
            monthName = "Февраль";
            break;
        case "03":
            monthName = "Март";
            break;
        case "04":
            monthName = "Апрель";
            break;
        case "05":
            monthName = "Май";
            break;
        case "06":
            monthName = "Июнь";
            break;
        case "07":
            monthName = "Июль";
            break;
        case "08":
            monthName = "Август";
            break;
        case "09":
            monthName = "Сентябрь";
            break;
        case "10":
            monthName = "Октябрь";
            break;
        case "11":
            monthName = "Ноябрь";
            break;
        case "12":
            monthName = "Декабрь";
            break;
    }

    //GET запрос на получение данных по заявкам
    async function GetStats() {
        dataMonth = [];
        dataYear = [];
        let token = sessionStorage.getItem("accessToken");
        let currentDate = new Date().toLocaleString('ru-RU');
        await axios.post("https://localhost:7216/api/stats", {
            month: month,
            year: year
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
            .then(response => {
                setLoaded({
                    isLoaded: true,
                    stats: response.data
                });
                console.log(response.data);
            })
            .catch(function (error) {
                setLoaded({
                    isLoaded: true,
                    error
                })
                console.log('Error', error.message);
            });
    }

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        if (loaded.isLoaded === true) {
            return (
                <div>
                    <UpperBar role={roles} page={"Статистика"} />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={24} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                    Статистика по заявкам: {monthName} {year} года
                                </Typography>
                                <Divider textAlign={"center"} sx={{mt: 1, mb: 1}}></Divider>
                                <MonthChart data={loaded.stats.daysCount}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={24} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                    Статистика по заявкам: {year} год
                                </Typography>
                                <Divider textAlign={"center"} sx={{mt: 1, mb: 1}}></Divider>
                                <YearChart data={loaded.stats.monthsCount}/>
                            </Paper>
                        </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper
                                    elevation={24}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 300,
                                    }}
                                >
                                    <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                        Количество заявок по приоритету: {year} год
                                    </Typography>
                                    <Divider textAlign={"center"} sx={{mt: 1, mb: 1}}></Divider>
                                    <PriorityChart data={loaded.stats.priorityCount}/>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper
                                    elevation={24}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 300,
                                    }}
                                >
                                    <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                        Количество заявок по статусу: {year} год
                                    </Typography>
                                    <Divider textAlign={"center"} sx={{mt: 1, mb: 1}}></Divider>
                                    <StatusChart data={loaded.stats.statusCount}/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
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

    return(
        <CheckError/>
    );
}


