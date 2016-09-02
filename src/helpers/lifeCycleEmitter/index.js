import React, { PropTypes } from 'react'

export default (ComposedComponent) => (
  class extends React.Component {
    static propTypes = {
      onComponentDidMount: PropTypes.func,
      onComponentWillReceiveProps: PropTypes.func,
    }
    componentDidMount() {
      const { onComponentDidMount } = this.props
      if (onComponentDidMount && typeof onComponentDidMount === 'function') {
        onComponentDidMount()
      }
    }

    componentWillReceiveProps(nextProps) {
      const { onComponentWillReceiveProps } = this.props
      if (onComponentWillReceiveProps && typeof onComponentWillReceiveProps === 'function') {
        onComponentWillReceiveProps(nextProps)
      }
    }
    render() {
      return <ComposedComponent {...this.props} />
    }
  }
)
