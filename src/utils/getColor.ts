import { COLOR_API_URL } from "../constants";
import { TColorSwatch } from "../types";

/* Color API response */
type TColorResponse = {
  name: {
    value: string;
  };
  rgb: {
    r: number;
    g: number;
    b: number;
  };
};

/**
 * Fetches color information from the Color API based on HSL values.
 *
 * This function takes hue, saturation, and lightness values, validates them,
 * and fetches the corresponding color information from the Color API. It returns
 * a promise that resolves to a TColorSwatch object containing the color name and RGB values.
 *
 * @param {number} h - The hue value (0-359).
 * @param {number} s - The saturation value (0-100).
 * @param {number} l - The lightness value (0-100).
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel the fetch request.
 * @returns {Promise<TColorSwatch>} A promise that resolves to a TColorSwatch object.
 * @throws {Error} Throws an error if the HSL values are invalid or if the fetch request fails.
 */
const getColor = async (
  h: number,
  s: number,
  l: number,
  signal?: AbortSignal
): Promise<TColorSwatch> => {
  if (h < 0 || h > 359 || s < 0 || s > 100 || l < 0 || l > 100) {
    throw new Error(`Invalid HSL values ${h}, ${s}, ${l}`);
  }

  const response = await fetch(`${COLOR_API_URL}/id?hsl=${h},${s}%,${l}%`, {
    signal,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch color");
  }

  const data: TColorResponse = await response.json();

  return {
    name: data.name.value,
    rgb: {
      ...data.rgb,
    },
  };
};

export { getColor };
