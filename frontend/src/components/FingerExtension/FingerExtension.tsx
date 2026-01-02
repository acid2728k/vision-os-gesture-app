import { useEffect, useRef, useMemo } from "react";
import { FingerExtension as FingerExtensionType } from "../../types";
import styles from "./FingerExtension.module.css";

interface FingerExtensionProps {
  extension: FingerExtensionType;
}

const FINGER_LABELS = ["THM", "IDX", "MID", "RNG", "PNK"] as const;

export const FingerExtension = ({ extension }: FingerExtensionProps) => {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousValuesRef = useRef<number[]>([0, 0, 0, 0, 0]);

  // Мемоизируем значения для стабильности
  const normalizedValues = useMemo(() => {
    const getValidValue = (value: number | undefined): number => {
      if (value === null || value === undefined || isNaN(value)) {
        return 0;
      }
      return Math.max(0, Math.min(1, Number(value) || 0));
    };

    // Thumb: используем значение напрямую для проверки работы расчета
    // Если нужно инвертировать, сделаем это позже
    return [
      getValidValue(extension.thumb), // Thumb: проверяем работу расчета
      getValidValue(extension.index),
      getValidValue(extension.middle),
      getValidValue(extension.ring),
      getValidValue(extension.pinky),
    ];
  }, [
    extension.thumb,
    extension.index,
    extension.middle,
    extension.ring,
    extension.pinky,
  ]);

  const fingers = useMemo(
    () =>
      normalizedValues.map((value, index) => ({
        value,
        label: FINGER_LABELS[index],
      })),
    [normalizedValues]
  );

  // Прямое обновление высоты через DOM
  useEffect(() => {
    normalizedValues.forEach((value, index) => {
      const barElement = barRefs.current[index];

      if (barElement) {
        const height = `${value * 100}%`;
        const previousHeight = barElement.style.height;
        const previousValue = previousValuesRef.current[index];

        // Для thumb (index 0) всегда обновляем принудительно
        // Для остальных обновляем только если значение изменилось
        const shouldUpdate =
          index === 0 || value !== previousValue || previousHeight !== height;

        if (shouldUpdate) {
          // Синхронное обновление для надежности
          barElement.style.height = height;
          barElement.style.boxShadow =
            value > 0.8 ? "0 0 10px #bb00ff" : "none";

          previousValuesRef.current[index] = value;
        }
      }
    });
  }, [normalizedValues]);

  return (
    <div className={styles.fingerExtension}>
      <div className={styles.wrapper}>
        <div className={styles.header}>FINGER_EXTENSION</div>
        <div className={styles.bars}>
          {fingers.map((finger, index) => {
            const normalizedValue = Math.max(0, Math.min(1, finger.value || 0));

            return (
              <div key={finger.label} className={styles.barContainer}>
                <div className={styles.barWrapper}>
                  <div
                    ref={(el) => {
                      barRefs.current[index] = el;
                    }}
                    className={`${styles.bar} ${
                      index === 0 ? styles.barThumb : ""
                    }`}
                    style={{
                      height: `${normalizedValue * 100}%`,
                      boxShadow:
                        normalizedValue > 0.8 ? "0 0 10px #bb00ff" : "none",
                    }}
                  />
                </div>
                <div className={styles.label}>{finger.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
