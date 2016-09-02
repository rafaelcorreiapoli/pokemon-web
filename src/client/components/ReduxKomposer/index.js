import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer';


export default
  (composer, mapStateToProps, mapDispatchToProps) =>
    ComposedComponent =>
      connect(mapStateToProps, mapDispatchToProps)(
        composeWithTracker(composer)(ComposedComponent)
      )
