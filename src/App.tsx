import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/app.scss";
import Chart from "pages/Chart";
import Selection from "pages/Selection";
export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/select" element={<Selection />} />
          <Route path="/chart/:symbol" element={<Chart />} />
        </Routes>
      </Router>
    </div>
  );
}
