import { ChangeLayer } from './change'
import { Changes } from '@objects/types'

const testKey = 'test'
const testValue = true

const changeSymbol = Symbol('test change')

interface Data {
  [testKey]: boolean
}

describe('Change', () => {
  let testData: Data
  let testReciever: Data

  beforeEach(() => {
    testData = {
      [testKey]: testValue,
    }
    testReciever = {
      [testKey]: testValue,
    } as Data
  })

  const makeLayer = (onEnd = jest.fn()) => ({
    layer: new ChangeLayer<Data>(onEnd, changeSymbol),
    onEnd,
  })

  const makeChangeFactory = (
    layer: ChangeLayer<Data>,
    data: Data = testData,
    reciever: Data = testReciever
  ) => ({
    factory: layer.get(data, changeSymbol, reciever),
    data,
    reciever,
  })

  const makeChanges = (
    layer: ChangeLayer<Data>,
    makeObservable?: (obs: any) => any,
    data: Data = testData,
    reciever: Data = testReciever
  ) => ({
    changes: makeChangeFactory(layer, data, reciever).factory?.(
      makeObservable
    ) as Changes<Data>,
    data,
    reciever,
  })

  const makeObserver = <Key extends keyof Data>(
    changes: Changes<Data>,
    key: Key,
    observer = {
      next: jest.fn(),
      complete: jest.fn(),
      error: jest.fn(),
    }
  ) => ({
    observer,
    subscription: changes[key][Symbol.observable]().subscribe(observer),
  })

  describe('#get', () => {
    it('should return a function for change symbol', () => {
      const { layer } = makeLayer()
      const { factory } = makeChangeFactory(layer)

      expect(typeof factory).toBe('function')
    })

    it('should return an changes factory function for change symbol', () => {
      const decorator = jest.fn((val) => val)
      const { layer } = makeLayer()
      const { changes: plain } = makeChanges(layer)
      const { changes: decorated } = makeChanges(layer, decorator)

      expect(decorator).toHaveBeenCalledTimes(0)

      expect(typeof plain[testKey]).toBe('object')
      expect(typeof plain[testKey].subscribe).toBe('function')
      expect(typeof decorated[testKey]).toBe('object')
      expect(typeof decorated[testKey].subscribe).toBe('function')

      const { subscription } = makeObserver(plain, testKey)

      expect(typeof subscription).toBe('object')
      expect(typeof subscription.unsubscribe).toBe('function')
    })

    it('should return a "next" observer factory function for Symbol.observable', () => {
      const { layer } = makeLayer()
      const { changes } = makeChanges(layer)

      expect(typeof changes[testKey]).toBe('object')
      expect(typeof changes[testKey].next).toBe('function')
    })

    it('should create a "next" observer that updates values on the reciever', () => {
      const { layer } = makeLayer()
      const { changes, reciever } = makeChanges(layer)

      expect(reciever).toMatchObject({
        [testKey]: testValue,
      })

      changes[testKey].next!(!testValue)

      expect(reciever).toMatchObject({ [testKey]: !testValue })
    })

    it('should create a "next" observer that does not run after end', () => {
      const { layer, onEnd } = makeLayer()
      const { changes, reciever } = makeChanges(layer)

      const [endCb] = onEnd.mock.calls[0]

      expect(reciever).toMatchObject({
        [testKey]: testValue,
      })

      endCb()

      changes[testKey].next!(!testValue)

      expect(reciever).toMatchObject({
        [testKey]: testValue,
      })
    })

    it('should create an observable that completes on end', () => {
      const { layer, onEnd } = makeLayer()
      const { changes } = makeChanges(layer)
      const { observer } = makeObserver(changes, testKey)

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      expect(observer.complete).toHaveBeenCalledTimes(1)
    })

    describe('#set', () => {
      it('should run observers on set', () => {
        const { layer } = makeLayer()
        const { changes } = makeChanges(layer)
        const { observer } = makeObserver(changes, testKey)

        layer.set(testData, testKey, !testValue)

        expect(observer.next).toHaveBeenCalledWith(!testValue)
      })

      it('should run observers for undefined values', () => {
        const { layer } = makeLayer()
        const { changes } = makeChanges(layer)
        const { observer } = makeObserver(changes, testKey)

        layer.set(testData, testKey, undefined)

        expect(observer.next).toHaveBeenCalledWith(undefined)
      })

      it('should not run observers after end', () => {
        const { layer, onEnd } = makeLayer()
        const { changes } = makeChanges(layer)
        const { observer } = makeObserver(changes, testKey)

        const [endCb] = onEnd.mock.calls[0]

        endCb()

        layer.set(testData, testKey, false)

        expect(observer.next).not.toHaveBeenCalled()
      })
    })

    describe('#deleteProperty', () => {
      it('should run observers on delete', () => {
        const { layer } = makeLayer()
        const { changes } = makeChanges(layer)
        const { observer } = makeObserver(changes, testKey)

        layer.deleteProperty(testData, testKey)

        expect(observer.next).toHaveBeenCalledWith(undefined)
      })

      it('should not run observers after end', () => {
        const { layer, onEnd } = makeLayer()
        const { changes } = makeChanges(layer)
        const { observer } = makeObserver(changes, testKey)

        const [endCb] = onEnd.mock.calls[0]

        endCb()

        layer.deleteProperty(testData, testKey)

        expect(observer.next).not.toHaveBeenCalled()
      })
    })
  })
})
