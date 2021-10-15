import React, { useState, Fragment, useEffect } from "react";
import {
  TextField,
  Grid,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
import EditIcon from "@material-ui/icons/Edit";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import { useSelector, useDispatch} from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "5%",
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

export default function Banks() {
    const classes = useStyles();
  const [fetch_stock, set_fetch_stock] = useState([]);
  const vertical = "top";
  const horizontal = "right";
  const [anchorEl, setAnchorEl] = React.useState(null);
  const componRef = React.useRef();
  const [stockToChange,setStockToChange] = useState({});
  const [error, set_error] = React.useState(false);
  const [error_message, set_error_message] = useState("");
  const [success, set_success] = React.useState(false);
  const [success_message, set_success_message] = useState("");
  const [amount, setAmount] = React.useState(0);  
  const { usuario, access} = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    access: state.redux_reducer.usuario.userInfo.access
  }));

  const handleClick = (event, element) => {
    setStockToChange(element);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openP = Boolean(anchorEl);
  const id = openP ? "simple-popover" : undefined;

  useEffect(() => {
    fetch("https://bobcons.herokuapp.com/api/stockGET/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_stock(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const refresh = () => {
    fetch("https://bobcons.herokuapp.com/api/stockGET/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
            set_fetch_stock(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  const updateStock = () => {
    let statusUp;
    fetch("https://bobcons.herokuapp.com/api/stock/"+stockToChange.id+"/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access
      },
      body: JSON.stringify({
        id: stockToChange.id,
        stock_amount: amount 
      }),
    })
      .then((res) => {
        statusUp = res.status;
        res.json();})
      .then((response) => {
        if (statusUp != 200) {
          set_error(true);
          set_error_message("Error: " + response.details);
          return;
        }
        refresh();
        set_success_message("Material cambiado con éxito");
        set_success(true);
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor " + err);
      });
  };


    return(
        <Fragment>
            <h3>
            STOCK
            </h3>
            <TableContainer component={Paper} style={{ width: "97%" }}>
            <Table stickyHeader={true} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>ID obra</TableCell>
                    <TableCell>ID Material</TableCell>
                    <TableCell>Cantidad</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {fetch_stock.map((element) => (
                    <TableRow key={element.id}>
                    <TableCell>{element.construction_id}</TableCell>
                    <TableCell>{element.material_id}</TableCell>
                    <TableCell>{element.stock_amount}</TableCell>
                    <TableCell>
                    <IconButton
                      onClick={(e) => handleClick(e, element)}
                      children={
                        <EditIcon
                          style={{
                            fontSize: 25,
                            marginLeft: "8px",
                            color: "green",
                          }}
                        />
                      }
                    />
                    <Popover
                      id={id}
                      open={openP}
                      ref={componRef}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Typography className={classes.typography}>
                        Cantidad
                      </Typography>
                      <TextField
                        id="cambio-amount"
                        label="Nueva cantidad"
                        fullWidth
                        value={amount}
                        onChange={(e) =>
                          setAmount(e.target.value)
                        }
                      />
                      <IconButton
                        onClick={updateStock}
                        children={
                          <CheckIcon
                            style={{
                              fontSize: "inherit",
                              marginLeft: "2px",
                              color: "green",
                            }}
                          />
                        }
                      />
                    </Popover>
                  </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
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