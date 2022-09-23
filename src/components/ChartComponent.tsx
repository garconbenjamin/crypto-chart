import {
  createChart,
  ColorType,
  AreaStyleOptions,
  LayoutOptions,
  CrosshairMode,
  IChartApi,
  TimeRange,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
type ChartComponentProps = {
  interval?: string;
  data: any[];
  colors: Partial<AreaStyleOptions & LayoutOptions>;
};
function ChartComponent(props: ChartComponentProps) {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      // areaTopColor = "#2962FF",
      // areaBottomColor = "rgba(41, 98, 255, 0.28)"
    },
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
        timeVisible: [
          "1s",
          "1m",
          "3m",
          "5m",
          "15m",
          "30m",
          "1h",
          "2h",
          "4h",
          "6h",
          "8h",
          "12h",
        ].includes(interval),
        // visible: false,
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
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    interval,
    //   areaTopColor,
    //   areaBottomColor
  ]);
  return (
    <div>
      <div ref={chartContainerRef}></div>
      <button
        onClick={() => {
          if (chartInstance) {
            const timeScale = chartInstance.timeScale();
            const { from, to } = timeScale.getVisibleLogicalRange() || {};
            console.log("to", to);
            console.log("from", from);
            const startDateStamp = Number(from) * 1000;
            const endDateStamp = Number(to) * 1000;
            // timeScale.scrollToRealTime();
            console.log(
              "range",
              moment(startDateStamp).format("yyyy/MM/DD"),
              moment(endDateStamp).format("yyyy/MM/DD")
            );
          }
        }}
      >
        time range
      </button>
    </div>
  );
}
export default ChartComponent;
