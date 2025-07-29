import { useState } from "react";


const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex-1 p-8" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Perfect Doctor 👩‍⚕️</h1>
            <p className="text-gray-600 mb-6">Search by name, specialization, or location to book your appointment instantly</p>
            
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by doctor name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
              >
                Search Now
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 cursor-pointer transform hover:-translate-y-1">
            <div className="text-3xl mb-3">🩺</div>
            <h3 className="font-semibold text-gray-800 mb-2">General Checkup</h3>
            <p className="text-gray-600 text-sm">Book routine health checkups</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 cursor-pointer transform hover:-translate-y-1">
            <div className="text-3xl mb-3">🦷</div>
            <h3 className="font-semibold text-gray-800 mb-2">Dental Care</h3>
            <p className="text-gray-600 text-sm">Find dental specialists</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 cursor-pointer transform hover:-translate-y-1">
            <div className="text-3xl mb-3">👁️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Eye Care</h3>
            <p className="text-gray-600 text-sm">Vision and eye health</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 cursor-pointer transform hover:-translate-y-1">
            <div className="text-3xl mb-3">💊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Pharmacy</h3>
            <p className="text-gray-600 text-sm">Order medicines online</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-96 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>
          
          <div className="p-8 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
                🏥
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Find Your Doctor?</h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">Start your search above to discover qualified healthcare professionals in your area</p>
              <div className="flex justify-center space-x-4">
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">✅ Verified Doctors</div>
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">📅 Instant Booking</div>
                <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">💬 24/7 Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 export default Dashboard;