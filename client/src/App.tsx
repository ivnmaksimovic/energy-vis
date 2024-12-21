import { useEffect } from "react";
import "./App.css";

const fetchData = async () => {
  const response = await fetch("http://localhost:3173/api/installed_power");
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
