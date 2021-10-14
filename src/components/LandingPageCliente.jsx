import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import ApartmentIcon from '@material-ui/icons/Apartment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Swal from 'sweetalert2';
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
        main: '#2b8b4b',
      },
    },
  });

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#F8DB66',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LandingPageCliente = () => {
  const classes = useStyles();
  

  const [cedula, setCedula] = React.useState('');




  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("boton pulsado")
  }


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ApartmentIcon color="secondary"/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Consulta de Obras
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="cedula"
                name="cedula"
                variant="outlined"
                required
                fullWidth
                id="cedula"
                label="Cedula"
                onChange={(event) => {setCedula(event.target.value)}}
                autoFocus
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Consultar
          </Button>
        </form>
      </div>
    </Container>
    </ThemeProvider>
  );
}

export default LandingPageCliente;