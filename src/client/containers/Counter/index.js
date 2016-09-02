import { connect } from 'react-redux'
import Counter from 'client/components/Counter'
import { getCount, increaseCount, decreaseCount } from 'client/ducks/counter'

const mapStateToProps = (state) => ({
  count: getCount(state),
})
const mapDispatchToProps = (dispatch) => ({
  increaseCount() {
    dispatch(increaseCount())
  },
  decreaseCount() {
    dispatch(decreaseCount())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
