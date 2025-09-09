export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
