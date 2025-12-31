import { GestureType } from '../../types';
import styles from './DetectedGesture.module.css';

interface DetectedGestureProps {
  gesture: GestureType;
}

const GESTURE_ICONS: Record<GestureType, string> = {
  OPEN: '✋',
  CLOSED: '✊',
  PINCH: '🤏',
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  POINT: '👆',
  VICTORY: '✌️',
  NONE: '—',
};

export const DetectedGesture = ({ gesture }: DetectedGestureProps) => {
  return (
    <div className={styles.detectedGesture}>
      <div className={styles.header}>DETECTED_GESTURE</div>
      <div className={styles.content}>
        <div className={styles.gestureName}>{gesture}</div>
        <div className={styles.gestureIcon}>{GESTURE_ICONS[gesture]}</div>
      </div>
    </div>
  );
};

