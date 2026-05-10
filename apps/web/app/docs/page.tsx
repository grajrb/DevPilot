export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-white">Documentation</h1>
        <button className="btn-primary">
          <Plus size={16} />
          New Doc
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Getting Started', 'API Reference', 'Best Practices'].map((doc) => (
          <div key={doc} className="card hover:border-teal-500/50 cursor-pointer transition-colors">
            <h3 className="font-medium text-white">{doc}</h3>
            <p className="text-sm text-gray-400 mt-1">Last updated 2 days ago</p>
          </div>
        ))}
      </div>
    </div>
  );
}
