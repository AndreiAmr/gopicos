'use client';

import { Eye } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

type ImagePreviewProps = {
  url: string;
};

export const ImagePreview = ({ url }: ImagePreviewProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      key={url}
      className="h-50 w-1/5 bg-cover rounded shadow-md cursor-pointer relative"
      style={{
        backgroundImage: `url(${url})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        className="absolute inset-0 bg-accent/75 flex items-center justify-center"
      >
        <Eye />
      </motion.div>
    </div>
  );
};
