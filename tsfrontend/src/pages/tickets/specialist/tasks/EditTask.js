import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

export default function EditTask({ticket, onChanged, statusFlag}) {
    const [open, setOpen] = React.useState(false);
    const [boolsRegex, setBoolsRegex] = React.useState({nameTaskBool: null});

    //Открытие окна
    const taskEditOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const taskEditClose = () => {
       setOpen(false);
       onChanged(false);
    };

    //Редактирование задачи
    const taskEdit = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const dataTask = new FormData(event.currentTarget);
        let name = dataTask.get('taskName');
        let description = dataTask.get('taskDesc');
        let regexCheck = ({nameTaskBool: /^(?=\s*\S).*$/.test(name),});
        setBoolsRegex(regexCheck)

        //POST запрос на редактирование задачи
        if (regexCheck.nameTaskBool === true) {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/task/edit", {
                id: ticket.id,
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
                    taskEditClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <div>
            <IconButton disabled={statusFlag} onClick={taskEditOpen} edge="end">
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={taskEditClose}>
                <DialogTitle>Редактировать задачу</DialogTitle>
                <Box noValidate component="form" onSubmit={taskEdit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField required
                                           autoFocus
                                           fullWidth
                                           id="taskName"
                                           name="taskName"
                                           label="Название задачи"
                                           defaultValue={ticket.name}
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
                                           defaultValue={ticket.description}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box item sx={{ ml: 3, mr: 3, mt: 1, mb: 2 }} display="flex" justifyContent="space-between">
                        <Button variant="outlined" onClick={taskEditClose}>Отмена</Button>
                        <Button variant="contained" type="submit">Изменить</Button>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
}