import { Button } from '@/atomic/atoms/button';
import { Card } from '@/atomic/atoms/card';
import { Input } from '@/atomic/atoms/input';

import { useLogin } from './useLogin';

export const LoginPage = () => {
  const {
    isLoading,
    handleConfirm,
    email,
    setEmail,
    password,
    setPassword,
    handleEnter,
  } = useLogin();

  return (
    <div className="h-full w-full flex flex-1 justify-center items-center border border-black">
      <Card className="flex flex-col shadow-double gap-1 p-10 rounded-2x justify-center items-center border-none">
        <div className="flex items-center gap-1 ">
          <img src="/logo.svg" alt="logo" />
          <h1 className="font-bold text-2xl">GoPicos</h1>
        </div>
        <p className="font-normal text-muted-foreground text-xs mt-0 ">
          Informe seus dados para entrar na nossa comunidade
        </p>
        <div className="flex flex-col w-full gap-3 mt-6">
          <Input
            placeholder="Digite aqui"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
          />
          <Input
            placeholder="Digite aqui"
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>
        <Button className="w-full mt-1" onClick={handleConfirm}>
          {isLoading ? 'Carregando...' : 'Acessar'}{' '}
        </Button>
      </Card>
    </div>
  );
};
