import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Done from "@material-ui/icons/Done";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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
}));

export default function Perfiles() {
  const classes = useStyles();
  const [fetch_profiles, set_fetch_profiles] = useState([]);
  const [nombre_profile, set_nombre_profile] = useState("");
  const [nombre_profile_temp, set_nombre_profile_temp] = useState([]);
  const [cargando, set_cargando] = useState(false);
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [activado, set_activado] = useState("Activo");
  const [gilad, set_gilad] = useState(true);
  const [value, setValue] = React.useState(0);
  const [nombre_profile_to_change, set_nombre_profile_to_change] = useState("");
  const vertical = "top";
  const horizontal = "right";
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [valueId, set_valueId] = useState(0);
  const componRef = React.useRef();
  const [id_doc, set_id_doc] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [id_type, set_id_type] = useState("");
  const [user_cargado, set_user_cargado] = useState([]);
  const [profiles_from_user, set_prof_from_user] = useState([]);
  const [user_temp, set_user_temp] = useState({});

  const set_state_type_id = (value) => {
    set_id_type(value);
  };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllDocuments", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((items) => {
        if (active) {
          setOptions(items.map((x) => x.DocumentTypeID));
        }
      })
      .catch((err) => console.log(err));
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleClick = (event, valueId) => {
    set_valueId(valueId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openP = Boolean(anchorEl);
  const id = openP ? "simple-popover" : undefined;

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

  const add_profile = () => {
    let temp_profiles = nombre_profile_temp;
    temp_profiles.filter((x) => x.ProfileName === nombre_profile).length === 0
      ? temp_profiles.push({
          ProfileName: nombre_profile,
          ProfileStatus: gilad,
        })
      : set_error_message("Ya se ha creado este perfil");
    set_nombre_profile_temp(temp_profiles);
    set_nombre_profile("");
    set_gilad(true);
    set_cargando(true);
  };

  const eliminar_profile_temp = (value) => {
    let temp = nombre_profile_temp;
    console.log(value);
    for (let i = 0; i < temp.length; i++) {
      if (value === temp[i].ProfileName) {
        temp.splice(i, 1);
      }
    }
    set_nombre_profile_temp(temp);
    set_cargando(false);
  };

  const borrar_perfil = (valueId, valueName) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProfile", {
      method: "POST",
      body: JSON.stringify({
        ProfileID: parseInt(valueId),
        ProfileName: valueName,
        ProfileStatus: false,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        set_fetch_profiles(response);
        set_success(true);
        set_success_message("Perfil cambiado con éxito");
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  const reactivar_perfil = (valueId, valueName) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProfile", {
      method: "POST",
      body: JSON.stringify({
        ProfileID: parseInt(valueId),
        ProfileName: valueName,
        ProfileStatus: true,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        set_fetch_profiles(response);
        set_success(true);
        set_success_message("Perfil cambiado con éxito");
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  const guardar_perfil = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "createProfile", {
      method: "POST",
      body: JSON.stringify(nombre_profile_temp[0]),
    })
      .then((res) => res.json())
      .then((response) => {
        set_success(true);
        set_success_message("Perfil agregado con éxito");
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllProfiles", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          set_fetch_profiles(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const cambiar_nom_perfil = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProfile", {
      method: "POST",
      body: JSON.stringify({
        ProfileID: parseInt(valueId),
        ProfileName: nombre_profile_to_change,
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
        set_success_message("Perfil cambiado con éxito");
        if (response.length > 0) {
          set_fetch_profiles(response);
        }
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  const buscar_id = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getUser/" + id_type + "/" + id_doc, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        set_user_cargado([response]);
        set_user_temp(response);
        getProfilesFromUser(id_type, id_doc);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const getProfilesFromUser = (id_type, id_doc) => {
    fetch(
      (process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllUserProfiles/" + id_type + "/" + id_doc,
      {
        method: "GET",
      }
    )
      .then((res) => (res.status == 204 ? [] : res.json()))
      .then((response) => {
        if (response.length > 0) {
          set_prof_from_user(
            response.map((element) => {
              return element.ProfileID;
            })
          );
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const quitar_perfil = (valueId) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProfileUser", {
      method: "POST",
      body: JSON.stringify({
        ProfileID: parseInt(valueId),
        RestaurantUserID: user_temp.RestaurantUserID,
        DocumentTypeID: user_temp.DocumentTypeID,
        UserProfileStatus: false,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        buscar_id();
        set_success(true);
        set_success_message("Perfil borrado con éxito");
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

  const asignar_perfil = (valueId) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "assignProfileToUser", {
      method: "POST",
      body: JSON.stringify({
        ProfileID: parseInt(valueId),
        RestaurantUserID: user_temp.RestaurantUserID,
        DocumentTypeID: user_temp.DocumentTypeID,
        UserProfileStatus: true,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        buscar_id();
        set_success(true);
        set_success_message("Perfil asignado con éxito");
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexión con el servidor " + err);
      });
  };

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
          <Tab label="Crear Perfil" {...a11yProps(0)} />
          <Tab label="Asignar Perfil" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container className={classes.root} spacing={5}>
          <Grid item xs={6}>
            <TextField
              id="standard-textarea"
              label="Nombre del perfil"
              disabled={cargando}
              fullWidth
              value={nombre_profile}
              onChange={(e) => set_nombre_profile(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              value={activado}
              control={
                <Switch
                  disabled={cargando}
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
              disabled={cargando}
              style={{ color: "green", marginLeft: "1%" }}
              onClick={(e) => add_profile()}
            >
              Agregar
              <CheckCircleOutline
                style={{ fontSize: 30, marginLeft: "10px", color: "green" }}
              />
            </Button>
          </Grid>
        </Grid>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          {" "}
          Perfil a guardar
        </h3>
        <TableContainer component={Paper} style={{ width: "100%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre del perfil</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nombre_profile_temp.map((element) => (
                <TableRow key={element.ProfileName}>
                  <TableCell>{element.ProfileName}</TableCell>
                  <TableCell>
                    {element.ProfileStatus ? "Activo" : "No activo"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) =>
                        eliminar_profile_temp(element.ProfileName)
                      }
                      children={
                        <DeleteOutline
                          style={{
                            fontSize: 25,
                            marginLeft: "8px",
                            color: "red",
                          }}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: "center", marginTop: "4%" }}>
          <Button
            style={{ color: "white", backgroundColor: "green" }}
            variant="contained"
            endIcon={<Done />}
            onClick={(e) => guardar_perfil()}
          >
            REGISTRAR PERFIL
          </Button>
        </div>
        <br></br>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Perfiles registrados
        </h3>
        <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetch_profiles.map((element) => (
                <TableRow key={element.ProfileID}>
                  <TableCell>{element.ProfileID}</TableCell>
                  <TableCell>{element.ProfileName}</TableCell>
                  <TableCell>
                    {element.ProfileStatus ? "Activo" : "No activo"}
                  </TableCell>
                  <TableCell>
                    {new Date(
                          element.ProfileCreationDate
                        ).toLocaleDateString()
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleClick(e, element.ProfileID)}
                      children={
                        <EditIcon
                          style={{
                            fontSize: 25,
                            marginLeft: "8px",
                            color: "green",
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
                      <Typography className={classes.typography}>
                        Cambiar nombre perfil
                      </Typography>
                      <TextField
                        id="cambio-perfil"
                        label="Nuevo nombre"
                        fullWidth
                        value={nombre_profile_to_change}
                        onChange={(e) =>
                          set_nombre_profile_to_change(e.target.value)
                        }
                      />
                      <IconButton
                        onClick={cambiar_nom_perfil}
                        children={
                          <CheckIcon
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
                  <TableCell>
                    {element.ProfileStatus ? (
                      <IconButton
                        onClick={(e) =>
                          borrar_perfil(element.ProfileID, element.ProfileName)
                        }
                        children={
                          <DeleteOutline
                            style={{
                              fontSize: 25,
                              marginLeft: "8px",
                              color: "red",
                            }}
                          />
                        }
                      />
                    ) : (
                      <IconButton
                        onClick={(e) =>
                          reactivar_perfil(
                            element.ProfileID,
                            element.ProfileName
                          )
                        }
                        children={
                          <AddCircleIcon
                            style={{
                              fontSize: 25,
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
          <Grid item xs={6}>
            <TextField
              id="standard-txt"
              label="Nombre del perfil"
              fullWidth
              type="number"
              value={id_doc}
              onChange={(e) => set_id_doc(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={3}>
          <Autocomplete
						id="async-autocompl"
						open={open}
						onOpen={() => {
							setOpen(true);
						}}
						onClose={() => {
							setOpen(false);
						}}
						getOptionSelected={(option, value) => option === value}
						onChange={(event, newValue) => {
							set_state_type_id(newValue);
						}}
						getOptionLabel={(option) => option}
						options={options}
						loading={loading}
						renderInput={(params) => (
							<TextField 
								{...params}
								className={classes.input}
								label="Seleccione el documento"
								variant="outlined"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{loading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									),
								}}
							/>
						)}
			    />
          </Grid>
          <Grid item xs={2}>
            <Button style={{ marginLeft: "1%" }} onClick={buscar_id}>
              <SearchIcon style={{ fontSize: 30, marginLeft: "10px" }} />
            </Button>
          </Grid>
        </Grid>
        <h3 style={{ textAlign: "center", color: "gray" }}></h3>
        <TableContainer component={Paper} style={{ width: "100%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Num. Documento</TableCell>
                <TableCell>Nombre </TableCell>
                <TableCell>Apellido </TableCell>
                <TableCell> Estado </TableCell>
                <TableCell>Fecha de creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user_cargado.map((element) => (
                <TableRow key={element.RestaurantUserID}>
                  <TableCell>{element.RestaurantUserID}</TableCell>
                  <TableCell>{element.RestaurantUserName}</TableCell>
                  <TableCell>{element.RestaurantUserLastname}</TableCell>
                  <TableCell>
                    {element.RestaurantUserStatus ? "Activo" : "No activo"}
                  </TableCell>
                  <TableCell>
                    {
                      new Date(
                          element.RestaurantUserCreationDate
                        ).toLocaleDateString()
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br></br>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Perfiles Asignados
        </h3>
        <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell>Asignado/Asignar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user_cargado.length > 0
                ? fetch_profiles.map((element) => (
                    <TableRow key={element.ProfileID}>
                      <TableCell>{element.ProfileID}</TableCell>
                      <TableCell>{element.ProfileName}</TableCell>
                      <TableCell>
                        {element.ProfileStatus ? "Activo" : "No activo"}
                      </TableCell>
                      <TableCell>
                          {new Date(
                              element.ProfileCreationDate
                            ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {profiles_from_user.length > 0 ? (
                          profiles_from_user.includes(element.ProfileID) ? (
                            <IconButton
                              onClick={(e) => quitar_perfil(element.ProfileID)}
                              children={
                                <CheckBoxIcon
                                  style={{ fontSize: 25, marginLeft: "5px" }}
                                />
                              }
                            />
                          ) : (
                            <IconButton
                              onClick={(e) => asignar_perfil(element.ProfileID)}
                              children={
                                <CheckBoxOutlineBlankIcon
                                  style={{ fontSize: 25, marginLeft: "5px" }}
                                />
                              }
                            />
                          )
                        ) : (
                          <IconButton
                            onClick={(e) => asignar_perfil(element.ProfileID)}
                            children={
                              <CheckBoxOutlineBlankIcon
                                style={{ fontSize: 25, marginLeft: "5px" }}
                              />
                            }
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
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
