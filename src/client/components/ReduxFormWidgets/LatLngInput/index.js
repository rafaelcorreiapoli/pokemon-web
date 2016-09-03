import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import GoogleMap from 'google-map-react';

const MARKER_WIDTH = 20;
const MARKER_HEIGHT = 34;

const greatPlaceStyle = {
  position: 'absolute',
  width: MARKER_WIDTH,
  height: MARKER_HEIGHT,
  left: -MARKER_WIDTH / 2,
  top: -MARKER_HEIGHT / 2
}

const Marker = () => (
  <div style={greatPlaceStyle}>
    <img src="https://www.google.com/intl/en_ALL/mapfiles/marker.png" />
  </div>
)

class LatLngInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
      selectedPlaceLatLng: null,
      centerLatLng: null,
    }
    this.onPlacesChanged = this.onPlacesChanged.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleLatLngChange = this.handleLatLngChange.bind(this)
  }


  componentDidMount() {
    const input = this.refs.input.input;
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }

  onPlacesChanged() {
    this.setState({
      places: this.searchBox.getPlaces()
    })
  }
  handlePlaceClick(place) {
    const latitude = place.geometry.location.lat()
    const longitude = place.geometry.location.lng()
    this.setState({
      centerLatLng: {
        latitude,
        longitude,
      }
    })
    this.handleLatLngChange(latitude, longitude)
  }

  handleLatLngChange(latitude, longitude) {
    const { input: { onChange } } = this.props
    onChange({
      latitude,
      longitude
    })
  }

  handleMapClick({ lat: latitude, lng: longitude }) {
    this.handleLatLngChange(latitude, longitude)
  }

  render() {
    const {
      input: {
        value
      },
      ...props
    } = this.props
    console.log(this.props)
    const {
      places = [],
      selectedPlaceLatLng,
      centerLatLng
    } = this.state
    console.log(centerLatLng, value)
    return (
      <div>
        <TextField
          ref="input"
          fullWidth
          floatingLabelText={'Search'}
          floatingLabelFixed
          autoComplete="off"
        />
        {!!places.length &&
          <Paper style={{ marginBottom: 10 }}>
            <Menu>
              {
                places && places.slice(0, 5).map((place, i) => (
                  <MenuItem
                    key={i}
                    primaryText={place.name}
                    onClick={() => this.handlePlaceClick(place)}
                  />
                ))
              }
            </Menu>
          </Paper>
        }
        <div style={{ height: 400, width: '100%' }}>
          <GoogleMap
            onClick={this.handleMapClick}
            center={centerLatLng
              ? { lat: centerLatLng.latitude, lng: centerLatLng.longitude }
              : { lat: 10, lng: 10 }}
            zoom={17}
          >
          {
            value &&
            <Marker
              lat={value.latitude}
              lng={value.longitude}
              />
          }
          </GoogleMap>
        </div>
      </div>
    )
  }
}

export default LatLngInput;
