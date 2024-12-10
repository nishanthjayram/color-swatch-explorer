import styles from "./Grid.module.css";
import Swatch from "../Swatch/Swatch";
import TColorSwatch from "../../types/TColorSwatch";

type TGridProps = {
  swatches: TColorSwatch[];
};
const Grid: React.FC<TGridProps> = ({ swatches }) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {swatches.map((swatch) => {
          return (
            <Swatch
              key={`${swatch.rgb.r}-${swatch.rgb.g}-${swatch.rgb.b}`}
              swatch={swatch}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
