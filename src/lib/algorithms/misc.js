export const sequentialRecursiveAlgorithm = (fn, { errorsToAbort, intervalMs }) => {
  const recFn = (step = 0, errorCount = 0) => {
    //  if (step === targetSteps) return true
     if (errorCount === errorsToAbort) return false

    if (step > 0) Meteor._sleepForMs(intervalMs)
    try {
      const ret = fn(step, errorCount)
      if (ret === true) {
        return true
      }
      if (ret === false) {
        return false
      }
      return recFn(step + 1, errorCount)
    } catch (error) {
      return recFn(step, errorCount + 1)
    }
  }
  return recFn
}
