import { RawDraftContentState } from 'draft-js';

export interface Note {
  id: number;
  name: string;
  raw?: RawDraftContentState;
  created: number;
  updated: number;
}
