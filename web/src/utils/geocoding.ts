type BboxProps = number[];

export function bboxToPolygon([minLat, maxLat, minLng, maxLng]: BboxProps) {
  return [
    [
      [minLng, minLat],
      [minLng, maxLat],
      [maxLng, maxLat],
      [maxLng, minLat],
      [minLng, minLat],
    ],
  ];
}
