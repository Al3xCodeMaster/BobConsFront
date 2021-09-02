import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';    
import Title from './Title';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link'
import { TextField, Input, List, ListItem, ListItemText} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import UpdateUserAdmin from './formulario_update';
import { useSelector, useDispatch } from 'react-redux';
import {
	set_id,
	set_nombre,
	set_apellido,
	set_type_id,
  set_date,
  success_login
} from '../../redux/actions';



const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  avatar: {
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(2),
    },
    flexDirection: 'row',
    width: theme.spacing(30),
    height: theme.spacing(30)
  },
  input: {
		width: '100%',
		margin: '1%'
  }
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  
export default function Dashboard() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [openMess, setopenMess] = React.useState(false);
    const [open_success, set_open_sucess] = React.useState(false);
    const [message, set_message] = React.useState('');
    const [message_success, set_message_success] = React.useState('');
    const { usuario, datePick, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    datePick: state.redux_reducer.datePick,
    access: state.redux_reducer.usuario.userInfo.access
  }));
  const [open, setOpen] = React.useState(false);
  const [contrasenhaNew, set_contrasenhaNew] = useState('');
  const [contrasenhaOld, set_contrasenhaOld] = useState('');
  const [showPassword, set_showPassword] = useState(false);
  const [openPop, setopenPop] = useState(false);
  
  const handleClickOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const vertical = 'top';
	const horizontal = 'right';

  const handleCloseSucess = () => {
		set_open_sucess(false);
	};

  const handleCloseSnack = () => {
    setopenMess(false);
  };
  
  const handleClose = () => {
    setOpen(false);
    set_contrasenhaNew('');
    set_contrasenhaOld('');
  };

  const handleClickShowPassword = () => {
		set_showPassword(!showPassword);
	  };
	
	  const handleMouseDownPassword = (event) => {
		event.preventDefault();
    };

    const perfomChange = (event) => {
      let status = 0
        if(window.confirm("¿Desea cambiar la contraseña?")){
          fetch("https://bobcons.herokuapp.com/api/change-password/", {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + access,
            },
            body: JSON.stringify({
              old_password: contrasenhaOld,
              new_password: contrasenhaNew
            })      
        }).then(res => {
          status = res.status;
          return res.json();
        })
            .then(response => {
                    if(status != 200){
                      setopenMess(true);
                      set_message('Error: '+"Contraseña antigua invalida");
                        return
                    }
                    set_open_sucess(true);
                    set_message_success('Contraseña cambiada con éxito');
            })
            .catch(err => {
                setopenMess(true);
                set_message('Error en la conexión con el servidor '+err);
            })
            set_contrasenhaNew('');
            set_contrasenhaOld('');
            handleClose();
        }
    }

    const setOpenPopAction = (event) => {
        event.preventDefault();
        dispatch(set_nombre(usuario.status==200?usuario.userInfo.username:""));
        dispatch(set_apellido(usuario.status==200?usuario.userInfo["last name"]:""));
        dispatch(set_id(usuario.status==200?usuario.userInfo.id:""));
        setopenPop(true);
    }

    const handleClosePop = () => {
      dispatch(set_nombre(""));
      dispatch(set_apellido(""));
      dispatch(set_date(datePick));
      dispatch(set_id(""));
      dispatch(set_type_id(""));
      setopenPop(false);
    };
    
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                <Paper className={fixedHeightPaper}>
                <Title>{usuario.status==200?usuario.userInfo.username+" "+usuario.userInfo["last name"]:"No user"}</Title>    
                <Typography color="textPrimary" className={classes.depositContext}>
                {usuario.status==200?"Numero de Documento: "+usuario.userInfo.app_user_id:""}
                </Typography>
                <Typography color="textPrimary" className={classes.depositContext}>
                {usuario.status==200?"Email: "+usuario.userInfo.email:""}
                </Typography>
                <div>
                  
                </div>
                  <Link color="primary" href="" onClick={(e) => handleClickOpen(e)}> Cambiar mi contraseña </Link>
                  <Link color="primary" href="" onClick={(e) => setOpenPopAction(e)}> Actualizar mis datos </Link>
                </Paper>
                </Grid>
                <Grid item xs={9}>
                <h2>Roles:</h2>
                <Paper className={classes.paper}>
                  <List dense>
                  {usuario.status==200?usuario.userInfo.Role.length>0?usuario.userInfo.Role.map( (element, index) => (
                    <ListItem key={index}>
                    <ListItemText
                      primary={element}
                    />
                  </ListItem>
                  )):<ListItem><h3>{usuario.userInfo["Is staff"]?"Admin con todos los privilegios":"No tiene roles asignados"}</h3></ListItem>:null}
                  </List>
                </Paper>
                </Grid>
            </Grid>
            </Container>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Cambio de contraseña</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Recuerde que la nueva contraseña debe de ser de mas de 6 caracteres.
                </DialogContentText>
                <TextField
                  onChange={(e) => set_contrasenhaOld(e.target.value)}
                  margin="dense"
                  id="old_pass"
                  label="Digite su actual contraseña"
                  type="password"
                  fullWidth
                  value={contrasenhaOld}
                />
                <FormControl className={classes.input}>
                <InputLabel htmlFor="standard-adornment-password">Nueva contraseña</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={contrasenhaNew}
                  onChange={e => set_contrasenhaNew(e.target.value)}
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
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cerrar
                </Button>
                <Button onClick={perfomChange} color="primary">
                  Cambiar
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openPop} onClose={handleClosePop} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Modificar mis datos de usuario</DialogTitle>
              <DialogContent>
                <UpdateUserAdmin/>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePop} color="primary">
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar open={openMess} autoHideDuration={3000} onClose={handleCloseSnack}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleCloseSnack} severity="error">
					{message}
				</Alert>
			</Snackbar>
			<Snackbar open={open_success} autoHideDuration={3000} onClose={handleCloseSnack}
				anchorOrigin={{ vertical, horizontal }}>
				<Alert onClose={handleCloseSucess} severity="success">
					{message_success}
				</Alert>
			</Snackbar>    
        </main>
    );
};