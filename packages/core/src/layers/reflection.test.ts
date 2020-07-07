import { ReflectionLayer } from './reflection'

describe('Reflection', () => {
  const makeReflection = (
    update = jest.fn(),
    onEnd = jest.fn(),
    reflect = {
      set: jest.fn(),
      get: jest.fn(),
      getOwnPropertyDescriptor: jest.fn(),
      getPrototypeOf: jest.fn(),
      setPrototypeOf: jest.fn(),
      defineProperty: jest.fn(),
      deleteProperty: jest.fn(),
      enumerate: jest.fn(),
      isExtensible: jest.fn(),
      ownKeys: jest.fn(),
      apply: jest.fn(),
      construct: jest.fn(),
      has: jest.fn(),
      preventExtensions: jest.fn(),
    }
  ) => ({
    layer: new ReflectionLayer(reflect, onEnd),
    reflect,
    onEnd,
  })

  describe('#constructor', () => {
    it('should call onEnd passing a callback', () => {
      const { onEnd } = makeReflection()

      expect(onEnd).toHaveBeenCalledTimes(1)
      expect(typeof onEnd.mock.calls[0][0]).toBe('function')
    })
  })

  describe('#set', () => {
    it('should call reflect.set passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['set']>

      const stringArgs: Args = [{}, 'foo', {}, {}]
      const numberArgs: Args = [{}, 1, {}, {}]
      const symbolArgs: Args = [{}, Symbol('symbol'), {}, {}]

      layer.set(...stringArgs)
      layer.set(...numberArgs)
      layer.set(...symbolArgs)

      expect(reflect.set).toHaveBeenCalledTimes(3)

      // Set should not pass the reciever...see comment in ReflectionLayer
      expect(reflect.set.mock.calls[0]).toMatchObject(stringArgs.slice(0, -1))
      expect(reflect.set.mock.calls[1]).toMatchObject(numberArgs.slice(0, -1))
      expect(reflect.set.mock.calls[2]).toMatchObject(symbolArgs.slice(0, -1))
    })

    it('should not call reflect.set after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['set']>

      const args: Args = [{}, 'foo', {}, {}]

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callSet = () => layer.set(...args)

      expect(callSet).toThrowError('Attempted to reflect.set after reset')
      expect(reflect.set).toHaveBeenCalledTimes(0)
    })
  })

  describe('#get', () => {
    it('should call reflect.get passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['get']>

      const stringArgs: Args = [{}, 'foo', {}]
      const numberArgs: Args = [{}, 1, {}]
      const symbolArgs: Args = [{}, Symbol('symbol'), {}]

      layer.get(...stringArgs)
      layer.get(...numberArgs)
      layer.get(...symbolArgs)

      expect(reflect.get).toHaveBeenCalledTimes(3)

      expect(reflect.get.mock.calls[0]).toMatchObject(stringArgs)
      expect(reflect.get.mock.calls[1]).toMatchObject(numberArgs)
      expect(reflect.get.mock.calls[2]).toMatchObject(symbolArgs)
    })

    it('should not call reflect.get after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['get']>

      const args: Args = [{}, 'foo', {}]

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callGet = () => layer.get(...args)

      expect(callGet).toThrowError('Attempted to reflect.get after reset')
      expect(reflect.get).toHaveBeenCalledTimes(0)
    })
  })

  describe('#getOwnPropertyDescriptor', () => {
    it('should call reflect.getOwnPropertyDescriptor passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['getOwnPropertyDescriptor']>

      const stringArgs: Args = [{}, 'foo']
      const numberArgs: Args = [{}, 1]
      const symbolArgs: Args = [{}, Symbol('symbol')]

      layer.getOwnPropertyDescriptor(...stringArgs)
      layer.getOwnPropertyDescriptor(...numberArgs)
      layer.getOwnPropertyDescriptor(...symbolArgs)

      expect(reflect.getOwnPropertyDescriptor).toHaveBeenCalledTimes(3)

      expect(reflect.getOwnPropertyDescriptor.mock.calls[0]).toMatchObject(
        stringArgs
      )
      expect(reflect.getOwnPropertyDescriptor.mock.calls[1]).toMatchObject(
        numberArgs
      )
      expect(reflect.getOwnPropertyDescriptor.mock.calls[2]).toMatchObject(
        symbolArgs
      )
    })

    it('should not call reflect.getOwnPropertyDescriptor after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['getOwnPropertyDescriptor']>

      const args: Args = [{}, 'foo']

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callgetOwnPropertyDescriptor = () =>
        layer.getOwnPropertyDescriptor(...args)

      expect(callgetOwnPropertyDescriptor).toThrowError(
        'Attempted to reflect.getOwnPropertyDescriptor after reset'
      )
      expect(reflect.getOwnPropertyDescriptor).toHaveBeenCalledTimes(0)
    })
  })

  describe('#getPrototypeOf', () => {
    it('should call reflect.getPrototypeOf passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['getPrototypeOf']>

      const args: Args = [{}]

      layer.getPrototypeOf(...args)

      expect(reflect.getPrototypeOf).toHaveBeenCalledTimes(1)

      expect(reflect.getPrototypeOf.mock.calls[0]).toMatchObject(args)
    })

    it('should not call reflect.getPrototypeOf after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['getPrototypeOf']>

      const args: Args = [{}]

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callGetPrototypeOf = () => layer.getPrototypeOf(...args)

      expect(callGetPrototypeOf).toThrowError(
        'Attempted to reflect.getPrototypeOf after reset'
      )
      expect(reflect.getPrototypeOf).toHaveBeenCalledTimes(0)
    })
  })

  describe('#setPrototypeOf', () => {
    it('should call reflect.setPrototypeOf passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['setPrototypeOf']>

      const args: Args = [{}, {}]

      layer.setPrototypeOf(...args)

      expect(reflect.setPrototypeOf).toHaveBeenCalledTimes(1)

      expect(reflect.setPrototypeOf.mock.calls[0]).toMatchObject(args)
    })

    it('should not call reflect.setPrototypeOf after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['setPrototypeOf']>

      const args: Args = [{}, {}]

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callSetPrototypeOf = () => layer.setPrototypeOf(...args)

      expect(callSetPrototypeOf).toThrowError(
        'Attempted to reflect.setPrototypeOf after reset'
      )
      expect(reflect.setPrototypeOf).toHaveBeenCalledTimes(0)
    })
  })

  describe('#defineProperty', () => {
    it('should call reflect.defineProperty passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['defineProperty']>

      const stringArgs: Args = [{}, 'foo', {}]
      const numberArgs: Args = [{}, 1, {}]
      const symbolArgs: Args = [{}, Symbol('symbol'), {}]

      layer.defineProperty(...stringArgs)
      layer.defineProperty(...numberArgs)
      layer.defineProperty(...symbolArgs)

      expect(reflect.defineProperty).toHaveBeenCalledTimes(3)

      expect(reflect.defineProperty.mock.calls[0]).toMatchObject(stringArgs)
      expect(reflect.defineProperty.mock.calls[1]).toMatchObject(numberArgs)
      expect(reflect.defineProperty.mock.calls[2]).toMatchObject(symbolArgs)
    })

    it('should not call reflect.defineProperty after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['defineProperty']>

      const args: Args = [{}, 'foo', {}]

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callDefineProperty = () => layer.defineProperty(...args)

      expect(callDefineProperty).toThrowError(
        'Attempted to reflect.defineProperty after reset'
      )
      expect(reflect.defineProperty).toHaveBeenCalledTimes(0)
    })
  })

  describe('#deleteProperty', () => {
    it('should call reflect.deleteProperty passing arguments', () => {
      const { layer, reflect } = makeReflection()

      type Args = Parameters<typeof Reflect['deleteProperty']>

      const stringArgs: Args = [{}, 'foo']
      const numberArgs: Args = [{}, 1]
      const symbolArgs: Args = [{}, Symbol('symbol')]

      layer.deleteProperty(...stringArgs)
      layer.deleteProperty(...numberArgs)
      layer.deleteProperty(...symbolArgs)

      expect(reflect.deleteProperty).toHaveBeenCalledTimes(3)

      expect(reflect.deleteProperty.mock.calls[0]).toMatchObject(stringArgs)
      expect(reflect.deleteProperty.mock.calls[1]).toMatchObject(numberArgs)
      expect(reflect.deleteProperty.mock.calls[2]).toMatchObject(symbolArgs)
    })

    it('should not call reflect.deleteProperty after end', () => {
      const { layer, reflect, onEnd } = makeReflection()

      type Args = Parameters<typeof Reflect['deleteProperty']>

      const args: Args = [{}, 'foo']

      const [endCb] = onEnd.mock.calls[0]

      endCb()

      const callDeleteProperty = () => layer.deleteProperty(...args)

      expect(callDeleteProperty).toThrowError(
        'Attempted to reflect.deleteProperty after reset'
      )
      expect(reflect.deleteProperty).toHaveBeenCalledTimes(0)
    })
  })
})
