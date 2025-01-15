import * as validateImage from "../middleware/validateImageUpload.js";
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
    } else {
      continue;
    }
  }

  //deleting the image at the position the image was shown on site to replace with new
  const imagesInData = await model.getImagesById(ctx.db, id);
  for (let i = 1; i <= 3; i++) {
    if (i - 1 === imageNum[0]) {
      const image = await model.getImageById(ctx.db, imagesInData[i - 1][5]);
      await model.deleteWorkImageById(ctx.db, image[0][5]);
    }
  }
  const imageData = { images: images, error: thumbnailError };
  return imageData;
};
