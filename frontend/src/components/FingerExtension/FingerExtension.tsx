import { FingerExtension as FingerExtensionType } from '../../types';
import styles from './FingerExtension.module.css';

interface FingerExtensionProps {
  extension: FingerExtensionType;
}

const FINGER_LABELS = ['THM', 'IDX', 'MID', 'RNG', 'PNK'] as const;

export const FingerExtension = ({ extension }: FingerExtensionProps) => {
  const fingers = [
    extension.thumb,
    extension.index,
    extension.middle,
    extension.ring,
    extension.pinky,
  ];

  return (
    <div className={styles.fingerExtension}>
      <div className={styles.header}>FINGER_EXTENSION</div>
      <div className={styles.bars}>
        {fingers.map((value, index) => (
          <div key={index} className={styles.barContainer}>
            <div className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{
                  height: `${value * 100}%`,
                  boxShadow: value > 0.8 ? '0 0 10px #00ff00' : 'none',
                }}
              />
            </div>
            <div className={styles.label}>{FINGER_LABELS[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

