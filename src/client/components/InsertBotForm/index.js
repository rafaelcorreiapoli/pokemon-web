import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import GoogleMap from 'google-map-react';
import { reduxForm, Field } from 'redux-form' // imported Field
import Joi from 'joi-browser';
import { RaisedButton, Paper } from 'material-ui'
import InputWrapper from '@components/ReduxFormWidgets/InputWrapper';
import TextInput from '@components/ReduxFormWidgets/TextInput';
import DateInput from '@components/ReduxFormWidgets/DateInput';
import SectionHeader from '@components/ReduxFormWidgets/SectionHeader'
import LatLngInput from '@components/ReduxFormWidgets/LatLngInput'

import language from '@config/joi'
import AutoComplete from 'material-ui/AutoComplete';
import { deserializeFormErrors } from '@utils/form_errors';
import { telefone, celular, cpf } from '@utils/patterns'
import { call } from '@ducks/methods'
import {
  urlRegex,
  passwordRegex,
  telefoneRegex,
  celularRegex,
  cpfRegex,
} from '@utils/regex';
import TextField from 'material-ui/TextField'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
// import GooglePlacesSuggest from 'react-google-places-suggest'

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nickname: Joi.string().label('Nick').required(),
  coords: Joi.object().required(),
  proxy: Joi.string().label('Nick'),
});

const validate = values => {
  const result = Joi.validate(values, schema, { abortEarly: false, language });
  return deserializeFormErrors(result)
}



class InsertBotForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    invalid: PropTypes.bool,
    formValues: PropTypes.object,
  }
  render() {
    const {
      handleSubmit,
      onSubmit,
      invalid,
    } = this.props

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper style={{ paddingTop: 0 }}>
          <Field
            component={LatLngInput}
            name="coords"
          />
          <Field
            label="Google Account"
            component={TextInput}
            name="email"
          />

          <Field
            label="Google Password"
            component={TextInput}
            name="password"
          />

          <Field
            label="Patrolman nickname"
            component={TextInput}
            name="nickname"
          />
        </InputWrapper>

        {/* <RaisedButton
          label={'Create bot!'}
          disabled={invalid}
          primary
          type="submit"
          /> */}
      </form>
    )
  }
}


const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit(values) {
      console.log(values)
      dispatch(call('bots.registerBot', {
        ...values,
      }))
      .then(res => {
        console.log(res)
      })
      .error(err => {
        console.log(err)
      })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(reduxForm({
  form: 'newBot',
  destroyOnUnmount: false,
  validate,
})(InsertBotForm))
