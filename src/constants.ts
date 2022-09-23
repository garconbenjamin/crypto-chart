const BASE_URL = "https://api.binance.com/api/v3/";

const TIME_VISIBLE_MAP: { [key: string]: boolean } = {
  "1s": true,
  "1m": true,
  "3m": true,
  "5m": true,
  "15m": true,
  "30m": true,
  "1h": true,
  "2h": true,
  "4h": true,
  "6h": true,
  "8h": true,
  "12h": true,
};

const INTERVAL_LIST = [
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
  "1d",
  "3d",
  "1w",
  "1M",
];
const initialData: Array<{
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}> = [
  {
    time: "2018-10-19 12:00",
    open: 180.34,
    high: 180.99,
    low: 178.57,
    close: 179.85,
  },
  { time: "2018-10-22", open: 180.82, high: 181.4, low: 177.56, close: 178.75 },
  {
    time: "2018-10-23",
    open: 175.77,
    high: 179.49,
    low: 175.44,
    close: 178.53,
  },
  {
    time: "2018-10-24",
    open: 178.58,
    high: 182.37,
    low: 176.31,
    close: 176.97,
  },
  { time: "2018-10-25", open: 177.52, high: 180.5, low: 176.83, close: 179.07 },
  {
    time: "2018-10-26",
    open: 176.88,
    high: 177.34,
    low: 170.91,
    close: 172.23,
  },
  { time: "2018-10-29", open: 173.74, high: 175.99, low: 170.95, close: 173.2 },
  {
    time: "2018-10-30",
    open: 173.16,
    high: 176.43,
    low: 172.64,
    close: 176.24,
  },
  {
    time: "2018-10-31",
    open: 177.98,
    high: 178.85,
    low: 175.59,
    close: 175.88,
  },
  { time: "2018-11-01", open: 176.84, high: 180.86, low: 175.9, close: 180.46 },
  {
    time: "2018-11-02",
    open: 182.47,
    high: 183.01,
    low: 177.39,
    close: 179.93,
  },
  { time: "2018-11-05", open: 181.02, high: 182.41, low: 179.3, close: 182.19 },
  {
    time: "2018-11-06",
    open: 181.93,
    high: 182.65,
    low: 180.05,
    close: 182.01,
  },
  {
    time: "2018-11-07",
    open: 183.79,
    high: 187.68,
    low: 182.06,
    close: 187.23,
  },
  { time: "2018-11-08", open: 187.13, high: 188.69, low: 185.72, close: 188.0 },
  {
    time: "2018-11-09",
    open: 188.32,
    high: 188.48,
    low: 184.96,
    close: 185.99,
  },
  {
    time: "2018-11-12",
    open: 185.23,
    high: 186.95,
    low: 179.02,
    close: 179.43,
  },
  { time: "2018-11-13", open: 177.3, high: 181.62, low: 172.85, close: 179.0 },
  { time: "2018-11-14", open: 182.61, high: 182.9, low: 179.15, close: 179.9 },
  {
    time: "2018-11-15",
    open: 179.01,
    high: 179.67,
    low: 173.61,
    close: 177.36,
  },
  { time: "2018-11-16", open: 173.99, high: 177.6, low: 173.51, close: 177.02 },
  { time: "2018-11-19", open: 176.71, high: 178.88, low: 172.3, close: 173.59 },
  { time: "2018-11-20", open: 169.25, high: 172.0, low: 167.0, close: 169.05 },
  { time: "2018-11-21", open: 170.0, high: 170.93, low: 169.15, close: 169.3 },
  {
    time: "2018-11-23",
    open: 169.39,
    high: 170.33,
    low: 168.47,
    close: 168.85,
  },
  { time: "2018-11-26", open: 170.2, high: 172.39, low: 168.87, close: 169.82 },
  {
    time: "2018-11-27",
    open: 169.11,
    high: 173.38,
    low: 168.82,
    close: 173.22,
  },
  {
    time: "2018-11-28",
    open: 172.91,
    high: 177.65,
    low: 170.62,
    close: 177.43,
  },
  { time: "2018-11-29", open: 176.8, high: 177.27, low: 174.92, close: 175.66 },
  {
    time: "2018-11-30",
    open: 175.75,
    high: 180.37,
    low: 175.11,
    close: 180.32,
  },
  { time: "2018-12-03", open: 183.29, high: 183.5, low: 179.35, close: 181.74 },
  { time: "2018-12-04", open: 181.06, high: 182.23, low: 174.55, close: 175.3 },
  { time: "2018-12-06", open: 173.5, high: 176.04, low: 170.46, close: 175.96 },
  {
    time: "2018-12-07",
    open: 175.35,
    high: 178.36,
    low: 172.24,
    close: 172.79,
  },
  {
    time: "2018-12-10",
    open: 173.39,
    high: 173.99,
    low: 167.73,
    close: 171.69,
  },
  { time: "2018-12-11", open: 174.3, high: 175.6, low: 171.24, close: 172.21 },
];
export { initialData, INTERVAL_LIST, BASE_URL, TIME_VISIBLE_MAP };
