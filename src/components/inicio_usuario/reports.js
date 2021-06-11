import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from './Title';
import {
  BarChart, Bar, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
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
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
}));

export default function Reports() {
  const theme = useTheme();
  const [sixMonthsProd, setSixMonth] = useState([]);
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [openProd, setOpenProd] = useState(false);
  const loading = openProd && options.length === 0;
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [selectedDateOne, setSelectedDateOne] = React.useState(new Date(Date.now()));
  const [selectedDateTwo, setSelectedDateTwo] = React.useState(new Date(Date.now()));
  const [salesInteval, setSalesInterv] = useState([]);
  const [yearsBar, setYearBar] = useState([]);
  const [moreAmountP, setMoreAumentP] = useState([]);
  const [lessAmountP, setLessAmountP] = useState([]);
  const [bestClients, setBestClients] = useState([]);
  const [lessAmountRes, setLessAmountRes] = useState([]);
  const [moreAmountRes, setMoreAmountRes] = useState([]);
  const [clientBirthday, setClientBirthday] = useState([]);

  const handleDateChangeOne = (date) => {
    setSelectedDateOne(date);
  };
  const handleDateChangeTwo = (date) => {
    setSelectedDateTwo(date);
  };

  React.useEffect(() => {
    
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "moreAmountProductsSales", {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.length > 0) {
          setMoreAumentP(response.map((data) => {
            return {nom: data.ProductID, ventas: data.Amount}
          }));
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "lessRestaurantSales/10/0", {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.length > 0) {
          setLessAmountRes(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "birthdayOfClients", {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.length > 0) {
          setClientBirthday(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "moreRestaurantSales/10/0", {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.length > 0) {
          setMoreAmountRes(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "bestClients/5/0", {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.length > 0) {
          setBestClients(response.map((data) => {
            return {id: data.ClientID, acumulado: data.Amount}
          }));
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "lessAmountProductsSales", {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.length > 0) {
          setLessAmountP(response.map((data) => {
            return {nom: data.ProductID, ventas: data.Amount}
          }));
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    fetch(
      (process.env.REACT_APP_BACKEND || "http://localhost:4000/") +
        "getAllProducts",
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((items) => {
        if (active) {
          setOptions(items.map((x) => x.ProductID));
        }
      })
      .catch((err) => alert(error));
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!openProd) {
      setOptions([]);
    }
  }, [openProd]);

  const generateReportSixM = (prodID) => {
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "sixMonthProduct/" + prodID, {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        setSixMonth(response.map((data) => {
          return {time: data.Mon, amount: data.Amount};
        }));
      })
      .catch((error) => {
        alert(error);
      });
  }

  const generateSalesInterval = () => {
    let status;
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "salesInterval/" + selectedDateOne.toUTCString() + "/" + selectedDateTwo.toUTCString(), {
      method: "GET",
    })
      .then((res) => {status=res.status; return status==204? []:res.json()})
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_error_message("Error: " + response.error);
          return;
        }
        let years = [];
        setSalesInterv(response.map((data) => {
          years.push(data.Yyyy);
          let year = data.Yyyy;
          return {mon: data.Mon, [year]: data.Amount};
        }));
        
        setYearBar([...new Set(years)]);
      })
      .catch((error) => {
        alert(error);
      });
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <CssBaseline />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={6} lg={6}>
            <Autocomplete
                              id="async-autocompl-reporte"
                              open={openProd}
                              onOpen={() => {
                                setOpenProd(true);
                              }}
                              onClose={() => {
                                setOpenProd(false);
                              }}
                              getOptionSelected={(option, value) => option === value}
                              onChange={(event, newValue) => {
                                generateReportSixM(newValue);
                              }}
                              getOptionLabel={(option) => option}
                              options={options}
                              loading={loading}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  className={classes.input}
                                  label="Seleccione el producto para generar reporte"
                                  variant="outlined"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {loading ? (
                                          <CircularProgress color="inherit" size={20} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
              />
              <Paper className={fixedHeightPaper}>
              <Title>Ventas en los ultimos seis meses</Title>  
              {sixMonthsProd.length>0?
              <React.Fragment>
              <ResponsiveContainer>  
                <LineChart
                  data={sixMonthsProd}
                  margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                  }}
                >
                  <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary}>
                    <Label
                      angle={270}
                      position="left"
                      style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                    >
                      Cantidad (unidades)
                    </Label>
                  </YAxis>
                  <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </React.Fragment>:null
            }
              </Paper>
            </Grid>
            {/* Recent Deposits */}
              <Grid item xs={12} md={6} lg={6}>
              <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                fullWidth
                disableToolbar
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                id="date-picker-inline-report-one"
                label="Seleccione la fecha de inicio"
                value={selectedDateOne}
                onChange={handleDateChangeOne}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              /></MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                disableToolbar
                fullWidth
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                id="date-picker-inline-report-two"
                label="Seleccione la fecha final"
                value={selectedDateTwo}
                onChange={handleDateChangeTwo}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              /></MuiPickersUtilsProvider>
              <Grid item md={3} lg={3}>
              <Button variant="contained" onClick={generateSalesInterval}>Generar</Button>
              </Grid>
              </Grid>  
              <Paper className={fixedHeightPaper}>
              <Title>Ventas entre fechas</Title>
              {salesInteval.length>0?
                <BarChart
                width={400}
                height={200}
                data={salesInteval}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid/>
                <XAxis dataKey="mon" />
                <YAxis />
                <Tooltip />
                <Legend />
                {yearsBar.map((year) => {
                  let color = getColor();
                  return(<Bar dataKey={year} fill={color}/>)
                  })
                }
              </BarChart>:null
              }  
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>  
              <Paper className={fixedHeightPaper}>
              <Title>20 productos mas vendidos</Title>
              {moreAmountP.length>0?
                <BarChart
                width={400}
                height={200}
                data={moreAmountP}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid/>
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#8884d8"/>
              </BarChart>:null
              }
              <Title>20 productos menos vendidos</Title>
              {lessAmountP.length>0?
                <BarChart
                width={400}
                height={200}
                data={lessAmountP}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid/>
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#82ca9d"/>
              </BarChart>:null
              }  
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={6}>
              <Paper className={classes.paper}>
              <Title>Restaurantes con menos ventas</Title>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id del restaurante</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {lessAmountRes.map((row) => (
                      <TableRow key={row.RestaurantID}>
                        <TableCell component="th" scope="row">
                          {row.RestaurantID}
                        </TableCell>
                        <TableCell align="right">{row.Amount}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <Paper className={classes.paper}>
              <Title>Restaurantes con mas ventas</Title>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id del restaurante</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {moreAmountRes.map((row) => (
                      <TableRow key={row.RestaurantID}>
                        <TableCell component="th" scope="row">
                          {row.RestaurantID}
                        </TableCell>
                        <TableCell align="right">{row.Amount}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Title>Mejores clientes</Title>
                {bestClients.length>0?
                  <BarChart
                  width={400}
                  height={200}
                  data={bestClients}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid/>
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="acumulado" fill="#82ca4d"/>
                </BarChart>:null
                }  
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Title>Clientes que cumplen en este mes</Title>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Id Cliente</TableCell>
                        <TableCell>Nombre cliente</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {clientBirthday.map((row) => (
                      <TableRow key={row.ClientID}>
                        <TableCell component="th" scope="row">
                          {row.ClientID}
                        </TableCell>
                        <TableCell>{row.ClientName}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                </Grid>
          </Grid>
        </Container>
    </div>
  );
}

function getColor() {
   return "#"+Math.floor(Math.random()*16777215).toString(16)
}


