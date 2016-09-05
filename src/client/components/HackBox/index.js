import React, { PropTypes } from 'react'
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import PokeSniperContainer from '@containers/PokeSniperContainer'
import HackToolsContainer from '@containers/HackToolsContainer'
class HackBox extends React.Component {
  static propTypes = {
    selectedTab: PropTypes.string,
    selectedBot: PropTypes.object,
    handleChange: PropTypes.func,
  }

  render() {
    const {
      selectedTab,
      selectedBot,
      handleChange,
    } = this.props

    return (
      <Tabs
        value={selectedTab}
        style={{ width: '100%' }}
        onChange={handleChange}
      >
        <Tab label={"Sniper"} value="sniper">
          <PokeSniperContainer />
        </Tab>
        <Tab label={"Tools"} value="tools">
          <HackToolsContainer />
        </Tab>
      </Tabs>
    )
  }
}

export default HackBox
