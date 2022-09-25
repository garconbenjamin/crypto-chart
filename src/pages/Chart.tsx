import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getHistoryData } from "api";
import { INTERVAL_LIST, TIME_VISIBLE_MAP } from "constant";

import {
  createChart,
  ColorType,
  CrosshairMode,
  ISeriesApi,
  ITimeScaleApi,
  CandlestickData,
  Range,
  Logical,
} from "lightweight-charts";

function Chart() {
  const { symbol } = useParams();
  const [intervalValue, setIntervalValue] = useState("1d");
  const [initialData, setInitialData] = useState<CandlestickData[]>([]);

  const [loadFlag, setLoadFlag] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [timescalInstance, setTimescalInstance] =
    useState<ITimeScaleApi | null>(null);
  const [seriesInstance, setSeriesInstance] =
    useState<ISeriesApi<"Candlestick"> | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  /** Initialize chart and load initialData */
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
      height: 600,
      timeScale: {
        timeVisible: TIME_VISIBLE_MAP[intervalValue] || false,
        shiftVisibleRangeOnNewBar: false,
      },
    });
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };
    window.addEventListener("resize", handleResize);
    const timescal = chart.timeScale();
    setTimescalInstance(timescal);
    const initSeries = async () => {
      const candleSeries = chart.addCandlestickSeries({});
      const data = await getHistoryData({
        symbol: symbol || "",
        intervalValue,
      });
      setHasMore(Boolean(data.length));
      setInitialData(data);
      candleSeries.setData(data);
      setSeriesInstance(candleSeries);
    };
    initSeries();
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [intervalValue, symbol]);
  /** Lazy load trigger*/
  useEffect(() => {
    if (timescalInstance && seriesInstance) {
      const onVisibleLogicalRangeChanged = (
        newVisibleLogicalRange: Range<Logical>
      ) => {
        const barsInfo = seriesInstance.barsInLogicalRange(
          newVisibleLogicalRange
        );
        // if there less than 50 bars to the left of the visible area
        if (barsInfo !== null && barsInfo.barsBefore < 50) {
          setLoadFlag(true);
        }
      };

      timescalInstance.subscribeVisibleLogicalRangeChange(
        (newVisibleLogicalRange) =>
          newVisibleLogicalRange &&
          onVisibleLogicalRangeChanged(newVisibleLogicalRange)
      );
    }
  }, [symbol, seriesInstance, timescalInstance]);
  /** Lazy load */
  useEffect(() => {
    if (loadFlag && hasMore) {
      const loadMore = async () => {
        const endTime = Number(initialData[0].time) * 1000 - 1;

        const data = await getHistoryData({
          symbol: symbol || "",
          intervalValue,
          endTime,
        });

        if (data.length) {
          const newData = [...data, ...initialData];
          setInitialData(newData);
          seriesInstance?.setData(newData);
        } else {
          setHasMore(false);
        }

        setLoadFlag(false);
      };

      loadMore();
    }
  }, [
    loadFlag,
    seriesInstance,
    setInitialData,
    initialData,
    hasMore,
    setHasMore,
    intervalValue,
    symbol,
  ]);

  return (
    <div>
      {symbol}
      <div className="interval-controls">
        {INTERVAL_LIST.map((value) => (
          <button key={value} onClick={() => setIntervalValue(value)}>
            {value}
          </button>
        ))}
      </div>
      <div>
        <div ref={chartContainerRef}></div>
      </div>
    </div>
  );
}
export default Chart;
