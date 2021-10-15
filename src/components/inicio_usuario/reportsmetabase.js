import React, { useState, Fragment, useEffect } from "react";
import { useSelector} from "react-redux";
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";

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
    height:'100%',
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}


export default function Reports() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);  
  const theme = useTheme();
  const [urlUser, setUrlUser] = React.useState("");
  const [urlClient, setUrlClient] = React.useState("");
  const [urlAvance, setUrlAvance] = React.useState("");
  const { usuario, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    access: state.redux_reducer.usuario.userInfo.access
  }));

  React.useEffect(() => {
    
    let status;
    fetch("https://bobcons.herokuapp.com/api/reporteUsuario/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access,
      }
    })
      .then((res) => {
      status = res.status; 
      return res.json();})
      .then((response) => {
        if (status != 200) {
          return
        }
        setUrlUser(response.reportes);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch("https://bobcons.herokuapp.com/api/reporteCliente/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access,
      }
    })
      .then((res) => {
      status = res.status; 
      return res.json();})
      .then((response) => {
        if (status != 200) {
          return
        }
        setUrlClient(response.reportes);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  React.useEffect(() => {
    
    let status;
    fetch("https://bobcons.herokuapp.com/api/avanceReporte/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access,
      }
    })
      .then((res) => {
      status = res.status; 
      return res.json();})
      .then((response) => {
        if (status != 200) {
          return
        }
        setUrlAvance(response.reportes);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Fragment className={classes.root}>
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
          <Tab label="Usuarios" {...a11yProps(0)} />
          <Tab label="Clientes" {...a11yProps(1)} />
          <Tab label="Avances" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
      <iframe
            src={urlUser}
            frameborder="0"
            width="100%"
            height="800px"
            allowtransparency
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
      <iframe
            src={urlClient}
            frameborder="0"
            width="100%"
            height="800px"
            allowtransparency
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
      <iframe
            src={urlAvance}
            frameborder="0"
            width="100%"
            height="800px"
            allowtransparency
        />
      </TabPanel>
  </Fragment>
        

  );
}

function getColor() {
   return "#"+Math.floor(Math.random()*16777215).toString(16)
}


