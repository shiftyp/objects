import {
  Stable,
  Subscription,
  streamedSymbol,
} from '@objects/types'
import { UpdateLayer } from './update'

export class ConnectionLayer<Obj> extends UpdateLayer<Obj> {
  static isConnectable<Obj>(
    obj: Obj | Stable<Obj>
  ): obj is Stable<Obj> {
    // @ts-ignore
    return typeof obj[streamedSymbol] === 'function'
  }

  protected sourceSubscription: Subscription | null = null

  constructor(
    protected source: Stable<Obj>,
    protected reset: () => void,
    onEnd: (cb: () => void) => void,
    update?: () => void
  ) {
    super(onEnd, update)

    onEnd(this.breakConnection)

    this.sourceSubscription = this.source[
      streamedSymbol
    ]().subscribe({
      next: () => {
        this.update?.()
      },
      complete: () => this.reset(),
    })
  }

  breakConnection = () => {
    this.sourceSubscription?.unsubscribe()
    this.sourceSubscription = null
  }
}
