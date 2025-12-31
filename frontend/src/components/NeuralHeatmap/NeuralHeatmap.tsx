import { NeuralHeatmapData } from '../../types';
import styles from './NeuralHeatmap.module.css';

interface NeuralHeatmapProps {
  heatmap: NeuralHeatmapData;
}

export const NeuralHeatmap = ({ heatmap }: NeuralHeatmapProps) => {
  return (
    <div className={styles.neuralHeatmap}>
      <div className={styles.header}>NEURAL_HEATMAP</div>
      <div className={styles.content}>
        <div className={styles.label}>SPATIAL_MAP</div>
        <div className={styles.activeLabel}>ACTIVE: {heatmap.activeCells}</div>
        <div className={styles.grid}>
          {heatmap.grid.map((row, i) =>
            row.map((value, j) => (
              <div
                key={`${i}-${j}`}
                className={styles.cell}
                style={{
                  opacity: value,
                  boxShadow: value > 0.3 ? `0 0 ${value * 8}px #00ff00` : 'none',
                  background: value > 0.3 ? '#00ff00' : '#001100',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

