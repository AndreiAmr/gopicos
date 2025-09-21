import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  MapPin,
  Redo2Icon,
  SquareDashedMousePointer,
  Trash2Icon,
} from 'lucide-react';

import { motion } from 'framer-motion';

import { ButtonTooltip } from '../../../atomic/atoms/ButtonTooltip';
import { cn } from '@/lib/utils';
import { useNewSpotMapControls } from './useNewSpotMapControls';

export const NewSpotMapControls = () => {
  const { markingType, handleRedo, handleTrash, handleChangeMarkingType } =
    useNewSpotMapControls();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 0.5,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Mapa</CardTitle>
          <CardDescription>Controles do mapa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between ">
            <div className="flex gap-1">
              <ButtonTooltip
                tooltip="Refazer"
                variant="outline"
                onClick={handleRedo}
              >
                <Redo2Icon />
              </ButtonTooltip>
              <ButtonTooltip
                tooltip="Descartar"
                variant="outline"
                onClick={handleTrash}
              >
                <Trash2Icon className="text-destructive" />
              </ButtonTooltip>
            </div>

            <div className="flex gap-1">
              <ButtonTooltip
                tooltip="Desenhar"
                variant="ghost"
                onClick={() => handleChangeMarkingType('POLYGON')}
                className={cn(
                  markingType === 'POLYGON' &&
                    'bg-muted-foreground text-zinc-900'
                )}
              >
                <SquareDashedMousePointer />
              </ButtonTooltip>
              <ButtonTooltip
                tooltip="Ponto"
                variant="ghost"
                onClick={() => handleChangeMarkingType('POINT')}
                className={cn(
                  markingType === 'POINT' && 'bg-muted-foreground text-zinc-900'
                )}
              >
                <MapPin />
              </ButtonTooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
