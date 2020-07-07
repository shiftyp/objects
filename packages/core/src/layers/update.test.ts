import { UpdateLayer } from './update'

describe('Update', () => {
  const makeUpdate = (update = jest.fn(), onEnd = jest.fn()) => ({
    layer: new UpdateLayer(update, onEnd),
    update,
    onEnd,
  })

  describe('#constructor', () => {
    it('should call onEnd passing a callback', () => {
      const { onEnd } = makeUpdate()

      expect(onEnd).toHaveBeenCalledTimes(1)
      expect(typeof onEnd.mock.calls[0][0]).toBe('function')
    })
  })
  describe('#set', () => {
    it('should call update when set is invoked', () => {
      const { update, layer } = makeUpdate()

      expect(update).toHaveBeenCalledTimes(0)

      layer.set()

      expect(update).toHaveBeenCalledTimes(1)
    })

    it('should not call update when set is invoked after onEnd is called', () => {
      const { update, layer, onEnd } = makeUpdate()

      expect(update).toHaveBeenCalledTimes(0)

      const endCb = onEnd.mock.calls[0][0]

      expect(typeof endCb).toBe('function')

      endCb()

      layer.set()

      expect(update).toHaveBeenCalledTimes(0)
    })
  })
  describe('#deleteProperty', () => {
    it('should call update when deleteProperty is invoked', () => {
      const { update, layer } = makeUpdate()

      expect(update).toHaveBeenCalledTimes(0)

      layer.deleteProperty()

      expect(update).toHaveBeenCalledTimes(1)
    })

    it('should not call update when deleteProperty is invoked after onEnd is called', () => {
      const { update, layer, onEnd } = makeUpdate()

      expect(update).toHaveBeenCalledTimes(0)

      const endCb = onEnd.mock.calls[0][0]

      expect(typeof endCb).toBe('function')

      endCb()

      layer.deleteProperty()

      expect(update).toHaveBeenCalledTimes(0)
    })
  })
})
