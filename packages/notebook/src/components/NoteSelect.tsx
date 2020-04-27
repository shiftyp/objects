import React from 'react';
import Select from 'react-select/creatable';

import { EditorLogic } from '../logic/EditorLogic';
import { NotebookSelectorLogic } from '../logic/NotebookSelectorLogic';

import './NoteSelect.scss';

export const NoteSelect: React.FC<{
  editor: EditorLogic;
  selector: NotebookSelectorLogic;
}> = ({ editor, selector }) => {
  const options = selector.currentNotes
    ? selector.currentNotes.map(({ id, name, updated }) => ({
        value: id,
        label: name,
        updated: updated,
      }))
    : [];
  const selectedOption =
    editor.currentNote &&
    options.find((opt) => opt.value === editor.currentNote.id);
  return (
    <Select
      isClearable
      components={{
        Option: ({ innerProps, data }) => (
          <div className="note-select-option" {...innerProps}>
            <b>{data.label}</b>{' '}
            {data.updated !== undefined ? (
              <i>{new Date(data.updated).toDateString()}</i>
            ) : null}
          </div>
        ),
      }}
      placeholder="Select or create a note"
      value={selectedOption}
      onChange={(option) => {
        editor.loadNote(parseInt((option as any).value));
      }}
      onCreateOption={async (name) => {
        await editor.newNote(name);
        selector.fetch();
      }}
      options={options}
    />
  );
};
