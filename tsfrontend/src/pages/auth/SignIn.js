import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";

export default function SignIn() {
    let navigate = useNavigate();

    const [boolsRegex, setBoolsRegex] = React.useState(
        {emailLoginBool: null, passwordLoginBool: null}
    );
    const [boolsError, setBoolsError] = React.useState(
        {emailErrorBool: null, passwordErrorBool: null}
    );

    //Вход
    const loginAccount = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let password = data.get('password');
        let regexCheck = (
            {
                emailLoginBool: /^([a-z0-9.]+@[a-z]+\.[a-z.]{2,})$/.test(email),
                passwordLoginBool: /^[a-zA-Z0-9@\#$%&*()_+\]\[';:?.,!^-]{8,32}$/.test(password)
            }
        );
        let errorCheck = (
            {
                emailErrorBool: false,
                passwordErrorBool: false
            }
        );
        setBoolsRegex(regexCheck)

        //POST запрос на вход
        if (regexCheck.emailLoginBool === true && regexCheck.passwordLoginBool === true) {
            await axios.post("https://localhost:7216/api/signin", {
                email: email,
                password: password,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"},
            })
                .then(response => {
                    console.log(response.data);
                    sessionStorage.setItem("role", response.data.role)
                    sessionStorage.setItem("accessToken", response.data.access_token)
                    sessionStorage.setItem("radio", "open")
                    sessionStorage.setItem("radioUser", "current")
                    navigate("/tickets")
                })
                .catch(function (error) {;
                    if (error.message.toString().includes("400")) {
                        errorCheck.emailErrorBool = false;
                        errorCheck.passwordErrorBool = true;
                    }
                    if (error.message.toString().includes("404")) {
                        errorCheck.emailErrorBool = true;
                        errorCheck.passwordErrorBool = false;
                    }
                    setBoolsError(errorCheck);
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                <CssBaseline />
                <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
                    <Box component="form" onSubmit={loginAccount} noValidate sx={{ mt: 10 }}>
                        <Typography component="h1" variant="h5" display="flex" justifyContent="center">Войти</Typography>
                        <TextField required
                                   fullWidth
                                   autoFocus
                                   id="email"
                                   name="email"
                                   label="Email"
                                   margin="normal"
                                   autoComplete="email"
                                   error={(boolsRegex.emailLoginBool === false && true) || (boolsError.emailErrorBool === true && true)}
                                   helperText={(boolsRegex.emailLoginBool === false && "Введите корректный Email. Пример: example@mail.ru") || (boolsError.emailErrorBool === true && "Пользователь с таким Email не зарегистрирован")}
                        />
                        <TextField required
                                   fullWidth
                                   id="password"
                                   name="password"
                                   label="Пароль"
                                   type="password"
                                   margin="normal"
                                   autoComplete="current-password"
                                   error={(boolsRegex.passwordLoginBool === false && true) || (boolsError.passwordErrorBool === true && true)}
                                   helperText={(boolsRegex.passwordLoginBool === false && "Пароль должен быть от 8 до 32 символов") || (boolsError.passwordErrorBool === true && "Введен неправильный пароль")}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Войти
                        </Button>
                        <Link href="/signup" variant="body2" margin="normal" justifyContent="center" display="flex">
                            Нет аккаунта? - Зарегистрироваться
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