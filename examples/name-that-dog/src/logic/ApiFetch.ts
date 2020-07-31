import { Update } from './Update'
import { ApiOptions } from '../types'

export class ApiFetch<Data, Response> extends Update<Data> {
  constructor(protected options: ApiOptions<Data, Response>) {
    super()
  }

  async fetch(path: string, info?: RequestInit) {
    return await this.update(
      fetch(`${this.options.apiBase}${path}${this.options.apiSuffix || ''}`, info)
        .then<Response>((resp) => resp.json())
        .then<Data>((resp) => this.options.transform(resp))
    )
  }
}
