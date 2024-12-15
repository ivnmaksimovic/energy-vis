import { useEffect } from "react";
import "./App.css";

const fetchData = async () => {
  const response = await fetch("https://api.energy-charts.info/installed_power?country=de&time_step=yearly&installation_decommission=false");
  const result = await response.json();
  return result;
};

function App() {
  useEffect(() => {
    fetchData()
      .then((data) => {
        console.log(data);
      })
      .catch();
  }, []);

  return (
    <>
      <div>hello</div>
    </>
  );
}

export default App;
