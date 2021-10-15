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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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

const parseoFecha = (fecha) => {
  return `${fecha.substring(8,10)}/${fecha.substring(5,7)}/${fecha.substring(0,4)} a las ${fecha.substring(11,19)}`
}

const LandingPageCliente = (props) => {
  const classes = useStyles();
  

  const [cedula, setCedula] = React.useState('');

  const [infoObras, setInfoObras] = React.useState([]);




  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("boton pulsado")
    fetch(`https://bobcons.herokuapp.com/api/constructionProgressGet/${cedula}`, 
    {
      method: 'GET',
      headers: { "Content-Type": "application/json"
               },
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        setInfoObras(data)
      })
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
    <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre Construccion</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Fecha de Inicio de Obra</TableCell>
            <TableCell>Fecha de Final de Obra</TableCell>
            <TableCell>Estado de Obra</TableCell>
            <TableCell>Detalle de Obra</TableCell>
            <TableCell>Geolocalización</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoObras.map((row) => (
            <TableRow key={row.pk}>
              <TableCell>{row.fields.construction_name}</TableCell>
              <TableCell>{row.pk}</TableCell>
              <TableCell>{parseoFecha(row.fields.construction_init_date)}</TableCell>
              <TableCell>{parseoFecha(row.fields.construction_final_date)}</TableCell>
              <TableCell>{row.fields.construction_status_status}</TableCell>
              <TableCell><Button variant="contained" color="secondary" onClick={() => {props.history.push(`/detailobra/${row.pk}`)}}> Ver Detalle </Button></TableCell>
              <TableCell><Button variant="contained" color="secondary"> Ver Mapa </Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ThemeProvider>
  );
}

export default LandingPageCliente;