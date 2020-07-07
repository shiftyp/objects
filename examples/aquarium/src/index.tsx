import React from 'react'
import { render } from 'react-dom'

import { Fish } from './Fish.component'

import 'preact/devtools'

const rootElement = document.getElementById('root')

render(
  <>
    <Fish id="medium" speed={6}>
      🐟
    </Fish>
    <Fish id="fast" speed={10}>
      🐠
    </Fish>
    <Fish id="slow" speed={2}>
      🐡
    </Fish>
    <Fish id="v-slow" speed={1}>
      🐙
    </Fish>
  </>,
  rootElement
)
