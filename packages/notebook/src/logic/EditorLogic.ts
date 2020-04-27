import {
  EditorState,
  RichUtils,
  SelectionState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { Database } from './Database';
import { Note } from '../types';
import { HooksProxy } from 'object-hooks';

export interface EditorLogic extends AsyncIterable<EditorLogic> {}
export class EditorLogic {
  editorState: EditorState = EditorState.createEmpty();
  currentNote: Note;
  updating: boolean = false;

  constructor(private database: HooksProxy<Database>) {}

  updateEditorState = (state: EditorState) => {
    this.editorState = state;
  };

  focus() {
    this.editorState = EditorState.forceSelection(
      this.editorState,
      (this.editorState.getSelection() as any).merge({
        hasFocus: true,
      }) as SelectionState
    );
  }

  updateFromCommand(command: string) {
    this.focus();
    this.editorState =
      RichUtils.handleKeyCommand(this.editorState, command) || this.editorState;
  }

  async saveOnChange() {
    for await (const { editorState, currentNote } of this) {
      if (editorState && currentNote) {
        const content = editorState.getCurrentContent();
        const raw = convertToRaw(content);
        this.database.put({
          ...currentNote,
          raw,
        });
      }
    }
  }

  async updateNote(update: Promise<Note>) {
    this.updating = true;
    this.currentNote = await update;
    this.updating = false;
    this.editorState = this.currentNote.raw
      ? EditorState.moveFocusToEnd(
          EditorState.createWithContent(convertFromRaw(this.currentNote.raw))
        )
      : EditorState.createEmpty();
  }

  newNote(name: string) {
    return this.updateNote(this.database.createNote(name));
  }

  async loadNote(id: number) {
    this.currentNote = null;

    await this.database.awaitDB();

    return await this.updateNote(this.database.get(id));
  }
}
