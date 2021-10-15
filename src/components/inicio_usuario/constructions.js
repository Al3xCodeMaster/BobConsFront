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
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Done from "@material-ui/icons/Done";
import { useSelector, useDispatch} from "react-redux";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {Dialog, DialogTitle, DialogActions, DialogContent, FormControlLabel, Switch} from "@material-ui/core";

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
  const [fetch_constructors, set_fetch_constructors] = useState([]);
  const [client_id, set_client_id] = useState("");
  const [constructor_temp, set_constructor_temp] = useState([]);
  const [cargando, set_cargando] = useState(false);
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const vertical = "top";
  const horizontal = "right";
  const [options, setOptions] = useState([]);
	const [open, setOpen] = useState(false);
  const [openD, setOpenD] = React.useState(false);
  const [openDStock, setOpenDStock] = React.useState(false);
	const loading = open && options.length === 0;
  const [selectedDateOne, setSelectedDateOne] = React.useState(new Date(Date.now()));
  const [selectedDateTwo, setSelectedDateTwo] = React.useState(new Date(Date.now()));
  const [selectedDateThree, setSelectedDateThree] = React.useState(new Date(Date.now()));
  const [constID, setConstID] = React.useState("");
  const [valueState, setValueState] = React.useState("ACTIVO");
  const [amount, setAmount] = React.useState(0);
  const [optionsMat, setOptionsMat] = useState([]);
  const [openStock, setOpenStock] = useState(false);
  const loadingStock = openStock && optionsMat.length === 0;
  const [idMat, setIdMat] = React.useState("");
  const [cons_name, setConsName] = React.useState("");  
  const { usuario, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    access: state.redux_reducer.usuario.userInfo.access
  }));

  const handleClickPlus = (item) => {
    setConstID(item.construction_id);
    setOpenDStock(true);
  }

  const handleClickPlusClose = () => {
    setOpenDStock(false);
  }

  const handleClick = (item) => {
    setSelectedDateThree(new Date(item.construction_final_date));
    setConstID(item.construction_id);
    setOpenD(true);
  }

  const handleClose = () => {
    setOpenD(false);
  };

  const handleDateChangeOne = (date) => {
    setSelectedDateOne(date);
  };
  const handleDateChangeTwo = (date) => {
    setSelectedDateTwo(date);
  };

  const handleDateChangeThree = (date) => {
    setSelectedDateThree(date);
  };

  const add_constructor = () => {
    let temp_constructor = constructor_temp;
    temp_constructor.filter((x) => x.client_id === client_id).length === 0
      ? temp_constructor.push({
          client_id: client_id,
          construction_name: cons_name,
          construction_init_date: selectedDateOne,
          construction_final_date: selectedDateTwo,
          construction_status_status: "ACTIVO"
        })
      : set_error_message("Este constructor ya fue creado");
      set_constructor_temp(temp_constructor);
    set_cargando(true);
  };

  const eliminar_constructor_temp = (value) => {
    let temp = constructor_temp;
    for (let i = 0; i < temp.length; i++) {
      if (value === temp[i].client_id) {
        temp.splice(i, 1);
      }
    }
    set_constructor_temp(temp);
    set_cargando(false);
  };

  React.useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		fetch("https://bobcons.herokuapp.com/api/clientGET/", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + access,
				  },
			}).then(res => res.json())
			.then(items => {
				if(active){
					setOptions(items.map((x) => x.client_id));
				}
			})
			.catch(err => console.log(err));
		return () => {
			active = false;
		};
	}, [loading]);

	React.useEffect(() => {
		if (!open) {
		  setOptions([]);
		}
	  }, [open]);
  

  useEffect(() => {
    fetch("https://bobcons.herokuapp.com/api/constructionGET/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_constructors(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const refresh = () => {
    fetch("https://bobcons.herokuapp.com/api/constructionGET/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_constructors(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  const save_constructor = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/construction/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        client_id: constructor_temp[0].client_id,
        construction_name: constructor_temp[0].cons_name,
        construction_init_date: constructor_temp[0].construction_init_date,
        construction_final_date: constructor_temp[0].construction_final_date,
        construction_status_status: constructor_temp[0].construction_status_status
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
            set_success_message("Obra creada con éxito");
            set_success(true);
            set_constructor_temp([]);
            refresh();
        }  
      })
      .catch((err) => {
          alert("Error con el servidor: "+err);
      });
  };

  const createStock = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/stock/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        construction_id: constID,
        material_id: idMat,
        stock_amount: amount
      }),
    })
      .then((res) => {
        status = res.status;
        res.json();
      })
      .then((response) => {
        if(status != 200){
            set_error_message("Error en la creación");
            set_error(true);
        }else{
            set_success_message("Stock creado con éxito");
            set_success(true);
            handleClickPlusClose();
        }  
      })
      .catch((err) => {
          alert("Error con el servidor: "+err);
      });
  }

  const updateCons = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/construction/"+constID+"/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access,
      },
      body: JSON.stringify({
        construction_id: constID,
        construction_final_date: selectedDateThree,
        construction_status_status: valueState
      }), // data can be `string` or {object}!
    })
      .then((res) => {
        status = res.status
        return res.json();
      })
      .then((response) => {
        if(status != 200){
          set_error_message("Error: "+response.details);
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

  React.useEffect(() => {
		let active = true;

		if (!loadingStock) {
			return undefined;
		}

		fetch("https://bobcons.herokuapp.com/api/materialGET/", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + access,
				  },
			}).then(res => res.json())
			.then(items => {
				if(active){
					setOptionsMat(items.map((x) => {return{id: x.material_id, label: x.material_name}}));
				}
			})
			.catch(err => console.log(err));
		return () => {
			active = false;
		};
	}, [loadingStock]);

	React.useEffect(() => {
		if (!openStock) {
		  setOptionsMat([]);
		}
	  }, [openStock ]);


    return(
        <Fragment>
            <Grid container className={classes.root} spacing={5}>
            <Grid item xs={3}>
            <Autocomplete
						id="async-autocompl-construct"
						open={open}
						onOpen={() => {
							setOpen(true);
						}}
						onClose={() => {
							setOpen(false);
						}}
						getOptionSelected={(option, value) => option === value}
						onChange={(event, newValue) => {
							set_client_id(newValue);
						}}
						getOptionLabel={(option) => option}
						options={options}
						loading={loading}
						renderInput={(params) => (
							<TextField 
								{...params}
								className={classes.input}
								label="Cliente ID"
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
            <Grid item xs={3}>
            <TextField
                id="filled-full-width-consname"
                label="Nombre de Obra"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={cons_name}
                onChange={(e) => setConsName(e.target.value)}
            />
            </Grid>
            <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                
                disablePast
                disableToolbar
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                id="date-picker-inline-const"
                label="Fecha de inicio"
                value={selectedDateOne}
                onChange={handleDateChangeOne}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              /></MuiPickersUtilsProvider>
              </Grid>
            <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disablePast
                disableToolbar
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                id="date-picker-inline-consttwo"
                label="Fecha de finzalición"
                value={selectedDateTwo}
                onChange={handleDateChangeTwo}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              /></MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={4}>
                <Button
                disabled={cargando}
                style={{ color: "green", marginLeft: "1%" }}
                onClick={(e) => add_constructor()}
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
            Obra a Guardar
            </h3>
            <TableContainer component={Paper} style={{ width: "100%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Cliente id</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Fecha inicio</TableCell>
                    <TableCell>Fecha final</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {constructor_temp.map((element) => (
                    <TableRow key={element.client_id}>
                    <TableCell>{element.client_id}</TableCell>
                    <TableCell>{element.construction_name}</TableCell>
                    <TableCell>
                        {new Date(element.construction_init_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        {new Date(element.construction_final_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {element.construction_status_status}
                    </TableCell>
                    <TableCell>
                        <IconButton
                        onClick={(e) =>
                          eliminar_constructor_temp(element.client_id)
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
                onClick={(e) => save_constructor()}
            >
                REGISTRAR OBRA
            </Button>
            </div>
            <br></br>
            <h3 style={{ textAlign: "center", color: "gray" }}>
            Obras
            </h3>
            <TableContainer component={Paper} style={{ width: "97%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Const ID</TableCell>
                    <TableCell>Cliente ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Final</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {fetch_constructors.map((element) => (
                    <TableRow key={element.construction_id}>
                    <TableCell>{element.construction_id}</TableCell>
                    <TableCell>{element.client_id}</TableCell>
                    <TableCell>{element.construction_name}</TableCell>
                    <TableCell>{new Date(element.construction_init_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(element.construction_final_date).toLocaleDateString()}</TableCell>
                    <TableCell>{element.construction_status_status}</TableCell>
                    <TableCell>
                    <IconButton
                            onClick={ () => handleClick(element)}
                            children={
                              <EditIcon/>
                            }
                    />
                    </TableCell>
                    <TableCell>
                    <IconButton
                            onClick={ () => handleClickPlus(element)}
                            children={
                              <AddIcon/>
                            }
                    />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        <Dialog
          open={openD}
          onClose={handleClose}
          scroll='body'
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
        <DialogTitle id="scroll-dialog-title">Modificar Obra</DialogTitle>
        <DialogContent>
        <div>
        <Autocomplete
          value={valueState}
          disablePortal
          id="combo-box-edit"
          options={["ACTIVO","FINALIZADO","CANCELADO"]}
          fullWidth
          onChange={(event, newValue) => {
            setValueState(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Estado" />}
        />
        <br></br>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disablePast
                disableToolbar
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                id="date-picker-inline-const-update"
                label="Nueva fecha de finalización"
                value={selectedDateThree}
                onChange={handleDateChangeThree}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              /></MuiPickersUtilsProvider>
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateCons} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
          open={openDStock}
          onClose={handleClose}
          scroll='body'
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
        <DialogTitle id="scroll-dialog-title-mat">Crear Stock</DialogTitle>
        <DialogContent>
        <div>
        <Autocomplete
						id="async-autocompl-stock-mat-const"
						open={openStock}
						onOpen={() => {
							setOpenStock(true);
						}}
						onClose={() => {
							setOpenStock(false);
						}}
						getOptionSelected={(option, value) => option === value}
						onChange={(event, newValue) => {
							setIdMat(newValue.id);
						}}
						getOptionLabel={(option) => option.label}
						options={optionsMat}
						loading={loadingStock}
						renderInput={(params) => (
							<TextField 
								{...params}
								className={classes.input}
								label="Material"
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
        <br></br>
        <TextField
                    id="standard-textarea-stock-amount-const"
                    label="Cantidad/UND"
                    fullWidth
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
        />
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickPlusClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createStock} color="primary">
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