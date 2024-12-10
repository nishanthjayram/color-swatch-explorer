import { useState } from "react";
import { TColorCache } from "../types/TColorCache";

/**
 * Custom hook to manage a color cache stored in local storage. Provides a stateful
 * color cache and a function to update it. The cache is initialized from local
 * storage and any updates to the cache are also persisted to local storage.
 *
 * @returns {Object} An object containing:
 * - colorCache: The current state of the color cache.
 * - wrappedSetColorCache: A function to update the color cache.
 */
const useColorCache = () => {
  const [colorCache, setColorCache] = useState<TColorCache>(() => {
    const cache = localStorage.getItem("colorCache");
    if (cache) {
      return JSON.parse(cache);
    } else {
      localStorage.setItem("colorCache", JSON.stringify({}));
      return {};
    }
  });

  // Update the color cache and persist it to local storage
  const wrappedSetColorCache = (cache: TColorCache) => {
    localStorage.setItem("colorCache", JSON.stringify(cache));
    setColorCache(cache);
  };

  return {
    colorCache,
    wrappedSetColorCache,
  };
};

export default useColorCache;
