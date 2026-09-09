import { Eye } from "lucide-react";

const Orders = () => {
  const orders = [
    {
      id: "#1234",
      customer: "John Doe",
      amount: 72,
      status: "Delivered",
      date: "Jan 17, 2024",
    },
    {
      id: "#1235",
      customer: "Jane Smith",
      amount: 150,
      status: "Processing",
      date: "Jan 18, 2024",
    },
    {
      id: "#1236",
      customer: "Bob Johnson",
      amount: 89,
      status: "Pending",
      date: "Jan 19, 2024",
    },
  ];

  const statusColors: Record<string, string> = {
    Delivered: "bg-green-100 text-green-800",
    Processing: "bg-blue-100 text-blue-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-900">169</h3>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-600">34</h3>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Processing</p>
          <h3 className="text-3xl font-bold text-blue-600">59</h3>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Delivered</p>
          <h3 className="text-3xl font-bold text-green-600">65</h3>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.date}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ${order.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
