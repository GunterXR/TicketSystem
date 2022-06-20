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
import {AddCircle} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import ruLocale from "date-fns/locale/ru";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";

export default function CreateTicket({onChanged}) {
    let ip;
    let browser;
    const [priority, setPriority] = React.useState("low");
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState(new Date());

    const [boolsRegex, setBoolsRegex] = React.useState(
        {nameTickerBool: null, typeTickerBool: null}
    );

    //Смена даты
    const dateChange = (newValue) => {
        setDate(newValue);
    };

    //Смена приоритета
    const priorityChange = (event) => {
        setPriority(event.target.value);
    };

    //Открыть окно
    const createTicketOpen = () => {
        setOpen(true);
    };

    //Закрыть окно
    const createTicketClose = () => {
        setOpen(false);
        onChanged(false);
    };

    //Получить IP адрес
    async function GetIP() {
        await axios.get("https://geolocation-db.com/json/")
            .then(response => {
                console.log(response.data.IPv4);
                ip = response.data.IPv4;
                //return response.data.IPv4;
            })
            .catch(function (error) {
                console.log('Error', error.message);
                //return null;
            });
    }

    GetIP();
    GetBrowserName();

    //Создание заявки
    const createTicket = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const dataDialog = new FormData(event.currentTarget);
        // function dateConvert(date) {
        //     date = new Date();
        //     let dd = String(date.getDate()).padStart(2, '0');
        //     let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        //     let yyyy = date.getFullYear();
        //
        //     date = dd + '.' + mm + '.' + yyyy;
        //     return (
        //         date
        //     );
        // }
        let name = dataDialog.get('ticketName');
        let info = dataDialog.get('ticketDescription');
        let type = dataDialog.get('ticketType');
        let dateSent = new Date().toLocaleString('ru-RU').substring(0, 10)
        let regexCheck = (
            {
                nameTickerBool: /^(?=\s*\S).*$/.test(name),
                typeTickerBool: /^(?=\s*\S).*$/.test(type),
            }
        );
        setBoolsRegex(regexCheck);

        //POST запрос на создание заявки
        if (regexCheck.nameTickerBool === true && regexCheck.typeTickerBool === true) {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/tickets/create", {
                name: name,
                info: info,
                dateSent: dateSent,
                problemType: type,
                priority: priority,
                ip: ip,
                browser: browser,
                deadline: date.toLocaleString('ru-RU').substring(0, 10),
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token},
            })
                .then(response => {
                    console.log(response.data);
                    createTicketClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
        }
    };

    //Получить название браузера
    function GetBrowserName () {
        if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) browser = 'Opera';
        else if(navigator.userAgent.indexOf("Chrome") != -1 ) browser =  'Chrome';
        else if(navigator.userAgent.indexOf("Safari") != -1) browser =  'Safari';
        else if(navigator.userAgent.indexOf("Firefox") != -1 ) browser =  'Firefox';
        else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) browser =  'Internet Explorer';
        else browser = null;
    }

    return (
        <div>
            <IconButton title="Новая заявка" type="submit" variant="contained" onClick={createTicketOpen}>
                <AddCircle />
            </IconButton>
            <Dialog open={open} onClose={createTicketClose}>
                <DialogTitle>Создание новой заявки</DialogTitle>
                <Box noValidate component="form" onSubmit={createTicket}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField required
                                           fullWidth
                                           autoFocus
                                           id="ticketName"
                                           name="ticketName"
                                           label="Название"
                                           error={(boolsRegex.nameTickerBool === false && true)}
                                           helperText={(boolsRegex.nameTickerBool === false && "Это поле не должно быть пустым")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required
                                           fullWidth
                                           autoFocus
                                           id="ticketType"
                                           name="ticketType"
                                           label="Тип проблемы"
                                           error={(boolsRegex.typeTickerBool === false && true)}
                                           helperText={(boolsRegex.typeTickerBool === false && "Это поле не должно быть пустым")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="priority">Приоритет</InputLabel>
                                    <Select labelId="priority"
                                            label="Приоритет"
                                            value={priority}
                                            onChange={priorityChange}
                                    >
                                        <MenuItem value={"low"}>Низкий</MenuItem>
                                        <MenuItem value={"medium"}>Средний</MenuItem>
                                        <MenuItem value={"high"}>Высокий</MenuItem>
                                        <MenuItem value={"critical"}>Критический</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider adapterLocale={ruLocale} dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker label="Срок выполнения"
                                                       inputFormat="dd.MM.yyyy"
                                                       value={date}
                                                       onChange={dateChange}
                                                       renderInput={(params) => <TextField {...params} sx={{width: '100%'}}/>}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                           multiline
                                           maxRows={10}
                                           id="ticketDescription"
                                           label="Описание"
                                           name="ticketDescription"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{mr: 2, mb: 1}}>
                        <Button variant="outlined" onClick={createTicketClose}>
                            Отмена
                        </Button>
                        <Button variant="contained" type="submit">
                            Создать заявку
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
}