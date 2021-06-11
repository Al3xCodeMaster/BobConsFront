import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Geocode from "react-geocode";
import { connect } from 'react-redux';
import { set_coordinates, set_Address} from '../../redux/actions';
import { withRouter, Redirect } from 'react-router-dom';
Geocode.setApiKey("AIzaSyDcpnTaFMV5WjJULkv5HTKX5kHw7FeL8A4");
// set response language. Defaults to english.
Geocode.setLanguage("en");
 
// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");
 
// Enable or disable logs. Its optional.
Geocode.enableDebug();

class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marker:
      {
        title: "The marker`s title will appear as a tooltip.",
        name: "SOMA",
        position: { lat: 37.778519, lng: -122.40564 }
      },
      direccion:'',
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    };
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  }

  onMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        alert(address);
        this.props.set_Address(address);
      },
      error => {
        alert(error);
        this.props.set_Address(error);
      }
    );
    this.props.set_coordinates({ lat, lng });
  };
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
  render() {
    const { coordenadas, direccion } = this.props;
    return (
      <div>
        <Map
          google={this.props.google}
          style={{ width: "50%", height: '50%'}}
          className={"map"}
          zoom={16}
          center={coordenadas}
        >
          <Marker onClick={this.onMarkerClick}
            position={coordenadas}
            draggable={true}
            name={this.state.selectedPlace.name}
            onClick={this.onMarkerClick}
            onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            <div>
              <h1>{direccion}</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

const MapContainer = GoogleApiWrapper({
  apiKey: ("AIzaSyDcpnTaFMV5WjJULkv5HTKX5kHw7FeL8A4")
})(Mapa);

const mapStateToProps = (state) => {
  return {
    coordenadas: state.redux_reducer.coordenadas,
    direccion: state.redux_reducer.direccion,
  };
}
const mapDispatchToProps = {
  set_coordinates,
  set_Address,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MapContainer)

);