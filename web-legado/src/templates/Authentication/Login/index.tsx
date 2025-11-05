import { ShadowContainer } from '@/atomic/atoms/ShadowContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useLoginTemplate } from './useLoginTemplate';
import Image from 'next/image';

export const LoginTemplate = () => {
  const { password, email, handleChange, handleSubmit } = useLoginTemplate();

  return (
    <div className="flex flex-1 justify-center items-center">
      <ShadowContainer className="justify-center items-center">
        <div className="flex items-center gap-2">
          <Image src="/skater-pin.png" alt="logo" width={30} height={30} />
          <h1 className="font-bold text-lg">SkateSpotter</h1>
        </div>
        <p className="font-normal text-muted-foreground text-xs">
          Informe seus dados para entrar na nossa comunidade
        </p>
        <div className="flex flex-col w-full gap-3 mt-6">
          <Input
            placeholder="Digite aqui"
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <Input
            placeholder="Digite aqui"
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <Button className="w-full mt-4" onClick={handleSubmit}>
          Acessar
        </Button>
      </ShadowContainer>
    </div>
  );
};
