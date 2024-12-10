import { TWrappedMap, setWrappedMap } from "./wrappedMap";

/**
 * Updates the inflight query state for a specific saturation and lightness value.
 *
 * This function updates the state of inflight queries by setting a boolean value
 * for a specific combination of saturation and lightness. It uses the provided
 * state setter function to update the state.
 *
 * @param {React.Dispatch<React.SetStateAction<TWrappedMap<boolean>>>} setQueries - The state setter function for inflight queries.
 * @param {number} saturation - The saturation value for the query.
 * @param {number} lightness - The lightness value for the query.
 * @param {boolean} value - The boolean value to set for the specified saturation and lightness.
 */
export const updateInflightQuery = (
  setQueries: React.Dispatch<React.SetStateAction<TWrappedMap<boolean>>>,
  saturation: number,
  lightness: number,
  value: boolean
) => {
  setQueries((prev) =>
    setWrappedMap(prev, `${saturation}-${lightness}`, value)
  );
};
