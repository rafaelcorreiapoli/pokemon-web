import React, { PropTypes } from 'react'
import Radium from 'radium'
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rule: {
    height: 1,
    width: '100%',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#ddd'
  },
  text: {
    whiteSpace: 'nowrap',
    color: '#ddd'
  }
}
const OrSeparator = ({
  style,
  ...props
}) => {
  return (
    <div style={[styles.container, style]} {...props}>
      <div style={styles.rule} />
      <span style={styles.text}>ou entrar com email</span>
      <div style={styles.rule} />
    </div>
  )
}

export default Radium(OrSeparator)
