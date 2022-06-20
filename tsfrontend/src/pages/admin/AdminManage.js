import axios from "axios";
import * as React from 'react';
import {useEffect} from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import UpperBar from "../UpperBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AdminTable from "./AdminTable";

//Заготовки для таблицы
let rows = [];
const columns = [
    { id: 'id', label: 'ID Пользователя',},
    { id: 'email', label: 'Электронная почта', align: 'right',},
    { id: 'name', label: 'Имя', align: 'right',},
    { id: 'surname', label: 'Фамилия', align: 'right',},
    { id: 'patronymic', label: 'Отчество', align: 'right',},
    { id: 'role', label: 'Роль', align: 'right',},
    { id: 'post', label: 'Должность', align: 'right',},
];

export default function AdminManage() {
    let roles = sessionStorage.getItem("role")

    const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, users: []
    });

    useEffect(() => {
        GetUsers();
    }, []);

    //Получение ответа от дочерних компонентов о загрузке
    function OnChanged(changed) {
        if (changed === true) {
            setLoaded({isLoaded: false})
            GetUsers();
        }
    }

    //GET запрос получения списка пользователей
    async function GetUsers() {
        rows = [];
        let token = sessionStorage.getItem("accessToken");
        await axios.get("https://localhost:7216/api/admin/users", {
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token},
        })
            .then(response => {
                console.log(response.data);
                response.data.map(user => (rows.push({id: user.id, email: user.email, name: user.name, surname: user.surname, patronymic: user.patronymic, role: user.role, post: user.post})));
                setLoaded({
                    isLoaded: true,
                    users: response.data
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

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        if (loaded.isLoaded === true) {
            return (
                <div>
                    <UpperBar role={roles} page={"Администрирование"} />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={12}>
                                <Paper elevation={24} sx={{ p: 1, display: 'flex', flexDirection: 'column',}}>
                                    <div>
                                        <Paper elevation={0} sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                                            <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                                Список пользователей
                                            </Typography>
                                            <AdminTable columns={columns} rows={rows} isLoaded={loaded.isLoaded}/>
                                        </Paper>
                                    </div>
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
        <div>
            <CheckError />
        </div>
    );
}

