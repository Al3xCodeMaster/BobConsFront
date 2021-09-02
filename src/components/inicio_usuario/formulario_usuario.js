
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
	return ['Información básica', 'Seguridad'];
}
function Informacion_basica() {
	const classes = useStyles();
	const [id, set_cc] = useState('');
	const [nombre, set_name] = useState('');
	const [apellido, set_last_name] = useState('');
	const [email, set_email] = useState('');
	const [options, setOptions] = useState([]);
	const [open, setOpen] = useState(false);
	const loading = open && options.length === 0;
	const {access, datePick} = useSelector(state => ({
		access: state.redux_reducer.usuario.userInfo.access,
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
	
	const set_state_email = (value) => {
		dispatch(set_correo(value));
		set_email(value);
	};

	const set_state_type_id = (value) => {
		dispatch(set_type_id(value));
	}

	React.useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		fetch("https://bobcons.herokuapp.com/api/documentTypeGET/", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + access,
				  },
			}).then(res => res.json())
			.then(items => {
				if(active){
					setOptions(items.map((x) => x.document_type_id));
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
			<TextField
            id="email"
            value={email}
            onChange={(e) => set_state_email(e.target.value)}
            className={classes.input}
            label="email"
            variant="outlined"
          />
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
		</div>
	)
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <Informacion_basica />;
		case 1:
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
	const { usuario, access} = useSelector(state => ({
		usuario: state.redux_reducer.usuario,
		access: state.redux_reducer.usuario.userInfo.access
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
				set_message('ID no puede estar vacia y debe ser un dato tipo numérico');
				setOpen(true);
			}
			else if (usuario.nombre.length === 0) {
				set_message('El nombre no puede estar vacio');
				setOpen(true);
			}
			else if (usuario.apellido.length === 0) {
				set_message('El apellido no puede estar vacio');
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
		        comprobar_info();
				setOpen(false);
				fetch("https://bobcons.herokuapp.com/api/appUser/", {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + access,
					},
					body: JSON.stringify({
						app_user_id: usuario.id,
						app_user_document_type: usuario.tipoId,
						user_name:usuario.nombre,
						last_name:usuario.apellido,
						email:usuario.correo,
						password:usuario.contrasenha
					  })
				}).then(res => res.json())
					.then(response => {
						if (response.status !=200) {
							set_message(response.details);
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
							Regresar a crear usuario
						</Typography>
						<Button onClick={handleReset} className={classes.button}>
							Ok
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