import React, { PropTypes } from 'react'
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import PokemonsListContainer from '@containers/PokemonsListContainer'
import EggsListContainer from '@containers/EggsListContainer'
import ItemsListContainer from '@containers/ItemsListContainer'
import ProfileContainer from '@containers/ProfileContainer'

class GameScreen extends React.Component {
  static propTypes = {
    selectedTab: PropTypes.string,
    selectedBot: PropTypes.object,
    handleChange: PropTypes.func,
  }

  render() {
    const {
      selectedTab,
      selectedBot,
      hasToken,
      handleChange,
      onLoginBot,
      pokemonsCount,
      pokemonsMaxCount,
    } = this.props
    if (selectedBot) {
      if (hasToken) {
        return (
          <Tabs
            value={selectedTab}
            style={{ width: '100%' }}
            onChange={handleChange}
          >
            <Tab label={`Pokemons (${pokemonsCount}/${pokemonsMaxCount})`} value="pokemons">
              <PokemonsListContainer selectedBotId={selectedBot._id} />
            </Tab>
            {/* <Tab label="Eggs" value="eggs">
              <EggsListContainer botId={selectedBot} />
            </Tab> */}
            <Tab label="Inventory" value="items">
              <ItemsListContainer />
            </Tab>
            {/* <Tab label="Profile" value="profile">
              <ProfileContainer />
            </Tab> */}
          </Tabs>
        )
      }
      return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RaisedButton
            onClick={() => onLoginBot(selectedBot._id)}
            primary
            label="LOGIN BOT"
          />
        </div>
      )
    }
    return (
      <div>Please select a bot</div>
    )

  }
}

export default GameScreen
