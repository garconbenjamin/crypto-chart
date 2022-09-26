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
  Time,
} from "lightweight-charts";
import type { StreamKline } from "types";

function Chart() {
  const { symbol } = useParams();
  const [intervalValue, setIntervalValue] = useState("1d");
  const [initialData, setInitialData] = useState<CandlestickData[]>([]);

  const [loadFlag, setLoadFlag] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [candlestickInfo, setCandlestickInfo] = useState<any>(null);

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
        mode: CrosshairMode.Magnet,
      },

      width: chartContainerRef?.current?.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: TIME_VISIBLE_MAP[intervalValue] || false,
      },
    });
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };
    window.addEventListener("resize", handleResize);
    const candleSeries = chart.addCandlestickSeries({});
    chart.subscribeCrosshairMove((param) => {
      setCandlestickInfo(param.seriesPrices.get(candleSeries));
    });
    const timescal = chart.timeScale();
    setTimescalInstance(timescal);
    const initSeries = async () => {
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

  /** Realtime ticker */
  useEffect(() => {
    const websocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol?.toLowerCase()}@kline_${intervalValue}`
    );

    websocket.onmessage = (event) => {
      const data: StreamKline = JSON.parse(event.data);

      const {
        k: { o, c, h, l, t },
      } = data;
      const currentBar = {
        time: (t / 1000) as Time,
        open: Number(o),
        close: Number(c),
        high: Number(h),
        low: Number(l),
      };

      seriesInstance?.update(currentBar);
    };
    websocket.onopen = (event) => {
      console.log("open");
    };
    websocket.onclose = (event) => {
      console.log("close");
    };
    return () => {
      websocket.close();
    };
  }, [seriesInstance, symbol, intervalValue]);

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
      <h2 className="title">{symbol}</h2>
      <div className="interval-controls">
        <div>Interval</div>

        <select
          onChange={(e) => setIntervalValue(e.target.value)}
          value={intervalValue}
        >
          {INTERVAL_LIST.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="chart-outer-container">
        <div className="price-detail-bar">
          {candlestickInfo &&
            Object.entries(candlestickInfo).map(([name, price]) => (
              <span key={name}>{name + ": " + price}</span>
            ))}
        </div>
        <div ref={chartContainerRef}></div>
      </div>
    </div>
  );
}
export default Chart;
