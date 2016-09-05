import { connect } from 'react-redux'
import HackBox from '@components/HackBox'
import { selectTab } from '@ducks/hackbox'

const mapStateToProps = state => {
  return {
    selectedTab: state.hackbox.get('selectedTab')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleChange(tab) {
      dispatch(selectTab(tab))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HackBox)
