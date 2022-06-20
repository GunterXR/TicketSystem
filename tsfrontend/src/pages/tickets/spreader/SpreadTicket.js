import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ruLocale from 'date-fns/locale/ru';
import axios from "axios";
import {useEffect} from "react";
import {FormHelperText} from "@mui/material";
import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';

export default function SpreadTicket({ticketID, ticketPriority, onChanged}) {
    const [error, setError] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [priority, setPriority] = React.useState(ticketPriority);
    const [specialist, setSpecialist] = React.useState("");
    const [date, setDate] = React.useState(new Date());
    const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, specialists: []
    });

    useEffect(() => {
        GetSpecialists();
    }, []);

    //Смена даты
    const dateChange = (newValue) => {
        setDate(newValue);
    };

    //Смена приоритета
    const priorityChange = (event) => {
      setPriority(event.target.value);
    };

    //Смена специалиста
    const specialistChange = (event) => {
      setSpecialist(event.target.value);
    };

    //Открытие окна
    const spreadOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const spreadClose = () => {
       setOpen(false);
       onChanged(false);
    };

    //Распределение заявки
    const spreadTicket = async () => {
        //POST запрос на распределение заявки
        if (specialist != "") {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/ticket/spread", {
                priority: priority.toString(),
                deadline: date.toLocaleString('ru-RU').substring(0, 10),
                specialistID: specialist,
                id: ticketID
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            })
                .then(response => {
                    console.log(response.data);
                    spreadClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
        }
        else {
            setError(true);
        }
    };

    //Получение списка специалистов
    async function GetSpecialists() {
        //GET запрос на получение списка специалистов
        let token = sessionStorage.getItem("accessToken");
        await axios.get("https://localhost:7216/api/ticket/specialists", {
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token},
        })
            .then(response => {
                console.log(response.data);
                setLoaded({
                    isLoaded: true,
                    specialists: response.data
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

    //Вывести ошибку если специалист не выбран
    function SpecialistError() {
        if (error === true) {
            return (
                <div>
                    <FormHelperText>Это поле не должно быть пустым!</FormHelperText>
                </div>
            );
        }
    }

    //Вывести список специалистов
    function SpecialistList() {
        if (specialist != null) {
            return(
                <div>
                    <FormControl fullWidth error={(error === true && true)}>
                        <InputLabel id="specialist">Специалист</InputLabel>
                        <Select
                            labelId="specialist"
                            label="Специалист"
                            value={specialist}
                            onChange={specialistChange}
                        >
                            {loaded.specialists.map((spec) => (
                                <MenuItem key={spec.id} value={spec.id}>{spec.name} {spec.surname}</MenuItem>
                            ))}
                        </Select>
                        <SpecialistError />
                    </FormControl>
                </div>
            );
        }
    }

    return (
        <div>
            <Button startIcon={<SafetyDividerIcon />} variant="contained" type="submit" onClick={spreadOpen}>
                Распределить
            </Button>
            <Dialog open={open} onClose={spreadClose}>
                <DialogTitle>Распределение заявки</DialogTitle>
                <Box noValidate component="form">
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <SpecialistList />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="priority">Приоритет</InputLabel>
                                    <Select
                                        labelId="priority"
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
                                    <DesktopDatePicker
                                        label="Срок выполнения"
                                        inputFormat="dd.MM.yyyy"
                                        value={date}
                                        onChange={dateChange}
                                        renderInput={(params) => <TextField {...params} sx={{width: '100%'}}/>}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box item sx={{ ml: 3, mr: 3, mt: 1, mb: 2 }} display="flex" justifyContent="space-between">
                        <Button variant="outlined" onClick={spreadClose}>
                            Отмена
                        </Button>
                        <Button variant="contained" onClick={spreadTicket}>
                            Распределить
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
}