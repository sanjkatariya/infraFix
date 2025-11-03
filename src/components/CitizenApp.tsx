import { useState } from 'react';
import AIChatbotComplaint from './AIChatbotComplaint';

interface CitizenAppProps {
  onLogout: () => void;
}

export default function CitizenApp({ onLogout }: CitizenAppProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'chatbot'>('submit');
  const [complaintForm, setComplaintForm] = useState({
    category: '',
    description: '',
    location: '',
    phone: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setComplaintForm({ category: '', description: '', location: '', phone: '' });
      setImagePreview(null);
    }, 3000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setComplaintForm(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          alert('Location captured successfully!');
        },
        () => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const complaints = [
    { id: 'CPL-5433', type: 'Pothole', location: 'Main St & 5th Ave', status: 'In Progress', date: '2025-10-27', progress: 60 },
    { id: 'CPL-5410', type: 'Streetlight', location: 'Park Road', status: 'Completed', date: '2025-10-25', progress: 100 },
    { id: 'CPL-5389', type: 'Garbage', location: 'Market Street', status: 'Pending', date: '2025-10-24', progress: 20 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show chatbot view if selected */}
      {activeTab === 'chatbot' ? (
        <AIChatbotComplaint onBack={() => setActiveTab('submit')} />
      ) : (
        <>
          {/* Header */}
          <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🛠️</span>
                </div>
                <div>
                  <h1 className="text-xl">InfraFix</h1>
                  <p className="text-sm text-gray-500">Report Infrastructure Issues</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex gap-2 bg-white rounded-lg border p-1">
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'submit'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>➕</span>
                  Submit Complaint
                </button>
                <button
                  onClick={() => setActiveTab('chatbot' as typeof activeTab)}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                    (activeTab as string) === 'chatbot'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>🤖</span>
                  AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'history'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>📋</span>
                  My Complaints
                </button>
              </div>
            </div>

            {/* Submit Complaint Tab */}
            {activeTab === 'submit' && (
              <div className="bg-white rounded-lg border p-6">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="text-xl mb-2">Complaint Submitted!</h3>
                    <p className="text-gray-600 mb-4">
                      Your complaint has been received and is being processed by our AI agents.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                      <div className="text-sm text-gray-600 mb-1">Your Complaint ID</div>
                      <div className="text-2xl text-blue-600">CPL-5434</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl mb-2">Submit Infrastructure Complaint</h2>
                    <p className="text-gray-600 mb-6">
                      Report potholes, broken streetlights, water leaks, and other infrastructure issues
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Category */}
                      <div>
                        <label className="block text-sm mb-2">Issue Category *</label>
                        <select
                          value={complaintForm.category}
                          onChange={(e) => setComplaintForm(prev => ({ ...prev, category: e.target.value }))}
                          required
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select category</option>
                          <option value="pothole">🕳️ Pothole</option>
                          <option value="streetlight">💡 Streetlight Issue</option>
                          <option value="water-leak">💧 Water Leak</option>
                          <option value="garbage">🗑️ Garbage/Waste</option>
                          <option value="drainage">🌊 Drainage Problem</option>
                          <option value="other">⚙️ Other</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm mb-2">Description *</label>
                        <textarea
                          value={complaintForm.description}
                          onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                          required
                          rows={4}
                          placeholder="Describe the issue in detail..."
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <label className="block text-sm mb-2">Upload Photo *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                          {imagePreview ? (
                            <div className="space-y-3">
                              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                              <button
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                              >
                                Change Photo
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="text-4xl mb-2">📸</div>
                              <p className="text-sm text-gray-600 mb-2">Upload a photo of the issue</p>
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="photo-upload"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById('photo-upload')?.click()}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                              >
                                Choose Photo
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm mb-2">Location *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={complaintForm.location}
                            onChange={(e) => setComplaintForm(prev => ({ ...prev, location: e.target.value }))}
                            required
                            placeholder="Enter address or coordinates"
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            📍
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Click the pin icon to auto-detect your location
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm mb-2">Contact Number *</label>
                        <input
                          type="tel"
                          value={complaintForm.phone}
                          onChange={(e) => setComplaintForm(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          placeholder="Your phone number"
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Submit Complaint
                      </button>

                      {/* Info Box */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm mb-2">What happens next?</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>✓ AI analyzes your complaint and classifies severity</li>
                          <li>✓ Issue is prioritized based on impact and location</li>
                          <li>✓ Work order is created and assigned to a crew</li>
                          <li>✓ You'll receive updates via SMS and notifications</li>
                        </ul>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* My Complaints Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white rounded-lg border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg">{complaint.id}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            complaint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-gray-600">{complaint.type}</p>
                      </div>
                      {complaint.status === 'Completed' && (
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                          ⭐ Feedback
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">📍 {complaint.location}</p>

                    {complaint.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span>{complaint.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              complaint.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${complaint.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Submitted: {complaint.date}
                    </div>
                  </div>
                ))}

                {complaints.length === 0 && (
                  <div className="bg-white rounded-lg border p-12 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg mb-2">No Complaints Yet</h3>
                    <p className="text-gray-600">
                      Submit your first complaint to start tracking infrastructure issues
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}