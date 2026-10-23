import { Alert } from 'react-native';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import type { PickedPhoto } from '../../../../domain/spot/newSpotForm';

export const pickPhotoStrings = {
  takePhoto: 'Tirar foto',
  pickFromGallery: 'Escolher da galeria',
  cancel: 'Cancelar',
  addPhotoTitle: 'Adicionar foto',
} as const;

export const toPicked = (assets: Asset[] = []): PickedPhoto[] =>
  assets
    .filter(asset => asset.uri)
    .map((asset, index) => ({
      uri: asset.uri as string,
      name: asset.fileName ?? `foto-${Date.now()}-${index}.jpg`,
      type: asset.type ?? 'image/jpeg',
      size: asset.fileSize,
    }));

/** Pergunta câmera ou galeria e devolve o resultado em `onPicked`. */
export const askForPhoto = (
  remaining: number,
  onPicked: (response: ImagePickerResponse) => void,
) => {
  Alert.alert(pickPhotoStrings.addPhotoTitle, undefined, [
    {
      text: pickPhotoStrings.takePhoto,
      onPress: () => launchCamera({ mediaType: 'photo', quality: 0.8 }, onPicked),
    },
    {
      text: pickPhotoStrings.pickFromGallery,
      onPress: () =>
        launchImageLibrary(
          { mediaType: 'photo', quality: 0.8, selectionLimit: remaining },
          onPicked,
        ),
    },
    { text: pickPhotoStrings.cancel, style: 'cancel' },
  ]);
};
