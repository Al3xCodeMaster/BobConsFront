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
import { useSelector, useDispatch} from "react-redux";

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
  const [fetch_materials, set_fetch_materials] = useState([]);
  const [nit, set_nit] = useState("");
  const [sup_temp, set_sup_temp] = useState([]);
  const [sup_email, set_mail] = useState("");
  const [sup_phone, set_phone] = useState("");
  const [cargando, set_cargando] = useState(false);
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const vertical = "top";
  const horizontal = "right";  
  const { usuario, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    access: state.redux_reducer.usuario.userInfo.access
  }));

  const add_material = () => {
    let temp_material = sup_temp;
    temp_material.filter((x) => x.nit === nit).length === 0
      ? temp_material.push({
          nit: nit,
          email: sup_email,
          phone: sup_phone
        })
      : set_error_message("Este supplier esta siendo creado");
      set_sup_temp(temp_material);
    set_nit("");
    set_mail("");
    set_phone("");
    set_cargando(true);
  };

  const eliminar_sup_temp = (value) => {
    let temp = sup_temp;
    for (let i = 0; i < temp.length; i++) {
      if (value === temp[i].nit) {
        temp.splice(i, 1);
      }
    }
    set_sup_temp(temp);
    set_cargando(false);
  };

  useEffect(() => {
    fetch("https://bobcons.herokuapp.com/api/supplierGET/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_materials(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const refresh = () => {
    fetch("https://bobcons.herokuapp.com/api/supplierGET/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_materials(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  const save_sup = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/supplier/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        supplier_nit: sup_temp[0].nit,
        supplier_email: sup_temp[0].email,
        supplier_phone: sup_temp[0].phone
      }),
    })
      .then((res) => {
        status = res.status;
        res.json();
      })
      .then((response) => {
        if(status != 200){
            set_error_message("Error en la creación: " + response.details);
            set_error(true);
        }else{
            set_success_message("Supplier agregado con éxito");
            set_success(true);
            set_cargando(false);
            set_sup_temp([]);
            set_nit("");
            set_mail("");
            set_phone("");
            refresh();
        }  
      })
      .catch((err) => {
          alert("Error con el servidor: "+err);
      });
  };

  const update_sup = (obj, status) => {
    let statusUp;
    fetch("https://bobcons.herokuapp.com/api/supplier/"+obj.supplier_nit+"/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        supplier_nit: obj.supplier_nit,
        supplier_email: obj.supplier_email,
        supplier_phone: obj.supplier_phone,
        supplier_status: status
      }),
    })
      .then((res) => {
        statusUp = res.status;
        res.json();})
      .then((response) => {
        if (statusUp!=200) {
          set_error(true);
          set_error_message("Error: " + response.details);
          return;
        }
        refresh();
        set_success_message("Proveedor cambiado con éxito");
        set_success(true);
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor " + err);
      });
  };


    return(
        <Fragment>
            <Grid container className={classes.root} spacing={5}>
            <Grid item xs={3}>
                <TextField
                id="standard-textarea-supplier-nit"
                label="Nit proveedor"
                disabled={cargando}
                fullWidth
                value={nit}
                onChange={(e) => set_nit(e.target.value)}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-textarea-email"
                    label="Correo"
                    disabled={cargando}
                    fullWidth
                    value={sup_email}
                    onChange={(e) => set_mail(e.target.value)}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-textarea-supplier-phone"
                    label="Telefono"
                    disabled={cargando}
                    fullWidth
                    value={sup_phone}
                    onChange={(e) => set_phone(e.target.value)}
                />
            </Grid>
            <Grid item xs={4}>
                <Button
                disabled={cargando}
                style={{ color: "green", marginLeft: "1%" }}
                onClick={(e) => add_material()}
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
            Proveedor a Guardar
            </h3>
            <TableContainer component={Paper} style={{ width: "100%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Nit</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Telefono</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {sup_temp.map((element) => (
                    <TableRow key={element.nit}>
                    <TableCell>{element.nit}</TableCell>
                    <TableCell>
                        {element.email}
                    </TableCell>
                    <TableCell>
                        {element.phone}
                    </TableCell>
                    <TableCell>
                        <IconButton
                        onClick={(e) =>
                          eliminar_sup_temp(element.nit)
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
                onClick={(e) => save_sup()}
            >
                REGISTRAR PROVEEDOR
            </Button>
            </div>
            <br></br>
            <h3 style={{ textAlign: "center", color: "gray" }}>
            Proveedores creados
            </h3>
            <TableContainer component={Paper} style={{ width: "97%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Nit</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Telefono</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {fetch_materials.map((element) => (
                    <TableRow key={element.supplier_nit}>
                    <TableCell>{element.supplier_nit}</TableCell>
                    <TableCell>{element.supplier_email}</TableCell>
                    <TableCell>{element.supplier_phone}</TableCell>
                    <TableCell>
                        {element.supplier_status ? "Activo" : "No activo"}
                    </TableCell>
                    <TableCell>
                        {element.supplier_status ? (
                        <IconButton
                            onClick={(e) =>
                                update_sup(element, false)
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
                                update_sup(element, true)
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