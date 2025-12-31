import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { validatePDF } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export function UploadZone(): JSX.Element {
  const { uploadedFile, setUploadedFile } = useAppStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validation = validatePDF(file);

      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      setUploadedFile(file);
      toast.success('PDF uploaded successfully');
    },
    [setUploadedFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024, // 25MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'min-h-[320px] rounded-lg border-2 border-dashed',
        'cursor-pointer transition-all',
        isDragActive
          ? 'border-text-secondary bg-bg-secondary/30'
          : 'border-bg-tertiary hover:border-text-secondary hover:bg-bg-secondary/10',
        uploadedFile && 'border-solid border-accent-gold/50'
      )}
    >
      <input {...getInputProps()} />

      {uploadedFile ? (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="w-12 h-12 text-accent-gold" />
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <p className="text-xs text-text-secondary">
            Click or drag to replace
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <FileText className="w-12 h-12 text-text-tertiary" />
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              {isDragActive
                ? 'Drop your pitch deck here'
                : 'Drop Pitch Deck PDF or click to browse'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
