import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import axios from "axios";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditProfile from "./EditProfile";
import UpperBar from "../UpperBar";
import Container from "@mui/material/Container";
import {useEffect} from "react";

let id;
let basicInfo;
let socialInfo;
let aboutInfo;

export default function Profile() {
    let roles = sessionStorage.getItem("role")

    const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, profile: []
    });

    //Получение ответа от дочерних компонентов о загрузке
    function OnChanged(changed) {
        if (changed === true) {
            setLoaded({isLoaded: false})
            GetData();
        }
    }

    useEffect(() => {
        GetData();
    }, []);

    //GET запрос на получение данных о пользователе
    async function GetData() {
        let token = sessionStorage.getItem("accessToken");
        await axios.get("https://localhost:7216/api/profile", {
            headers: {"Accept": "application/json", "Authorization": "Bearer " + token},
        })
            .then(response => {
                let data = response.data;
                FillData(data)
                setLoaded({
                    isLoaded: true,
                    profile: data
                });
            })
            .catch(function (error) {
                setLoaded({
                    isLoaded: true,
                    error: error
                })
                console.log('Error', error.message);
            });
    }

    //Разбивка информации на части
    function FillData(data) {
        id = data.id;
        basicInfo = ([
            { name: 'Фамилия:', info: data.surname},
            { name: 'Имя:', info: data.name},
            { name: 'Отчество:', info: data.patronymic},
            { name: 'Дата рождения:', info: data.birthday},
        ]);

        socialInfo = ([
            { name: 'Email:', info: data.email},
            { name: 'Телефон:', info: data.phoneNumber},
            { name: 'Должность:', info: data.post},
        ]);

        aboutInfo = ([
            { name: 'О себе:', info: data.aboutMe},
        ]);

        if (data.gender === "male") basicInfo.push({name: 'Пол:', info: "Мужской"});
        else if (data.gender === "female") basicInfo.push({name: 'Пол:', info: "Женский"});
        else if (data.gender === null) basicInfo.push({name: 'Пол:', info: null});

        if (data.role === "worker") basicInfo.push({name: 'Роль:', info: "Пользователь"});
        else if (data.role === "specialist") basicInfo.push({name: 'Роль:', info: "Специалист"});
        else if (data.role === "spreader") basicInfo.push({name: 'Роль:', info: "Распределитель"});
    }

    //Отобразить информацию
    function PrintInfo({tempInfo}) {
        return (
            <div>
                <Grid container>
                    {tempInfo.map((tempInf) => (
                        <React.Fragment key={tempInf.name}>
                            <Grid item xs={2}>
                                <Typography fontSize={16} gutterBottom>{tempInf.name}</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography fontSize={16} gutterBottom color="text.secondary">{tempInf.info}</Typography>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </div>
        )
    }

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        if (loaded.isLoaded === true) {
            return (
                <div>
                    <UpperBar role={roles} page={"Профиль: " + basicInfo[1].info + " " + basicInfo[0].info + " (ID: " + id + ")"} />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={12}>
                                <Paper elevation={24} sx={{p: 1, display: 'flex', flexDirection: 'column',}}>
                                    <Paper sx={{ mt: 9, mb: 4, ml: 5, mr: 5,}} elevation={0}>
                                        <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                            {"Мой профиль"}
                                        </Typography>
                                        <Grid item xs={12} md={12}>
                                            <Divider textAlign={"center"} sx={{ mt: 3, mb: 3}}><Typography color="text.secondary">Основная информация</Typography></Divider>
                                            <PrintInfo tempInfo={basicInfo} />
                                            <Divider textAlign={"center"} sx={{ mt: 3, mb: 3}}><Typography color="text.secondary">Дополнительная информация</Typography></Divider>
                                            <PrintInfo tempInfo={socialInfo} />
                                            <PrintInfo tempInfo={aboutInfo} />
                                        </Grid>
                                        <EditProfile user={loaded.profile} onChanged={OnChanged}/>
                                    </Paper>
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
        if (loaded.error != null && loaded.isLoaded == true) {
            return <div>ОШИБКА ДОСТУПА</div>;
        }
        else {
            return (
                <RenderWhenLoaded />
            );
        }
    }

    return (
        console.log(loaded.error),
        <div>
            <CheckError />
        </div>
    );
}