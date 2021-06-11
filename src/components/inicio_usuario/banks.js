import React, { useState, Fragment, useEffect } from "react";
import {
  TextField,
  Grid,
  IconButton,
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
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Done from "@material-ui/icons/Done";


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

export default function Banks() {
    const classes = useStyles();
  const [fetch_bancos, set_fetch_bancos] = useState([]);
  const [nombre_banco, set_nombre_banco] = useState("");
  const [nombre_banco_temp, set_nombre_banco_temp] = useState([]);
  const [cargando, set_cargando] = useState(false);
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [activado, set_activado] = useState("Activo");
  const [gilad, set_gilad] = useState(true);
  const vertical = "top";
  const horizontal = "right";  

  const set_state_gilad = () => {
    set_gilad(!gilad);
    set_activado(!gilad ? "Activo" : "No activo");
  };

  const add_banco = () => {
    let temp_bancos = nombre_banco_temp;
    temp_bancos.filter((x) => x.BankID === nombre_banco).length === 0
      ? temp_bancos.push({
          BankID: nombre_banco,
          BankStatus: gilad,
        })
      : set_error_message("Ya se ha creado este perfil");
    set_nombre_banco_temp(temp_bancos);
    set_nombre_banco("");
    set_gilad(true);
    set_cargando(true);
  };

  const eliminar_banco_temp = (value) => {
    let temp = nombre_banco_temp;
    console.log(value);
    for (let i = 0; i < temp.length; i++) {
      if (value === temp[i].BankID) {
        temp.splice(i, 1);
      }
    }
    set_nombre_banco_temp(temp);
    set_cargando(false);
  };

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllBanks", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_bancos(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const refresh = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllBanks", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.length > 0) {
              set_fetch_bancos(response);
          }
        })
        .catch((error) => {
          alert(error);
        });
  }

  const guardar_banco = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "createBank", {
      method: "POST",
      body: JSON.stringify(nombre_banco_temp[0]),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
            set_error_message("Error en la creación: " + response.error);
            set_error(true);
        }else{
            set_success_message("Banco agregado con éxito");
            set_success(true);
            set_nombre_banco_temp([]);
            set_nombre_banco("");
            refresh();
        }  
      })
      .catch((err) => {
          alert("Error con el servidor: "+err);
      });
  };

  const update_banco = (valueId, status) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateBank", {
      method: "POST",
      body: JSON.stringify({
        BankID: valueId,
        BankStatus: status
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        refresh();
        set_success_message("Banco cambiado con éxito");
        set_success(true);
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor " + err);
      });
  };


    return(
        <Fragment>
            <Grid container className={classes.root} spacing={5}>
            <Grid item xs={6}>
                <TextField
                id="standard-textarea-bank"
                label="Nombre del banco"
                disabled={cargando}
                fullWidth
                value={nombre_banco}
                onChange={(e) => set_nombre_banco(e.target.value)}
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
                onClick={(e) => add_banco()}
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
            Banco a guardar
            </h3>
            <TableContainer component={Paper} style={{ width: "100%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Nombre del Banco</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {nombre_banco_temp.map((element) => (
                    <TableRow key={element.bancoName}>
                    <TableCell>{element.BankID}</TableCell>
                    <TableCell>
                        {element.BankStatus ? "Activo" : "No activo"}
                    </TableCell>
                    <TableCell>
                        <IconButton
                        onClick={(e) =>
                            eliminar_banco_temp(element.BankID)
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
                onClick={(e) => guardar_banco()}
            >
                REGISTRAR BANCO
            </Button>
            </div>
            <br></br>
            <h3 style={{ textAlign: "center", color: "gray" }}>
            Bancos registrados
            </h3>
            <TableContainer component={Paper} style={{ width: "97%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>BankID</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {fetch_bancos.map((element) => (
                    <TableRow key={element.BankID}>
                    <TableCell>{element.BankID}</TableCell>
                    <TableCell>
                        {element.BankStatus ? "Activo" : "No activo"}
                    </TableCell>
                    <TableCell>
                        {element.BankStatus ? (
                        <IconButton
                            onClick={(e) =>
                                update_banco(element.BankID, false)
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
                                update_banco(element.BankID, true)
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