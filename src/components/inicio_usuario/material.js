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
  const [mat_temp, set_mat_temp] = useState([]);
  const [mat_name, set_name] = useState("");
  const [mat_und, set_und] = useState("");
  const [detail, set_detail] = useState("");
  const [cargando, set_cargando] = useState(false);
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [activado, set_activado] = useState("Activo");
  const [gilad, set_gilad] = useState(true);
  const vertical = "top";
  const horizontal = "right";  
  const { usuario, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    access: state.redux_reducer.usuario.userInfo.access
  }));

  const add_material = () => {
    let temp_material = mat_temp;
    temp_material.filter((x) => x.nit === nit).length === 0
      ? temp_material.push({
          nit: nit,
          name: mat_name,
          und: mat_und,
          detail: detail
        })
      : set_error_message("Este material ya fue creado");
      set_mat_temp(temp_material);
    set_nit("");
    set_name("");
    set_und("");
    set_detail("");
    set_cargando(true);
  };

  const eliminar_material_temp = (value) => {
    let temp = mat_temp;
    for (let i = 0; i < temp.length; i++) {
      if (value === temp[i].nit) {
        temp.splice(i, 1);
      }
    }
    set_mat_temp(temp);
    set_cargando(false);
  };

  useEffect(() => {
    fetch("https://bobcons.herokuapp.com/api/materialGET/", {
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
    fetch("https://bobcons.herokuapp.com/api/materialGET/", {
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

  const save_material = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/material/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        supplier_nit: mat_temp[0].nit,
        material_name: mat_temp[0].name,
        material_und: mat_temp[0].und,
        material_detail: mat_temp[0].detail
      }),
    })
      .then((res) => {
        status = res.status;
        res.json();
      })
      .then((response) => {
        if(status != 200){
            set_error_message("Error en la creación: " + response.error);
            set_error(true);
        }else{
            set_success_message("Material agregado con éxito");
            set_success(true);
            set_mat_temp([]);
            set_nit("");
            set_name("");
            set_und("");
            set_detail("");
            refresh();
        }  
      })
      .catch((err) => {
          alert("Error con el servidor: "+err);
      });
  };

  const update_material = (obj, status) => {
    let statusUp;
    fetch("https://bobcons.herokuapp.com/api/material/"+obj.material_id+"/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        material_id: obj.material_id,
        supplier_nit: obj.supplier_nit,
        material_name: obj.material_name,
        material_und: obj.material_und,
        material_detail: obj.material_detail,
        material_status: status
      }),
    })
      .then((res) => {
        statusUp = res.status;
        res.json();})
      .then((response) => {
        if (statusUp != 200) {
          set_error(true);
          set_error_message("Error: " + response.details);
          return;
        }
        refresh();
        set_success_message("Material cambiado con éxito");
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
                id="standard-textarea-material-nit"
                label="Nit proveedor"
                disabled={cargando}
                fullWidth
                value={nit}
                onChange={(e) => set_nit(e.target.value)}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-textarea-material-name"
                    label="Nombre del material"
                    disabled={cargando}
                    fullWidth
                    value={mat_name}
                    onChange={(e) => set_name(e.target.value)}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-textarea-material-und"
                    label="Unidad"
                    disabled={cargando}
                    fullWidth
                    value={mat_und}
                    onChange={(e) => set_und(e.target.value)}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-textarea-material-detail"
                    label="Detalle"
                    disabled={cargando}
                    multiline
                    rows={1}
                    fullWidth
                    value={detail}
                    onChange={(e) => set_detail(e.target.value)}
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
            Material a Guardar
            </h3>
            <TableContainer component={Paper} style={{ width: "100%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Nit material</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>UND</TableCell>
                    <TableCell>Detalle</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {mat_temp.map((element) => (
                    <TableRow key={element.nit}>
                    <TableCell>{element.nit}</TableCell>
                    <TableCell>
                        {element.name}
                    </TableCell>
                    <TableCell>
                        {element.und}
                    </TableCell>
                    <TableCell>
                        {element.detail}
                    </TableCell>
                    <TableCell>
                        <IconButton
                        onClick={(e) =>
                          eliminar_material_temp(element.nit)
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
                onClick={(e) => save_material()}
            >
                REGISTRAR MATERIAL
            </Button>
            </div>
            <br></br>
            <h3 style={{ textAlign: "center", color: "gray" }}>
            Materiales creados
            </h3>
            <TableContainer component={Paper} style={{ width: "97%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Nit material</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>UND</TableCell>
                    <TableCell>Detalle</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {fetch_materials.map((element) => (
                    <TableRow key={element.supplier_nit}>
                    <TableCell>{element.supplier_nit}</TableCell>
                    <TableCell>{element.material_name}</TableCell>
                    <TableCell>{element.material_und}</TableCell>
                    <TableCell>{element.material_detail}</TableCell>
                    <TableCell>
                        {element.material_status ? "Activo" : "No activo"}
                    </TableCell>
                    <TableCell>
                        {element.material_status ? (
                        <IconButton
                            onClick={(e) =>
                                update_material(element, false)
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
                                update_material(element, true)
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