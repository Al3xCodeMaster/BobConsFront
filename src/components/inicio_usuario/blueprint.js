import React, { useState, Fragment, useEffect } from "react";
import { useSelector} from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Grid,
  IconButton,
  Popover,
  Slide,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Done from "@material-ui/icons/Done";
import Modal from "@material-ui/core/Modal";
import {Dialog, DialogTitle, DialogActions, DialogContent} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "5%",
    flexGrow: 1,
  },
  rootContainer: {
    marginTop: "2%",
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
  const theme = useTheme();
  const [blueppic, set_blueppic] = React.useState(null);
  const [fetch_bluep, set_fetch_bluep] = useState([]);
  const [name_bluep, set_name_bluep] = useState("");
  const [details, set_details] = useState("");
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [value, setValue] = React.useState(0);
  const [update_name, set_update_name] = useState("");
  const [update_details, set_update_details] = useState("");
  const vertical = "top";
  const horizontal = "right";
  const [blueId, setBlueId] = useState("");
  const [id_cons, set_state_cons] = React.useState("");
  const [id_cons_search, set_id_cons_search] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [openDB, set_openDB] = useState(false);
  const [obra_cargado, set_obra_cargado] = useState([]);
  const [openM, setOpenM] = React.useState(false);
  const [urlphoto, set_url] = React.useState("");
  const { usuario, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    access: state.redux_reducer.usuario.userInfo.access
  }));

  const handleClickDB = (id, name, details) => {
    setBlueId(id);
    set_update_name(name);
    set_update_details(details);
    set_openDB(true);
  }

  const handleCloseDB = () => {
    setBlueId("");
    set_update_name("");
    set_update_details("");
    set_openDB(false);
  }

  const handleOpenM = (value) => {
    set_url(value); 
    setOpenM(true);
  };
  const handleCloseM = () => {
    set_url("");
    setOpenM(false)
  };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
   }

    fetch("https://bobcons.herokuapp.com/api/constructionGET/", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + access,
				  },
			}).then(res => res.json())
			.then(items => {
				if(active){
					setOptions(items.map((x) => x.construction_id.toString()));
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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }



  const createBlueprint = () => {
    let status;
    var formData = new FormData();
    formData.append("construction_id", id_cons);
    formData.append("blueprint_name", name_bluep);
    formData.append("blueprint_detail", details);
    formData.append("blueprint_file", blueppic);
    fetch("https://bobcons.herokuapp.com/api/bluePrint/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + access,
      },
      body: formData,
    })
      .then((res) => {
        status = res.status;
        return res.json()})
      .then((response) => {
        if (status != 200) {
          set_error_message("No se pudo a??adir el plano");
          set_error(true);
        } else {
          set_success_message("Se cre?? el producto con ??xito!");
          set_success(true);
          set_name_bluep("");
          set_details("");
          set_blueppic(null);
        }
      })
      .catch((error) => {
        alert("Error con el servidor: "+error);
      });
  };


  const updateBluePrint = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/bluePrint/"+blueId+"/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access,
      },
      body: JSON.stringify({
        blueprint_name: update_name,
        blueprint_detail: update_details,
      }),
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((response) => {
        if (status != 200) {
          set_error(true);
          set_error_message("Error: " + response.details);
          return;
        }
        set_success(true);
        set_success_message("Plano cambiado con ??xito");
        getBlueprint(id_cons_search);
        set_openDB(false);
      })
      .catch((err) => {
        set_error(true);
        set_error_message("Error en la conexi??n con el servidor " + err);
      });
  }

  const get_obra = () => {
    let status;
    fetch("https://bobcons.herokuapp.com/api/constructionGET/"+id_cons_search, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + access,
				  },
			}).then((res) => {
        status = res.status
        return res.json();})
      .then((response) => {
        if (status != 200) {
          set_error_message("No se encuentra la obra");
          set_error(true);
        }
          getBlueprint(id_cons_search);
          set_obra_cargado(response);
          
      })
      .catch((error) => {
        alert(error);
      });
  }

  const getBlueprint = (value) => {
    
    let status;
    fetch("https://bobcons.herokuapp.com/api/blueprintConstructionIdGet/"+value, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + access,
				  },
			}).then((res) => res.json())
        .then((response) => {
        if (response.length > 0) {
          set_fetch_bluep(response);
        }
      })
      .catch((error) => {
        alert(error);
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
          <Tab label="A??adir Planos" {...a11yProps(0)} />
          <Tab label="Actualizar Planos" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
      <Grid container className={classes.rootContainer} spacing={6}>
            <Grid item xs={3}>
            <Autocomplete
						id="async-autocompl-blu-cons"
						open={open}
						onOpen={() => {
							setOpen(true);
						}}
						onClose={() => {
							setOpen(false);
						}}
						getOptionSelected={(option, value) => option === value}
						onChange={(event, newValue) => {
							set_state_cons(newValue);
						}}
						getOptionLabel={(option) => option}
						options={options}
						loading={loading}
						renderInput={(params) => (
							<TextField 
								{...params}
								className={classes.input}
								label="ID Obra"
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
                fullWidth
                value={name_bluep}
                onChange={(e) => set_name_bluep(e.target.value)}
                id="blueprint-name"
                label="Nombre del plano"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                id="blueprint-details"
                label="Detalles del plano"
                multiline
                value={details}
                onChange={(e) => set_details(e.target.value)}
                rowsMax={4}
              />
            </Grid>
            <Grid item xs={3}>
              <input
                accept="image/*"
                id="raised-button-file-blueprint"
                style={{ display: "none" }}
                onChange={(e) => set_blueppic(e.target.files[0])}
                type="file"
              />
              <label htmlFor="raised-button-file-blueprint">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PhotoCamera />}
                  component="span"
                >
                  Subir Foto
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                onClick={createBlueprint}
                variant="contained"
                endIcon={<Done />}
                style={{ color: "white", background: "green" }}
              >
                A??adir plano
              </Button>
            </Grid>
          </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container className={classes.rootContainer} spacing={5}>
          <Grid item xs={6}>
            <TextField
              id="standard-cons-search"
              label="Id de la obra"
              fullWidth
              type="number"
              value={id_cons_search}
              onChange={(e) => set_id_cons_search(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button style={{ marginLeft: "1%" }} onClick={get_obra}>
              <SearchIcon style={{ fontSize: 30, marginLeft: "10px" }} />
            </Button>
          </Grid>
        </Grid>
        <h3 style={{ textAlign: "center", color: "gray" }}></h3>
        <TableContainer component={Paper} style={{ width: "100%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Cliente N. Doc</TableCell>
                <TableCell>Fecha inicio</TableCell>
                <TableCell>Fecha final </TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obra_cargado?
                <TableRow key={obra_cargado.construction_id}>
                  <TableCell>{obra_cargado.client_id}</TableCell>
                  <TableCell>{new Date(obra_cargado.construction_init_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(obra_cargado.construction_final_date).toLocaleDateString()}</TableCell>
                  <TableCell>{obra_cargado.construction_status_status}</TableCell>
                </TableRow>:null}
            </TableBody>
          </Table>
        </TableContainer>
        <br></br>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Planos registrados de la obra
        </h3>
        <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Crea</TableCell>
                <TableCell>Ver foto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obra_cargado
                ? fetch_bluep.map((element) => (
                    <TableRow key={element.pk}>
                      <TableCell>{element.fields.blueprint_name}</TableCell>
                      <TableCell>{element.fields.blueprint_detail}</TableCell>
                      <TableCell>{new Date(element.fields.blueprint_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                          <IconButton
                            onClick={(e) => handleOpenM(element.fields.blueprint_file)}
                            children={
                              <PhotoCamera
                                style={{ fontSize: 25, marginLeft: "5px" }}
                              />
                            }
                          />
                      </TableCell>
                      <TableCell>
                          <IconButton
                            onClick={(e) => handleClickDB(element.pk, element.fields.blueprint_name, element.fields.blueprint_detail)}
                            children={
                              <EditIcon
                                style={{ fontSize: 25, marginLeft: "5px" }}
                              />
                            }
                          />
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
          <Modal
            open={openM}
            onClose={handleCloseM}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Paper variant="outlined" style={{textAlign: 'center'}}>
              <img style={{width: '512px', height:'400px', marginTop:'5%'}} src={"https://bob-cons-media.s3.amazonaws.com/"+  urlphoto} />
              </Paper>
          </Modal>
        </TableContainer>
        <Dialog
          open={openDB}
          onClose={handleCloseDB}
          scroll='body'
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
        <DialogTitle id="scroll-dialog-title-mat">Modificar el plano</DialogTitle>
        <DialogContent>
        <div>  
        
        <TextField
                    id="standard-text-bl-update-name"
                    label="Nombre del plano"
                    fullWidth
                    value={update_name}
                    onChange={(e) => set_update_name(e.target.value)}
        />
        <br></br>
        <TextField
                    id="standard-text-bl-update-details"
                    label="Detalles"
                    fullWidth
                    multiline
                    rowsMax={4}
                    value={update_details}
                    onChange={(e) => set_update_details(e.target.value)}
        />
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDB} color="primary">
            Cancel
          </Button>
          <Button onClick={updateBluePrint} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
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
