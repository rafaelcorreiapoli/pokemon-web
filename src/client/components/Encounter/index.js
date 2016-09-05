import React, { PropTypes } from 'react'
import { Paper, FlatButton, RaisedButton } from 'material-ui'
import pokemonsById from '@resources/pokemons'
import itemsById from '@resources/items'

const styles = {
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 'initial',
    width: 50,
    minWidth: 'initial',
    rippleColor: 'white',
    height: 50,
    marginLeft: 20,
    borderRadius: 25,
    //border: '2px solid black',
  },
  runImg: {
    width: 35,
    height: 35,
    display: 'block',
  },
  pokeballImg: {
    width: 50,
    height: 50,
  },
  mainImg: {
    margin: 20,
    width: 150,
    height: 150,
  },
  actionRow: {
    display: 'flex',
    position: 'absolute',
    bottom: 50,
  },
  cp: {
    marginBottom: 10,
  },
  catched: {
    marginBottom: 10,
    color: 'green',
  },
  fleed: {
    marginBottom: 10,
    color: 'gray',
  },
}
/*
{height: 'inherit', padding: 0, lineHeight: 'inherit', width: 50, minWidth: 50, height: 50, borderRadius: 25, rippleColor: 'white'}
*/
class Encounter extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    pokedexNumber: PropTypes.number.isRequired,
    cp: PropTypes.number.isRequired,
    onClickRun: PropTypes.func.isRequired,
    onClickCatch: PropTypes.func.isRequired,
    fleed: PropTypes.bool,
    catched: PropTypes.bool
  }
  render() {
    const { style, pokedexNumber, cp, onClickRun, onClickCatch, catched, fleed } = this.props
    const mergedStyles = Object.assign({}, styles.container, style)

    const drawTitle = () => {
      if (catched) {
        return <h3 style={styles.catched}>Catch!</h3>
      }
      if (fleed) {
        return <h3 style={styles.fleed}>Pokemon ran away...</h3>
      }

      return <h3 style={styles.cp}>CP: {cp}</h3>
    }
    const drawMainImage = () => {
      if (catched) {
        return (
          <img
            src="http://vignette1.wikia.nocookie.net/thelorienlegacies/images/2/2c/4129-pokemon-pokeball.png/revision/latest?cb=20140822201518"
            style={styles.mainImg}
          />
        )
      }
      if (fleed) {
        return (
          <img
            src="http://vignette3.wikia.nocookie.net/roblox/images/c/c6/Smoke.png/revision/latest?cb=20091213220753"
            style={styles.mainImg}
          />
        )
      }
      return <img src={pokemonsById[pokedexNumber].encounterImg} style={styles.mainImg} />
    }
    return (
      <Paper style={mergedStyles}>
        {drawTitle()}
        {drawMainImage()}
        <div style={styles.actionRow}>
        {
          catched || fleed
          ? <RaisedButton
            primary
            label={'CLOSE'}
            onClick={onClickRun}
          />
          :
            <div style={{ display: 'flex' }}>
              {
                [1, 2, 3, 4].map(i => (
                  <FlatButton style={styles.button} onClick={() => onClickCatch(i)}>
                    <img
                      style={styles.pokeballImg}
                      src={itemsById[i].img}
                    />
                  </FlatButton>
                ))
              }
              <FlatButton style={styles.button} onClick={onClickRun}>
                <img
                  style={styles.runImg}
                  src="https://camo.githubusercontent.com/642cce8f6da1c3b2c7903313957c5a0e40430e17/68747470733a2f2f63646e322e69636f6e66696e6465722e636f6d2f646174612f69636f6e732f77696e646f77732d382d6d6574726f2d7374796c652f3531322f72756e6e696e672e706e67"
                />
              </FlatButton>
            </div>
        }
        </div>

      </Paper>
    )
  }
}

export default Encounter;
