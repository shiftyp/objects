import React from 'react';
import { Editor, getDefaultKeyBinding } from 'draft-js';
import { EditorLogic } from '../logic/EditorLogic';

import 'draft-js/dist/Draft.css';

import './NoteEditor.scss';

export const NoteEditor: React.FC<{ editor: EditorLogic }> = ({ editor }) => {
  return (
    <div className="note-editor-container">
      <Editor
        onChange={editor.updateEditorState}
        editorState={editor.editorState}
        keyBindingFn={(e) => getDefaultKeyBinding(e)}
        handleKeyCommand={(command, editorState) => {
          editor.updateFromCommand(command);

          if (editor.editorState !== editorState) {
            return 'handled';
          }
          return 'not-handled';
        }}
      />
    </div>
  );
};
