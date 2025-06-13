'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit triggered");

    const materials = input.split(',').map((m) => m.trim());
    console.log("Sending materials:", materials);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materials }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (data.result) {
        setResult(data.result);
      } else {
        setResult("No result returned.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult("Something went wrong with the API call.");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🧪 Little Lab Coats</h1>
      <p className="mb-2">Enter materials (comma-separated):</p>
      <input
        type="text"
        className="border p-2 w-full rounded mb-4 text-black"
        placeholder="e.g. balloon, vinegar, baking soda"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Project
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white text-black rounded shadow whitespace-pre-wrap">
          <h2 className="font-bold text-lg mb-2">Your Project</h2>
          {result}
        </div>
      )}
    </main>
  );
}