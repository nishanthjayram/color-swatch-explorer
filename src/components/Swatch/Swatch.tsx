import styles from "./Swatch.module.css";
import TColorSwatch from "../../types/TColorSwatch";

type SwatchProps = { swatch: TColorSwatch };
const Swatch: React.FC<SwatchProps> = ({ swatch }) => {
  const {
    name,
    rgb: { r, g, b },
  } = swatch;
  return (
    <div className={styles.swatchWrapper}>
      <div
        className={styles.swatchColor}
        style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
      />
      <div className={styles.swatchInfo}>
        <div className={styles.name}>{name}</div>
        <div className={styles.rgb}>{`rgb(${r}, ${g}, ${b})`}</div>
      </div>
    </div>
  );
};

export default Swatch;
