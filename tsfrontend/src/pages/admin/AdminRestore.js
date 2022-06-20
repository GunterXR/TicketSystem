import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import axios from "axios";
import Box from "@mui/material/Box";
import RestoreIcon from '@mui/icons-material/Restore';

export default function AdminRestore({user, onChanged}) {
    const [open, setOpen] = React.useState(false);

    const [boolsRegex, setBoolsRegex] = React.useState(
        {emailLoginBool: null}
    );
    const [boolsError, setBoolsError] = React.useState(
        {emailErrorBool: null}
    );

    //Открытие окна
    const restoreAccountOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const restoreAccountClose = () => {
       setOpen(false);
       onChanged(false);
    };

    //POST запрос на восстановление аккаунта
    const restoreAccount = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let regexCheck = (
            {
                emailLoginBool: /^([a-z0-9.]+@[a-z]+\.[a-z.]{2,})$/.test(email),
            }
        );
        let errorCheck = (
            {
                emailErrorBool: false,
            }
        );
        setBoolsRegex(regexCheck)

        if (regexCheck.emailLoginBool === true) {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/admin/restore", {
                id: user.id,
                email: email,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            })
                .then(response => {
                    console.log(response.data);
                    restoreAccountClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    if (error.message.toString().includes("400")) {
                        errorCheck.emailErrorBool = true;
                    }
                    setBoolsError(errorCheck);
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <div>
            <Button startIcon={<RestoreIcon />} type="submit" variant="contained" sx={{mr: 13, mt: 3, mb: 2}} onClick={restoreAccountOpen}>
                Восстановить пользователя
            </Button>
            <Dialog open={open} onClose={restoreAccountClose}>
                <DialogTitle>
                    Восстановить пользователя
                </DialogTitle>
                <Box noValidate component="form" onSubmit={restoreAccount}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField required
                                           fullWidth
                                           id="email"
                                           label="Email"
                                           name="email"
                                           error={(boolsRegex.emailLoginBool === false && true) || (boolsError.emailErrorBool === true && true)}
                                           helperText={(boolsRegex.emailLoginBool === false && "Введите корректный Email. Пример: example@mail.ru.") || (boolsError.emailErrorBool === true && "Пользователь с таким Email уже зарегистрирован.")}
                                           defaultValue={user.email}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box item sx={{ ml: 3, mr: 3, mt: 1, mb: 2 }} display="flex" justifyContent="space-between">
                        <DialogActions sx={{ mt: 1, mb: 2, ml: 4, }}>
                            <Button sx={{ ml: 21.5,}} variant="outlined" onClick={restoreAccountClose}>
                                Отмена
                            </Button>
                            <Button variant="contained" type="submit">
                                Восстановить
                            </Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
}