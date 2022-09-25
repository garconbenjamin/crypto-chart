import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { binanceCryptoIcons } from "binance-icons";
import type { Symbol } from "types";
import { useEffect } from "react";
function SymbolCard(props: Symbol) {
  const { symbol, lastPrice } = props;
  const prevPrice = useRef(lastPrice);
  const [color, setColor] = useState("#707A8A");
  useEffect(() => {
    if (prevPrice.current > lastPrice) {
      setColor("#CF304A");
    } else if (prevPrice.current < lastPrice) {
      setColor("#03A66D");
    } else {
      setColor("#707A8A");
    }

    prevPrice.current = lastPrice;
  }, [lastPrice]);

  const name = symbol.substring(0, symbol.length - 4).toLowerCase();
  return (
    <Link key={symbol} to={`chart/${symbol}`}>
      <li className="symbol-item">
        <div
          className="icon"
          dangerouslySetInnerHTML={{
            __html: binanceCryptoIcons.get(name) || "",
          }}
        />
        <div className="info">
          <div className="name">
            {symbol.slice(0, symbol.length - 4) + "/USDT"}
          </div>
          <div className="price" style={{ color }}>
            {Number(lastPrice)}
          </div>
        </div>
      </li>
    </Link>
  );
}
export default SymbolCard;
