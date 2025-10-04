export const formatLocationString = (text?: string, isLastOne?: boolean) => {
  if (text && !isLastOne) {
    return `${text},`;
  }

  if (text && isLastOne) {
    return text;
  }

  return '';
};

export const getBoundingBoxPolygonVertices = (
  boundingBox: number[]
): number[][] => {
  const [minLat, maxLat, minLon, maxLon] = boundingBox.map(Number);

  return [
    [minLon, minLat],
    [maxLon, minLat],
    [maxLon, maxLat],
    [minLon, maxLat],
    [minLon, minLat],
  ];
};
