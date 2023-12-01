type CompareArrayReturn<T> = { type: 'add' | 'remove'; value: T } | undefined
export function compareArray<T = any>(
  newArray: T[],
  oldArray: T[]
): CompareArrayReturn<T> {
  if (newArray.length > oldArray.length) {
    const addedValue = newArray.find(value => !oldArray.includes(value))
    return addedValue ? { type: 'add', value: addedValue } : undefined
  } else if (newArray.length < oldArray.length) {
    const removedValue = oldArray.find(value => !newArray.includes(value))
    return removedValue ? { type: 'remove', value: removedValue } : undefined
  } else {
    return undefined
  }
}
