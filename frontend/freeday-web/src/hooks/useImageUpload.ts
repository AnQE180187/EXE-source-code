import { useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '@/components/common/useToast';
import { uploadAPI } from '@/services/api';

interface UseImageUploadProps {
  onUploadSuccess: (url: string) => void;
}

export const useImageUpload = ({ onUploadSuccess }: UseImageUploadProps) => {
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const { data: signData } = await uploadAPI.getSignature();
      const formData = new FormData();
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

      if (!apiKey) {
        throw new Error('Cloudinary API Key is not configured.');
      }

      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);

      const response = await axios.post(
        import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
        formData
      );

      onUploadSuccess(response.data.secure_url);
      toast.showToast('Tải ảnh lên thành công!', 'success');
    } catch (error) {
      toast.showToast('Tải ảnh lên thất bại.', 'error');
      console.error(error);
      setPreviewImage(null); // Clear preview on error
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return {
    isUploading,
    previewImage,
    fileInputRef,
    handleFileSelect,
    triggerFileSelect,
    setPreviewImage,
  };
};
