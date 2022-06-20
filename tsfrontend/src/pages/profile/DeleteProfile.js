import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function DeleteProfile({userID}) {
    let navigate = useNavigate();

    const [open, setOpen] = React.useState(false);

    //Открытие окна
    const deleteProfileOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const deleteProfileClose = () => {
        setOpen(false);
    };

    //Удаление аккаунта
    const deleteProfile = async () => {
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/profile/delete", userID, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
            .then(response => {
                console.log(response.data);
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("radio");
                sessionStorage.removeItem("radioUser");
                deleteProfileClose();
                navigate("/signin");
            })
            .catch(function (error) {
                console.log('Error', error.message);
            });
    };

    return (
        <div>
            <Button variant="outlined" onClick={deleteProfileOpen} color="error">
                Удалить аккаунт
            </Button>
            <Dialog open={open} onClose={deleteProfileClose}>
                <DialogTitle>Удалить профиль</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить свою учетную запись?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={deleteProfileClose}>
                        Нет
                    </Button>
                    <Button color="error" variant="contained" onClick={deleteProfile} autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
