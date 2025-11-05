import { useSidebar } from '@/components/ui/sidebar';
import { useEffect, useRef } from 'react';

type useHomeTemplateProps = {};

export const useHomeTemplate = ({}: useHomeTemplateProps) => {
  const sidebar = useSidebar();

  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.resize();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebar]);

  return { mapRef };
};
