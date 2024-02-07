import React from "react";
import Papa from "papaparse";
import './App.css';
import StateList from './StateList';

function App() {
  const [data, setData] = React.useState([])
  React.useEffect(() => {

    async function getRows() {
      let rows = []
      const response = await fetch('/data/statecpi_beta.csv').then( response => response.text() )
      .then( responseText => {
          rows = Papa.parse(responseText);
      });
      setData(rows.data)
    }
    getRows()
    
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h2 id="title">{"State-Level Quarterly Inflation Rates"}</h2>
        <StateList className="list" csvData={data} />
      </header>
    </div>
  );
}

export default App;
