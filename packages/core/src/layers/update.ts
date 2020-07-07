import { ObjectLayer } from '@objects/types'

export class UpdateLayer<Obj>
  implements Pick<ObjectLayer<Obj>, 'set' | 'deleteProperty'> {
  ended = false

  constructor(private update: () => void, onEnd: (cb: () => void) => void) {
    onEnd(this.onEnd)
  }

  onEnd = () => {
    this.ended = true
  }

  set() {
    if (!this.ended) {
      this.update()
    }
  }

  deleteProperty() {
    if (!this.ended) {
      this.update()
    }
  }
}
