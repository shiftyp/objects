import { Stateful } from 'object-hooks';
import { ImageSearch } from './ImageSearch';

export class GameSelection {
  image: Stateful<ImageSearch> | null = null;
}
