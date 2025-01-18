import * as validateImage from "../utility/validateImageUpload.js";
import * as model from "../model/workPortfolioModel.js";

export const validateEachImageUpload = (formData) => {
  const images = [];
  let thumbnailError = "";
  for (let i = 1; i <= 8; i++) {
    const image = formData.get(`image${i}`);
    if (image && image.size > 0) {
      thumbnailError = validateImage.validateImage(image);
      images.push(image);
    } else {
      continue;
    }
  }
  const imageData = { images: images, error: thumbnailError };
  return imageData;
};

export const validateEachImageEditUpload = async (ctx, formData, id) => {
  let thumbnailError = "";
  const images = [];
  const imageNum = [];

  for (let i = 1; i <= 3; i++) {
    const image = formData.get(`image${i}`);
    if (image && image.size > 0) {
      thumbnailError = validateImage.validateImage(image);
      images.push(image);
      imageNum.push(i - 1);
    }
  }

  const imagesInData = await model.getImagesById(ctx.db, id);

  for (const position of imageNum) {
    if (imagesInData[position]) {
      const imageId = imagesInData[position][5];
      if (imageId) {
        await model.deleteWorkImageById(ctx.db, imageId);
      }
    }
  }

  const imageData = { images: images, error: thumbnailError };
  return imageData;
};
