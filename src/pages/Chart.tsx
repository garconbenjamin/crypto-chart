import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ChatrComponent from "./../components/ChartComponent";
import { INTERVAL_LIST } from "./../constants";
import moment, { DurationInputArg2 } from "moment";
import type { Kline } from "./../types/kline";
type ChartKline = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
};
const handleInterval = (str: string) => ({
  basis: Number(str.substring(0, str.length - 1)),
  unit: str.substring(str.length - 1, str.length),
});
function Chart() {
  const { symbol } = useParams();
  const [intervalValue, setIntervalValue] = useState("1d");
  const [offset, setOffset] = useState(0);

  const [data, setData] = useState<ChartKline[]>([]);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const { basis, unit } = handleInterval(intervalValue);
  console.log("data", data);
  const endTime = useMemo(
    () =>
      moment(new Date())
        .add(offset * -1000 * basis, unit as DurationInputArg2)
        .valueOf(),
    []
  );
  const startTime = useMemo(
    () =>
      moment(new Date())
        .add((offset + 1) * -1000 * basis, unit as DurationInputArg2)
        .valueOf(),
    [offset]
  );

  useEffect(() => {
    // const websocket = new WebSocket(
    //   `wss://stream.binance.com:9443/stream?streams=btcusdt@miniTicker/${symbol}@kline_${intervalValue}`
    // );
    // setWs(websocket);
    // websocket.onopen = () => console.log("ws opened");
    // websocket.onclose = () => console.log("ws closed");
    // websocket.onmessage = (event) => {
    //   // console.log(event.data);
    // };

    const getHistoryData = async () => {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervalValue}&startTime=${startTime}&endTime=${endTime}&limit=1000`
      );
      const data = await res.json();

      const klineData: ChartKline[] = data.map((kline: Kline) => {
        const [
          openTime, // Kline open time
          openPrice, // Open price
          highPrice, // High price
          lowPrice, // Low price
          closePrice, // Close price
        ] = kline;

        return {
          time: Math.floor(openTime / 1000),
          open: openPrice,
          close: closePrice,
          high: highPrice,
          low: lowPrice,
        };
      });
      const newData: ChartKline[] = Array.from(data);

      newData.concat(klineData);
      console.log("newData", newData);
      setData(klineData);
    };
    getHistoryData();
  }, [symbol, intervalValue, startTime, endTime]);
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
        {data.length && (
          <ChatrComponent
            colors={{}}
            data={data}
            interval={intervalValue}
            onOffsetChange={setOffset}
            offset={offset}
          />
        )}
      </div>
    </div>
  );
}
export default Chart;
