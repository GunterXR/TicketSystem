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
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export default function AdminChangeRole({user, onChanged}) {
    const [open, setOpen] = React.useState(false);
    const [role, setRole] = React.useState(user.role);

    //Смена роли
    const roleChange = (event) => {
        setRole(event.target.value);
    };

    //Открытие окна
    const editRoleOpen = () => {
        setOpen(true);
    };

    //Закрытие окна
    const editRoleClose = () => {
       setOpen(false);
       onChanged(false);
    };

    //POST запрос на смену роли пользователю
    const editRole = async (event) => {
        event.preventDefault();
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/admin/changerole", {
            id: user.id,
            role: role.toString(),
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token},
        })
            .then(response => {
                console.log(response.data);
                editRoleClose();
                onChanged(true);
            })
            .catch(function (error) {
                console.log('Error', error.message);
            });
    };

    return (
        <div>
            <Button startIcon={<EditIcon />} type="submit" variant="contained" sx={{mr: 13, mt: 3, mb: 2}} onClick={editRoleOpen}>
                Изменить роль пользователя
            </Button>
            <Dialog open={open} onClose={editRoleClose}>
                <DialogTitle>
                    Изменить роль пользователя
                </DialogTitle>
                <Box noValidate component="form" onSubmit={editRole}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="role">Роль</InputLabel>
                                    <Grid item xs={12}>
                                        <Select
                                            fullWidth
                                            labelId="role"
                                            label="Роль"
                                            value={role}
                                            onChange={roleChange}
                                        >
                                            <MenuItem value={"worker"}>Пользователь</MenuItem>
                                            <MenuItem value={"specialist"}>Специалист</MenuItem>
                                            <MenuItem value={"spreader"}>Распределитель</MenuItem>
                                        </Select>
                                    </Grid>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box item sx={{ ml: 3, mr: 3, mt: 1, mb: 2 }} display="flex" justifyContent="space-between">
                        <DialogActions sx={{ mt: 1, mb: 2, ml: 4, }}>
                            <Button sx={{ ml: 21.5,}} variant="outlined" onClick={editRoleClose}>
                                Отмена
                            </Button>
                            <Button variant="contained" type="submit">
                                Изменить
                            </Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
}