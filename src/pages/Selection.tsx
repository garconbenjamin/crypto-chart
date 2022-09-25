import { useEffect, useState } from "react";

import type { Symbol } from "types";
import SymbolCard from "component/SymbolCard";
function Selection() {
  const [list, setList] = useState([]);

  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr?type=MINI"
      );
      const symbols = await res.json();

      const usdtPairs = symbols.filter(
        ({ symbol, lastPrice }: Symbol) =>
          symbol.substring(symbol.length - 4) === "USDT" &&
          Number(lastPrice) !== 0
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

      <div>
        <ul className="symbol-list">
          {Boolean(list.length) &&
            list
              .slice(offset, offset + 20)
              .map((item: Symbol) => (
                <SymbolCard {...item} key={item.symbol} />
              ))}
        </ul>
      </div>
      <div className="pagination">
        <button
          onClick={() => {
            setOffset((offset) => offset - 10);
          }}
          disabled={offset === 0}
        >
          Previous
        </button>
        {Array(Math.floor(list.length / 20))
          .fill(true)
          .map((_, i) => {
            const page = i;
            return (
              <button
                className={`page-number ${
                  currentPage === page ? "active" : ""
                }`}
                key={"p" + i}
                onClick={() => {
                  setOffset(page * 20);

                  setCurrentPage(page);
                }}
              >
                {page + 1}
              </button>
            );
          })}
        <button
          onClick={() => {
            setOffset((offset) => offset + 10);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default Selection;
