import { Update } from './Update';

interface ApiResponse<Message> {
  message: Message;
}

export abstract class ApiFetch<Data, Response> extends Update<Data> {
  abstract readonly apiBase: string;
  abstract readonly apiSuffix?: string;

  abstract transform: (response: Response) => Data;

  protected fetch(path: string, info?: RequestInit) {
    return this.update(
      fetch(`${this.apiBase}${path}${this.apiSuffix || ''}`, info)
        .then<Response>((resp) => resp.json())
        .then<Data>((resp) => this.transform(resp))
    );
  }
}
