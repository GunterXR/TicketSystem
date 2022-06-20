import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {FormControlLabel, Input, InputAdornment, Radio, RadioGroup} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import FormControl from "@mui/material/FormControl";

let rowsTmp = [];
let rowsTmp2 = [];

export default function AdminTable(props) {
    let navigate = useNavigate();

    let radio = sessionStorage.getItem("radioUser");
    const [value, setValue] = React.useState(radio);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");

    //Выбор количества строк на одной странице
    const chooseRows = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Фильтрация пользователей
    const handleRadio = (event) => {
        sessionStorage.setItem("radioUser", event.target.value)
        setValue(event.target.value);
    };

    //Поиск
    const handleSearch = (event) => {
         setSearch(event.target.value);
    };

    //Переход на страницу
    const changePage = (event, newPage) => {
        setPage(newPage);
    };

    //Перевод перехода на страницы
    function RowsRussian({ from, to, count }) {
        return `${from}–${to} из ${count !== -1 ? count : `больше чем ${to}`}`;
    }

    //Перевод стрелок перехода на страницы
    function PagesRussian(type) {
        if (type === "next") return `Перейти на следующую страницу`;
        else return `Перейти на предыдущую страницу`;
    }

    //Перевод данных из БД в читаемую форму
    function Translate() {
        rowsTmp = props.rows;
        rowsTmp2 = [];
        for (let i = 0; i < rowsTmp.length; i++) {
            if (rowsTmp[i].role == "worker") rowsTmp[i].role = "Пользователь"
            else if (rowsTmp[i].role == "specialist") rowsTmp[i].role = "Специалист"
            else if (rowsTmp[i].role == "spreader") rowsTmp[i].role = "Распределитель"

            if (rowsTmp[i].patronymic == null || rowsTmp[i].patronymic == "") rowsTmp[i].patronymic = "[не указано]"
            if (rowsTmp[i].post == null || rowsTmp[i].post == "") rowsTmp[i].post = "[не указана]"
        }
        for(let i = 0; i < rowsTmp.length; i++) {
            FilterRadio(rowsTmp[i]);
        }
    }

    //Фильтрация пользователей
    function FilterRadio(row1) {
        if (value == "current") {
            if (row1.email != "[DELETED]") Search(row1);
        }
        else if (value == "deleted") {
            if (row1.email == "[DELETED]") Search(row1);
        }
    }

    //Поисковые результаты
    function Search(row1) {
        if (search === "" || search === null) {
            return (
                rowsTmp2.push(row1)
            );
        }
        else {
            if (row1.id.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.email.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.name.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.surname.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.patronymic.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.role.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.post.toString().toLowerCase().includes(search.toLowerCase()) === true)
            {
                return (
                    rowsTmp2.push(row1)
                )
            }
        }
    }

    //Отображение поисковых результатов
    function SearchRender(row1) {
        return(
            <TableRow hover role="checkbox" tabIndex={-1} key={row1.id} onClick={() => {
                sessionStorage.setItem("userid", row1.id)
                navigate("/admin/user")
            }}>
                {props.columns.map((column) => {
                    const value = row1[column.id];
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {value}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    //Отобразить информацию только когда пришел ответ на запрос
    function RenderWhenLoaded() {
        if (props.isLoaded === true) {
            return (
                <TableBody>
                    {rowsTmp2
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => SearchRender(row))}
                </TableBody>
            );
        }
    }

    Translate();

    useEffect(() => {
        Translate();
    }, []);

    return (
        <Paper elevation={1} sx={{ width: '100%', overflow: 'hidden' }}>
            <div>
                <div>
                    <Box display="flex" justifyContent="space-between" sx={{p: {xs: 2, md: 3}}}>
                        <Grid item>
                            <FormControl>
                                <RadioGroup
                                    sx={{height: '35pt'}}
                                    row
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    onChange={handleRadio}
                                >
                                    <FormControlLabel value="current" control={<Radio />} label="Пользователи" />
                                    <FormControlLabel value="deleted" control={<Radio />} label="Удаленные пользователи" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Input
                                sx={{ width: '200pt', height: '28pt'}}
                                id="searchs"
                                value={search}
                                type="search"
                                placeholder="Поиск"
                                onChange={handleSearch}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                    </Box>
                </div>
                <TableContainer sx={{ maxHeight: 375, minHeight: 375}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {props.columns.map((column) => (
                                    <TableCell key={column.id} align={column.align}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <RenderWhenLoaded />
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[10, 25, 100]}
                                 labelDisplayedRows={RowsRussian}
                                 getItemAriaLabel={PagesRussian}
                                 onPageChange={changePage}
                                 onRowsPerPageChange={chooseRows}
                                 count={rowsTmp2.length}
                                 component="div"
                                 rowsPerPage={rowsPerPage}
                                 page={page}
                                 labelRowsPerPage={"Строк на странице"}

                />
            </div>
        </Paper>
    );
}