export default function TestTailwind() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        Tailwind Test - If this is red, Tailwind is working!
      </h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded">Blue Box</div>
        <div className="bg-green-500 text-white p-4 rounded">Green Box</div>
        <div className="bg-yellow-500 text-white p-4 rounded">Yellow Box</div>
      </div>
      
      <button className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
        Primary Button
      </button>
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold">Tailwind Classes Check:</h2>
        <ul className="list-disc pl-5 mt-2">
          <li className={`${'text-red-500' ? 'text-green-500' : ''}`}>
            Text colors: ✓ Working
          </li>
          <li className="font-bold">Font weight: ✓ Working</li>
          <li className="p-2 bg-blue-100">Padding/Background: ✓ Working</li>
        </ul>
      </div>
    </div>
  );
}