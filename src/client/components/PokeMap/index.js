import React, { PropTypes } from 'react'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';
import pokemonsById from '@resources/pokemons'

class PokeMap extends React.Component {
  static propTypes = {
    encounters: PropTypes.array.isRequired,
    bots: PropTypes.array.isRequired,
    pokestops: PropTypes.array.isRequired,
    onMapClick: PropTypes.func.isRequired,
    onBotClick: PropTypes.func.isRequired,
    selectedBot: PropTypes.string.isRequired,
    onPokestopClick: PropTypes.func.isRequired,
    currentEncounter: PropTypes.string,
    catchedEncounters: PropTypes.array.isRequired,
    fleedEncounters: PropTypes.array.isRequired,
    onCatchPokemon: PropTypes.func.isRequired,
    onEncounterPokemon: PropTypes.func.isRequired,
  }
  static defaultProps = {
    encounters: [],
    bots: [],
    pokestops: [],
    catchedEncounters: [],
    fleedEncounters: [],
  }
  render() {
    const {
      encounters,
      bots,
      pokestops,
      onMapClick,
      onBotClick,
      selectedBot,
      onPokestopClick,
      currentEncounter,
      catchedEncounters,
      fleedEncounters,
      onCatchPokemon,
      onEncounterPokemon,
    } = this.props
    return (
      <div>
        <GoogleMapLoader
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
                      onEncounterPokemon(selectedBot, encounter._id)
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
        />
      </div>
    )
  }
}

export default PokeMap
