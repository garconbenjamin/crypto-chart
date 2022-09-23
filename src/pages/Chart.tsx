import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatrComponent from "./../components/ChartComponent";
import { INTERVAL_LIST } from "./../constants";
import moment from "moment";
import type { Kline } from "./../types/kline";
function Chart() {
  const { symbol } = useParams();
  const [intervalValue, setIntervalValue] = useState("1d");

  const [isPaused, setPause] = useState(false);
  const [data, setData] = useState([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // { time: "2018-12-11", open: 174.3, high: 175.6, low: 171.24, close: 172.21 }

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
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervalValue}&endTime=${new Date().getTime()}&limit=1000`
      );
      const data = await res.json();

      const klineData = data.map((kline: Kline) => {
        const [
          openTime, // Kline open time
          openPrice, // Open price
          highPrice, // High price
          lowPrice, // Low price
          closePrice, // Close price
          volume, // Volume
          closeTime, // Kline Close time
          // _, // Quote asset volume
          // _, // Number of trades
          // _, // Taker buy base asset volume
          // _, // Taker buy quote asset volume
          // _, // Unused field, ignore.]
        ] = kline;
        const time = String(moment(openTime).format("yyyy/MM/DD HH:mm:ss"));
        console.log("time", moment(time));
        return {
          time: Math.floor(openTime / 1000),
          open: openPrice,
          close: closePrice,
          high: highPrice,
          low: lowPrice,
        };
      });
      console.log("kline", klineData);
      setData(klineData);
    };
    getHistoryData();
  }, [symbol, intervalValue]);
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
        <ChatrComponent colors={{}} data={data} interval={intervalValue} />
      </div>
    </div>
  );
}
export default Chart;
