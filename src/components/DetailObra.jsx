import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import BuildIcon from '@material-ui/icons/Build';
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

const DetailObra = (props) => {
  const classes = useStyles();
  const { match } = props;
  const obraId = match.params.idObra;
  const [infoProgresos, setInfoProgresos] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://bobcons.herokuapp.com/api/progressConstructionIdGet/${obraId}`, 
    {
      method: 'GET',
      headers: { "Content-Type": "application/json"
               },
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        setInfoProgresos(data)
      })
  }, []);

  


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <BuildIcon color="secondary"/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Obra #{obraId}
        </Typography>
      </div>
    </Container>
    <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre Construccion</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Fecha en la que registró Progreso</TableCell>
            <TableCell>Detalle de Progreso</TableCell>
            <TableCell>Audio de Progreso</TableCell>
            <TableCell>Foto de Progreso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoProgresos.map((row) => (
            <TableRow key={row.pk}>
              <TableCell>{row.fields.construction_name}</TableCell>
              <TableCell>{row.pk}</TableCell>
              <TableCell>{parseoFecha(row.fields.progress_date)}</TableCell>
              <TableCell>{row.fields.progress_detail}</TableCell>
              <TableCell>{row.fields.progress_audio}</TableCell>
              <TableCell>{row.fields.progress_photo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ThemeProvider>
  );
}

export default DetailObra;