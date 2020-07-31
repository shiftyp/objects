import { ObjectLayer } from '@objects/types'

export class UpdateLayer<Obj>
  implements Pick<ObjectLayer<Obj>, 'set' | 'deleteProperty'> {
  ended = false

  constructor(
    onEnd: (cb: () => void) => void,
    protected update?: () => void
  ) {
    onEnd(this.onEnd)
  }

  onEnd = () => {
    this.ended = true
  }

  set() {
    if (!this.ended) {
      this.update?.()
    }
  }

  deleteProperty() {
    if (!this.ended) {
      this.update?.()
    }
  }
}
