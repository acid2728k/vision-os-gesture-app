import { useEffect, useRef } from "react";
import { PinchData } from "../../types";
import styles from "./PinchAnalysis.module.css";

interface PinchAnalysisProps {
  pinch: PinchData;
}

export const PinchAnalysis = ({ pinch }: PinchAnalysisProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Функция для отрисовки графика
  const drawGraph = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    history: number[]
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !history || history.length === 0) {
      // Очищаем canvas если нет данных
      ctx?.clearRect(0, 0, width, height);
      return;
    }

    // Отступы для графика
    const paddingTop = 4;
    const paddingBottom = 12;
    const paddingLeft = 0;
    const paddingRight = 0;

    // Рабочая область для графика
    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;
    const graphTop = paddingTop;
    const graphBottom = height - paddingBottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Рисуем нижнюю границу (базовую линию) - всегда видна
    ctx.strokeStyle = "rgba(187, 0, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft, graphBottom);
    ctx.lineTo(paddingLeft + graphWidth, graphBottom);
    ctx.stroke();

    // Фиксированная шкала от 0 до 1
    // Функция для преобразования значения в координату Y
    const valueToY = (value: number): number => {
      // Обрабатываем некорректные значения
      if (value === null || value === undefined || isNaN(value)) {
        value = 0;
      }
      // Ограничиваем значение в диапазоне [0, 1]
      const clampedValue = Math.max(0, Math.min(1, value));
      // Инвертируем: 0 = нижняя точка (graphBottom), 1 = верхняя точка (graphTop)
      return graphBottom - clampedValue * graphHeight;
    };

    // Настройки для графика
    ctx.strokeStyle = "#bb00ff";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#bb00ff";

    if (history.length === 1) {
      // Если только одна точка, рисуем горизонтальную линию
      const y = valueToY(history[0]);

      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(paddingLeft + graphWidth, y);
      ctx.stroke();

      // Заливка под линией
      ctx.beginPath();
      ctx.moveTo(paddingLeft, graphBottom);
      ctx.lineTo(paddingLeft, y);
      ctx.lineTo(paddingLeft + graphWidth, y);
      ctx.lineTo(paddingLeft + graphWidth, graphBottom);
      ctx.closePath();
      ctx.fillStyle = "rgba(187, 0, 255, 0.15)";
      ctx.fill();
    } else {
      // Множество точек - рисуем полный график
      const stepX = graphWidth / (history.length - 1);

      // Рисуем линию графика
      ctx.beginPath();
      let hasMoved = false;

      history.forEach((value, index) => {
        const x = paddingLeft + index * stepX;
        const y = valueToY(value);

        if (!hasMoved) {
          ctx.moveTo(x, y);
          hasMoved = true;
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Заливка под графиком
      ctx.beginPath();
      ctx.moveTo(paddingLeft, graphBottom); // Начинаем с нижней линии

      history.forEach((value, index) => {
        const x = paddingLeft + index * stepX;
        const y = valueToY(value);
        ctx.lineTo(x, y);
      });

      ctx.lineTo(paddingLeft + graphWidth, graphBottom); // Заканчиваем на нижней линии
      ctx.closePath();
      ctx.fillStyle = "rgba(187, 0, 255, 0.15)";
      ctx.fill();
    }
  };

  // Единый эффект для инициализации и обновления графика
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Фильтруем и валидируем историю
    const validHistory = (pinch.history || []).filter(
      (v) => v !== null && v !== undefined && !isNaN(v)
    );

    // Функция для обновления размеров и отрисовки
    const updateGraph = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      // Устанавливаем размеры canvas только если они изменились
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Всегда перерисовываем график с валидными данными
      drawGraph(canvas, canvas.width, canvas.height, validHistory);
    };

    // Первоначальная отрисовка
    updateGraph();

    // Наблюдаем за изменением размера контейнера
    const resizeObserver = new ResizeObserver(updateGraph);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pinch.history]);

  return (
    <div className={styles.pinchAnalysis}>
      <div className={styles.header}>
        <span className={styles.title}>SIGNAL_ANALYSIS_PINCH</span>
        <div className={styles.headerRight}>
          <span className={styles.label}>PINCH_STRENGTH</span>
          <span className={styles.value}>{pinch.strength.toFixed(3)}</span>
        </div>
      </div>
      <div className={styles.content}>
        <div ref={containerRef} className={styles.graphContainer}>
          <canvas ref={canvasRef} className={styles.graph} />
        </div>
      </div>
    </div>
  );
};
