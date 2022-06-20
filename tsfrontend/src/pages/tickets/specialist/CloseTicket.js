import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function CloseTicket({ticketID, onChanged}) {
    const [open, setOpen] = React.useState(false);
    const [boolsRegex, setBoolsRegex] = React.useState(
        {reasonBool: null}
    );

    //Открытие окна
    const ticketCloseOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const ticketClose = () => {
        setOpen(false);
        onChanged(false);
    };

    //Закрытие заявки
    const closeTicket = async (event) => {
        //Проверка регулярных выражений
        event.preventDefault();
        const dataDialog = new FormData(event.currentTarget);
        let closeReason = dataDialog.get('closereason');
        let regexCheck = (
            {
                reasonBool: /^(?=\s*\S).*$/.test(closeReason),
            }
        );
        setBoolsRegex(regexCheck)

        //POST запрос на закрытие заявки
        if (regexCheck.reasonBool === true) {
            let token = sessionStorage.getItem("accessToken");
            await axios.post("https://localhost:7216/api/ticket/close", {
                id: ticketID,
                closeReason: closeReason,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            })
                .then(response => {
                    console.log(response.data);
                    ticketClose();
                    onChanged(true);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
        }
    };

    return (
        <div>
            <Button startIcon={<CloseIcon />} variant="contained" color="error" onClick={ticketCloseOpen}>
                Закрыть заявку
            </Button>
            <Dialog open={open} onClose={ticketClose}>
                <DialogTitle>
                    Закрытие заявки
                </DialogTitle>
                <Box noValidate component="form" onSubmit={closeTicket}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                           autoFocus
                                           id="closereason"
                                           label="Причина закрытия"
                                           name="closereason"
                                           maxRows={10}
                                           error={(boolsRegex.reasonBool === false && true)}
                                           helperText={(boolsRegex.reasonBool === false && "Это поле не должно быть пустым")}
                                           multiline
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Grid container spacing={2}>
                        <DialogActions sx={{ mt: 1, mb: 2, ml: 4, }}>
                            <Button sx={{ ml: 21.5,}} variant="outlined" onClick={ticketClose}>
                                Отмена
                            </Button>
                            <Button variant="contained" type="submit">
                                Закрыть
                            </Button>
                        </DialogActions>
                    </Grid>
                </Box>
            </Dialog>
        </div>
    );
}
