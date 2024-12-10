import { useRef, useState } from "react";
import styles from "./App.module.css";
import Grid from "./components/Grid/Grid";
import useColorLoading from "./hooks/useColorLoading";
import { useOnMount } from "./hooks/useOnMount";
import { DEFAULT_SWATCH, DEFAULT_SAT, DEFAULT_LIGHT } from "./constants";

export type TSwatchesConfig = {
  saturation: number;
  lightness: number;
};

const App = () => {
  const saturationRef = useRef<HTMLInputElement>(null);
  const lightnessRef = useRef<HTMLInputElement>(null);

  const [swatchesConfig, setSwatchesConfig] =
    useState<TSwatchesConfig>(DEFAULT_SWATCH);

  const [draftSwatchesConfig, setDraftSwatchesConfig] =
    useState<TSwatchesConfig>(DEFAULT_SWATCH);

  const {
    colorsForSaturationAndLightness,
    loading,
    loadingProgress,
    populateCache,
  } = useColorLoading(swatchesConfig);

  useOnMount(() => populateCache(DEFAULT_SAT, DEFAULT_LIGHT));

  return (
    <div className={styles.appWrapper}>
      <div className={styles.controlWrapper}>
        <div className={styles.control}>
          <label>Saturation</label>
          <input
            type="range"
            ref={saturationRef}
            value={draftSwatchesConfig.saturation}
            onChange={(e) => {
              setDraftSwatchesConfig((prev) => ({
                ...prev,
                saturation: parseInt(e.target.value),
              }));
            }}
            onMouseUp={async () => {
              if (!saturationRef.current) {
                return;
              }
              const newSaturation = parseInt(saturationRef.current.value);

              setSwatchesConfig(draftSwatchesConfig);

              await populateCache(newSaturation, draftSwatchesConfig.lightness);
            }}
          />
          <label>{draftSwatchesConfig.saturation}%</label>
        </div>
        <div className={styles.control}>
          <label>Lightness</label>
          <input
            type="range"
            ref={lightnessRef}
            value={draftSwatchesConfig.lightness}
            onChange={(e) => {
              setDraftSwatchesConfig((prev) => ({
                ...prev,
                lightness: parseInt(e.target.value),
              }));
            }}
            onMouseUp={async () => {
              if (!lightnessRef.current) {
                return;
              }

              const newLightness = parseInt(lightnessRef.current.value);

              setSwatchesConfig(draftSwatchesConfig);

              await populateCache(draftSwatchesConfig.saturation, newLightness);
            }}
          />
          <label>{draftSwatchesConfig.lightness}%</label>
        </div>
      </div>
      {loading ? (
        <div className={styles.loadingContainer}>
          Loading colors... {loadingProgress}%
        </div>
      ) : (
        <Grid swatches={colorsForSaturationAndLightness} />
      )}
    </div>
  );
};

export default App;
