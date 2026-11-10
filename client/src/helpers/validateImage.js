const validateImage = (file, maxSize, allowedExtentions) => {
  const fileType = file?.type?.split("/")[0];
  const fileExtention = file?.type?.split("/")[1];
  const fileSize = file?.size;

  if (!file) {
    return "image is required";
  }

  if (fileType !== "image") {
    return "only image required";
  }

  if (!allowedExtentions.includes(fileExtention)) {
    return "extention not allowed";
  }

  if (fileSize > maxSize) {
    return `max size is ${maxSize / 1024}KB`;
  }
};

export default validateImage;
