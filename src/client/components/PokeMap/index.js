import React, { PropTypes } from 'react'
import pokemonsById from '@resources/pokemons'
import itemsById from '@resources/items'
import Bot from '@components/Bot'
import GoogleMap from 'google-map-react';
import keydown, { Keys } from 'react-keydown';
import Encounter from '@components/Encounter'
import moment from 'moment'
import { mapStyle1, mapStyle2 } from '@resources/map_style'
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

class MapElement extends React.Component {
  render() {
    const { src, style, width, height, onClick } = this.props
    const customStyle = mapStyleBuilder(width, height)
    const mergedStyles = Object.assign({}, style, customStyle)
    return (
      <img
        onClick={onClick}
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
    expirationDate: moment(),
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

    const mergedStyles = Object.assign({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, containerStyle, style)
    return (
      <div style={mergedStyles}>
        {
          (moment(expirationDate) > moment()) ?
          (
            <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px 2px 6px', textAlign: 'center', borderRadius: 8 }}>
              {moment(moment(expirationDate).diff(moment())).format('mm:ss')}
            </span>
          )
          : (
            <span style={{ backgroundColor: 'rgba(255,0,0,0.7)', color: 'white', padding: '2px 6px 2px 6px', textAlign: 'center', borderRadius: 8 }}>
              -
            </span>
          )
        }

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
      itemsAwardedDisplay
    } = this.props
    const rotateAngle = selectedBot ? selectedBot.angle : 0
    const mapCenterCoords = selectedBot
    ? { lat: selectedBot.coords.latitude, lng: selectedBot.coords.longitude }
    : { lat: -23.632697, lng: -46.713803 }
    return (
      <div style={{ width: 800, height: 800, overflow: 'hidden' }}>
        <img
          src="http://i537.photobucket.com/albums/ff339/lomastulx/6Actor_5.png"
          ref="botAsset"
          onLoad={this.handleLoad}
          style={{ display: 'none' }}
        />
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{display: 'flex', zIndex: 9999, position: 'absolute', top: 0, left: 0, right: 0, height: 50}}>
            {
              itemsAwardedDisplay.entrySeq().map(([key, items]) => (
                items.map(item => (
                  <div style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
                    <img
                      src={itemsById[item].img}
                      style={{width: 50, height: 50}}
                      />
                  </div>
                ))
              ))
            }
          </div>
          <GoogleMap
            disableDefaultUI
            center={mapCenterCoords}
            zoom={16}
            options={{
              styles: mapStyle1,
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
                    transform: `rotate(-${rotateAngle}deg)`
                  }}
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
                    style={{ transform: `rotate(-${rotateAngle}deg)` }}
                    />
                } else if (fleedEncounters.indexOf(encounter._id) !== -1) {
                  return <MapElement
                    width={FLEE_MAP_WIDTH}
                    height={FLEE_MAP_HEIGHT}
                    src={FLEE_IMG}
                    {...commonKeys}
                    style={{ transform: `rotate(-${rotateAngle}deg)` }}
                    />
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
                onClickCatch={(pokeball) => onClickCatch(selectedBot._id, currentEncounter._id, pokeball)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                />
            }
          </div>
        </div>
      )
    }
  }

  export default keydown(PokeMap)
