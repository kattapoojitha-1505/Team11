import api, { requestHandler } from './api';

const uploadService = {
  uploadThumbnail: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return requestHandler(
      () => api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      () => {
        // Fallback: Read file to Base64 data URI to enable full persistence in localStorage mock database
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ url: reader.result });
          };
          reader.onerror = () => {
            reject(new Error('Failed to read upload file'));
          };
          reader.readAsDataURL(file);
        });
      }
    );
  }
};

export default uploadService;
