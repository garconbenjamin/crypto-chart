import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
type Symbol = {
  symbol: string;
  lastPrice: number;
};
function Selection() {
  const [list, setList] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr?type=MINI"
      );
      const symbols = await res.json();

      const usdtPairs = symbols.filter(
        ({ symbol }: Symbol) => symbol.substring(symbol.length - 4) === "USDT"
      );
      setList(usdtPairs);
    };
    getData();
    const polling = setInterval(() => {
      getData();
    }, 4000);

    return () => {
      clearInterval(polling);
    };
  }, []);

  return (
    <div>
      <h1>selection</h1>
      <button
        onClick={() => {
          setOffset((offset) => offset - 10);
        }}
        disabled={offset === 0}
      >
        -
      </button>
      <button
        onClick={() => {
          setOffset((offset) => offset + 10);
        }}
      >
        +
      </button>
      <div>
        <ul>
          {list.length &&
            list.map((item: Symbol) => (
              <Link key={item.symbol} to={`chart/${item.symbol}`}>
                <li>
                  <div>{item.symbol}</div>
                  <div>{item.lastPrice}</div>
                </li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
}
export default Selection;
