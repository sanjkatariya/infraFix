import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { complaintsAPI } from '@/lib/api';
import AIChatbotComplaint from '@/components/AIChatbotComplaint';

export default function CitizenDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'chatbot'>('submit');
  const [complaintForm, setComplaintForm] = useState({
    description: '',
    location: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch complaints on component mount
  useEffect(() => {
    if (user?.email) {
      fetchComplaints();
    }
  }, [user?.email]);

  const fetchComplaints = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const response = await complaintsAPI.getByEmail(user.email);
      const data = response.data || [];
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching complaints:', error);
      
      // Don't show alert for fetch errors, just log and use empty array
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('Network error fetching complaints - Check CORS configuration');
      }
      
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        e.target.value = ''; // Reset input
        return;
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size should be less than 10MB');
        e.target.value = ''; // Reset input
        return;
      }
      
      console.log('📎 File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('No file selected');
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      alert('Email is required');
      return;
    }

    if (!selectedFile) {
      alert('Please upload a photo');
      return;
    }

    if (!complaintForm.description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!complaintForm.location.trim()) {
      alert('Please enter a location');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('description', complaintForm.description);
      formData.append('location', complaintForm.location);
      
      // Append file - ensure it's a File object
      if (selectedFile instanceof File) {
        formData.append('file', selectedFile, selectedFile.name);
      } else {
        throw new Error('File is not valid');
      }

      // Log FormData contents for debugging
      console.log('📤 Submitting complaint:');
      console.log('  Email:', user.email);
      console.log('  Description:', complaintForm.description);
      console.log('  Location:', complaintForm.location);
      console.log('  File:', selectedFile.name, selectedFile.type, `${(selectedFile.size / 1024).toFixed(2)} KB`);
      
      // Verify FormData entries
      console.log('  FormData verification:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`    ${key}:`, `File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`    ${key}:`, value);
        }
      }

      // Submit complaint
      await complaintsAPI.create(formData);
      
      setIsSubmitted(true);
      
      // Refresh complaints list
      await fetchComplaints();
      
      // Reset form
      setTimeout(() => {
        setIsSubmitted(false);
        setComplaintForm({ description: '', location: '' });
        setSelectedFile(null);
        setImagePreview(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      
      let errorMessage = 'Failed to submit complaint. Please try again.';
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Network error: Cannot connect to server. Please check:\n1. Server is running\n2. Network connectivity\n3. Firewall settings';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout: Server took too long to respond. The API server might be slow or unreachable.';
      } else if (error.response?.status === 500) {
        const errorData = error.response.data;
        const errorStr = typeof errorData === 'string' 
          ? errorData 
          : (errorData?.message || JSON.stringify(errorData || 'Internal server error'));
        
        if (typeof errorStr === 'string' && (errorStr.includes('ETIMEDOUT') || errorStr.includes('Proxy Error'))) {
          errorMessage = 'Cannot connect to API server (9.61.3.174:8080). The server might be:\n- Not running\n- Not accessible from your network\n- Blocked by firewall\n\nContact backend team or check server status.';
        } else {
          errorMessage = `Server error (500): ${errorStr}`;
        }
      } else if (error.response) {
        const errorData = error.response.data;
        errorMessage = (typeof errorData === 'object' && errorData?.message) 
          ? errorData.message 
          : (typeof errorData === 'string' ? errorData : `Server error: ${error.response.status}`);
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

  // Calculate complaint statistics
  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending' || c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress' || c.status === 'In Progress' || c.status === 'in_progress').length,
    completed: complaints.filter(c => c.status === 'completed' || c.status === 'Completed').length,
  };

  // Show chatbot view if selected
  if (activeTab === 'chatbot') {
    return <AIChatbotComplaint onBack={() => setActiveTab('submit')} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={() => setActiveTab('chatbot')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'chatbot'
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

        {/* Complaint Stats Banner */}
        {user?.email && (
          <div className="mb-6 bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Your Complaints</h3>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{complaintStats.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{complaintStats.pending}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{complaintStats.inProgress}</div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{complaintStats.completed}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        )}

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
                  Your complaint has been received and is being processed.
                </p>
      </div>
            ) : (
              <>
                <h2 className="text-xl mb-2">Submit Infrastructure Complaint</h2>
                <p className="text-gray-600 mb-6">
                  Report potholes, broken streetlights, water leaks, and other infrastructure issues
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
      
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
                            onClick={() => {
                              setImagePreview(null);
                              setSelectedFile(null);
                              // Reset file input
                              const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
                              if (fileInput) {
                                fileInput.value = '';
                                console.log('🔄 File input reset');
                              }
                            }}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Complaint'}
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
            {isLoading ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg mb-2">Loading Complaints...</h3>
              </div>
            ) : complaints.length > 0 ? (
              complaints.map((complaint, index) => {
                const status = complaint.status || 'Pending';
                const statusClass = 
                  status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                  status.toLowerCase() === 'in progress' || status.toLowerCase() === 'in-progress' || status.toLowerCase() === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800';
                
                return (
                  <div key={complaint.id || complaint._id || index} className="bg-white rounded-lg border p-6">
                    <div className="flex items-start justify-between mb-4">
                  <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg">{complaint.id || complaint._id || `Complaint #${index + 1}`}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${statusClass}`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-gray-600">{complaint.description?.substring(0, 50)}...</p>
                      </div>
                      {status.toLowerCase() === 'completed' && (
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                          ⭐ Feedback
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">📍 {complaint.location || 'Location not specified'}</p>

                    {complaint.createdAt && (
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    )}
                    {complaint.created_at && (
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(complaint.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
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
    </div>
  );
}
