import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteTask from "./DeleteTask";
import EditTask from "./EditTask";
import Box from "@mui/material/Box";
import axios from "axios";
import {useEffect} from "react";
import CreateTask from "./CreateTask";

export default function Tasks({ticket}) {
  const [openCollapse, setOpenCollapse] = React.useState(-1);
  const [checked, setChecked] = React.useState([]);

  const [loaded, setLoaded] = React.useState({
        error: null, isLoaded: false, tasks: []
    });

  //Нажатие на галочку
  const checkClick = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      CompleteTask(value, true);
    } else {
      newChecked.splice(currentIndex, 1);
      CompleteTask(value, false);
    }
    setChecked(newChecked);
  };

  //Отображение галочек
  function RenderChecks(value) {
      let rows = [];
      value.map(
          (row) => {
              if (row.status === true) {
                  rows.push(row.id);
              }
          });
      setChecked(rows)
  }

    //Получение ответа от дочерних компонентов о загрузке
    function OnChanged(changed) {
        if (changed === true) {
            setLoaded({isLoaded: false})
            GetTasks();
        }
    }

    useEffect(() => {
        GetTasks();
    }, []);

    //Отображение кнопки создания задачи в зависимости от статуса
    function GetStatusRender() {
        if (ticket.status == "closed") {
            return null;
        }
        else {
            return (
                <div>
                    <CreateTask onChanged={OnChanged} ticketID={ticket.id}/>
                </div>
            );
        }
    }

    //POST запрос на пометку задачи как выполненной
    async function CompleteTask(completeid, completestatus) {
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/task/complete", {
            id: completeid,
            status: completestatus,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log('Error', error.message);
            });
    }

    //POST запрос на получение списка задач
    async function GetTasks() {
        let token = sessionStorage.getItem("accessToken");
        await axios.post("https://localhost:7216/api/tasks", ticket.id, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
            .then(response => {
                console.log(response.data);
                RenderChecks(response.data);
                setLoaded({
                    isLoaded: true,
                    tasks: response.data
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

    //Отображение заметок при их наличии
    function CheckNotes({id, desc}) {
        if (desc === "") {
            return null;
        }
        else {
            return (
                <IconButton id={[id, 3]}
                            onClick={() => setOpenCollapse(openCollapse === id ? -1 : id)}
                            aria-label="expand"
                >
                    <KeyboardArrowDownIcon />
                </IconButton>
            );
        }
    }

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        if (loaded.isLoaded === true) {
            return (
                <div>
                    <Paper sx={{mb: 4, p: 1, display: 'flex', flexDirection: 'column'}} elevation={24}>
                        <Paper sx={{ mt: 4, mb: 4, ml: 5, mr: 5,}} elevation={0}>
                            <Typography component="h1" variant="h5" align="center" fontSize={24}>
                                Задачи
                            </Typography>
                            <Divider textAlign={"center"} sx={{ mt: 3}}><Typography color="text.secondary">Список задач</Typography></Divider>
                            <GetStatusRender />
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {loaded.tasks.map((value) => {
                                    const labelId = `checkbox-list-label-${value.id}`;
                                    return (
                                        <div key={value.id}>
                                            <Grid>
                                                <ListItem
                                                    secondaryAction={
                                                        <div>
                                                            <Grid container>
                                                                <Grid>
                                                                    <CheckNotes id={value.id} desc={value.description}/>
                                                                </Grid>
                                                                <Grid>
                                                                    <EditTask statusFlag={ticket.status == "closed"} ticket={value} onChanged={OnChanged}/>
                                                                </Grid>
                                                                <Grid>
                                                                    <DeleteTask statusFlag={ticket.status == "closed"} ticketID={value.id} onChanged={OnChanged}/>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    }
                                                    disablePadding
                                                >
                                                    <ListItemButton disabled={ticket.status == "closed"} role={undefined} onClick={checkClick(value.id)} dense>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={checked.indexOf(value.id) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={labelId}
                                                                      primary={checked.indexOf(value.id) !== -1 ?
                                                                          <Typography color="text.secondary" fontSize={16}><strike>{value.name}</strike></Typography> :
                                                                          <Typography fontSize={16}>{value.name}</Typography>}>
                                                        </ListItemText>
                                                    </ListItemButton>
                                                </ListItem>
                                                <div style={{ backgroundColor: 'rgba(211,211,211,0.4)'}}>
                                                    <Collapse in={openCollapse === value.id} timeout="auto" unmountOnExit>
                                                        <Box>
                                                            <Grid sx={{ ml: 2, mt: 1, mb: 1}} item xs={12}>
                                                                <Typography textAlign={"left"} component="h2" variant="h5" color="text.secondary" fontSize={16}>
                                                                    {value.description}
                                                                </Typography>
                                                            </Grid>
                                                        </Box>
                                                    </Collapse>
                                                </div>
                                            </Grid>
                                        </div>
                                    );
                                })}
                            </List>
                        </Paper>
                    </Paper>
                </div>
            );
        }
    }

    return (
        <div>
            <RenderWhenLoaded />
        </div>
    );
}