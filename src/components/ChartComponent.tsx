import {
  createChart,
  ColorType,
  AreaStyleOptions,
  LayoutOptions,
  CrosshairMode,
  IChartApi,
  Range,
  Logical,
  ISeriesApi,
  ITimeScaleApi,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { TIME_VISIBLE_MAP, LIMIT } from "./../constants";

type ChartComponentProps = {
  interval?: string;
  data: any[];
  // colors: Partial<AreaStyleOptions & LayoutOptions>;
  loadMore: () => void;
};
function ChartComponent(props: ChartComponentProps) {
  const { data, interval = "1d", loadMore } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const [timescalInstance, setTimescalInstance] =
    useState<ITimeScaleApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  useEffect(() => {
    const chart = createChart(chartContainerRef.current as HTMLElement, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },

      width: chartContainerRef?.current?.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: TIME_VISIBLE_MAP[interval] || false,
        shiftVisibleRangeOnNewBar: false,
      },
    });
    setChartInstance(chart);
    const candleSeries = chart.addCandlestickSeries({});
    candleSeries.setData(data);
    setSeries(candleSeries);
    const timescal = chart.timeScale();
    setTimescalInstance(timescal);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      // window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [interval, loadMore]);

  useEffect(() => {
    if (timescalInstance && series) {
      const onVisibleLogicalRangeChanged = (
        newVisibleLogicalRange: Range<Logical>
      ) => {
        const barsInfo = series.barsInLogicalRange(newVisibleLogicalRange);
        // if there less than 50 bars to the left of the visible area

        if (barsInfo !== null && barsInfo.barsBefore < 50) {
          // loadMore();
        }
      };

      timescalInstance.subscribeVisibleLogicalRangeChange(
        (newVisibleLogicalRange) =>
          newVisibleLogicalRange &&
          onVisibleLogicalRangeChanged(newVisibleLogicalRange)
      );
    }
  }, [timescalInstance, series, loadMore]);
  useEffect(() => {
    if (series) {
      series.setData(data);
    }
  }, [data, series]);
  return (
    <div>
      {data.length}
      <div ref={chartContainerRef}></div>{" "}
      <button
        onClick={() => {
          const updateData = data[data.length - 1];

          updateData.open = "1080";
          updateData.close = "1000";
          updateData.high = "1115";
          updateData.low = "900";

          series?.update(updateData);
        }}
      >
        update new
      </button>
      <button
        onClick={() => {
          const updateData = data.filter((_, i) => i > 500);

          series?.setData(updateData);
        }}
      >
        add old
      </button>
    </div>
  );
}
export default ChartComponent;
