import React from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import { useSelector, useDispatch } from 'react-redux';
import MapContainer from './map_container';
import { set_coordinates, set_Address } from '../../redux/actions';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
    input: { width: '93%', borderRadius: '3px', padding: '20px 20px', margin: '8px 0', border: '1px solid #ccc' },
    root: {
        width: '100%',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: '1%',
        fontSize:'13px'
    },
}));

export default function Search_location() {
    const [address, setAddress] = React.useState("");
    const classes = useStyles();
    const { coordenadas, direccion } = useSelector(state => ({
        coordenadas: state.redux_reducer.coordenadas,
        direccion: state.redux_reducer.direccion,
    }));
    const dispatch = useDispatch()
    const [coordinates, setCoordinates] = React.useState({
        lat: null,
        lng: null
    });

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setCoordinates(latLng);
        dispatch(set_coordinates(latLng));
        dispatch(set_Address(value));

    };

    return (

        <Grid container spacing={5}>
            <Grid item xs={5}>
                <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <div>
                                <Card className={classes.root} variant="outlined">
                                    <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                            Información Dirección
                                        </Typography>
                                            <p>Latitude: {coordenadas.lat}</p>
                                            <p>Longitude: {coordenadas.lng}</p>
                                            <p>Dirección: {direccion}</p>
                                            <p>Una vez haya terminado de ingresar su dirección en la casilla de abajo presione enter para buscarla.</p>
                                            <p>En caso de que no encuentre su dirección en el buscador puede arrastrar el marcador a la posición que desea</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <input className={classes.input} {...getInputProps({ placeholder: "Escripe la dirección..." })} />

                            <div>
                                {loading ? <div>...loading</div> : null}

                                {suggestions.map( (suggestion, index) => {
                                    const style = {
                                        backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                                    };

                                    return (
                                        <div key={index} {...getSuggestionItemProps(suggestion, { style })}>
                                            {suggestion.description}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    )}
                </PlacesAutocomplete>
            </Grid>
            <Grid item xs={7}>
                <div><MapContainer /></div>
            </Grid>
        </Grid>
    );
}