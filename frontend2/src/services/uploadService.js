import api from './api';
import axios from 'axios';

// Get signature from our backend
export const getCloudinarySignature = async () => {
  try {
    const response = await api.post('/upload/signature');
    return response.data; // { signature, timestamp }
  } catch (error) {
    throw new Error('Could not get upload signature.');
  }
};

// Upload file directly to Cloudinary
export const uploadImage = async (file, signature, timestamp, apiKey, cloudName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', apiKey);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data; // Contains secure_url
  } catch (error) {
    throw new Error('Could not upload image to Cloudinary.');
  }
};
