import { Button } from '@/atomic/atoms/button';
import { Map } from '@/components/map';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNewSpotMap } from './useNewSpotMap';

export const NewSpotMapTemplate = () => {
  const {
    mapRef,
    handleCreate,
    handleDelete,
    handleUpdate,
    showContinueButton,
    handleNextStep,
  } = useNewSpotMap();

  return (
    <div className="h-full w-full overflow-hidden relative">
      <Map
        mapRef={mapRef}
        handleDrawCreate={handleCreate}
        handleDrawDelete={handleDelete}
        handleDrawUpdate={handleUpdate}
      />

      <motion.div
        className="absolute bottom-0 z-30 left-1/2 -translate-x-1/2"
        animate={
          showContinueButton ? { translateY: '-50%' } : { translateY: '100%' }
        }
        initial={{ translateY: '100%' }}
        transition={{ duration: 0.5 }}
      >
        <Button className="gap-5 font-semibold" onClick={handleNextStep}>
          Continuar para os detalhes
          <ArrowRight />
        </Button>
      </motion.div>
    </div>
  );
};
