import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import FormularioUsuario from './formulario_usuario';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import EditIcon from "@material-ui/icons/Edit";
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import clsx from 'clsx';
import {lighten} from '@material-ui/core/styles';
import { Select, TextField, MenuItem, Grid, Button, Avatar} from "@material-ui/core";
import {Dialog, DialogTitle, DialogActions, DialogContent, FormControlLabel, Switch} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { purple } from '@material-ui/core/colors';
import Search_location from '../mapas/search_location';
import {
  set_coordinates  
} from '../../redux/actions';
import { set } from "date-fns";

const PurpleSwitch = withStyles({
  switchBase: {
    color: purple[300],
    '&$checked': {
      color: purple[500],
    },
    '&$checked + $track': {
      backgroundColor: purple[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});


const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "5%",
      flexGrow: 1,
    },
    card_root: {
      minWidth: 275,
      marginBottom: "2%",
    },
    card_bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    card_title: {
      fontSize: 14,
    },
    card_pos: {
      marginBottom: 12,
    },
    scroll_grid: {
      height: "500px",
      overflowY: "scroll",
    },
    indicator: {
      backgroundColor: "white",
      color: "red",
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
      },
      table: {
        minWidth: 750,
      },
      visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
      },
      avatar: {
        large: {
          width: '100%',
          height: '80%',
        }
      }
  }));

  
export default function Usuarios(){
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    
    function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
    }

    const handleChange = (event, newValue) => {
    setValue(newValue);
    };

    TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    };

    return(
            <Fragment>
                <AppBar position="static">
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    className={classes.indicator}
                    >
                    <Tab label="Crear Usuario" {...a11yProps(0)} />
                    <Tab label="Listar/Buscar usuarios" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <FormularioUsuario/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <EnhancedTable/>
                </TabPanel>
            </Fragment>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    );
  }
  
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  const headCells = [
    { id: 'RestaurantUserID', numeric: true, disablePadding: false, label: 'Número de identificación'},
    { id: 'DocumentTypeID', numeric: false, disablePadding: true, label: 'Tipo de documento' },
    { id: 'RestaurantUserName', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'RestaurantUserLastname', numeric: false, disablePadding: true, label: 'Apellido' },
    { id: 'RestaurantUserModDate', numeric: false, disablePadding: true, label: 'Fecha última modif' },
    { id:  'RestaurantUserCreationDate', numeric: false, disablePadding: true, label: 'Fecha de creación' },
  ];
  
  function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox"/>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
  };
  
  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }));
  
  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {search, setSearch, filterCrit, setFilter} = props;
    const [opt, setOpt] = React.useState(filterCrit);
    const [searchAux, setSearchAux] = React.useState(search);
    const handleChange = (event) => {
      setSearch(event.target.value);
      setSearchAux(event.target.value);
    };

    const handleChangeSearch = (event) => {
      setOpt(event.target.value);
      setFilter(event.target.value);
    }
 
  const getFilter = (id) => {
      
    switch(id){
        
        case "RestaurantUserID":
          return "Id";
        case "DocumentTypeID":
          return "Tipo de doc";
        case "RestaurantUserName":
          return "Nombre";
        case "RestaurantUserLastname":
          return "Apellidos";
        case "RestaurantUserModDate":
          return "Por fecha de mod";
        case "RestaurantUserCreationDate":
          return "Por fecha creac";
        default:
          return "";           
      }
    }

    return (
      <Toolbar
        className={clsx(classes.root)}
      >
          <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
            Tabla de usuarios del restaurante
          </Typography>
          <Grid container>
            <Grid item xs={6}>
            <TextField
                fullWidth
                id="standard-select-orderby"
                select
                value={opt}
                onChange={handleChangeSearch}
                label="Columna"
                >
                  {headCells.map((headCell) => (
                    <MenuItem key={headCell.id} value={headCell.id}>
                      {getFilter(headCell.id)}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
              fullWidth 
              id="standard-search-orderby" 
              label={"Buscar por "+getFilter(opt)} 
              type="search"
              value={searchAux}
              onChange={handleChange}
              />
            </Grid>
          </Grid>
      </Toolbar>
    );
  };
  
    
  function EnhancedTable() {

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('RestaurantUserID');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([]);
    const [error, set_error] = React.useState(false);
    const [error_message, set_error_message] = useState("");
    const [success, set_success] = React.useState(false);
    const [success_message, set_success_message] = useState("");
    const [search, setSearch] = React.useState("");
    const [filterCrit, setFilter] = React.useState("RestaurantUserID");
    const [openD, setOpenD] = React.useState(false);
    const vertical = "top";
    const horizontal = "right";
    const [id, setId] = React.useState(0);
    const [typeId, setType] = React.useState("");
    const [name, setName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [status, setStatus] = React.useState(false);
    const [datePick, setDate] = React.useState(null);
    const [picture, setPicture] = React.useState("");
    const dispatch = useDispatch();
    const {coordenadas} = useSelector(state => ({
      coordenadas: state.redux_reducer.coordenadas,
    }));

    const refresh = () => {
      fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listUsers/50/0", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.error) {
            setRows([]);
          }else{
            setRows(response);
          }
        })
        .catch((error) => {
          alert(error);
        });
    }

    useEffect(() => {
      fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listUsers/50/0", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.error) {
            setRows([]);
          }else{
            setRows(response);
          }
        })
        .catch((error) => {
          alert(error);
        });
    }, []);

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleClick = (event, userSelected) => {
        setId(userSelected.RestaurantUserID);
        setType(userSelected.DocumentTypeID);
        setName(userSelected.RestaurantUserName);
        setLastName(userSelected.RestaurantUserLastname);
        setStatus(userSelected.RestaurantUserStatus);
        setDate(new Date(userSelected.RestaurantUserBirthdate));
        setPicture(userSelected.RestaurantUserPicture);
        dispatch(set_coordinates({ lat: userSelected.RestaurantUserLatitude, lng: userSelected.RestaurantUserLongitude}));
        setOpenD(true);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleClose = () => {
      setOpenD(false);
    };

    const updateUser = () => {
      fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateUser", {
        method: "POST",
        body: JSON.stringify({
          RestaurantUserID: id,
          RestaurantUserName: name,
          RestaurantUserLastname: lastName,
          RestaurantUserLatitude: parseFloat(coordenadas.lat),
          RestaurantUserLongitude: parseFloat(coordenadas.lng),
          RestaurantUserBirthdate: datePick,
          RestaurantUserStatus: status,
          DocumentTypeID: typeId,
        }), // data can be `string` or {object}!
      })
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          if(response.error){
            set_error_message("Error: "+response.error);
            set_error(true);
          }else{
            set_success_message("Hecho");
            set_success(true);
            refresh();
            setOpenD(false);
          }
        })
        .catch(err => {
          alert(err);
        })
    }

    const handleDateChange = (value) => {
       setDate(value);
    };


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            search = {search}
            setSearch = {setSearch}
            filterCrit = {filterCrit}
            setFilter = {setFilter}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size='medium'
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {rows.length > 0?stableSort(search.length?rows.filter( x => x[filterCrit].toString().toUpperCase().includes(search.toUpperCase())):rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover={row.RestaurantUserStatus}
                        style={
                          row.RestaurantUserStatus ? { opacity: 1 } : { opacity: 0.5 }
                        }
                        onClick={(event) => handleClick(event, row)}
                        tabIndex={-1}
                        key={labelId+row.RestaurantUserID}
                      >
                        <TableCell padding="checkbox">
                        <IconButton
                            children={
                              <EditIcon/>
                            }
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {parseInt(row.RestaurantUserID)}
                        </TableCell>
                        <TableCell align="right">{row.DocumentTypeID}</TableCell>
                        <TableCell align="right">{row.RestaurantUserName}</TableCell>
                        <TableCell align="right">{row.RestaurantUserLastname}</TableCell>
                        <TableCell align="right">{new Date(row.RestaurantUserCreationDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{new Date(row.RestaurantUserModDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  }):null}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog
          open={openD}
          onClose={handleClose}
          scroll='body'
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
        <DialogTitle id="scroll-dialog-title">Modificar usuario</DialogTitle>
        <DialogContent>
        <div>
          <div style={{display: 'flex ', alignItems: 'center'}}>
            <Avatar src={picture.length>0?(process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "file/"+picture:null} className={classes.avatar}/>   
          </div>
        <FormControlLabel
          control={<PurpleSwitch checked={status} onChange={(e) => setStatus(!status)} name="checkedStatus" />}
          label="Activar/Desactivar usuario"
        />
        <TextField
          id="filled-full-width-name"
          label="Nombre"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="filled-full-width-lastname"
          label="Apellido"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableFuture
			        fullWidth
              margin="normal"
              id="date-picker-birthday-user-admin"
              label="Fecha de nacimiento"
              format="yyyy/MM/dd"
              value={datePick}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "Cambiar fecha",
              }}
            />
          </MuiPickersUtilsProvider>
          <Search_location/>
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateUser} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
        <Snackbar
                open={error}
                autoHideDuration={2000}
                anchorOrigin={{ vertical, horizontal }}
                >
                <Alert
                onClose={() => set_error(false)}
                variant="filled"
                severity="error"
                >
                {error_message}
                </Alert>
                </Snackbar>
                <Snackbar
                open={success}
                autoHideDuration={2000}
                anchorOrigin={{ vertical, horizontal }}
                >
                <Alert
                onClose={() => set_success(false)}
                variant="filled"
                style={{ backgroundColor: "white", color: "black" }}
                >
                {success_message}
                </Alert>
         </Snackbar>
      </div>
    );
  }