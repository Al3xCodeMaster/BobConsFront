import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useSelector, useDispatch } from "react-redux";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Done from "@material-ui/icons/Done";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { CheckCircleOutline, DeleteOutline } from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Popover from '@material-ui/core/Popover';
import CheckIcon from "@material-ui/icons/Check";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  rootContainer: {
    flexGrow: 1,
  },
  input: {
    display: "none",
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: "white",
    color: "black",
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


export default function Products() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [productID, set_productID] = React.useState("");
  const [productDesc, set_productDesc] = React.useState("");
  const [productPrice, set_productPrice] = React.useState(0);
  const [productPic, set_productPic] = React.useState("");
  const [error_price, set_error_price] = React.useState(false);
  const [error_ID, set_error_ID] = React.useState(false);
  const [error_desc, set_error_desc] = React.useState(false);
  const [error_pic, set_error_pic] = React.useState(false);
  const [error, set_error] = React.useState(false);
  const [success, set_success] = React.useState(false);
  const [message, set_message] = React.useState("");
  const [currentProd, setcurrentProd] = React.useState("");
  const [openDialog, setopenDialog] = React.useState(false);
  const [fetch_categories, set_fetch_categories] = useState([]);
  const [nombre_category, set_nombre_category] = useState("");
  const [nombre_category_temp, set_nombre_category_temp] = useState([]);
  const [cargando, set_cargando] = useState(false);
  const [gilad, set_gilad] = useState(true);
  const [activado, set_activado] = useState("Activo");
  const [options, setOptions] = useState([]);
  const [catPerProd, setCatPerProd] = useState([]);
  const [allAvaibleRest, setAllAvaibleRest] = useState([]);
  const [restPerProd, setRestPerProd] = useState([]);
  const [openDR, setOpenDR] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const componRef = React.useRef();
  const [restSelected, setRestSelected] = useState("");
  const [cantidadProd, setCantidadProd] = useState(0);
  const [discPerProd, setDiscPerProd] = useState([]);
  const [openDiscounts, setOpenDiscounts] = useState(false);
  const [allDiscounts, setAllDiscounts] = useState([]);
  const { usuario } = useSelector((state) => ({
    usuario: state.redux_reducer.usuario,
  }));
  const dispatch = useDispatch();
  const [products, setProds] = React.useState([]);

  const handleClick = (event, valueId) => {
    setRestSelected(valueId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openP = Boolean(anchorEl);
  const id = openP ? "simple-popover-pr" : undefined;

  const getAllProducts = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllProducts", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          setProds(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(getAllProducts, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const checkFields = () => {
    set_error_ID(false);
    set_error_desc(false);
    set_error_price(false);
    set_error_pic(false);
    set_message("");
    set_error(false);
    if (productID == "") {
      set_error(true);
      set_error_ID(true);
      set_message("El ID del producto no puede estar vacio");
    } else if (productDesc == "") {
      set_error(true);
      set_error_desc(true);
      set_message("La descripción no puede estar vacia");
    } else if (productPrice <= 0) {
      set_error(true);
      set_error_price(true);
      set_message("El precio debe ser mayor a cero");
    } else if (productPic == "") {
      set_error(true);
      set_error_pic(true);
      set_message("Seleccione una foto válida");
    } else {
      createProduct();
    }
  };
  const createProduct = () => {
    var formData = new FormData();
    formData.append("photo", productPic);
    formData.append(
      "productInfo",
      JSON.stringify({
        ProductID: productID,
        ProductDescription: productDesc,
        ProductPrice: parseFloat(productPrice),
      })
    );
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "createProduct", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 400) {
          set_message(response.message);
          set_error(true);
        } else {
          set_message("Se creó el producto con éxito!");
          set_success(true);
          set_productID("");
          set_productDesc("");
          set_productPrice(0);
          set_productPic("");
          set_error(false);
          set_error_ID(false);
          set_error_desc(false);
          set_error_price(false);
          set_productPic(false);
        }
      })
      .catch((error) => {
        set_message(error);
        set_error(true);
      });
  };

  const actDesProd = (id_value, status) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProduct", {
      method: "POST",
      body: JSON.stringify({
        ProductID: id_value,
        ProductStatus: !status,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          set_error(true);
          set_message("Error: " + response.error);
          return;
        }
        getAllProducts();
      })
      .catch((err) => {
        set_error(true);
        set_message("Error en la conexión con el servidor " + err);
      });
  };

  const set_Close = () => {
    set_productID("");
    set_productDesc("");
    set_productPrice(0);
    setopenDialog(false);
  };

  const performOperation = () => {
    if (productDesc == "") {
      set_error(true);
      set_error_desc(true);
      set_message("La descripción no puede estar vacia");
    } else if (productPrice <= 0) {
      set_error(true);
      set_error_price(true);
      set_message("El precio debe ser mayor a cero");
    } else {
      fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProduct", {
        method: "POST",
        body: JSON.stringify({
          ProductID: currentProd,
          ProductDescription: productDesc,
          ProductPrice: parseFloat(productPrice),
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.error) {
            set_error(true);
            set_message("Error: " + response.error);
            setopenDialog(false);
            return;
          }
          set_productID("");
          set_productDesc("");
          set_productPrice(0);
          set_message("Se creó el producto con éxito!");
          set_success(true);
          setopenDialog(false);
          getAllProducts();
        })
        .catch((err) => {
          alert("Se produjo un error en el servidor "+err);
        });
    }
  };

  const editProd = (valueID) => {
    set_productID("");
    set_productDesc("");
    set_productPrice(0);
    setcurrentProd(valueID);
    getCatPerProd(valueID);
    setopenDialog(true);
  };
  
  const restProd = (valueID) => {
    setcurrentProd(valueID);
    getRestFromProd(valueID);
  };

  const discountProd = (valueID) => {
    setcurrentProd(valueID);
    getDiscountsFromProd(valueID);
  };

  const set_state_gilad = () => {
    set_gilad(!gilad);
    set_activado(!gilad ? "Activo" : "No activo");
  };

  const add_category = () => {
    let temp_categories = nombre_category_temp;
    if(temp_categories.filter((x) => x.CategoryID === nombre_category).length === 0){
      temp_categories.push({
        CategoryID: nombre_category,
        CategoryStatus: gilad,
      });
      set_nombre_category_temp(temp_categories);
      set_nombre_category("");
      set_gilad(true);
      set_cargando(true);
    }else{
      set_error(true);
      set_message("Ya esta pendiente este producto para crear");
    }
  };

  const eliminar_category_temp = (value) => {
    let temp = nombre_category_temp;
    console.log(value);
    for (let i = 0; i < temp.length; i++) {
      if (value === temp[i].CategoryID) {
        temp.splice(i, 1);
      }
    }
    set_nombre_category_temp(temp);
    set_cargando(false);
  };

  const guardar_categoria = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "createCategory", {
      method: "POST",
      body: JSON.stringify(nombre_category_temp[0]),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
            set_error(true);
            set_message("Error: " + response.error);
            return;
        }
        set_success(true);
        set_message("Categoria agregada con éxito");
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  };

  const perfomSaveRes = () => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "assignProductToRestaurant", {
      method: "POST",
      body: JSON.stringify({
        RestaurantID: parseInt(restSelected),
        ProductID: currentProd,
        RestaurantProductAmount: parseInt(cantidadProd)
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
            set_error(true);
            set_message("Error: " + response.error);
            return;
        }
        getRestFromProd(currentProd);
        handleClose();
        set_success(true);
        set_message("Restaurante agregado con éxito");
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  };

  const perfomUpdateRes = (state, id) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "updateProductToRestaurant", {
      method: "POST",
      body: JSON.stringify({
        RestaurantProductID: parseInt(id),
        RestaurantProductState: state
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
            set_error(true);
            set_message("Error: " + response.error);
            return;
        }
        getRestFromProd(currentProd);
        set_success(true);
        set_message("Estado cambiado con éxito");
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  };
  
  const update_category = (id, status) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "modifyCategory", {
      method: "POST",
      body: JSON.stringify({
        CategoryID: id,
        CategoryStatus: status
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
          set_error(true);
          set_message("Error: " + response.error);
          return;
        }
        set_success(true);
        set_message("Categoria agregada con éxito");
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  };

  const update_discount = (id, status) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "assignDiscountToProduct", {
      method: "POST",
      body: JSON.stringify({
        DiscountID: parseInt(id),
        ProductID: currentProd,
        ProductDiscountStatus: status
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
          set_error(true);
          set_message("Error: " + response.error);
          return;
        }
        getDiscountsFromProd(currentProd);
        set_success(true);
        set_message("Descuento modificado con exito");

      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  };

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllCategories", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          set_fetch_categories(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  useEffect(() => {

    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllDiscounts", {
      method: "GET",
    })
      .then((res) => (res.status === 204 ? [] : res.json()))
      .then((response) => {
        if (response.length > 0) {
          setAllDiscounts(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllActiveCategories", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          setOptions(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  useEffect(() => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "listRestaurantsToClient", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          setAllAvaibleRest(response);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);
  
  const getCatPerProd = (id) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getAllProductCategories/"+id, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
          set_error(true);
          set_message("Error: " + response.error);
          return;
        }
        if(response.length>0){
          setCatPerProd(response);
        }
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  };

  const getRestFromProd = (id) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "getRestaurantsToProduct/"+id, {
      method: "GET"
    })
    .then((res) => (res.status === 204 ? [] : res.json()))
    .then((response) => {
          if(response.error){
            set_error(true);
            set_message("Error: " + response.error);
            return; 
          }
          setRestPerProd(response.map((data) => { return {RestaurantID: data.RestaurantID, 
                                                RestaurantProductID: data.RestaurantProductID,
                                                RestaurantProductState: data.RestaurantProductState}}));
          setOpenDR(true);
    })
    .catch((error) => {
      alert(error);
    });
  };

  const getDiscountsFromProd = (id) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "sendDiscountsForProduct/"+id, {
      method: "GET"
    })
    .then((res) => (res.status === 204 ? [] : res.json()))
    .then((response) => {
          if(response.error){
            set_error(true);
            set_message("Error: " + response.error);
            return; 
          }
          setDiscPerProd(response.map(value => value.DiscountID));
          setOpenDiscounts(true);
    })
    .catch((error) => {
      alert(error);
    });
  };
  

  const addProdToCat = (prodId, catID) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "addProductToCategory", {
      method: "POST",
      body: JSON.stringify({
        ProductID: prodId,
        CategoryID: catID
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
          set_error(true);
          set_message("Error: " + response.error);
          return;
        }
        getCatPerProd(prodId);
        set_success(true);
        set_message("Categoria agregada con éxito");
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  }

  const removeProdToCat = (prodId, catID) => {
    fetch((process.env.REACT_APP_BACKEND || "http://localhost:4000/") + "removeProductFromCategory", {
      method: "POST",
      body: JSON.stringify({
        ProductID: prodId,
        CategoryID: catID
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
          set_error(true);
          set_message("Error: " + response.error);
          return;
        }
        getCatPerProd(prodId);
        set_success(true);
        set_message("Categoria borrada con éxito");
      })
      .catch((err) => {
        alert("Error en la conexión con el servidor: "+err);
      });
  }

  const set_close_res = () => {
    setcurrentProd("");
    setRestPerProd([]);
    setRestSelected("");
    setOpenDR(false);
  }

  const set_close_discounts = () => {
    setcurrentProd("");
    setDiscPerProd([]);
    setOpenDiscounts(false);
  }

  return (
    <div className={classes.root}>
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
          <Tab label="Crear Producto" {...a11yProps(0)} />
          <Tab label="Listar Productos" {...a11yProps(1)} />
          <Tab label="Crear Categoria" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container className={classes.rootContainer} spacing={4}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                error={error_ID}
                value={productID}
                onChange={(e) => set_productID(e.target.value)}
                id="product_id"
                label="ID del Producto"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                id="product_desc"
                label="Descripción"
                error={error_desc}
                multiline
                value={productDesc}
                onChange={(e) => set_productDesc(e.target.value)}
                rowsMax={4}
              />
            </Grid>
            <Grid item xs={3}>
              <InputLabel htmlFor="product_price">Precio</InputLabel>
              <Input
                fullWidth
                error={error_price}
                value={productPrice}
                onChange={(e) => set_productPrice(e.target.value)}
                id="product_price"
                type="number"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={3}>
              <input
                accept="image/*"
                id="raised-button-file"
                style={{ display: "none" }}
                onChange={(e) => set_productPic(e.target.files[0])}
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PhotoCamera />}
                  component="span"
                >
                  Subir Foto
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                onClick={checkFields}
                variant="contained"
                endIcon={<Done />}
                style={{ color: "white", background: "green" }}
              >
                Registrar Producto
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {products.length > 0
                ? products.map((card) => (
                    <Grid
                      item
                      key={card.ProductID}
                      xs={12}
                      sm={6}
                      md={4}
                      style={
                        card.ProductStatus ? { opacity: 1 } : { opacity: 0.5 }
                      }
                    >
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={
                            (process.env.REACT_APP_BACKEND || "http://localhost:4000/")+"getPictureProducts/" +
                            card.ProductPicture
                          }
                          title={card.ProductID}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.ProductID}
                          </Typography>
                          <Typography>{card.ProductDescription}</Typography>
                          <Typography component="p" variant="h5">
                            {"$" + card.ProductPrice}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {card.ProductStatus ? (
                            <IconButton
                              aria-label="eliminar-producto"
                              onClick={(e) =>
                                actDesProd(card.ProductID, card.ProductStatus)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="agregar-producto"
                              onClick={(e) =>
                                actDesProd(card.ProductID, card.ProductStatus)
                              }
                            >
                              <AddBoxIcon />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="editar-producto"
                            onClick={(e) => editProd(card.ProductID)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="asignar-rest"
                            onClick={(e) => restProd(card.ProductID)}
                          >
                            <RestaurantMenuIcon />
                          </IconButton>
                          <IconButton
                            aria-label="asignar-discount"
                            onClick={(e) => discountProd(card.ProductID)}
                          >
                            <MonetizationOnIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                : null}
            </Grid>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
        <Grid container className={classes.root} spacing={5}>
          <Grid item xs={6}>
            <TextField
              id="categories"
              label="Nombre de la categoria"
              disabled={cargando}
              fullWidth
              value={nombre_category}
              onChange={(e) => set_nombre_category(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              value={activado}
              control={
                <Switch
                  disabled={cargando}
                  checked={gilad}
                  onChange={(e) => set_state_gilad()}
                />
              }
              label={activado}
              labelPlacement="top"
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              disabled={cargando}
              style={{ color: "green", marginLeft: "1%" }}
              onClick={(e) => add_category()}
            >
              Agregar
              <CheckCircleOutline
                style={{ fontSize: 30, marginLeft: "10px", color: "green" }}
              />
            </Button>
          </Grid>
        </Grid>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Categoria a guardar
        </h3>
        <TableContainer component={Paper} style={{ width: "100%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre de la categoria</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nombre_category_temp.map((element) => (
                <TableRow key={element.CategoryID}>
                  <TableCell>{element.CategoryID}</TableCell>
                  <TableCell>
                    {element.ProfileStatus ? "Activo" : "No activo"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) =>
                        eliminar_category_temp(element.CategoryID)
                      }
                      children={
                        <DeleteOutline
                          style={{
                            fontSize: 25,
                            marginLeft: "8px",
                            color: "red",
                          }}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: "center", marginTop: "4%" }}>
          <Button
            style={{ color: "white", backgroundColor: "green" }}
            variant="contained"
            endIcon={<Done />}
            onClick={(e) => guardar_categoria()}
          >
            REGISTRAR CATEGORIA
          </Button>
        </div>
        <br></br>
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Categorias registradas
        </h3>
        <TableContainer component={Paper} style={{ width: "97%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetch_categories.map((element) => (
                <TableRow key={element.CategoryID}>
                  <TableCell>{element.CategoryID}</TableCell>
                  <TableCell>
                    {element.CategoryStatus ? "Activo" : "No activo"}
                  </TableCell>
                  <TableCell>
                    {element.CategoryStatus ? (
                      <IconButton
                        onClick={(e) =>
                          update_category(element.CategoryID, false)
                        }
                        children={
                          <DeleteOutline
                            style={{
                              fontSize: 25,
                              marginLeft: "8px",
                              color: "red",
                            }}
                          />
                        }
                      />
                    ) : (
                      <IconButton
                        onClick={(e) =>
                          update_category(
                            element.CategoryID,
                            true
                          )
                        }
                        children={
                          <AddCircleIcon
                            style={{
                              fontSize: 25,
                              marginLeft: "8px",
                              color: "green",
                            }}
                          />
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </TabPanel>
        <Dialog
          open={error}
          onClose={() => set_error(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{ color: "red" }}>
            {"Información:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => set_error(false)}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={success}
          onClose={() => set_success(false)}
          aria-labelledby="alert-dialog-title-t"
          aria-describedby="alert-dialog-description-t"
        >
          <DialogTitle id="alert-dialog-title-t" style={{ color: "green" }}>
            {"Información:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-t">{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => set_success(false)}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDialog}
          onClose={() => set_Close()}
          aria-labelledby="alert-dialog-title-t"
          aria-describedby="alert-dialog-description-t"
        >
          <DialogTitle id="alert-dialog-title-k" style={{ color: "green" }}>
            {"Editar producto: " + currentProd}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="product_desc-ch"
              label="Nueva descripción"
              error={error_desc}
              multiline
              value={productDesc}
              onChange={(e) => set_productDesc(e.target.value)}
              rowsMax={4}
            />
            <InputLabel style={{ marginTop: "8%" }} htmlFor="product_price_k">
              Precio
            </InputLabel>
            <Input
              fullWidth
              error={error_price}
              value={productPrice}
              onChange={(e) => set_productPrice(e.target.value)}
              id="product_price_k"
              type="number"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
            <div className={classes.chips}>
              {options.length>0?options.map((element, index) => {
                return (catPerProd.some((cat => cat.CategoryID === element.CategoryID))?<Chip onDelete={e => removeProdToCat(currentProd, element.CategoryID)} label={""+element.CategoryID} color="primary" variant="outlined"/>:
                <Chip
                label={""+element.CategoryID}
                onClick={e => addProdToCat(currentProd ,element.CategoryID)}
                onDelete={(e) => {}}
                color="primary"
                deleteIcon={<DoneIcon />}
                variant="outlined"
                />);
              })
              :null}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => set_Close()}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Cerrar
            </Button>
            <Button
              onClick={(e) => performOperation()}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Cambiar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDR}
          onClose={() => set_close_res()}
          aria-labelledby="alert-dialog-title-t"
          aria-describedby="alert-dialog-description-t"
        >
          <DialogTitle id="dialog-title-prod-res" style={{ color: "green" }}>
            {"Asignar restaurantes al producto: " + currentProd}
          </DialogTitle>
          <DialogContent>
          <TableContainer component={Paper} style={{ width: "95%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Restaurante</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allAvaibleRest.map((element) => (
                <TableRow key={element.RestaurantID}>
                  <TableCell>{element.RestaurantID}</TableCell>
                  <TableCell>{element.RestaurantName}</TableCell>
                  <TableCell>
                      {
                        restPerProd.some(data => data.RestaurantID === element.RestaurantID)? 
                        restPerProd.find(data => data.RestaurantID === element.RestaurantID).RestaurantProductState?
                        <IconButton
                                onClick={(e) => perfomUpdateRes(false, restPerProd.find(data => data.RestaurantID === element.RestaurantID).RestaurantProductID)}
                                children={
                                  <CheckBoxIcon
                                    style={{color: 'green', fontSize: 'inherit', marginLeft: "2px" }}
                                  />
                                  }
                        />:
                        <IconButton
                                onClick={(e) => perfomUpdateRes(true, restPerProd.find(data => data.RestaurantID === element.RestaurantID).RestaurantProductID)}
                                children={
                                  <CheckBoxOutlineBlankIcon
                                    style={{fontSize: 'inherit', marginLeft: "2px" }}
                                  />
                                  }
                        />:
                        <div>
                        <IconButton
                          onClick={(e) => handleClick(e, element.RestaurantID)}
                          children={
                            <AddCircleIcon
                              style={{color: 'green', fontSize: 'inherit', marginLeft: "2px" }}
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
                            Disponibilidad
                          </Typography>
                          <TextField
                            id="cambio-cantidad"
                            label="Ingrese cantidad"
                            fullWidth
                            type="number"
                            value={cantidadProd}
                            onChange={(e) => setCantidadProd(e.target.value)
                            }
                          />
                          <IconButton
                            onClick={perfomSaveRes}
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
                        </div>
                      }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => set_close_res()}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDiscounts}
          onClose={() => set_close_discounts()}
          aria-labelledby="alert-dialog-title-disc"
          aria-describedby="alert-dialog-description-disc"
        >
          <DialogTitle id="dialog-title-prod-discounts" style={{ color: "green" }}>
            {"Asignar descuentos: " + currentProd}
          </DialogTitle>
          <DialogContent>
          <TableContainer component={Paper} style={{ width: "95%" }}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDiscounts.map((element) => (
                <TableRow key={element.DiscountID}>
                  <TableCell>{element.DiscountID}</TableCell>
                  <TableCell>{element.DiscountName}</TableCell>
                  <TableCell>{element.DiscountDescription}</TableCell>
                  <TableCell>{element.DiscountPercentage}</TableCell>
                  <TableCell>
                  {discPerProd.length>0 ? 
                    discPerProd.includes(element.DiscountID)?
                    (
                      <IconButton
                        onClick={(e) =>
                          update_discount(element.DiscountID, false)
                        }
                        children={
                          <DeleteOutline
                            style={{
                              fontSize: 'inherit',
                              marginLeft: "8px",
                              color: "red",
                            }}
                          />
                        }
                      />
                    ) : (
                      <IconButton
                        onClick={(e) =>
                          update_discount(
                            element.DiscountID,
                            true
                          )
                        }
                        children={
                          <AddCircleIcon
                            style={{
                              fontSize: 'inherit',
                              marginLeft: "8px",
                              color: "green",
                            }}
                          />
                        }
                      />
                    ):
                    <IconButton
                        onClick={(e) =>
                          update_discount(
                            element.DiscountID,
                            true
                          )
                        }
                        children={
                          <AddCircleIcon
                            style={{
                              fontSize: 'inherit',
                              marginLeft: "8px",
                              color: "green",
                            }}
                          />
                        }
                      />
                  }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => set_close_discounts()}
              color="primary"
              variant="outlined"
              color="primary"
              autoFocus
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </SwipeableViews>
    </div>
  );
}
