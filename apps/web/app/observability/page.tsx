export default function ObservabilityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-bold text-white">Observability</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total LLM Calls', value: '1.2M', change: '+12%' },
          { label: 'Avg Latency', value: '245ms', change: '-8%' },
          { label: 'Error Rate', value: '0.4%', change: '-0.2%' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <span className="text-sm text-green-400">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">LLM Call Volume</h3>
          <select className="select w-40">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="h-80 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
          [Time series chart placeholder]
        </div>
      </div>

      <div className="card">
        <h3 className="font-medium text-white mb-4">Cost by Provider</h3>
        <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
          [Pie chart placeholder]
        </div>
      </div>
    </div>
  );
}
