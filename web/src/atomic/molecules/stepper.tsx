import { cn } from '@/lib/utils';

type StepperProps = {
  current: number;
  total: number;
  className?: string;
};

/** Progresso em etapas: texto "Passo n de total" + barra segmentada. */
function Stepper({ current, total, className }: StepperProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-body-sm font-semibold text-gp-text">
        Passo {current} de {total}
      </span>
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full',
              index < current ? 'bg-gp-primary' : 'bg-gp-divider',
            )}
          />
        ))}
      </div>
    </div>
  );
}

export { Stepper };
