import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import {AddCircle} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

export default function CreateTask({ticketID, onChanged}) {
    const [open, setOpen] = React.useState(false);
    const [boolsRegex, setBoolsRegex] = React.useState({nameTaskBool: null});

    //Открытие окна
    const taskCreateOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const taskCreateClose = () => {
       setOpen(false);
       onChanged(false);
    };

    //Создание задачи
    const taskCreate = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const dataTask = new FormData(event.currentTarget);
        let name = dataTask.get('taskName');
        let description = dataTask.get('taskDesc');
        let regexCheck = ({ nameTaskBool: /^(?=\s*\S).*$/.test(name) });
        setBoolsRegex(regexCheck)

        //POST запрос на создание задачи
        if (regexCheck.nameTaskBool === true) {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/tasks/create", {
                ticketID: ticketID,
                name: name,
                description: description,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token},
            })
                .then(response => {
                    console.log(response.data);
                    taskCreateClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <div>
            <IconButton type="submit" variant="contained" onClick={taskCreateOpen}>
                <AddCircle />
            </IconButton>
            <Dialog open={open} onClose={taskCreateClose}>
                <DialogTitle>Создать новую задачу</DialogTitle>
                <Box noValidate component="form" onSubmit={taskCreate}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField required
                                           autoFocus
                                           fullWidth
                                           id="taskName"
                                           name="taskName"
                                           label="Название задачи"
                                           error={(boolsRegex.nameTaskBool === false && true)}
                                           helperText={(boolsRegex.nameTaskBool === false && "Это поле не должно быть пустым")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                           multiline
                                           maxRows={10}
                                           id="taskDesc"
                                           name="taskDesc"
                                           label="Описание задачи"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box item sx={{ ml: 3, mr: 3, mt: 1, mb: 2 }} display="flex" justifyContent="space-between">
                        <Button variant="outlined" onClick={taskCreateClose}>
                            Отмена
                        </Button>
                        <Button variant="contained" type="submit">
                            Создать
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
}