import React, { PropTypes } from 'react'
import pokemonsById from '@resources/pokemons'
import Bot from '@components/Bot'
import GoogleMap from 'google-map-react';
import keydown, { Keys } from 'react-keydown';
import Encounter from '@components/Encounter'
import moment from 'moment'

const mapStyleBuilder = (width, height) => ({
  position: 'absolute',
  width,
  height,
  left: -width / 2,
  top: -height / 2,
})
const POKESTOP_MAP_WIDTH = 31
const POKESTOP_MAP_HEIGHT = 31
const POKEBALL_MAP_WIDTH = 50
const POKEBALL_MAP_HEIGHT = 50
const FLEE_MAP_WIDTH = 50
const FLEE_MAP_HEIGHT = 50
const POKEBALL_IMG = 'http://vignette1.wikia.nocookie.net/thelorienlegacies/images/2/2c/4129-pokemon-pokeball.png/revision/latest?cb=20140822201518'
const POKESTOP_IMG = 'https://raw.githubusercontent.com/PokemonGoMap/PokemonGo-Map/develop/static/forts/Pstop.png'
const FLEE_IMG = 'http://vignette3.wikia.nocookie.net/roblox/images/c/c6/Smoke.png/revision/latest?cb=20091213220753'
const IDLE_BOT_IMG = 'https://www.google.com/intl/en_ALL/mapfiles/marker.png'
const IDLE_BOT_WIDTH = 20
const IDLE_BOT_HEIGHT = 34

const mapStyle = [
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#a1f199',
      },
    ],
  },
  {
    'featureType': 'landscape.natural.landcover',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#37bda2',
      },
    ],
  },
  {
    'featureType': 'landscape.natural.terrain',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#37bda2',
      },
    ],
  },
  {
    'featureType': 'poi.attraction',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'visibility': 'on',
      },
    ],
  },
  {
    'featureType': 'poi.business',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#e4dfd9',
      },
    ],
  },
  {
    'featureType': 'poi.business',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#37bda2',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#84b09e',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#fafeb8',
      },
      {
        'weight': '1.25',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#5ddad6',
      },
    ],
  },
]


class MapElement extends React.Component {
  render() {
    const { src, style, width, height } = this.props
    const customStyle = mapStyleBuilder(width, height)
    const mergedStyles = Object.assign({}, style, customStyle)
    return (
      <img
        style={mergedStyles}
        src={src}
      />
    )
  }
}


class EncounterMap extends React.Component {
  static propTypes = {
    pokemonId: PropTypes.number.isRequired,
    expirationDate: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  }
  static defaultProps = {
    expirationDate: moment()
  }
  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      loaded: false,
    }
    this.handleLoad = this.handleLoad.bind(this)
  }
  handleLoad(e) {
    const target = e.target
    const { width, height } = target
    this.setState({
      width,
      height,
      loaded: true,
    })
  }
  render() {
    const { pokemonId, onClick, style, expirationDate } = this.props
    const { width, height, loaded } = this.state
    const imgStyle = loaded
      ? {}
      : { display: 'none' }

    const containerStyle = loaded ? mapStyleBuilder(width, height) : {}

    const mergedStyles = Object.assign({display: 'flex', flexDirection: 'column', alignItems: 'center'}, containerStyle, style)
    return (
      <div style={mergedStyles}>
        <span style={{backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px 2px 6px', textAlign: 'center', borderRadius: 8}}>
          {moment(moment(expirationDate).diff(moment())).format('mm:ss')}
        </span>
        <img
          style={imgStyle}
          src={pokemonsById[pokemonId].encounterImg}
          onLoad={this.handleLoad}
          onClick={onClick}
        />
  </div>
    )
  }
}
class PokeMap extends React.Component {
  static propTypes = {
    encounters: PropTypes.array.isRequired,
    bots: PropTypes.array.isRequired,
    pokestops: PropTypes.array.isRequired,
    onMapClick: PropTypes.func.isRequired,
    onBotClick: PropTypes.func.isRequired,
    selectedBot: PropTypes.object,
    onPokestopClick: PropTypes.func.isRequired,
    currentEncounter: PropTypes.object,
    catchedEncounters: PropTypes.array.isRequired,
    fleedEncounters: PropTypes.array.isRequired,
    onClickCatch: PropTypes.func.isRequired,
    onClickRun: PropTypes.func.isRequired,
    onClickMapPokemon: PropTypes.func.isRequired,
    onLeft: PropTypes.func.isRequired,
    onRight: PropTypes.func.isRequired,
    onUp: PropTypes.func.isRequired,
    onDown: PropTypes.func.isRequired,
    currentEncounterCP: PropTypes.number,
  }
  static defaultProps = {
    encounters: [],
    bots: [],
    pokestops: [],
    catchedEncounters: [],
    fleedEncounters: [],
  }
  constructor(props) {
    super(props)
    this.state = {
      assetsLoaded: false,
      angle: 0,
    }
    this.handleLoad = this.handleLoad.bind(this)
    this.handleGoogleApiLoaded = this.handleGoogleApiLoaded.bind(this)
  }
  handleLoad() {
    this.setState({
      assetsLoaded: true,
    })
  }

  handleGoogleApiLoaded({ maps }) {
    if (this.keyListener) return;
    const {
      onLeft,
      onRight,
      onUp,
      onDown,
    } = this.props
    this.keyListener = maps.event.addDomListener(document, 'keyup', (e) => {
      const { selectedBot } = this.props
      const code = (e.keyCode ? e.keyCode : e.which);
      switch (code) {
        case 39:
          onLeft(selectedBot._id)
          break;
        case 37:
          onRight(selectedBot._id)
          break;
        case Keys.UP:
          onUp(selectedBot._id)
          break;
        case Keys.DOWN:
          onDown(selectedBot._id)
          break;
        default:
      }
    });
    console.log(this.keyListener)
  }

  render() {
    const {
      encounters,
      bots,
      pokestops,
      selectedBot,
      onPokestopClick,
      currentEncounter,
      catchedEncounters,
      fleedEncounters,
      onClickMapPokemon,
      currentEncounterCP,
      onClickRun,
      onClickCatch,
    } = this.props
    const rotateAngle = selectedBot ? selectedBot.angle : 0
    const mapCenterCoords = selectedBot
      ? { lat: selectedBot.coords.latitude, lng: selectedBot.coords.longitude }
      : { lat: -23.632697, lng: -46.713803 }
    return (
      <div style={{ width: 800, height: 800, overflow: 'hidden'}}>
        <img
          src="http://i537.photobucket.com/albums/ff339/lomastulx/6Actor_5.png"
          ref="botAsset"
          onLoad={this.handleLoad}
          style={{ display: 'none' }}
        />
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
          <GoogleMap
            disableDefaultUI
            center={mapCenterCoords}
            zoom={16}
            options={{
              styles: mapStyle,
              heading: 10,
              keyboardShortcuts: false,
            }}
            onGoogleApiLoaded={this.handleGoogleApiLoaded}
            yesIWantToUseGoogleMapApiInternals
            style={{
              height: Math.sqrt(2) * 800,
              width: Math.sqrt(2) * 800,
              position: 'absolute',
              marginLeft: '-25%',
              marginTop: '-25%',
              transform: `rotate(${rotateAngle}deg)`,
              //WebkitBackfaceVisibility: 'hidden'
              //transformOrigin: '50% 50%'
            }}
          >

            {(this.state.assetsLoaded && bots) && bots.map((bot, key) => {
              const coords = bot.coords
              if (coords) {
                return bot.selected ? (
                  <Bot
                    key={key}
                    image={this.refs.botAsset}
                    angle={90}
                    lat={coords.latitude}
                    lng={coords.longitude}
                    style={{
                      ...mapStyleBuilder(32, 32),
                      transform: `rotate(-${rotateAngle}deg)` }}
                  />
                ) : (
                  <MapElement
                    src={IDLE_BOT_IMG}
                    width={IDLE_BOT_WIDTH}
                    height={IDLE_BOT_HEIGHT}
                    key={key}
                    lat={coords.latitude}
                    lng={coords.longitude}
                  />
                )
              }
              return null
            })}
            {pokestops && pokestops.map((pokestop, key) => (
              <MapElement
                width={POKESTOP_MAP_WIDTH}
                height={POKESTOP_MAP_HEIGHT}
                src={POKESTOP_IMG}
                key={key}
                onClick={() => onPokestopClick(selectedBot._id, pokestop._id)}
                lat={pokestop.latitude}
                lng={pokestop.longitude}
                style={{ transform: `rotate(-${rotateAngle}deg)` }}
              />
            ))}
            {encounters && encounters.map((encounter, key) => {
              const commonKeys = {
                lat: encounter.latitude,
                lng: encounter.longitude,
                key,
              }
              if (catchedEncounters.indexOf(encounter._id) !== -1) {
                return <MapElement
                  width={POKEBALL_MAP_WIDTH}
                  height={POKEBALL_MAP_HEIGHT}
                  src={POKEBALL_IMG}
                  {...commonKeys}
                  style={{ transform: `rotate(-${rotateAngle}deg)` }} />
              } else if (fleedEncounters.indexOf(encounter._id) !== -1) {
                return <MapElement
                  width={FLEE_MAP_WIDTH}
                  height={FLEE_MAP_HEIGHT}
                  src={FLEE_IMG}
                  {...commonKeys}
                  style={{ transform: `rotate(-${rotateAngle}deg)` }} />
              } else {
                return (
                  <EncounterMap
                    onClick={() => onClickMapPokemon(selectedBot._id, encounter._id)}
                    pokemonId={encounter.pokedexNumber}
                    expirationDate={encounter.expirationDate}
                    style={{ transform: `rotate(-${rotateAngle}deg) translatez(0) scale(0.99)` }}
                    {...commonKeys}
                  />
                )
              }
            })}
          </GoogleMap>
          {currentEncounter &&
            <Encounter
              pokedexNumber={currentEncounter.pokedexNumber}
              cp={currentEncounterCP}
              catched={catchedEncounters.indexOf(currentEncounter._id) !== -1}
              fleed={fleedEncounters.indexOf(currentEncounter._id) !== -1}
              onClickRun={() => onClickRun(selectedBot._id)}
              onClickCatch={() => onClickCatch(selectedBot._id, currentEncounter._id)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          }
        </div>
        {/* <GoogleMapLoader
          containerElement={
          <div
          style={{
          height: '800px',
          }}
          />
          }
          googleMapElement={
          <GoogleMap
          // ref={(map) => console.log(map)}
          defaultZoom={18}
          defaultCenter={{ lat: -23.632746, lng: -46.713787 }}
          onClick={(e) => onMapClick(selectedBot, e.latLng.lat(), e.latLng.lng())}
          >
          {encounters && encounters.map((encounter, key) => (
          <Marker
          animation={currentEncounter === encounter._id
          ? google.maps.Animation.BOUNCE
          : null}
          opacity={catchedEncounters.indexOf(encounter._id) !== -1 ? 0.5 : 1}
          key={key}
          onClick={() => {
          if (currentEncounter === encounter._id) {
          onCatchPokemon(selectedBot, encounter._id)
          } else {
          onClickMapPokemon(selectedBot, encounter._id)
          }
          }}
          position={{
          lat: encounter.latitude,
          lng: encounter.longitude,
          }}
          icon={fleedEncounters.indexOf(encounter._id) === -1
          ? pokemonsById[encounter.get('pokedexNumber')].img
          : 'https://lh3.googleusercontent.com/-iCtUZjU0hFQ/AAAAAAAAAAI/AAAAAAAAAQo/-ugYw1XIMHE/s46-c-k-no/photo.jpg'}
          />
          ))}

          {bots && bots.map((bot, key) => {
          const coords = bot.coords
          if (coords) {
          return (
          <Marker
          key={key}
          icon={selectedBot === bot._id ? 'http://www.ps4-magazin.de/wcf/images/avatars/avatar-9254.gif' : null}
          onClick={() => onBotClick(bot._id)}
          position={{
          lat: coords.latitude,
          lng: coords.longitude,
          }}
          />
          );
          }
          return null
          })}

          {pokestops && pokestops.map((pokestop, key) => (
          <Marker
          key={key}
          icon={'http://megaicons.net/static/img/icons_sizes/15/534/32/map-marker-ball-left-pink-icon.png'}
          onClick={() => onPokestopClick(selectedBot, pokestop._id)}
          position={{
          lat: pokestop.latitude,
          lng: pokestop.longitude,
          }}
          />
          ))}
          </GoogleMap>
          }
          /> */}
        </div>
      )
  }
  }

export default keydown(PokeMap)
