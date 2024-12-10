import { isAbortError, isFetchError } from "../errors";
import TColorSwatch from "../types/TColorSwatch";

/**
 * Finds unique colors within a specified range of hues.
 *
 * This function iterates through a range of hues and uses a provided function
 * to fetch color data for each hue. It identifies and returns a map of unique
 * colors based on their names.
 *
 * @param {number} start - The starting hue value.
 * @param {number} end - The ending hue value.
 * @param {Function} getColorWithCache - A function that fetches color data for a given hue.
 * @param {Function} onProgress - An optional callback to report progress, e.g. for a loading indicator.
 * @returns {Promise<Map<string, TColorSwatch>>} A promise that resolves to a map of unique colors.
 */
const findUniqueColors = async (
  start: number,
  end: number,
  getColorWithCache: (h: number) => Promise<TColorSwatch>,
  onProgress?: (currentHue: number) => void
): Promise<Map<string, TColorSwatch>> => {
  const uniqueColors = new Map<string, TColorSwatch>();
  const checkedHues = new Set<number>();
  let maxHueChecked = start;

  /* Helper to update progress indicator */
  const updateProgress = (hue: number) => {
    if (hue > maxHueChecked) {
      maxHueChecked = hue;
      const progress = (maxHueChecked - start) / (end - start);
      onProgress?.(Math.floor(progress * 100));
    }
  };

  const checkAndAddColor = async (hue: number): Promise<string | null> => {
    if (checkedHues.has(hue)) {
      return null;
    }
    checkedHues.add(hue);
    updateProgress(hue);

    const color = await getColorWithCache(hue);
    if (!uniqueColors.has(color.name)) {
      uniqueColors.set(color.name, color);
      return color.name;
    }
    return null;
  };

  // Binary search to find the boundary of a color
  const findColorBoundary = async (
    start: number,
    end: number,
    startColor: string
  ): Promise<number> => {
    let left = start;
    let right = end;

    while (right - left > 1) {
      const mid = Math.floor((left + right) / 2);
      updateProgress(mid);
      const color = await getColorWithCache(mid);

      if (color.name === startColor) {
        left = mid;
      } else {
        right = mid;
      }
    }

    return right;
  };

  // Search for unique colors within the specified range. Uses a combination of
  // binary and exponential search to find the boundaries of unique colors.
  const searchRange = async (start: number, end: number) => {
    const startColor = await checkAndAddColor(start);
    if (!startColor) return;

    let step = 1;
    let currentHue = start + step;

    while (currentHue < end) {
      updateProgress(currentHue);
      const color = await getColorWithCache(currentHue);

      if (color.name !== startColor) {
        const boundaryHue = await findColorBoundary(
          currentHue - step,
          currentHue,
          startColor
        );

        // Recurse
        await searchRange(boundaryHue, end);
        return;
      }

      checkedHues.add(currentHue);
      step *= 2;
      currentHue = start + step;

      if (currentHue >= end) {
        await checkAndAddColor(end);
        updateProgress(end);
      }
    }
  };

  try {
    await searchRange(start, end);
    updateProgress(end);
    return uniqueColors;
  } catch (error: unknown) {
    if (isAbortError(error) || isFetchError(error)) {
      throw error;
    }

    throw new Error(
      `Failed to find unique colors: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export default findUniqueColors;
