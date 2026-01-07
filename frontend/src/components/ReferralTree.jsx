function ReferralTree({ node, level = 0 }) {
  if (!node) return null;

  const levelColor =
    level === 0
      ? "bg-green-100"
      : level === 1
      ? "bg-blue-100"
      : "bg-yellow-100";

  return (
    <div
      className={`${levelColor} p-4 rounded-lg mb-4 border-l-4 border-gray-400`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{node.fullName}</h3>
          <p className="text-sm text-gray-600">{node.email}</p>
          <p className="text-sm mt-1">
            Balance:{" "}
            <span className="font-semibold">${node.balance.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            Invested:{" "}
            <span className="font-semibold">
              ${node.totalInvested.toFixed(2)}
            </span>
          </p>
        </div>
        {level > 0 && (
          <span className="text-xs bg-gray-300 px-2 py-1 rounded">
            Level {level}
          </span>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="ml-4 mt-4 border-l-2 border-gray-300 pl-4 space-y-4">
          {node.children.map((child) => (
            <ReferralTree key={child._id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReferralTree;
