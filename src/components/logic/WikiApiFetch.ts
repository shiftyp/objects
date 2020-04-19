import { ApiFetch } from "./ApiFetch";

export abstract class WikiApiFetch<Data, Response> extends ApiFetch<
  Data,
  Response
> {
  apiBase = "https://en.wikipedia.org/w/api.php?";
  apiSuffix = "&format=json&origin=*";
}
