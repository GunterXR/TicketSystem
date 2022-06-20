import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import axios from "axios";
import Box from "@mui/material/Box";
import DeleteProfile from "./DeleteProfile";
import EditIcon from '@mui/icons-material/Edit';
import ruLocale from "date-fns/locale/ru";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

export default function EditProfile({user, onChanged}) {
    const [open, setOpen] = React.useState(false);
    const [gender, setGender] = React.useState(getGender());
    const [birthday, setBirthday] = React.useState(getBirthday());

    const [boolsRegex, setBoolsRegex] = React.useState(
        {nameProfileBool: null, surnameProfileBool: null}
    );

    //Получение данных о поле пользователя
    function getGender() {
        if (user.gender == null || user.gender == "") return "male";
        else return user.gender;
    }

    //Получение данных о дне рождения пользователя
    function getBirthday() {
        if (user.birthday == null) return new Date();
        else {
            let birthdayTmp = user.birthday.substring(3, 6) + user.birthday.substring(0, 3) + user.birthday.substring(6, 10);
            return birthdayTmp;
        }
    }

    //Открытие окна
    const editProfileOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const editProfileClose = () => {
       setOpen(false);
       onChanged(false);
    };

    //Смена даты
    const dateChange = (newValue) => {
        setBirthday(newValue);
    };

    //Смена пола
    const genderChange = (event) => {
        setGender(event.target.value);
    };

    //Редактирование аккаунта
    const editProfile = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const dataDialog = new FormData(event.currentTarget);
        let name = dataDialog.get('name');
        let surname = dataDialog.get('surname');
        let patronymic = dataDialog.get('patronymic');
        let phone = dataDialog.get('phone');
        let aboutme = dataDialog.get('aboutme');
        let post = dataDialog.get('post');
        let regexCheck = (
            {
                nameProfileBool: /^(?=\s*\S).*$/.test(name),
                surnameProfileBool: /^(?=\s*\S).*$/.test(surname),
            }
        );
        setBoolsRegex(regexCheck)

        //POST запрос на редактирование данных пользователя
        if (regexCheck.nameProfileBool === true && regexCheck.surnameProfileBool === true) {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/profile/edit", {
                name: name,
                surname: surname,
                patronymic: patronymic,
                phoneNumber: phone,
                aboutMe: aboutme,
                post: post,
                gender: gender,
                birthday: birthday.toLocaleString('ru-RU').substring(0, 10),
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token},
            })
                .then(response => {
                    console.log(response.data);
                    editProfileClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <div>
            <Button startIcon={<EditIcon />} type="submit" variant="contained" sx={{mr: 13, mt: 3, mb: 2}} onClick={editProfileOpen}>
                Изменить данные
            </Button>
            <Dialog open={open} onClose={editProfileClose}>
                <DialogTitle>
                    Изменение профиля
                </DialogTitle>
                <Box noValidate component="form" onSubmit={editProfile}>
                    <DialogContent>
                        <DialogContentText sx={{ mt: 1, mb: 2 }}>
                            Основная информация
                        </DialogContentText>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField required
                                           fullWidth
                                           autoFocus
                                           id="name"
                                           label="Имя"
                                           name="name"
                                           error={(boolsRegex.nameProfileBool === false && true)}
                                           helperText={(boolsRegex.nameProfileBool === false && "Это поле не должно быть пустым")}
                                           autoComplete="given-name"
                                           defaultValue={user.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField required
                                           fullWidth
                                           id="surname"
                                           label="Фамилия"
                                           name="surname"
                                           error={(boolsRegex.surnameProfileBool === false && true)}
                                           helperText={(boolsRegex.surnameProfileBool === false && "Это поле не должно быть пустым")}
                                           autoComplete="family-name"
                                           defaultValue={user.surname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth
                                           id="patronymic"
                                           label="Отчество"
                                           name="patronymic"
                                           defaultValue={user.patronymic}
                                />
                            </Grid>
                        </Grid>
                        <DialogContentText sx={{ mt: 1, mb: 2 }}>
                            Дополнительная информация
                        </DialogContentText>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField required
                                           fullWidth
                                           disabled
                                           id="email"
                                           label="Email"
                                           name="email"
                                           defaultValue={user.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth
                                           id="phone"
                                           label="Телефон"
                                           name="phone"
                                           defaultValue={user.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender">Пол</InputLabel>
                                    <Select
                                        labelId="gender"
                                        label="Пол"
                                        value={gender}
                                        onChange={genderChange}
                                    >
                                        <MenuItem value={"male"}>Мужской</MenuItem>
                                        <MenuItem value={"female"}>Женский</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider adapterLocale={ruLocale} dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Дата рождения"
                                        inputFormat="dd.MM.yyyy"
                                        value={birthday}
                                        onChange={dateChange}
                                        renderInput={(params) => <TextField {...params} sx={{width: '100%'}}/>}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                           id="post"
                                           label="Должность"
                                           name="post"
                                           defaultValue={user.post}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                           id="aboutme"
                                           label="О себе"
                                           name="aboutme"
                                           maxRows={10}
                                           multiline
                                           defaultValue={user.aboutMe}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Grid container spacing={2}>
                        <DialogActions sx={{ mt: 1, mb: 2, ml: 4, }}>
                            <Grid item >
                                <DeleteProfile userID={user.id} />
                            </Grid>
                            <Button sx={{ ml: 21.5,}} variant="outlined" onClick={editProfileClose}>
                                Отмена
                            </Button>
                            <Button variant="contained" type="submit">
                                Изменить
                            </Button>
                        </DialogActions>
                    </Grid>
                </Box>
            </Dialog>
        </div>
    );
}