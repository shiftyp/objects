import React from 'react';

import { NoteEditor } from './NoteEditor';
import { useNotebooks } from '../hooks/useNotebooks';
import { NoteSelect } from './NoteSelect';
import { StyleButton } from './StyleButton';

import './App.scss';

export const App: React.FC = () => {
  const { editor, selector } = useNotebooks();
  return (
    <div className="app-body">
      <form className="app-header">
        <h1 className="app-title">📔.to</h1>
        <NoteSelect editor={editor} selector={selector} />
        <StyleButton editor={editor} style="bold" label="b" />
        <StyleButton editor={editor} style="italic" label="i" />
        <StyleButton editor={editor} style="underline" label="u" />
      </form>
      {editor.currentNote && <NoteEditor editor={editor} />}
    </div>
  );
};
