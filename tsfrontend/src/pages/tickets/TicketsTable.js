import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {FormControlLabel, FormLabel, Input, InputAdornment, Radio, RadioGroup, Select, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

let rowsTmp = [];
let rowsTmp2 = [];

export default function TicketsTable(props) {
    let navigate = useNavigate();

    let radio = sessionStorage.getItem("radio")
    let roles = sessionStorage.getItem("role")
    const [value, setValue] = React.useState(radio);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");

    //Выбор количества строк на одной странице
    const chooseRows = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Фильтрация заявок
    const handleRadio = (event) => {
        sessionStorage.setItem("radio", event.target.value)
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
            if (rowsTmp[i].status == "opened") rowsTmp[i].status = "Открыта"
            else if (rowsTmp[i].status == "process") rowsTmp[i].status = "В обработке"
            else if (rowsTmp[i].status == "closed") rowsTmp[i].status = "Закрыта"

            if (rowsTmp[i].priority == "low") rowsTmp[i].priority = "Низкий"
            else if (rowsTmp[i].priority == "medium") rowsTmp[i].priority = "Средний"
            else if (rowsTmp[i].priority == "high") rowsTmp[i].priority = "Высокий"
            else if (rowsTmp[i].priority == "critical") rowsTmp[i].priority = "Критический"

            if (rowsTmp[i].status == "Закрыта") rowsTmp[i].deadLine = ("")
            if (rowsTmp[i].deadLine != null && rowsTmp[i].deadLine.includes("л") == false && rowsTmp[i].deadLine.includes("о") == false && rowsTmp[i].deadLine.includes("г") == false && rowsTmp[i].deadLine.includes("м") == false && rowsTmp[i].deadLine.includes("д") == false && rowsTmp[i].status != "Закрыта") {
                let date1 = new Date(rowsTmp[i].dateSent.substring(6, 10), rowsTmp[i].dateSent.substring(3, 5), rowsTmp[i].dateSent.substring(0, 2));
                let date2 = new Date(rowsTmp[i].deadLine.substring(6, 10), rowsTmp[i].deadLine.substring(3, 5), rowsTmp[i].deadLine.substring(0, 2));
                let diff = new Date(date2.getTime() - date1.getTime());
                let year = diff.getUTCFullYear() - 1970;
                let month = diff.getUTCMonth();
                let day = diff.getUTCDate() - 1;
                if (year < 0 || month < 0 || year < 0) {
                    rowsTmp[i].deadLine = ("Просрочена")
                }
                else
                {
                    if (year == 0 && day == 0 && day == 0) rowsTmp[i].deadLine = ("Сегодня")
                    else {
                        if (year == 0) year = "";
                        else
                        {
                            if (year % 10 == 0 || year % 10 == 5 || year % 10 == 6 || year % 10 == 7 || year % 10 == 8 || year % 10 == 9) year = year + " лет";
                            if (year % 10 == 2 || year % 10 == 3 || year % 10 == 4) year = year + " года";
                            if (year % 10 == 1) year = year + " год";
                        }
                        if (month == 0) month = "";
                        else
                        {
                            if (month % 10 == 0 || month % 10 == 5 || month % 10 == 6 || month % 10 == 7 || month % 10 == 8 || month % 10 == 9) month = month + " месяцев";
                            if (month % 10 == 2 || month % 10 == 3 || month % 10 == 4) month = month + " месяца";
                            if (month % 10 == 1) month = month + " месяц";
                        }
                        if (day == 0) day = "";
                        else
                        {
                            if (day % 10 == 0 || day % 10 == 5 || day % 10 == 6 || day % 10 == 7 || day % 10 == 8 || day % 10 == 9) day = day + " дней";
                            if (day % 10 == 2 || day % 10 == 3 || day % 10 == 4) day = day + " дня";
                            if (day % 10 == 1) day = day + " день";
                        }
                        rowsTmp[i].deadLine = (year + "" + month + "" + day + "")
                    }
                }
            }
        }
        for(let i = 0; i < rowsTmp.length; i++) {
            FilterRadio(rowsTmp[i]);
        }
    }

    //Фильтрация заявок
    function FilterRadio(row1) {
        if (roles == "worker") {
            if (value == "open") {
                if (row1.status != "Закрыта") Search(row1);
            }
            else if (value == "close") {
                if (row1.status == "Закрыта") Search(row1);
            }
        }
        else if (roles == "specialist") {
            if (value == "open") {
                if (row1.status == "В обработке") Search(row1);
            }
            else if (value == "close") {
                if (row1.status == "Закрыта") Search(row1);
            }
        }
        else if (roles == "spreader" || roles == "admin") {
            if (value == "open") {
                if (row1.status == "Открыта") Search(row1);
            }
            else if (value == "process") {
                if (row1.status == "В обработке" && row1.deadLine != "Просрочена") Search(row1);
            }
            else if (value == "dead") {
                if (row1.deadLine == "Просрочена") Search(row1);
            }
            else if (value == "close") {
                if (row1.status == "Закрыта") Search(row1);
            }
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
            //console.log(row1.deadLine)
            if (row1.id.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.name.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.priority.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.status.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.dateSent.toString().toLowerCase().includes(search.toLowerCase()) === true ||
                row1.deadLine.toString().toLowerCase().includes(search.toLowerCase()) === true)
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
                sessionStorage.setItem("ticketid", row1.id)
                navigate("/ticket")
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

    //Отображение переключений по ролям
    function RadioRender() {
        if (roles == "worker" || roles == "specialist") {
            return(
                <div>
                    <FormControl>
                        <RadioGroup
                            sx={{height: '35pt'}}
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleRadio}
                        >
                            <FormControlLabel value="open" control={<Radio />} label="Открытые заявки" />
                            <FormControlLabel value="close" control={<Radio />} label="Закрытые заявки" />
                        </RadioGroup>
                    </FormControl>
                </div>
            );
        }
        else if (roles = "spreader" || roles == "admin") {
            return(
              <div>
                  <FormControl>
                      <RadioGroup
                          sx={{height: '35pt'}}
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={value}
                          onChange={handleRadio}
                      >
                          <FormControlLabel value="open" control={<Radio />} label="Открытые" />
                          <FormControlLabel value="process" control={<Radio />} label="В обработке" />
                          <FormControlLabel value="dead" control={<Radio />} label="Просроченные" />
                          <FormControlLabel value="close" control={<Radio />} label="Закрытые" />
                      </RadioGroup>
                  </FormControl>
              </div>
            );
        }
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
                            <RadioRender />
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