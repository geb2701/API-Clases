import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageModalProps {
  src: string;
  alt: string;
  trigger: React.ReactNode;
  className?: string;
}

export const ImageModal = ({ src, alt, trigger, className }: ImageModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-transparent shadow-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-full h-full relative">
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg ${className || ""}`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
