import * as S from './styles';
import { Map } from '../../../components/Map';
import { Header } from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeTemplate = () => {
  return (
    <S.Container>
      <Map />

      <SafeAreaView edges={['top']}>
        <Header />
      </SafeAreaView>
    </S.Container>
  );
};
