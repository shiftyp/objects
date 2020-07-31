import { ObservableLayer } from './observable'
import { ObjectObservable, ObjectObserver } from '@objects/types'

const testKey = 'test'
const testValue = true

interface Data {
  [testKey]: boolean
}

describe('Observable', () => {
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
    layer: new ObservableLayer<Data>(onEnd, Symbol.observable),
    onEnd,
  })

  const makeObservableFactory = (
    layer: ObservableLayer<Data>,
    data: Data = testData,
    reciever: Data = testReciever
  ) => ({
    factory: layer.get(data, Symbol.observable, reciever),
    data,
    reciever,
  })

  const makeObservable = (
    layer: ObservableLayer<Data>,
    makeObservable?: (obs: any) => any,
    data: Data = testData,
    reciever: Data = testReciever
  ) => ({
    observable: makeObservableFactory(
      layer,
      data,
      reciever
    ).factory(makeObservable) as ObjectObservable<Data> &
      ObjectObserver<Data>,
    data,
    reciever,
  })

  const makeObserver = (
    observable: ObjectObservable<Data>,
    observer = {
      next: jest.fn(),
      complete: jest.fn(),
      error: jest.fn(),
    }
  ) => ({
    observer,
    subscription: observable.subscribe(observer),
  })

  describe('#constructor', () => {
    it('should call onEnd passing a callback', () => {
      const { onEnd } = makeLayer()

      expect(onEnd).toHaveBeenCalledTimes(1)
      expect(typeof onEnd.mock.calls[0][0]).toBe('function')
    })
  })

  describe('#get', () => {
    it('should return a function for Symbol.observable', () => {
      const { layer } = makeLayer()
      const { factory } = makeObservableFactory(layer)

      expect(typeof factory).toBe('function')
    })

    it('should return an observable factory function for Symbol.observable', () => {
      const decorator = jest.fn(val => val)
      const { layer } = makeLayer()
      const { observable: plain } = makeObservable(layer)
      const { observable: decorated } = makeObservable(
        layer,
        decorator
      )

      expect(decorator).toHaveBeenCalledTimes(1)

      expect(typeof plain).toBe('object')
      expect(typeof plain.subscribe).toBe('function')
      expect(typeof decorated).toBe('object')
      expect(typeof decorated.subscribe).toBe('function')

      const { subscription } = makeObserver(plain)

      expect(typeof subscription).toBe('object')
      expect(typeof subscription.unsubscribe).toBe('function')
    })

    it('should return a "next" observer factory function for Symbol.observable', () => {
      const { layer } = makeLayer()
      const { observable } = makeObservable(layer)

      expect(typeof observable).toBe('object')
      expect(typeof observable.next).toBe('function')
    })

    it('should create a "next" observer that updates values on the reciever', () => {
      const { layer } = makeLayer()
      const { observable, reciever } = makeObservable(layer)

      expect(reciever).toMatchObject({
        [testKey]: testValue,
      })

      observable.next!({ [testKey]: !testValue })

      expect(reciever).toMatchObject({ [testKey]: !testValue })
    })

    it('should create a "next" observer that does not run after end', () => {
      const { layer, onEnd } = makeLayer()
      const { observable, reciever } = makeObservable(layer)

      const [endCb] = onEnd.mock.calls[0]

      expect(reciever).toMatchObject({
        [testKey]: testValue,
      })

      endCb()

      observable.next!({ [testKey]: !testValue })

      expect(reciever).toMatchObject({
        [testKey]: testValue,
      })
    })

    it('should create an observable that completes on end', () => {
      const { layer, onEnd } = makeLayer()
      const { observable } = makeObservable(layer)
      const { observer } = makeObserver(observable)

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      expect(observer.complete).toHaveBeenCalledTimes(1)
    })
  })

  describe('#set', () => {
    it('should run observers on set', () => {
      const { layer } = makeLayer()
      const { observable } = makeObservable(layer)
      const { observer } = makeObserver(observable)

      layer.set(testData, testKey, !testValue)

      expect(observer.next).toHaveBeenCalledWith({
        [testKey]: false,
      })
    })

    it('should run observers for undefined values', () => {
      const { layer } = makeLayer()
      const { observable } = makeObservable(layer)
      const { observer } = makeObserver(observable)

      layer.set(testData, testKey, undefined)

      expect(observer.next).toHaveBeenCalledWith({
        [testKey]: undefined,
      })
    })

    it('should not run observers after end', () => {
      const { layer, onEnd } = makeLayer()
      const { observable } = makeObservable(layer)
      const { observer } = makeObserver(observable)

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      layer.set(testData, testKey, !testValue)

      expect(observer.next).not.toHaveBeenCalled()
    })
  })

  describe('#deleteProperty', () => {
    it('should run observers on delete', () => {
      const { layer } = makeLayer()
      const { observable } = makeObservable(layer)
      const { observer } = makeObserver(observable)

      layer.deleteProperty(testData, testKey)

      expect(observer.next).toHaveBeenCalledWith({
        [testKey]: undefined,
      })
    })

    it('should not run observers after end', () => {
      const { layer, onEnd } = makeLayer()
      const { observable } = makeObservable(layer)
      const { observer } = makeObserver(observable)

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      layer.deleteProperty(testData, testKey)

      expect(observer.next).not.toHaveBeenCalled()
    })
  })
})
