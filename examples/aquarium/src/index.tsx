import React from 'react'
import { render } from 'react-dom'

import { Ocean } from './Ocean'

import './index.scss'

const rootElement = document.getElementById('root')

render(
  <Ocean
    kinds={{
      [`🐠`]: 20,
      [`🐟`]: 15,
      [`🐡`]: 10,
      [`🦑`]: 8,
      [`🐙`]: 5,
    }}
  />,
  rootElement
)
