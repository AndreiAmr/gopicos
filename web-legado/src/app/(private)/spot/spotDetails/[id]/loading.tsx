'use client';
import Lottie from 'react-lottie';
import skaterBoyAnimation from '@/assets/animations/skate-boy-animation.json';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: skaterBoyAnimation,
        }}
        height={'25vh'}
      />

      <h1 className="font-normal text-xl mt-5">
        Carregando informações do local...
      </h1>
    </div>
  );
}
