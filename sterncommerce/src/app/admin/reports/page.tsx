export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales Reports</h1>
      <div className="space-y-8">
        {/* Sales by Date Section */}
        <div className="p-6 bg-white border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales by Date</h2>
          <p className="text-gray-500">
            This feature is not yet implemented. It will allow you to filter sales by a date range and view total revenue.
          </p>
          <div className="mt-4">
            <label className="mr-4">Start Date:</label>
            <input type="date" disabled className="p-2 border rounded bg-gray-100"/>
          </div>
           <div className="mt-2">
            <label className="mr-4">End Date:  </label>
            <input type="date" disabled className="p-2 border rounded bg-gray-100"/>
          </div>
          <button disabled className="mt-4 bg-blue-300 text-white px-6 py-2 rounded-lg cursor-not-allowed">Generate Report</button>
        </div>

        {/* Best-Selling Products Section */}
        <div className="p-6 bg-white border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Best-Selling Products</h2>
           <p className="text-gray-500">
            This feature is not yet implemented. It will show a list of products ranked by sales quantity.
          </p>
        </div>

        {/* Top Customers Section */}
        <div className="p-6 bg-white border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
           <p className="text-gray-500">
            This feature is not yet implemented. It will show a list of customers ranked by the number of orders placed.
          </p>
        </div>

        {/* Export Section */}
        <div className="p-6 bg-white border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Export Data</h2>
           <p className="text-gray-500">
            This feature is not yet implemented. It will allow you to export reports to PDF or Excel.
          </p>
           <button disabled className="mt-4 bg-green-300 text-white px-6 py-2 rounded-lg cursor-not-allowed">Export to Excel</button>
        </div>
      </div>
    </div>
  );
}
