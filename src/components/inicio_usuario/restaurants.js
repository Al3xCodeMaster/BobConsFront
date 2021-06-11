import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  TextField,
  Grid,
  IconButton,
  Popover,
  Slide,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { CheckCircleOutline, DeleteOutline } from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Done from "@material-ui/icons/Done";
import SearchLocation from '../mapas/search_location';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  set_coordinates
} from '../../redux/actions';


const dayptions = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

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
  }
}));

export default function Restaurants() {
  const classes = useStyles();
  const [fetch_restaurants, set_fetch_restaurants] = useState([]);
  const [nombre_restaurant, set_nombre_restaurant] = useState("");
  const [restaSelected, setRestSelected] = useState("");
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [activado, set_activado] = useState("Activo");
  const [gilad, set_gilad] = useState(true);
  const [value, setValue] = React.useState(0);
  const vertical = "top";
  const horizontal = "right";
  const [selectedDateOpenUpdate, setSelectedDateOpenUpdate] = useState("07:00");
  const [selectedDateCloseUpdate, setSelectedDateCloseUpdate] = useState("12:00");
  const [capc_restaurant, set_capac_rest] = useState(0);
  const componRef = React.useRef();
  const [openDD, set_openDD] = useState(false);
  const [openDU, set_openDU] = useState(false);
  const [daySelected, setDaySelected] = useState("");
  const [fetch_schedules, set_fetch_schedules] = useState([]);
  const [selectedDateOpen, setSelectedDateOpen] = useState("07:00");
  const [selectedDateClose, setSelectedDateClose] = useState("12:00");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openP = Boolean(anchorEl);
  const id = openP ? "simple-popover" : undefined;
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [scheduleFromRest, setScheduleFromRest] = useState([]);
  const [openDH, set_openDH] = useState(false);
  const { coordenadas } = useSelector((state) => ({
    coordenadas: state.redux_reducer.coordenadas,
  }));
  const dispatch = useDispatch();

  const updateSchedule = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateSchedule", {
      method: "POST",
      body: JSON.stringify({
        ScheduleID: parseInt(selectedSchedule),
        ScheduleOpeningHour: tConvert(selectedDateOpenUpdate),
        ScheduleClosingHour: tConvert(selectedDateCloseUpdate)
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        set_success(true);
        set_success_message("Horario cambiado con éxito");
        refreshSchedules();
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  }
  
  const handleClick = (event, valueId) => {
    setSelectedSchedule(valueId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const set_state_gilad = () => {
    set_gilad(!gilad);
    set_activado(!gilad ? "Activo" : "No activo");
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const set_close_DU = () => {
    set_nombre_restaurant("");
    set_capac_rest("");
    setRestSelected("");
    set_openDU(false);
  }

  const set_open_DU = (id, nombre, capac, latitude, longitude) => {
    dispatch(set_coordinates({ lat: latitude, lng: longitude }));
    set_nombre_restaurant(nombre);
    set_capac_rest(capac);
    setRestSelected(id);
    set_openDU(true);
  }

  const set_close_DH = () => {
    setScheduleFromRest([]);
    setRestSelected("");
    set_openDH(false);
  }

  const set_open_DH = (idRes) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllRestaurantSchedules/" + idRes + "/" + true, {
      method: "GET",
    })
      .then((res) => (res.status === 204 ? [] : res.json()))
      .then((response) => {
            if(response.error){
              set_error(true);
              set_error_message("Error: " + response.error);
              return; 
            }
            setScheduleFromRest(
              response.map((element) => {
                return element.ScheduleID;
              })
            );
            setRestSelected(idRes);
            set_openDH(true);
      })
      .catch((error) => {
        alert(error);
      });
  }

  const changeStateRest = (valueId, state) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateRestaurant", {
      method: "POST",
      body: JSON.stringify({
        RestaurantID: parseInt(valueId),
        RestaurantStatus: state,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        set_success(true);
        set_success_message("Restaurante cambiado con éxito");
        refresh();
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  const performUpdate = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateRestaurant", {
      method: "POST",
      body: JSON.stringify({
        RestaurantID: parseInt(restaSelected),
        RestaurantName: nombre_restaurant,
        RestaurantCapacity: parseInt(capc_restaurant),
        RestaurantLatitude: coordenadas.lat,
        RestaurantLongitude: coordenadas.lng 
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        set_success(true);
        set_success_message("Restaurante cambiado con éxito");
        refresh();
        set_close_DU();
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  const performSave = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "createRestaurant", {
      method: "POST",
      body: JSON.stringify({
        RestaurantName: nombre_restaurant,
        RestaurantLatitude: coordenadas.lat,
        RestaurantLongitude: coordenadas.lng,
        RestaurantCapacity: parseInt(capc_restaurant),
        RestaurantStatus: gilad
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if(resp.error){
          set_error(true);
          set_error_message("Error en la creación"+resp.error);
        }else{
          set_success(true);
          set_success_message("Perfil agregado con éxito");
          set_nombre_restaurant("");
          set_capac_rest(0);
          set_openDD(false);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const refresh = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listRestaurants/50/0", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          set_fetch_restaurants(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listRestaurants/50/0", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          set_fetch_restaurants(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listSchedules/50/0", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          set_fetch_schedules(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);


  const refreshSchedules = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listSchedules/50/0", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          set_fetch_schedules(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const saveSchedule = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "createSchedule", {
      method: "POST",
      body: JSON.stringify({
        ScheduleDay: daySelected,
        ScheduleOpeningHour: tConvert(selectedDateOpen),
        ScheduleClosingHour: tConvert(selectedDateClose)
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if(resp.error){
          set_error(true);
          set_error_message("Error en la creación"+resp.error);
          set_openDD(false);
          set_nombre_restaurant("");
          set_capac_rest(0);
        }else{
          set_success(true);
          set_success_message("Horario agregado con éxito");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const scheduleRestaurant = (schedId, status) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "assignScheduleToRestaurant", {
      method: "POST",
      body: JSON.stringify({
        RestaurantID: restaSelected,
        ScheduleID: schedId,
        Status: status
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if(resp.error){
          set_error(true);
          set_error_message("Error en la creación"+resp.error);
          set_openDD(false);
          set_nombre_restaurant("");
          set_capac_rest(0);
        }else{
          set_success(true);
          set_success_message("Horario agregado con éxito");
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
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
          <Tab label="Crear Sede Restaurante" {...a11yProps(0)} />
          <Tab label="Crear Horarios" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
    <TabPanel value={value} index={0}>
        <Grid container className={classes.root} spacing={5}>
          <Grid item xs={3}>
            <TextField
              id="standard-text-rest-nom"
              label="Nombre del restaurante"
              fullWidth
              value={nombre_restaurant}
              onChange={(e) => set_nombre_restaurant(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="standard-rest-capac"
              label="Capacidad"
              fullWidth
              type="number"
              value={capc_restaurant}
              onChange={(e) => set_capac_rest(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              value={activado}
              control={
                <Switch
                  checked={gilad}
                  onChange={(e) => set_state_gilad()}
                />
              }
              label={activado}
              labelPlacement="top"
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              style={{ color: "green", marginLeft: "1%" }}
              onClick={(e) => set_openDD(true)}
            >
              Agregar dirección y guardar
              <CheckCircleOutline
                style={{ fontSize: 30, marginLeft: "10px", color: "green" }}
              />
            </Button>
          </Grid>
        </Grid>      
        <br></br>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Restaurantes registrados
        </h3>
        <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell>Horario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetch_restaurants.map((element) => (
                <TableRow key={element.RestaurantID}>
                  <TableCell>{element.RestaurantID}</TableCell>
                  <TableCell>{element.RestaurantName}</TableCell>
                  <TableCell>{element.RestaurantCapacity}</TableCell>
                  <TableCell>
                    {element.RestaurantStatus ? "Activo" : "No activo"}
                  </TableCell>
                  <TableCell>
                    {new Date(
                          element.RestaurantCreationDate
                        ).toLocaleDateString()
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => set_open_DH(element.RestaurantID)}
                      children={
                        <ScheduleIcon
                          style={{
                            fontSize: 'inherit',
                            marginLeft: "8px",
                            color: "blue",
                          }}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => set_open_DU(element.RestaurantID, element.RestaurantName, 
                                                  element.RestaurantCapacity, element.RestaurantLatitude, 
                                                  element.RestaurantLongitude)}
                      children={
                        <EditIcon
                          style={{
                            fontSize: 'inherit',
                            marginLeft: "8px",
                            color: "green",
                          }}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {element.RestaurantStatus ? (
                      <IconButton
                        onClick={(e) =>
                          changeStateRest(element.RestaurantID, false)
                        }
                        children={
                          <DeleteOutline
                            style={{
                              fontSize: 'inherit',
                              marginLeft: "8px",
                              color: "red",
                            }}
                          />
                        }
                      />
                    ) : (
                      <IconButton
                        onClick={(e) =>
                          changeStateRest(
                            element.RestaurantID,
                            true
                          )
                        }
                        children={
                          <AddCircleIcon
                            style={{
                              fontSize: 'inherit',
                              marginLeft: "8px",
                              color: "green",
                            }}
                          />
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> 
    </TabPanel>
    <TabPanel value={value} index={1}>
        <Grid container className={classes.root} spacing={5}>
          <Grid item xs={3}>
          <Autocomplete
            id="controlled-combo-schedule"
            options={dayptions}
            getOptionLabel={option => option}
            value={daySelected}
            onChange={(event, newValue) => {
              setDaySelected(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Seleccione el día" variant="outlined" className={classes.input}/>}
          />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="time-open"
              label="Hora apertura"
              type="time"
              variant="standard"
              value={selectedDateOpen}
              onChange={(e) => setSelectedDateOpen(e.target.value)}
              defaultValue="07:00"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="time-close"
              label="Hora Cierre"
              type="time"
              variant="standard"
              onChange={(e) => setSelectedDateClose(e.target.value)}
              value={selectedDateClose}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              style={{ color: "green", marginLeft: "1%" }}
              onClick={(e) => saveSchedule()}
            >
              Guardar
              <CheckCircleOutline
                style={{ fontSize: 30, marginLeft: "10px", color: "green" }}
              />
            </Button>
          </Grid>
        </Grid>      
        <br></br>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Horarios registrados
        </h3>
        <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Día</TableCell>
                <TableCell>Hora Apertura</TableCell>
                <TableCell>Hora cierre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetch_schedules.map((element) => (
                <TableRow key={element.ScheduleID}>
                  <TableCell>{element.ScheduleID}</TableCell>
                  <TableCell>{element.ScheduleDay}</TableCell>
                  <TableCell>{element.ScheduleOpeningHour}</TableCell>
                  <TableCell>{element.ScheduleClosingHour}</TableCell>
                  <TableCell>
                  <IconButton
                      onClick={(e) => handleClick(e, element.ScheduleID)}
                      children={
                        <EditIcon
                          style={{
                            fontSize: 'inherit',
                            color: "red",
                          }}
                        />
                      }
                  />  
                  <Popover
                      id={id}
                      open={openP}
                      ref={componRef}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Typography>
                        Cambiar Horarios
                      </Typography>
                      <TextField
                        id="time-open-up"
                        label="Hora apertura"
                        type="time"
                        variant="standard"
                        onChange={(e) => setSelectedDateOpenUpdate(e.target.value)}
                        value={selectedDateOpenUpdate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />
                      <TextField
                        id="time-close-up"
                        label="Hora cierre"
                        type="time"
                        variant="standard"
                        onChange={(e) => setSelectedDateCloseUpdate(e.target.value)}
                        value={selectedDateCloseUpdate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />
                      <IconButton
                        onClick={updateSchedule}
                        children={
                          <EditIcon
                            style={{
                              fontSize: "inherit",
                              marginLeft: "2px",
                              color: "green",
                            }}
                          />
                        }
                      />
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> 
    </TabPanel>
    <Dialog
          open={openDH}
          onClose={set_close_DH}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="dialog-title-schedule" style={{ color: "red" }}>
            {"Asignación de Horarios"}
          </DialogTitle>
          <DialogContent>
          <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Día</TableCell>
                <TableCell>Hora Apertura</TableCell>
                <TableCell>Hora Cierre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetch_schedules.map((element) => (
                <TableRow key={element.ScheduleID}>
                  <TableCell>{element.ScheduleID}</TableCell>
                  <TableCell>{element.ScheduleDay}</TableCell>
                  <TableCell>{element.ScheduleOpeningHour}</TableCell>
                  <TableCell>{element.ScheduleClosingHour}</TableCell>
                  <TableCell>
                  {scheduleFromRest.length > 0 ? (
                          scheduleFromRest.includes(element.ScheduleID) ? (
                            <IconButton
                              onClick={(e) => scheduleRestaurant(element.ScheduleID,false)}
                              children={
                                <CheckBoxIcon
                                  style={{ fontSize: 25, marginLeft: "5px" }}
                                />
                              }
                            />
                          ) : (
                            <IconButton
                              onClick={(e) => scheduleRestaurant(element.ScheduleID,true)}
                              children={
                                <CheckBoxOutlineBlankIcon
                                  style={{ fontSize: 25, marginLeft: "5px" }}
                                />
                              }
                            />
                          )
                        ) : (
                          <IconButton
                            onClick={(e) => scheduleRestaurant(element.ScheduleID,true)}
                            children={
                              <CheckBoxOutlineBlankIcon
                                style={{ fontSize: 25, marginLeft: "5px" }}
                              />
                            }
                          />
                        )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </DialogContent>
          <DialogActions>
          <Button onClick={set_close_DH} color="primary">
                 Cerrar
          </Button>
          </DialogActions>
    </Dialog>
    <Dialog
          open={openDU}
          onClose={set_close_DU}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="dialog-title-up-res" style={{ color: "red" }}>
            {"Modificar restaurante"}
          </DialogTitle>
          <DialogContent>
          <Grid container className={classes.root} spacing={5}>
            <Grid item xs={6}>
              <TextField
                id="standard-text-rest-nom-up"
                label="Nombre del restaurante"
                fullWidth
                value={nombre_restaurant}
                onChange={(e) => set_nombre_restaurant(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-rest-capac-up"
                label="Capacidad"
                fullWidth
                type="number"
                value={capc_restaurant}
                onChange={(e) => set_capac_rest(e.target.value)}
              />
            </Grid>
          </Grid>
          <SearchLocation/>
          </DialogContent>
          <DialogActions>
          <Button onClick={set_close_DU} color="primary">
                 Regresar
          </Button>
            <Button
              onClick={() => performUpdate()}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Cambiar
            </Button>
          </DialogActions>
    </Dialog>
    <Dialog
          open={openDD}
          onClose={() => set_openDD(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="dialog-title-dir-res" style={{ color: "red" }}>
            {"Seleccionar Dirección"}
          </DialogTitle>
          <DialogContent>
            <SearchLocation/>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => set_openDD(false)} color="primary">
                 Regresar
          </Button>
            <Button
              onClick={() => performSave()}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
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

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' a.m.' : ' p.m.'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}