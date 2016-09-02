import Long from 'long'
export const convertLongToNumber = (object) => Long.fromBits(object.low, object.high, object.unsigned).toNumber()
