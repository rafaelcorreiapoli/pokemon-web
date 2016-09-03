import React, { PropTypes } from 'react'

const SectionHeader = ({
  text
}) => (
  <h3 style={{fontWeight: 300, fontSize: 34, marginBottom: 10}}>
    {text}
  </h3>
)

export default SectionHeader
