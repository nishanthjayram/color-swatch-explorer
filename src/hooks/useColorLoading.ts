import { useState, useMemo, useRef, useEffect } from "react";

import { DEFAULT_LIGHT, DEFAULT_SAT, HUE_RANGE } from "../constants";
import { isAbortError, isFetchError } from "../errors";
import findUniqueColors from "../utils/findUniqueColors";
import { getColor } from "../utils/getColor";
import {
  createWrappedMap,
  setWrappedMap,
  getWrappedMap,
  TWrappedMap,
} from "../utils/wrappedMap";
import useColorCache from "./useColorCache";
import TColorSwatch from "../types/TColorSwatch";
import { TColorCacheKey } from "../types/TColorCache";

/**
 * Custom hook to manage the loading and caching of color data.
 *
 * This hook handles the state and logic for loading color data based on
 * saturation and lightness values. It uses a cache to store the loaded colors
 * and manages inflight queries to prevent duplicate requests.
 *
 * @param {Object} params - Hook parameters, containing the (saturation, lightness) values
 * for the colors. Default values are (100, 50).
 *
 * @returns {Object} An object containing:
 * - loading: A boolean indicating if the colors are currently being loaded.
 * - populateCache: A function to start loading and caching the colors.
 * - colorsForSaturationAndLightness: An array of colors for the given saturation and lightness.
 */
const useColorLoading = ({
  saturation = DEFAULT_SAT,
  lightness = DEFAULT_LIGHT,
}) => {
  const { colorCache, wrappedSetColorCache } = useColorCache();
  const [inflightQueries, setInflightQueries] =
    useState<TWrappedMap<boolean>>(createWrappedMap);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup the abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Determine if the colors are currently being loaded
  const loading = useMemo(() => {
    const isFinished =
      getWrappedMap(inflightQueries, `${saturation}-${lightness}`) ?? false;
    return !isFinished;
  }, [inflightQueries, saturation, lightness]);

  // Populate the cache with colors for the given saturation and lightness values
  const populateCache = async (saturation: number, lightness: number) => {
    try {
      setLoadingProgress(0);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setInflightQueries((prev) =>
        setWrappedMap(prev, `${saturation}-${lightness}`, false)
      );

      const cache = { ...colorCache };
      const getColorWithCache = async (h: number) => {
        const key: TColorCacheKey = `${h}-${saturation}-${lightness}`;
        if (!cache[key]) {
          if (signal?.aborted) {
            throw new DOMException("Color search aborted", "AbortError");
          }
          cache[key] = await getColor(h, saturation, lightness, signal);
        }
        return cache[key];
      };

      await findUniqueColors(
        HUE_RANGE.min,
        HUE_RANGE.max,
        getColorWithCache,
        (colorCount) => setLoadingProgress(colorCount)
      );

      setLoadingProgress(100);
      setInflightQueries((prev) =>
        setWrappedMap(prev, `${saturation}-${lightness}`, true)
      );
      wrappedSetColorCache(cache);
    } catch (error: unknown) {
      if (isAbortError(error)) {
        console.log("Request cancelled");
        return;
      }

      console.error(
        isFetchError(error) ? "Failed to fetch colors" : "Unexpected error"
      );

      setInflightQueries((prev) =>
        setWrappedMap(prev, `${saturation}-${lightness}`, true)
      );
      throw error;
    }
  };

  // Get the colors for the given saturation and lightness values
  const colorsForSaturationAndLightness = useMemo(() => {
    if (loading) {
      return [];
    }

    const seenColorNames = new Set<string>();
    const colors = new Array<TColorSwatch>();
    for (let i = 0; i < 360; i++) {
      const key: TColorCacheKey = `${i}-${saturation}-${lightness}`;
      const color = colorCache[key];
      if (!color || seenColorNames.has(color.name)) {
        continue;
      }
      seenColorNames.add(color.name);
      colors.push(color);
    }
    return colors;
  }, [colorCache, lightness, loading, saturation]);

  return {
    loading,
    loadingProgress,
    populateCache,
    colorsForSaturationAndLightness,
  };
};

export default useColorLoading;
