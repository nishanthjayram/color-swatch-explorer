import { useRef, useEffect } from "react";

/**
 * Custom hook to run a callback function on mount.
 *
 * @param {Function} callback The function to run on mount.
 */
export const useOnMount = (callback: () => void) => {
  // Make the callback function non-reactive so it does not change between re-renders.
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current();
  }, []);
};
