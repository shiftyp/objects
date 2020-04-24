import * as React from 'react';
import { render } from 'react-dom';

import { Notebook } from './components/Notebook';
import { ThemeProvider } from './components/ThemeProvider';

const rootElement = document.getElementById('root');
render(
  <ThemeProvider>
    <Notebook />
  </ThemeProvider>,
  rootElement
);
