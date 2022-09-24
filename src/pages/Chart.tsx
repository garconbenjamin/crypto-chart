import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { INTERVAL_LIST, TIME_VISIBLE_MAP, LIMIT } from "./../constants";

import type { Kline } from "./../types/kline";
import {
  createChart,
  ColorType,
  CrosshairMode,
  ISeriesApi,
  ITimeScaleApi,
  CandlestickData,
  Range,
  Logical,
  Time,
} from "lightweight-charts";

const generateKlineData = (rawData: Kline[]) =>
  rawData.map((kline) => {
    const [
      openTime, // Kline open time
      openPrice, // Open price
      highPrice, // High price
      lowPrice, // Low price
      closePrice, // Close price
    ] = kline;

    return {
      time: (openTime / 1000) as Time,
      open: Number(openPrice),
      close: Number(closePrice),
      high: Number(highPrice),
      low: Number(lowPrice),
    };
  });
function Chart() {
  const { symbol } = useParams();
  const [intervalValue, setIntervalValue] = useState("1d");

  const [initialData, setInitialData] = useState<CandlestickData[]>([]);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [timescalInstance, setTimescalInstance] =
    useState<ITimeScaleApi | null>(null);
  const [seriesInstance, setSeriesInstance] =
    useState<ISeriesApi<"Candlestick"> | null>(null);
  const [loadFlag, setLoadFlag] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getHistoryData = async () => {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervalValue}&limit=${LIMIT}`
      );
      const rawData = await res.json();

      const klineData = generateKlineData(rawData);

      setInitialData(klineData);
      return klineData;
    };
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
      const data = await getHistoryData();
      candleSeries.setData(data);
      setSeriesInstance(candleSeries);
    };
    initSeries();
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [intervalValue, symbol]);

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
  }, [seriesInstance, timescalInstance]);
  useEffect(() => {
    if (loadFlag && hasMore) {
      const loadMore = async () => {
        if (initialData.length) {
          const endTime = Number(initialData[0].time) * 1000 - 1;
          console.log("endTime", endTime);
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervalValue}&endTime=${endTime}&limit=${LIMIT}`
          );

          const rawData = await res.json();
          if (rawData.length) {
            const klineData = generateKlineData(rawData);

            const newData = [...klineData, ...initialData];

            setInitialData(newData);
            seriesInstance?.setData(newData);
          } else {
            setHasMore(false);
          }

          setLoadFlag(false);
        }
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
      <select
        onChange={(e) => setIntervalValue(e.target.value)}
        value={intervalValue}
      >
        {INTERVAL_LIST.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <div>
        <div ref={chartContainerRef}></div>
      </div>

      <button
        onClick={() => {
          const newData = initialData.filter((_, i) => i > 500);
          setInitialData(newData);
          seriesInstance?.setData(newData);
        }}
      >
        update
      </button>
      <button onClick={() => setLoadFlag(true)}>fetch</button>
    </div>
  );
}
export default Chart;
