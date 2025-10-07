import React from 'react';

const Settings = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="content-limits">
            Content Limits
          </label>
          <input
            type="number"
            id="content-limits"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue="1000"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="auto-hide-threshold">
            Auto-hide Threshold
          </label>
          <input
            type="number"
            id="auto-hide-threshold"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue="5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="report-sla">
            Report SLA (hours)
          </label>
          <input
            type="number"
            id="report-sla"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue="24"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Save
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
