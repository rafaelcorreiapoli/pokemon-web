import React, { PropTypes } from 'react'
import Counter from '@containers/Counter'
import EggsList from '@containers/EggsList'
import EggMethodListener from '@containers/EggMethodListener'
import PokeMap from '@containers/PokeMapContainer'
import AuthenticatedLayout from '@components/AuthenticatedLayout'

class Welcome extends React.Component {
  render() {
    return (
      <AuthenticatedLayout>
        <PokeMap />
      </AuthenticatedLayout>
    )
  }
}

export default Welcome;
