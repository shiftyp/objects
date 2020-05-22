import * as React from 'react';
import { render } from 'react-dom';

import { Game } from './components/Game';
import { ThemeProvider } from './components/ThemeProvider';

const rootElement = document.getElementById('root');
render(
  <ThemeProvider>
    <Game />
  </ThemeProvider>,
  rootElement
);
