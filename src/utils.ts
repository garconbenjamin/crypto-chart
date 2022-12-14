import { Time } from "lightweight-charts";
import type { Kline } from "types";
import moment from "moment";
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
      // time: (moment(openTime).startOf("D").valueOf() / 1000) as Time,
      open: Number(openPrice),
      close: Number(closePrice),
      high: Number(highPrice),
      low: Number(lowPrice),
    };
  });

export { generateKlineData };
