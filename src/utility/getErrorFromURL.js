export const getErrorFromURL = (queryParams) => {
  let errors = [];
  if (queryParams.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(queryParams.errors));
    } catch {
      errors = [];
    }
  }
  return errors;
};
