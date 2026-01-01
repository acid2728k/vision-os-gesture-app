import { HandOrientation } from '../../types';
import styles from './OrientationCompass.module.css';

interface OrientationCompassProps {
  orientation: HandOrientation;
}

export const OrientationCompass = ({ orientation }: OrientationCompassProps) => {
  const { heading } = orientation;
  const rotation = heading;

  return (
    <div className={styles.orientationCompass}>
      <div className={styles.wrapper}>
        <div className={styles.header}>ORIENTATION_COMPASS</div>
        <div className={styles.compassContainer}>
          <div className={styles.compass}>
            <div className={styles.compassFace}>
              <div className={styles.direction}>N</div>
              <div className={styles.direction}>E</div>
              <div className={styles.direction}>S</div>
              <div className={styles.direction}>W</div>
              <div
                className={styles.needle}
                style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
              />
            </div>
          </div>
          <div className={styles.heading}>HDG {Math.round(heading)}°</div>
        </div>
      </div>
    </div>
  );
};

