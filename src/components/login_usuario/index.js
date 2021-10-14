import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { success_login, error_login } from '../../redux/actions';
import { withRouter, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
//import logo from '../../images/logo.png';
//import presentacion2 from '../../images/presentacion2.mp4';
import { Check } from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../../images/logo.png';
import line from '../../images/line.png';
import video from '../../images/video.mp4';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


const theme = createMuiTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#F8DB66',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#000000',
      },
    },
  });

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © BobCons '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login_usuario = () => {
  const { message, usuario } = useSelector(state => ({
    message: state.redux_reducer.message,
    usuario: state.redux_reducer.usuario,
  }));
  const dispatch = useDispatch();
  const [cedula, set_cedula] = useState('');
  const [contrasenha, set_contrasenha] = useState('');
  const [error_cedula, set_error_cedula] = useState(false);
  const [pass_invalid, set_pass_invalid] = useState(false);
  const [helper_cedula, set_helper_cc] = useState('');
  const [helper_contrasenha, set_helper_pass] = useState('');
  const [error_contrasenha, set_error_contrasenha] = useState(false);
  const classes = useStyles();

  const ingresar = () => {

      set_error_cedula(false);
      set_error_contrasenha(false);
      set_helper_pass('');
      set_helper_cc('');
      let status;
      fetch("https://bobcons.herokuapp.com/api/login/", {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        body: JSON.stringify({app_user_id: cedula, password: contrasenha}) // data can be `string` or {object}!
      }).then(res => { status = res.status; return res.json()})
        .then(response => {
          if(status!=200){
            set_pass_invalid(true);
            dispatch(error_login(response.detail));
          }else{
            dispatch(success_login(response, status));
          }
        })
        .catch(error => alert("Error con la conexión al servidor "+error));
  }
  return (
    <ThemeProvider theme={theme}>
    <Grid container component="main" className={classes.root} style={{backgroundColor:'white'}}>
      {usuario.status===200 ? <Redirect to="/inicio/usuario" /> : null}
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} className={classes.image} style={{textAlign:"center"}}>
      <img src={line} width="400" height="60"alt="Line" />
      <video src={video} width="100%" height="70%" autoPlay={true} muted/>
      <img src={line} width="400" height="60" alt="Line" />
      </Grid>
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper} style={{textAlign:"center"}}>
          <form className={classes.form} noValidate>
            <img src={logo} height="250" width="250" alt="Logo" />
            <TextField
              error={error_cedula}
              helperText={helper_cedula}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="cedula"
              label="ID"
              name="cedula"
              value={cedula}
              onChange={e => set_cedula(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              error={error_contrasenha}
              helperText={helper_contrasenha}
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              color='primary'
              value={contrasenha}
              onChange={e => set_contrasenha(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={() => ingresar()}
              style={{ background: '#2b8b4b', MozBorderRadius: 40, color: 'white', fontSize: 20, font: 'bold' }}
              className={classes.submit}
            >
              Ingresar
               <Check style={{ fontSize: 35, marginLeft: '10px' }} />
            </Button>
            <Snackbar open={pass_invalid} autoHideDuration={4000}
              anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
            >
              <Alert onClose={() => set_pass_invalid(false)} variant="filled" severity="error">
                {"Error en la contraseña o usuario: "}
              </Alert>
            </Snackbar>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
    </ThemeProvider>
  );
}
export default Login_usuario;