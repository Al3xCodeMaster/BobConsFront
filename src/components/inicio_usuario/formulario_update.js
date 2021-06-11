import React, { useState } from "react";
import Search_location from "../mapas/search_location";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useSelector, useDispatch } from "react-redux";
import {
  set_nombre,
  set_apellido,
  set_date,
  success_login,
} from "../../redux/actions";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  rootContainer: {
    flexGrow: 1,
  },
  button: {
    marginRight: theme.spacing(1),
    background: "green",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  input: {
    width: "95%",
    margin: "1%",
  },
  table: {
    minWidth: 650,
  },
  container_root: {
    flexGrow: 1,
    marginTop: "3%",
    marginLeft: "1%",
    marginBottom: "3%",
  },
}));

function getSteps() {
  return ["Información básica", "Dirección"];
}
function Informacion_basica() {
  const classes = useStyles();
  const { nombre, apellido, datePick } = useSelector((state) => ({
    nombre: state.redux_reducer.usuario.nombre,
    apellido: state.redux_reducer.usuario.apellido,
    datePick: state.redux_reducer.datePick,
  }));
  const dispatch = useDispatch();

  const set_state_nombre = (value) => {
    dispatch(set_nombre(value));
  };
  const set_state_apellido = (value) => {
    dispatch(set_apellido(value));
  };

  const handleDateChange = (value) => {
    dispatch(set_date(value));
  };

  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <Grid container className={classes.rootContainer} spacing={4}>
        <Grid item xs={12}>
          <TextField
            id="usuario_nombre"
            value={nombre}
            onChange={(e) => set_state_nombre(e.target.value)}
            className={classes.input}
            label="Nombre"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="usuario_apellido"
            value={apellido}
            onChange={(e) => set_state_apellido(e.target.value)}
            className={classes.input}
            label="Apellido"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={11}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableFuture
			        fullWidth
              margin="normal"
              id="date-picker-birthday-user"
              label="Fecha de nacimiento"
              format="yyyy/MM/dd"
              value={datePick}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "Cambiar fecha",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
    </div>
  );
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Informacion_basica />;
    case 1:
      return <Search_location />;
    default:
      return <h1>Unknown</h1>;
  }
}

export default function Formulario_update_usuario() {
  const classes = useStyles();
  const vertical = "top";
  const horizontal = "right";
  const [open, setOpen] = React.useState(false);
  const [open_success, set_open_sucess] = React.useState(false);
  const [message, set_message] = React.useState("");
  const [message_success, set_message_success] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  const { usuario, coordenadas, datePick } = useSelector((state) => ({
    usuario: state.redux_reducer.usuario,
    coordenadas: state.redux_reducer.coordenadas,
    datePick: state.redux_reducer.datePick,
  }));
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSucess = () => {
    set_open_sucess(false);
  };
  const comprobar_info = () => {
    if (usuario.nombre.length === 0) {
      set_message("el nombre no puede estar vacio");
      setOpen(true);
    } else if (usuario.apellido.length === 0) {
      set_message("el apellido no puede estar vacio");
      setOpen(true);
    } else {
      setOpen(false);
      handleNext();
    }
  };
  const subir_formulario = () => {
    if (
      !Number(usuario.id) ||
      usuario.nombre.length === 0 ||
      usuario.apellido.length === 0
    ) {
      if (usuario.nombre.length === 0) {
        set_message("el nombre no puede estar vacio");
      }
      if (usuario.apellido.length === 0) {
        set_message("el apellido no puede estar vacio");
      }
      setOpen(true);
    } else {
      let status;
      setOpen(false);
      fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateUser", {
        method: "POST",
        body: JSON.stringify({
          RestaurantUserID: parseInt(usuario.id),
          RestaurantUserName: usuario.nombre,
          RestaurantUserLastname: usuario.apellido,
          RestaurantUserLatitude: parseFloat(coordenadas.lat),
          RestaurantUserLongitude: parseFloat(coordenadas.lng),
          RestaurantUserBirthdate: datePick,
          DocumentTypeID: usuario.tipoId,
        }), // data can be `string` or {object}!
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((response) => {
          if (status === 400) {
            set_message("No se realizo la operación: " + response.error);
            setOpen(true);
          } else {
            set_message_success("Hecho");
            dispatch(
              success_login(
                {
                  Payload: {
                    ...usuario.userInfo.Payload,
                    UserName: usuario.nombre,
                    LastName: usuario.apellido,
                    Birthdate: datePick,
                  },
                  Message: "Ingreso Realizado!",
                },
                200
              )
            );
            set_open_sucess(true);
            handleReset();
            dispatch(set_nombre(""));
            dispatch(set_apellido(""));
            dispatch(set_date(datePick));
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={open_success}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleCloseSucess} severity="success">
          {message_success}
        </Alert>
      </Snackbar>
      <div style={{ bottom: "0", width: "100%" }}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              handleReset
            </Button>
          </div>
        ) : (
          <div>
            <div className={classes.instructions}>
              {getStepContent(activeStep) || <h1>Unknown</h1>}
            </div>
            <div style={{ textAlign: "center", marginTop: "8%" }}>
              <Button
                style={{ color: "gray" }}
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Regresar
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => subir_formulario()}
                  style={{
                    marginLeft: "5%",
                    color: "white",
                    background: "green",
                  }}
                >
                  Finalizar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={(e) => comprobar_info()}
                  style={{
                    marginLeft: "5%",
                    color: "white",
                    background: "green",
                  }}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
