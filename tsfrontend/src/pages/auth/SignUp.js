import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function SignUp() {
    let navigate = useNavigate();

    const [boolsRegex, setBoolsRegex] = React.useState(
        {nameLoginBool: null, surnameLoginBool: null, emailLoginBool: null, passwordLoginBool: null, passwordConfirmBool: null,}
    );
    const [boolsError, setBoolsError] = React.useState(
        {emailErrorBool: null,}
    );
    const [boolsKey, setBoolsKey] = React.useState(
        {keyErrorBool: null,}
    );

    //Регистрация
    const makeAccount = async (event) => {
        //Проверка регулярных выражений и подтверждение пароля
        event.preventDefault();
        const dataSignUp = new FormData(event.currentTarget);
        let email = dataSignUp.get('email');
        let password = dataSignUp.get('password');
        let passwordConfirm = dataSignUp.get('passwordConfirm');
        let name = dataSignUp.get('name');
        let surname = dataSignUp.get('surname');
        let patronymic = dataSignUp.get('patronymic');
        let adminkey = dataSignUp.get('adminkey');
        let regexCheck;
        regexCheck = (
            {
                nameLoginBool: /^(?=\s*\S).*$/.test(name),
                surnameLoginBool: /^(?=\s*\S).*$/.test(surname),
                emailLoginBool: /^([a-z0-9.]+@[a-z]+\.[a-z.]{2,})$/.test(email),
                passwordLoginBool: /^[a-zA-Z0-9@\#$%&*()_+\]\[';:?.,!^-]{8,32}$/.test(password),
                passwordConfirmBool: (password === passwordConfirm)
            }
        );
        let errorCheck = ({emailErrorBool: false});
        let keyCheck = ({keyErrorBool: false});
        setBoolsRegex(regexCheck)

        //POST запрос на регистрацию
        if (regexCheck.emailLoginBool === true && regexCheck.passwordLoginBool === true && regexCheck.nameLoginBool === true && regexCheck.surnameLoginBool === true && regexCheck.passwordConfirmBool === true) {
            await axios.post("https://localhost:7216/api/signup", {
                email: email,
                password: password,
                name: name,
                surname: surname,
                patronymic: patronymic,
                adminKey: adminkey,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"},
            })
                .then(response => {
                    console.log(response.data);
                    sessionStorage.setItem("role", response.data.role);
                    sessionStorage.setItem("accessToken", response.data.access_token);
                    sessionStorage.setItem("radio", "open")
                    sessionStorage.setItem("radioUser", "current")
                    navigate("/profile")
                })
                .catch(function (error) {
                    if (error.message.toString().includes("400")) {
                        errorCheck.emailErrorBool = true;
                        setBoolsError(errorCheck);
                    }
                    if (error.message.toString().includes("404")) {
                        keyCheck.keyErrorBool = true;
                        setBoolsKey(keyCheck);
                    }
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                <CssBaseline />
                <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
                    <CssBaseline />
                    <Box component="form" noValidate onSubmit={makeAccount} sx={{ mt: 10 }}>
                        <Typography component="h1" variant="h5" display="flex" justifyContent="center">
                            {'Регистрация'}
                        </Typography>
                        <TextField required
                                   autoFocus
                                   fullWidth
                                   id="name"
                                   name="name"
                                   label="Имя"
                                   margin="normal"
                                   autoComplete="given-name"
                                   error={(boolsRegex.nameLoginBool === false && true)}
                                   helperText={(boolsRegex.nameLoginBool === false && "Это поле не должно быть пустым")}
                        />
                        <TextField required
                                   fullWidth
                                   id="surname"
                                   name="surname"
                                   label="Фамилия"
                                   margin="normal"
                                   autoComplete="family-name"
                                   error={(boolsRegex.surnameLoginBool === false && true)}
                                   helperText={(boolsRegex.surnameLoginBool === false && "Это поле не должно быть пустым")}
                        />
                        <TextField fullWidth
                                   id="patronymic"
                                   name="patronymic"
                                   label="Отчество"
                                   margin="normal"
                                   autoComplete="patronymic-name"
                        />
                        <TextField required
                                   fullWidth
                                   id="email"
                                   name="email"
                                   label="Email"
                                   margin="normal"
                                   autoComplete="email"
                                   error={(boolsRegex.emailLoginBool === false && true) || (boolsError.emailErrorBool === true && true)}
                                   helperText={(boolsRegex.emailLoginBool === false && "Введите корректный Email. Пример: example@mail.ru") || (boolsError.emailErrorBool === true && "Пользователь с таким Email уже зарегистрирован")}
                        />
                        <TextField required
                                   fullWidth
                                   id="password"
                                   name="password"
                                   label="Пароль"
                                   type="password"
                                   margin="normal"
                                   autoComplete="new-password"
                                   error={(boolsRegex.passwordLoginBool === false && true)}
                                   helperText={(boolsRegex.passwordLoginBool === false && "Пароль должен быть от 8 до 32 символов")}
                        />
                        <TextField required
                                   fullWidth
                                   id="passwordConfirm"
                                   name="passwordConfirm"
                                   label="Подтверждения пароля"
                                   type="password"
                                   margin="normal"
                                   autoComplete="new-password"
                                   error={(boolsRegex.passwordConfirmBool === false && true)}
                                   helperText={(boolsRegex.passwordConfirmBool === false && "Пароли не совпадают!")}
                        />
                        <TextField fullWidth
                                   id="adminkey"
                                   name="adminkey"
                                   label="Ключ администратора"
                                   margin="normal"
                                   autoComplete="adminkey-name"
                                   error={(boolsKey.keyErrorBool === true && true)}
                                   helperText={(boolsKey.keyErrorBool === true && "Ключ администратора неверный!")}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Зарегистрироваться
                        </Button>
                        <Link href="/signin" variant="body2" margin="normal" justifyContent="center" display="flex">
                            Уже зарегистрированы? - Войти
                        </Link>
                    </Box>
                </Container>
                <Box component="footer" sx={{ mb: 5, mt: 'auto'}}>
                    <Container maxWidth="sm">
                        <Typography color="text.secondary" variant="body2" justifyContent="center" display="flex">
                            Ticket System - © Степан Иконников, 2022
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </Container>
    );
}