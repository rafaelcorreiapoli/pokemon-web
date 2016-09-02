import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MDSpinner from 'react-md-spinner';
import styles from './styles';
import { Facebook, Linkedin } from '@resources/icons'
import OrSeparator from '../OrSeparator'
import Radium from 'radium'

const hideAutoFillColorStyle = {
  WebkitBoxShadow: '0 0 0 1000px white inset',
};

class LoginForm extends React.Component {
  static propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    error: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onChangeEmail: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired,
    onClickRecuperarSenha: PropTypes.func.isRequired,
    onLoginWithPassword: PropTypes.func,
    onLoginWithFacebook: PropTypes.func,
    onLoginWithLinkedin: PropTypes.func,
    style: PropTypes.object,
  }

  render() {
    console.log(this.props)
    const {
      email,
      password,
      onChangeEmail,
      onChangePassword,
      onLoginWithPassword,
      error,
      success,
      loading,
      style,
      onClickRecuperarSenha,
      onLoginWithFacebook,
      onLoginWithLinkedin,
      redirect,
      ...props,
    } = this.props

    return (
      <div style={[style, styles.container]} {...props}>
        <h1 style={{ fontWeight: 200 }}>Login</h1>

        <RaisedButton
          style={{ marginBottom: 20, minWidth: 300, width: '50%' }}
          labelPosition="after"
          onClick={onLoginWithFacebook}
          label="LOGIN COM FACEBOOK"
          icon={<Facebook size={24} />}
          backgroundColor="#3b5998"
          labelColor="white"
        />

        {onLoginWithLinkedin &&
          <RaisedButton
            style={{ minWidth: 300, width: '50%' }}
            labelPosition="after"
            onClick={onLoginWithLinkedin}
            label="LOGIN COM LINKEDIN"
            icon={<Linkedin size={24} style={{ marginBottom: 4 }} />}
            backgroundColor="#007bb5"
            labelColor="white"
          />
        }
        {onLoginWithPassword &&
          <div>
            <OrSeparator style={{ marginTop: 20, marginBottom: 20, alignSelf: 'stretch' }} />
            <form autoComplete="off" style={styles.form}>
              {error &&
                <span style={styles.error}>
                  {(error.error === 403 && error.reason === 'User not found')
                    && 'Usuário não encontrado'}
                  {(error.error === 403 && error.reason === 'Incorrect password')
                    && 'Senha incorreta'}
                </span>
              }
              {loading &&
                <MDSpinner />
              }
              {success &&
                <span style={styles.success}>
                  Logado com sucesso!
                </span>
              }
              <TextField
                fullWidth
                name="email"
                id="email"
                value={email}
                onChange={(e, email) => onChangeEmail(email)}
                hintText="Email"
                floatingLabelText="Email ou usuário"
                inputStyle={hideAutoFillColorStyle}
              />
              <TextField
                fullWidth
                name="password"
                id="password"
                value={password}
                onChange={(e, password) => onChangePassword(password)}
                hintText="Senha"
                floatingLabelText="Senha"
                inputStyle={hideAutoFillColorStyle}
                type="password"
              />


              <RaisedButton
                style={{ minWidth: 300, width: '50%', marginTop: 30, marginBottom: 10 }}
                onClick={() => onLoginWithPassword(email, password)}
                label="LOGIN"
                labelPosition="after"
                labelColor="white"
                primary
              />

              <FlatButton
                style={{ minWidth: 300, width: '50%' }}
                label="Esqueceu a senha?"
                onClick={onClickRecuperarSenha}
              />
            </form>
          </div>
        }
      </div>
    )
  }
}

export default Radium(LoginForm)
