import {
  createChart,
  ColorType,
  AreaStyleOptions,
  LayoutOptions,
  CrosshairMode,
  IChartApi,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { TIME_VISIBLE_MAP } from "./../constants";

const LIMIT = 1000;
type ChartComponentProps = {
  interval?: string;
  data: any[];
  colors: Partial<AreaStyleOptions & LayoutOptions>;
  onOffsetChange: (offset: number) => void;
  offset: number;
};
function ChartComponent(props: ChartComponentProps) {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
    },
    offset,
    onOffsetChange,
    interval = "1d",
  } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current as HTMLElement, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },

      width: chartContainerRef?.current?.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: TIME_VISIBLE_MAP[interval] || false,
      },
    });
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    chart.timeScale().fitContent();

    const candleSeries = chart.addCandlestickSeries({});
    candleSeries.setData(data);
    setChartInstance(chart);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, interval]);
  useEffect(() => {
    if (chartInstance) {
      chartInstance
        .timeScale()
        .subscribeVisibleLogicalRangeChange((newVisibleLogicalRange) => {
          if (newVisibleLogicalRange) {
            const { from } = newVisibleLogicalRange;

            if (from && from < (LIMIT / 2) * -1) {
              onOffsetChange(Math.ceil(Math.abs(from / LIMIT)));
            }
          }
        });
    }
  }, [offset, onOffsetChange, chartInstance]);
  return (
    <div>
      {offset}
      <div ref={chartContainerRef}></div>
    </div>
  );
}
export default ChartComponent;
