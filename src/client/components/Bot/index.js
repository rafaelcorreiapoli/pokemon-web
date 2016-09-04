import React, { PropTypes } from 'react'
import { Rect, Stage, Layer, Sprite} from 'react-konva'

const IndexToAngle = {
  0: 270,
  1: 180,
  2: 0,
  3: 90,
  4: 225,
  5: 315,
  6: 135,
  7: 45
}
const buildAnimationArray = () => {
  const arr = []
  let animations = {}
  for (let j = 0; j < 8; j++) {
    let newArray = []
    for (let i = 0; i < 6; i++) {
      const a = [i * 32, j * 32, 32, 32]
      newArray = newArray.concat(a)
    }
    animations[IndexToAngle[j]] = newArray
  }
  return animations
}

buildAnimationArray()

class Bot extends React.Component {
  handleClick() {
    this.refs.sprite.start()
  }

  render() {
    const {
      image,
      angle,
      style
    } = this.props
    var animations = buildAnimationArray()
    return (
      <Stage width={32} height={32} style={style}>
        <Layer>
          <Sprite
            onClick={this.handleClick.bind(this)}
            ref="sprite"
            x={0}
            y={0}
            image={image}
            animation={String(angle)}
            animations={animations}
            frameRate={7}
            frameIndex={0}
          />
        </Layer>
      </Stage>
    )
  }
}

export default Bot;
