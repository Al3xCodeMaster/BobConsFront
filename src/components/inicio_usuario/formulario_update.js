import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from "react-redux";
import {
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

export default function Formulario_update_usuario() {
  const classes = useStyles();
  const vertical = "top";
  const horizontal = "right";
  const [open, setOpen] = React.useState(false);
  const [open_success, set_open_sucess] = React.useState(false);
  const [message, set_message] = React.useState("");
  const [message_success, set_message_success] = React.useState("");
  const { id, username , apellidoUser, emailUser, access, usuario} = useSelector((state) => ({
    usuario: state.redux_reducer.usuario,
    id: state.redux_reducer.usuario.userInfo.id,
    username: state.redux_reducer.usuario.userInfo.username,
    apellidoUser: state.redux_reducer.usuario.userInfo["last name"],
    emailUser: state.redux_reducer.usuario.userInfo.email,
    access: state.redux_reducer.usuario.userInfo.access
  }));
  const [name, set_state_name] = React.useState(username)
  const [apellido, set_state_apellido] = React.useState(apellidoUser)
  const [email, set_state_email] = React.useState(emailUser)
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSucess = () => {
    set_open_sucess(false);
  };
  const comprobar_info = () => {
    let status = false
    if (name.length === 0) {
      set_message("El name no puede estar vacio");
      setOpen(true);
      status = true
    } else if (apellido.length === 0) {
      set_message("El apellido no puede estar vacio");
      setOpen(true);
      status = true
    } else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      set_message("El email debe de ser valido");
      setOpen(true);
      status = true
    }

    return status
  };

  const subir_formulario = () => {
      
      let status = comprobar_info();
      if(status){
        return
      }
      fetch("https://bobcons.herokuapp.com/api/appUser/"+id+"/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access,
        },
        body: JSON.stringify({
          user_name: name,
          last_name: apellido,
          email: email
        }), // data can be `string` or {object}!
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((response) => {
          if (status != 200) {
            set_message("No se realizo la operación: " + response.error);
            setOpen(true);
          } else {
            set_message_success("Hecho");
            dispatch(
              success_login(
                {
                   ...usuario.userInfo,
                    username: name,
                    ["last name"]: apellido,
                    email: email,
                },
                200
              )
            );
            set_open_sucess(true);
          }
        })
        .catch((error) => {
          alert(error);
        });
  }
  
  return (
    <div className={classes.root}>
      <div style={{ justifyContent: "center", alignItems: "center" }}>
      <Grid container className={classes.rootContainer} spacing={4}>
        <Grid item xs={12}>
          <TextField
            id="usuario_name"
            value={name}
            onChange={(e) => set_state_name(e.target.value)}
            className={classes.input}
            label="name"
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
        <TextField
            id="email"
            value={email}
            onChange={(e) => set_state_email(e.target.value)}
            className={classes.input}
            label="email"
            variant="outlined"
          /> 
        </Grid>
        <Button onClick={subir_formulario} color="primary">
                  Guardar cambios
        </Button>
      </Grid>
    </div>
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
      
    </div>
  );
}
