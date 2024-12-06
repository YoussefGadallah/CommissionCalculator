import './App.css';
import { useState } from "react";

function App() {

  const [responseCommissionData, setResponseCommissionData] = useState({
    totalFcamaraCommission: 0,
    totalCompetitorCommission: 0,
    responseMessage: ""
  })

  const [requestCommissionData, setRequestCommissionData] = useState({
    localSalesCount: 0,
    foreignSalesCount: 0,
    averageSaleAmount: 0
  });

  async function calculate(e) {
    e.preventDefault();

    if(requestCommissionData.averageSaleAmount === 0 && requestCommissionData.foreignSalesCount === 0 && requestCommissionData.localSalesCount === 0) {
      setResponseCommissionData({
        totalFcamaraCommission: 0,
        totalCompetitorCommission: 0,
        responseMessage: "Please input some values other than 0!"
      })
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5111/Commision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "localSalesCount": requestCommissionData.localSalesCount,
          "foreignSalesCount": requestCommissionData.foreignSalesCount,
          "averageSaleAmount": requestCommissionData.averageSaleAmount
        })
      });

      const data = await res.json();

      if (data.status === undefined) {
        setResponseCommissionData({
          totalFcamaraCommission: data.fCamaraCommissionAmount,
          totalCompetitorCommission: data.competitorCommissionAmount,
          responseMessage: "Success!"
        });
      } else {
        setResponseCommissionData({
          totalFcamaraCommission: 0,
          totalCompetitorCommission: 0,
          responseMessage: "Bad request, please check your inputs"
        })
      }
    } catch (e) {
      setResponseCommissionData({
        totalFcamaraCommission: 0,
        totalCompetitorCommission: 0,
        responseMessage: "Error connecting to API"
      })
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
        </div>
        <form className="main-container" onSubmit={(e) => calculate(e)}>
          <label htmlFor="localSalesCount">Local Sales Count</label>
          <input name="localSalesCount" value={requestCommissionData.localSalesCount} onChange={(e) => setRequestCommissionData({ ...requestCommissionData, localSalesCount: e.target.value })} /><br />

          <label htmlFor="foreignSalesCount">Foreign Sales Count</label>
          <input name="foreignSalesCount" value={requestCommissionData.foreignSalesCount} onChange={(e) => setRequestCommissionData({ ...requestCommissionData, foreignSalesCount: e.target.value })} /><br />

          <label htmlFor="averageSaleAmount">Average Sale Amount</label>
          <input name="averageSaleAmount" value={requestCommissionData.averageSaleAmount} onChange={(e) => setRequestCommissionData({ ...requestCommissionData, averageSaleAmount: e.target.value })} /><br />

          <button type="submit">Calculate</button>
        </form>
      </header>

      <div>
        <h3>Results</h3>
        <p>Total FCamara commission: {responseCommissionData.totalFcamaraCommission}</p>
        <p>Total FCamara commission: {responseCommissionData.totalCompetitorCommission}</p>
        {responseCommissionData.responseMessage !== "" && (
          <p style={{
            color:
              responseCommissionData.responseMessage === "Success!"
                ? "green"
                : "red",
          }}>{responseCommissionData.responseMessage}</p>
        )}
      </div>
    </div>
  );
}

export default App;
