import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (base64, folder = 'products') => {
  if (!base64) return null;

  const result = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: 'image',
  });

  return result.secure_url;
};
