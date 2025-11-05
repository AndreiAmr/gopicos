import { Button } from '@/atomic/atoms/button';
import { URL } from '@/routes/url';
import { useNavigate } from 'react-router';

export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background">
      <img src="/under-construction.svg" className="w-2xl" />
      <h1 className="font-bold text-2xl my-2">Página em construção</h1>
      <p className="text-sm mb-4">
        No momento, essa página está em desenvolvimento e não está disponível
        para o publico!
      </p>

      <Button variant="outline" onClick={() => navigate(URL.HOME)}>
        Voltar para home
      </Button>
    </div>
  );
};
