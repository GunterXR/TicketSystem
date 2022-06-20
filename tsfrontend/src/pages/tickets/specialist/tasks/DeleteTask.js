import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

export default function DeleteTask({ticketID, onChanged, statusFlag}) {
    const [open, setOpen] = React.useState(false);

    //Открытие окна
    const taskDeleteOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const taskDeleteClose = () => {
        setOpen(false);
        onChanged(false);
    };

    //Удаление задачи
    const taskDelete = async (event) => {
        //POST запрос на удаление задачи
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/task/delete", ticketID, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token},
        })
            .then(response => {
                console.log(response.data);
                taskDeleteClose();
                onChanged(true);
            })
            .catch(function (error) {
                console.log('Error', error.message);
            });
    };

    return (
        <div>
            <IconButton disabled={statusFlag} onClick={taskDeleteOpen} edge="end">
                <DeleteIcon />
            </IconButton>
            <Dialog open={open} onClose={taskDeleteClose}>
                <DialogTitle>Удалить задачу?</DialogTitle>
                <DialogActions>
                    <Button variant="outlined" onClick={taskDeleteClose}>
                        Нет
                    </Button>
                    <Button variant="contained" onClick={taskDelete} autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
