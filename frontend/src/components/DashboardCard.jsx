function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <h3 className="text-gray-600 text-sm font-semibold uppercase">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

export default DashboardCard;
