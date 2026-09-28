const isValidEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

const allowedFileExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

const isValidFileType = (mimeType, originalName) => {
  const ext = originalName.toLowerCase().slice(originalName.lastIndexOf('.'));
  return allowedMimeTypes.includes(mimeType) && allowedFileExtensions.includes(ext);
};

module.exports = {
  isValidEmail,
  allowedMimeTypes,
  allowedFileExtensions,
  isValidFileType
};
