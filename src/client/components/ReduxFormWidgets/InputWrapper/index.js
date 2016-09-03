import React from 'react';

const InputWrapper = ({
  children,
  style,
  props
}) => (
  <div style={{paddingTop: 30, paddingBottom: 30, ...style}} {...props}>
    {children}
  </div>
)

export default InputWrapper;
