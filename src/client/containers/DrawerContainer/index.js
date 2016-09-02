import React from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import Drawer from '@components/Drawer'
import { setDrawerOpen } from '@ducks/layout'

const mapStateToProps = (state) => {
  return {
    drawerOpen: state.layout.get('drawerOpen'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeDrawerState(open) {
      dispatch(setDrawerOpen(open))
    },
    onClickBuscaLink() {
      dispatch(setDrawerOpen(false))
      dispatch(push('/busca'))
    },
    onClickComunidadeLink() {
      dispatch(setDrawerOpen(false))
      dispatch(push('/comunidade'))
    },
    onClickCadastroPessoal() {
      dispatch(setDrawerOpen(false))
      dispatch(push('/cadastro/pessoal'))
    },
    onClickCadastroEmpresarial() {
      dispatch(setDrawerOpen(false))
      dispatch(push('/cadastro/empresarial'))
    },
    onClickMuralLink() {
      dispatch(setDrawerOpen(false))
      dispatch(push('/mural'))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)
