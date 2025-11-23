import React, { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';

interface FormImageUploadProps {
  label: string;
  currentImage?: string | null;
  onImageChange: (file: File | null) => void;
  error?: string;
}

export const FormImageUpload: React.FC<FormImageUploadProps> = ({
  label,
  currentImage,
  onImageChange,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onImageChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {/* Preview da imagem */}
        <div className="relative">
          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover border-2 border-slate-300"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover foto"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-300">
              <User size={40} className="text-slate-400" />
            </div>
          )}
        </div>

        {/* Botão de upload */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Upload size={18} />
            {preview ? 'Alterar foto' : 'Enviar foto'}
          </button>
          <p className="text-xs text-slate-500 mt-2">
            Formatos aceitos: JPG, PNG, GIF (máximo 5MB)
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};