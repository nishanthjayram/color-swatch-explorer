import TColorSwatch from "./TColorSwatch";

export type TColorCacheKey = `${number}-${number}-${number}`;
export type TColorCache = {
  [key: TColorCacheKey]: TColorSwatch;
};
