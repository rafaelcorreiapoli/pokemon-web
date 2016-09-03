import objectPath from 'object-path';
export const deserializeFormErrors = (result, arrayFields = []) => {
  const formErrors = {}
  if (result.error) {
    const { details } = result.error;

    details.forEach(detail => {
      if (arrayFields.indexOf(detail.path) !== -1) {
        objectPath.set(formErrors, detail.path + '._error', detail.message)
      } else {
        objectPath.set(formErrors, detail.path, detail.message);
      }

    })
  }
  return formErrors;
}
