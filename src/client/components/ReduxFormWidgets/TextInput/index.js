import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField';


const TextInput = ({
  label,
  meta: {
    error,
    touched
  },
  input,
  ...props
}) => {

  return (
    <TextField
      errorText={touched && error}
      fullWidth={true}
      floatingLabelText={label}
      floatingLabelFixed={true}
      autoComplete="off"
      {...input}
      {...props}
    />
  )
}

export default TextInput
