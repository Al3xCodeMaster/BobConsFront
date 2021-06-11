
import React, { useState } from 'react';
import Search_location from '../mapas/search_location';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField, Input } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
  } from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import {
	set_id,
	set_nombre,
	set_apellido,
	set_celular,
	set_correo,
	set_contrasenha,
	set_servicios,
	subio_foto,
	set_type_id,
	set_date,
	set_repeat_pass
} from '../../redux/actions';
import { CloudUpload} from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	button: {
		marginRight: theme.spacing(1),
		background: 'green'
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	input: {
		width: '95%',
		margin: '1%'
	},
	table: {
		minWidth: 650,
	},
	container_root: {
		flexGrow: 1,
		marginTop: '3%',
		marginLeft: '1%',
		marginBottom: '3%',
	},
}));

function getSteps() {
	return ['Información básica', 'Dirección', 'Seguridad'];
}
function Informacion_basica() {
	const classes = useStyles();
	const [id, set_cc] = useState('');
	const [nombre, set_name] = useState('');
	const [apellido, set_last_name] = useState('');
	const [options, setOptions] = useState([]);
	const [open, setOpen] = useState(false);
	const loading = open && options.length === 0;
	const {datePick} = useSelector(state => ({
		datePick: state.redux_reducer.datePick,
	}));
	const dispatch = useDispatch();

	const set_state_id = (value) => {
		dispatch(set_id(value));
		set_cc(value);
	}
	const set_state_nombre = (value) => {
		dispatch(set_nombre(value));
		set_name(value);
	}
	const set_state_apellido = (value) => {
		dispatch(set_apellido(value));
		set_last_name(value);
	}
	
	const handleDateChange = (value) => {
		dispatch(set_date(value));
	};

	const set_state_type_id = (value) => {
		dispatch(set_type_id(value));
	}

	React.useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/")+"getAllDocuments", {
				method: 'GET'
			}).then(res => res.json())
			.then(items => {
				if(active){
					setOptions(items.map((x) => x.DocumentTypeID));
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

	return (
		<div style={{ justifyContent: 'center', alignItems: 'center', }}>
			<TextField id="usuario_id" type="number" value={id} onChange={e => set_state_id(e.target.value)} className={classes.input} label="Número documento" variant="outlined" />
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
			<TextField id="usuario_nombre" value={nombre} onChange={e => set_state_nombre(e.target.value)} className={classes.input} label="Nombre" variant="outlined" />
			<TextField id="usuario_apellido" value={apellido} onChange={e => set_state_apellido(e.target.value)} className={classes.input} label="Apellido" variant="outlined" />
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
						'aria-label': 'Cambiar fecha',
					}}
				/>
			</MuiPickersUtilsProvider>
		</div>
	)
}

function Informacion_seguridad() {
	const classes = useStyles();
	const [contrasenhaNew, set_contrasenhaNew] = useState('');
	const [contrasenhaRepeat, set_contrasenhaRepeat] = useState('');
	const [equalContrasenha, set_equalContrasenha] = useState(false);
	const [showPassword, set_showPassword] = useState(false);
	const [foto, set_foto] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [open_success, set_open_success] = React.useState(false);
	const [message, set_message] = useState('');
	const vertical = 'top';
	const horizontal = 'right';


	const { usuario } = useSelector(state => ({
		usuario: state.redux_reducer.usuario,
	}));
	const dispatch = useDispatch();

	const handleClose = () => {
		setOpen(false);
		set_open_success(false);
	};
	const set_state_contrasenhaNew = (value) => {
		dispatch(set_contrasenha(value));
		set_contrasenhaNew(value);
		set_equalContrasenha(false);
		dispatch(set_repeat_pass(false));
	}
	const set_state_contrasenhaRepeat = (value) => {
		if(value!=contrasenhaNew){
			set_equalContrasenha(false);
			dispatch(set_repeat_pass(false));
		}else{
			dispatch(set_repeat_pass(true));
			set_equalContrasenha(true);
		}
		set_contrasenhaRepeat(value);
	}

	const handleClickShowPassword = () => {
		set_showPassword(!showPassword);
	  };
	
	  const handleMouseDownPassword = (event) => {
		event.preventDefault();
	  };

	const set_file = value => {
		dispatch(subio_foto(value));
		set_foto(true);
	}

	return (
		<div style={{ alignContent: 'center' }}>
		<FormControl className={classes.input}>
          <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={contrasenhaNew}
			onChange={e => set_state_contrasenhaNew(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
		<FormControl className={classes.input}>
			<InputLabel htmlFor="standard-adornment-password">Repetir contraseña</InputLabel>
			<Input
            id="standard-adornment-password"
            type="password"
            value={contrasenhaRepeat}
			onChange={e => set_state_contrasenhaRepeat(e.target.value)}
			error={!equalContrasenha} 
			/>	
		</FormControl>
			<div style={{ marginLeft: '20%' }}>
				<Button variant="outlained" component="label">{foto?"Seleccionado":"Nada seleccionado"}
				</Button>
				<Button variant="contained" style={{ marginLeft: '3%', color: 'green' }} component="label"> Subir foto del usuario
				<CloudUpload style={{ fontSize: 30, marginLeft: '10px' }} />
					<Input
						type="file"
						onChange={e => set_file(e.target.files[0])}
						style={{ display: "none" }}
					/>
				</Button>
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="error">
					{message}
				</Alert>
			</Snackbar>
			<Snackbar open={open_success} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="success">
					archivo subido al servidor
				</Alert>
			</Snackbar>
		</div>
	)
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <Informacion_basica />;
		case 1:
			return <Search_location />;	
		case 2:
			return <Informacion_seguridad />;
		default:
			return 'Unknown step';
	}
}

export default function Formulario_empleado() {
	const classes = useStyles();
	const vertical = 'top';
	const horizontal = 'right';
	const [open, setOpen] = React.useState(false);
	const [open_success, set_open_sucess] = React.useState(false);
	const [message, set_message] = React.useState('');
	const [message_success, set_message_success] = React.useState('');
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const steps = getSteps();
	const { usuario, coordenadas, subio_fot, datePick} = useSelector(state => ({
		usuario: state.redux_reducer.usuario,
		coordenadas: state.redux_reducer.coordenadas,
		subio_fot: state.redux_reducer.subio_fot,
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
		if (usuario.id && usuario.nombre && usuario.apellido && usuario.tipoId) {
			if (!Number(usuario.id)) {
				set_message('la cédula no puede estar vacia y debe ser un dato tipo numérico');
				setOpen(true);
			}
			else if (usuario.nombre.length === 0) {
				set_message('el nombre no puede estar vacio');
				setOpen(true);
			}
			else if (usuario.apellido.length === 0) {
				set_message('el apellido no puede estar vacio');
				setOpen(true);
			}
			else {
				setOpen(false);
				handleNext()
			}
		}else{
			set_message('Todos los campos son obligatorios');
			setOpen(true);
		}
	}
	const subir_formulario = () => {

		if (usuario.id && usuario.nombre && usuario.apellido && usuario.tipoId && usuario.contrasenha){
			if (!Number(usuario.id) || usuario.nombre.length === 0 || usuario.apellido.length === 0 || usuario.contrasenha.length < 4 || !usuario.equalContrasenha) {

				if (!Number(usuario.id)) {
					set_message('la cédula no puede estar vacia y debe ser un dato tipo numérico');
				}
				if (usuario.nombre.length === 0) {
					set_message('el nombre no puede estar vacio');
				}
				if (usuario.apellido.length === 0) {
					set_message('el apellido no puede estar vacio');
				}
				if (usuario.contrasenha.length < 4) {
					set_message('la contraseña debe ser mayor a 6 caracteres');
				}
				if (!usuario.equalContrasenha) {
					set_message("Asegurese de repetir la contraseña");	
				}
				setOpen(true);
			}
			else {
				setOpen(false);
				var formData = new FormData();
				formData.append('photo', subio_fot);
				formData.append('userInfo', JSON.stringify({
					RestaurantUserID: parseInt(usuario.id),
					RestaurantUserName: usuario.nombre,
					RestaurantUserLastname: usuario.apellido,
					RestaurantUserLatitude: parseFloat(coordenadas.lat),
					RestaurantUserLongitude: parseFloat(coordenadas.lng),
					RestaurantUserBirthdate: datePick,
					RestaurantUserPass: usuario.contrasenha,
					DocumentTypeID: usuario.tipoId
				}));
				fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/")+"createUser", {
					method: 'POST',
					body: formData
				}).then(res => res.json())
					.then(response => {
						if (response.status === 400) {
							set_message(response.message);
							setOpen(true);
						}
						else {
							set_message_success(response.message);
							set_open_sucess(true);
							handleReset();
							dispatch(set_id(''));
							dispatch(set_nombre(''));
							dispatch(set_apellido(''));
							dispatch(set_celular(''));
							dispatch(set_correo(''));
							dispatch(set_servicios([]));
							dispatch(set_contrasenha(''));
							dispatch(subio_foto(false));
							dispatch(set_repeat_pass(false));
						}
					})
					.catch(error => {
						alert("Conexión fallida con el servidor"+error);
					});
			}	
		}else{
			set_message("Todos los campos son obligatorios");
			setOpen(true);
		}
	}
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
							<StepLabel  {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleClose} severity="error">
					{message}
				</Alert>
			</Snackbar>
			<Snackbar open={open_success} autoHideDuration={3000} onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleCloseSucess} severity="success">
					{message_success}
				</Alert>
			</Snackbar>
			<div style={{ bottom: '0', width: '100%' }}>
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
							<div className={classes.instructions}>{getStepContent(activeStep)}</div>
							<div style={{ textAlign:'center', marginTop: '8%' }}>
								<Button style={{ color: 'gray' }} disabled={activeStep === 0} onClick={handleBack} variant="outlined" >
									Regresar
								</Button>
								{activeStep === steps.length - 1 ?
									<Button
										variant="contained"
										color="primary"
										onClick={e => subir_formulario()}
										style={{ marginLeft: '5%', color: 'white', background: 'green' }}>Finalizar
									</Button> :
									<Button
										variant="contained"
										onClick={e => comprobar_info()}
										style={{ marginLeft: '5%', color: 'white', background: 'green' }}>Siguiente
									</Button>}

							</div>
						</div>
					)}
			</div>
		</div>
	);
}