import { generateKlineData } from "utils";
import { LIMIT } from "constant";
const getHistoryData = async ({
  symbol,
  intervalValue,
  limit = LIMIT,
  endTime,
}: {
  symbol: string;
  intervalValue: string;
  limit?: number;
  endTime?: number;
}) => {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervalValue}${
      endTime ? "&endTime=" + endTime : ""
    }&limit=${limit}`
  );
  const rawData = await res.json();

  const klineData = generateKlineData(rawData);

  return klineData;
};
export { getHistoryData };
