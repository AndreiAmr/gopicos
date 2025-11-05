import { call, put, select, takeLatest } from 'redux-saga/effects';

import { createSpotActions } from './createSpotActions';

import {
  CreateSpotActionTypes,
  ICoordinates,
  ICreateSpotAction,
} from './createSpotTypes';
import { createSpotRepository } from './createSpotRepository';
import { createSpotSelectors } from './createSpotSelectors';

export function* navigateToNextStep({ payload }: ICreateSpotAction) {
  if (!payload?.coordinates || !payload.markingType) return;

  yield put(createSpotActions.setCoordinates(payload.coordinates));

  yield put(createSpotActions.setNextStep(1));
}

export function* fetchCreateSpot({ payload }: ICreateSpotAction) {
  if (!payload?.newSpotInfos) return;
  yield put(createSpotActions.setNewSpotProps(payload.newSpotInfos));

  const coordinates: ICoordinates = yield select(
    createSpotSelectors.getCreateSpotCoordinates,
  );

  const imageFiles = payload.imageFiles || [];

  yield call(createSpotRepository.fetchCreateSpot, {
    coordinates,
    images: imageFiles,
    ...payload.newSpotInfos,
  });
}

const createSpotSagas = [
  takeLatest(CreateSpotActionTypes.FETCH_CREATE_SPOT, fetchCreateSpot),
  takeLatest(CreateSpotActionTypes.CONTINUE_TO_NEXT_STEP, navigateToNextStep),
];

export default createSpotSagas;
