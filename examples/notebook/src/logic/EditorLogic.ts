import {
  EditorState,
  RichUtils,
  SelectionState,
  convertToRaw
  convertFromRaw,
  Editor,
} from 'draft-js';
import { Database } from './Database';
import { Note } from '../types';
import { from, ObservableInput } from 'rxjs';
import { filter } from 'rxjs/operators';

export class EditorLogic {
  editorState: EditorState = EditorState.createEmpty();
  currentNote: Note;

  updateFromCommand(command: string) {
    const newEditorState = RichUtils.handleKeyCommand(
      EditorState.forceSelection(
        this.editorState,
        (this.editorState.getSelection() as any).merge({
          hasFocus: true,
        }) as SelectionState
      ),
      command
    );
    if (newEditorState) {
      this.editorState = newEditorState;
    }
  }
}

  async updateNote(update: Promise<Note>) {
    this.currentNote = await update;
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
