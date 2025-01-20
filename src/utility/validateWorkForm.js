export const getWorkFormData = (formData) => {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };
  return data;
};

export const errorGenerationForWork = (data) => {
  const errors = [];
  if (!data.title) errors.push("Du musst einen Titel eingeben.");
  if (!data.description) errors.push("Du musst eine Beschreibung eingeben.");
  return errors;
};

export const checkErrorsPortfolio = (errors, data) => {
  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      title: encodeURIComponent(data.title || ""),
      description: encodeURIComponent(data.description || ""),
    }).toString();
    return queryParams;
  }
  return;
};
