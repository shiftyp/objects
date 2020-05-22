import React, { useEffect, useState, useRef } from 'react';
import { render } from 'react-dom';
import 'preact/devtools';

import { FishComponent } from './FishComponent';

const rootElement = document.getElementById('root');

render(
  <>
    <FishComponent id="medium" speed={6}>
      🐟
    </FishComponent>
    <FishComponent id="fast" speed={10}>
      🐠
    </FishComponent>
    <FishComponent id="slow" speed={2}>
      🐡
    </FishComponent>
    <FishComponent id="very slow" speed={1}>
      🐙
    </FishComponent>
  </>,
  rootElement
);
