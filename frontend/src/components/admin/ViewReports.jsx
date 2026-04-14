import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/config";

export default function ViewReports() {
  const [reportType, setReportType] = useState("bookings");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      switch(reportType) {
        case "bookings":
          const bookingsRes = await axios.get("http://localhost:5000/api/booking");
          setData(bookingsRes.data);
          break;
        case "food":
          const foodRes = await axios.get("http://localhost:5000/api/food");
          setData(foodRes.data);
          break;
        case "tables":
          const tablesRes = await axios.get("http://localhost:5000/api/table");
          setData(tablesRes.data);
          break;
        case "billing":
          const billingRes = await axios.get("http://localhost:5000/api/billing");
          setData(billingRes.data);
          break;
        default:
          setData([]);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).filter(key => !key.startsWith("_"));
    const csvRows = [headers.join(",")];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header] || "";
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const calculateSummary = () => {
    if (reportType === "billing") {
      const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
      return { totalRevenue: total, count: data.length };
    }
    if (reportType === "bookings") {
      const checkedIn = data.filter(b => b.status === "CheckedIn").length;
      const checkedOut = data.filter(b => b.status === "CheckedOut").length;
      return { checkedIn, checkedOut, total: data.length };
    }
    return { total: data.length };
  };

  const summary = calculateSummary();

  if (loading) return <div className="loading">Loading report...</div>;

  return (
    <div className="view-reports">
      <h2>📈 View Reports</h2>
      
      <div className="report-controls">
        <select onChange={e => setReportType(e.target.value)} value={reportType}>
          <option value="bookings">Room Bookings Report</option>
          <option value="food">Food Orders Report</option>
          <option value="tables">Table Bookings Report</option>
          <option value="billing">Billing Report</option>
        </select>
        
        <div className="report-actions">
          <button onClick={exportToCSV}>📥 Export to CSV</button>
          <button onClick={printReport}>🖨️ Print Report</button>
        </div>
      </div>
      
      <div className="report-summary">
        <h3>Report Summary</h3>
        {reportType === "billing" && (
          <>
            <p>Total Revenue: ₹{summary.totalRevenue?.toLocaleString() || 0}</p>
            <p>Total Transactions: {summary.count}</p>
          </>
        )}
        {reportType === "bookings" && (
          <>
            <p>Total Bookings: {summary.total}</p>
            <p>Active Check-ins: {summary.checkedIn}</p>
            <p>Checked Out: {summary.checkedOut}</p>
          </>
        )}
        {reportType !== "billing" && reportType !== "bookings" && (
          <p>Total Records: {summary.total}</p>
        )}
      </div>
      
      <div className="report-table">
        {data.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div className="table-responsive">
            <table border="1">
              <thead>
                <tr>
                  {Object.keys(data[0]).filter(key => !key.startsWith("_")).slice(0, 8).map(key => (
                    <th key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 50).map((item, idx) => (
                  <tr key={idx}>
                    {Object.entries(item).filter(([key]) => !key.startsWith("_")).slice(0, 8).map(([key, value]) => (
                      <td key={key}>
                        {typeof value === "object" ? JSON.stringify(value) : 
                         key === "total" ? `₹${value}` : 
                         value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 50 && <p>Showing first 50 records of {data.length}</p>}
          </div>
        )}
      </div>
      
      <button onClick={() => navigate("/admin")} className="back-btn">Back to Dashboard</button>
    </div>
  );
}
