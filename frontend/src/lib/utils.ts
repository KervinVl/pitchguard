import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTimer(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function validatePDF(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are supported' };
  }

  // Check file extension
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Only PDF files are supported' };
  }

  // Check file size (25MB)
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File exceeds 25MB limit' };
  }

  return { valid: true };
}
