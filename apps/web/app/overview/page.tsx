export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-bold text-white">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Services', value: '12', change: '+2', positive: true },
          { title: 'API Calls (24h)', value: '1.2M', change: '+15%', positive: true },
          { title: 'Avg Latency', value: '124ms', change: '-8%', positive: true },
          { title: 'Monthly Cost', value: '$342', change: '+5%', positive: false },
        ].map((stat) => (
          <div key={stat.title} className="card">
            <p className="text-sm text-gray-400">{stat.title}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <span className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-medium text-white mb-4">LLM Usage (Last 7 days)</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
            [Chart placeholder]
          </div>
        </div>
        <div className="card">
          <h3 className="font-medium text-white mb-4">Cost by Model</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
            [Chart placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
