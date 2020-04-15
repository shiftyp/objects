import { Update } from "./Update";

interface ApiResponse<Message> {
  message: Message;
}

export class ApiFetch<Data> extends Update<Data> {
  protected fetch(path: string, info?: RequestInit) {
    return this.update(
      fetch(`https://dog.ceo/api/${path}`, info)
        .then<ApiResponse<Data>>((resp) => resp.json())
        .then<Data>(({ message }) => message)
    );
  }
}
