import * as validateImage from "../utility/validateImageUpload.js";

//PORTFOLIO

//ERROR GENERATING
export const validatePortfolioForm = (data) => {
  const errors = errorGenerationForportfolio(data);
  const thumbnailError = validateImage.validateImage(data.thumbnail);
  if (!thumbnailError == "") errors.push(thumbnailError);
  return errors;
};

export const validatePortfolioFormEdit = (data) => {
  const thumbnailError = validateImage.validateImage(data.thumbnail);
  const errors = errorGenerationForportfolio(data);
  if (
    !thumbnailError == "" &&
    !thumbnailError == "Du musst ein Bild hochladen."
  )
    errors.push(thumbnailError);
  return errors;
};

const errorGenerationForportfolio = (data) => {
  const errors = [];
  if (!data.title) errors.push("Du musst einen Titel eingeben.");
  if (!data.description) errors.push("Du musst eine Beschreibung eingeben.");
  if (!data.about)
    errors.push("Du musst eine Beschreibung über dich eingeben.");
  if (data.tagsString == "") errors.push("Du musst Tags auswählen.");
  if (data.skillsString == "") errors.push("Du musst deine Skills eingeben.");
  return errors;
};

//FILL ERROR INTO URL
export const checkErrorsPortfolio = (errors, data) => {
  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      title: encodeURIComponent(data.title || ""),
      description: encodeURIComponent(data.description || ""),
      about: encodeURIComponent(data.about || ""),
      tags: encodeURIComponent(data.tagsString),
      skills: encodeURIComponent(data.skillsString),
    }).toString();
    return queryParams;
  }
  return;
};

//FORMDATA
export const getPortfolioFormData = (formData) => {
  const tags = formData.getAll("tags");
  const tagsString = tags.join(",");
  const skills = [];
  for (let i = 1; i <= 8; i++) {
    const skill = formData.get(`skill${i}`);
    if (skill && skill.trim() !== "") {
      skills.push(skill.trim());
    }
  }
  const skillsString = skills.join(",");

  const data = {
    thumbnail: formData.get("thumbnail"),
    title: formData.get("title"),
    description: formData.get("description"),
    about: formData.get("about"),
    tagsString: tagsString,
    skillsString: skillsString,
  };
  return data;
};
