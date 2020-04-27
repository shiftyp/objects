import { Note } from '../types';
import { Database } from './Database';
import { HooksProxy } from 'object-hooks';

export class NotebookSelectorLogic {
  currentNotes: Omit<Note, 'raw'>[] | null = null;

  constructor(private database: HooksProxy<Database>) {}

  async fetch() {
    await this.database.awaitDB();

    this.currentNotes = await this.database.getCurrentNotes();
  }
}
