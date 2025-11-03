import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { complaintsAPI } from '@/lib/api';
import AIChatbotComplaint from '@/components/AIChatbotComplaint';
import TestAIAssist from '@/components/TestAIAssist';

export default function CitizenDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'chatbot' | 'testai'>('submit');
  
  // AI Agent URL - Update this with your actual AI Agent URL
  const AI_AGENT_URL = import.meta.env.VITE_AI_AGENT_URL || 'https://inftaagent.225wzs8oba88.us-east.codeengine.appdomain.cloud/api/chat';
  const [complaintForm, setComplaintForm] = useState({
    description: '',
    location: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 0 | 1 | 2>('all');

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
      console.log('  File:', selectedFile.name, selectedFile.type, ((selectedFile.size / 1024).toFixed(2) + ' KB'));
      
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
          errorMessage = 'Cannot connect to API server. The server might be:\n- Not running\n- Not accessible from your network\n- Blocked by firewall\n\nContact backend team or check server status.';
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
            location: latitude.toFixed(6) + ', ' + longitude.toFixed(6)
          }));
          alert('Location captured successfully!');
        },
        () => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  // Utility function to get status info (handles both numeric and string statuses)
  const getStatusInfo = (status: number | string | undefined) => {
    // Handle numeric status codes: 0 = pending, 1 = inprogress, 2 = resolved
    if (typeof status === 'number') {
    switch (status) {
        case 0:
          return {
            label: 'Pending',
            class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: '⏳',
            color: 'yellow'
          };
        case 1:
          return {
            label: 'In Progress',
            class: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: '🔄',
            color: 'blue'
          };
        case 2:
          return {
            label: 'Resolved',
            class: 'bg-green-100 text-green-800 border-green-200',
            icon: '✓',
            color: 'green'
          };
      default:
          return {
            label: 'Unknown',
            class: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: '❓',
            color: 'gray'
          };
      }
    }
    
    // Handle string statuses (backward compatibility)
    const statusStr = String(status || 'pending').toLowerCase();
    if (statusStr === 'pending' || statusStr === 'pending') {
      return {
        label: 'Pending',
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏳',
        color: 'yellow'
      };
    }
    if (statusStr === 'in-progress' || statusStr === 'in progress' || statusStr === 'in_progress' || statusStr === 'inprogress') {
      return {
        label: 'In Progress',
        class: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '🔄',
        color: 'blue'
      };
    }
    if (statusStr === 'resolved' || statusStr === 'completed' || statusStr === 'Completed') {
      return {
        label: 'Resolved',
        class: 'bg-green-100 text-green-800 border-green-200',
        icon: '✓',
        color: 'green'
      };
    }
    
    return {
      label: 'Pending',
      class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳',
      color: 'yellow'
    };
  };

  // Calculate complaint statistics
  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter(c => {
      const status = c.status;
      if (typeof status === 'number') return status === 0;
      return String(status || '').toLowerCase() === 'pending';
    }).length,
    inProgress: complaints.filter(c => {
      const status = c.status;
      if (typeof status === 'number') return status === 1;
      const statusStr = String(status || '').toLowerCase();
      return statusStr === 'in-progress' || statusStr === 'in progress' || statusStr === 'in_progress' || statusStr === 'inprogress';
    }).length,
    resolved: complaints.filter(c => {
      const status = c.status;
      if (typeof status === 'number') return status === 2;
      const statusStr = String(status || '').toLowerCase();
      return statusStr === 'resolved' || statusStr === 'completed';
    }).length,
  };

  // Show chatbot view if selected
  if (activeTab === 'chatbot') {
    return <AIChatbotComplaint onBack={() => setActiveTab('submit')} />;
  }

  // Show Test AI Assist view if selected
  if (activeTab === 'testai') {
    return <TestAIAssist onBack={() => setActiveTab('submit')} aiAgentUrl={AI_AGENT_URL} />;
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
              className={'flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ' + (
                activeTab === 'submit'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>➕</span>
              Submit Complaint
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={'flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ' + (
                activeTab === 'chatbot'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>🤖</span>
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={'flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ' + (
                activeTab === 'history'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>📋</span>
              My Complaints
            </button>
            <button
              onClick={() => setActiveTab('testai')}
              className={'flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ' + (
                activeTab === 'testai'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>🧪</span>
              Test AI Assist
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
          <div>
            {/* Complaint Stats Banner */}
            {user?.email && (
              <div className="mb-6 bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Your Complaints</h3>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{complaintStats.total}</div>
                    <div className="text-xs text-gray-600 font-medium">Total</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{complaintStats.pending}</div>
                    <div className="text-xs text-gray-600 font-medium">Pending</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{complaintStats.inProgress}</div>
                    <div className="text-xs text-gray-600 font-medium">In Progress</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">{complaintStats.resolved}</div>
                    <div className="text-xs text-gray-600 font-medium">Resolved</div>
                  </div>
                </div>
              </div>
            )}
            {/* Filter Tabs */}
            {complaints.length > 0 && (
              <div className="mb-4 bg-white rounded-lg border p-2 flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ' + (
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  All ({complaintStats.total})
                </button>
                <button
                  onClick={() => setFilterStatus(0)}
                  className={'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ' + (
                    filterStatus === 0
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Pending ({complaintStats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus(1)}
                  className={'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ' + (
                    filterStatus === 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  In Progress ({complaintStats.inProgress})
                </button>
                <button
                  onClick={() => setFilterStatus(2)}
                  className={'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ' + (
                    filterStatus === 2
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Resolved ({complaintStats.resolved})
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg mb-2">Loading Complaints...</h3>
              </div>
            ) : (() => {
              const filteredComplaints = filterStatus === 'all' 
                ? complaints 
                : complaints.filter(c => {
                    const status = c.status;
                    if (typeof status === 'number') {
                      return status === filterStatus;
                    }
                    const statusNum = getStatusInfo(status).value;
                    return statusNum === filterStatus;
                  });

              return filteredComplaints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredComplaints.map((complaint, index) => {
                    const statusInfo = getStatusInfo(complaint.status);
                    const complaintId = complaint.id || complaint._id || ('COMP-' + String(index + 1).padStart(4, '0'));
                    const complaintDate = complaint.createdAt || complaint.created_at || complaint.createdDate;
                    const imageUrl = complaint.imageUrl || complaint.image || complaint.photo || complaint.file;
                    const progressValue = complaint.progress || 50;
                    
                    return (
                      <div key={complaintId} className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
                        {/* Image Section */}
                        <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt="Complaint photo" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-5xl opacity-20">📷</div>
                            </div>
                          )}
                          {/* Status Badge Overlay */}
                          <div className="absolute top-2 right-2">
                            <span className={'px-2.5 py-1 rounded-full text-xs font-bold border border-white shadow-md flex items-center gap-1.5 ' + statusInfo.class}>
                              <span className="text-sm">{statusInfo.icon}</span>
                              <span>{statusInfo.label}</span>
                            </span>
                          </div>
                          {/* ID Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs font-semibold rounded backdrop-blur-sm">
                              #{complaintId}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Title */}
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-3 min-h-[2.5rem]">
                            {complaint.description || complaint.title || 'Infrastructure Issue'}
                          </h3>

                          {/* Quick Info */}
                          <div className="space-y-1.5 mb-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">📍</span>
                              <p className="text-xs text-gray-600 truncate flex-1">{complaint.location || 'Location not specified'}</p>
                            </div>

                            {complaintDate && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs">📅</span>
                                <p className="text-xs text-gray-600">
                                  {new Date(complaintDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}

                            {complaint.priority && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs">⚡</span>
                                <p className={'text-xs font-semibold ' + (
                                  complaint.priority.toLowerCase() === 'high' ? 'text-red-600' :
                                  complaint.priority.toLowerCase() === 'medium' ? 'text-yellow-600' :
                                  'text-green-600'
                                )}>
                                  {complaint.priority} Priority
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar for In Progress */}
                          {statusInfo.color === 'blue' && (
                            <div className="mb-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold text-blue-600">{progressValue}{'%'}</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 transition-all duration-300 rounded-full" 
                                  style={{ width: progressValue + '%' }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Work Order Info */}
                          {(complaint.workorderId || complaint.assignedCrew) && (
                            <div className="pt-3 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1.5 text-xs">
                                {complaint.workorderId && (
                                  <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                                    WO: {complaint.workorderId}
                                  </span>
                                )}
                                {complaint.assignedCrew && (
                                  <span className="px-2 py-0.5 bg-blue-50 rounded text-blue-700 font-medium">
                                    👷 {complaint.assignedCrew}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Feedback Button for Resolved */}
                          {statusInfo.color === 'green' && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <button className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                                <span>⭐</span>
                                <span>Provide Feedback</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                  <div className="bg-white rounded-lg border p-12 text-center col-span-full">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg mb-2">No Complaints Found</h3>
                    <p className="text-gray-600">
                      {filterStatus === 'all' 
                        ? 'Submit your first complaint to start tracking infrastructure issues'
                        : 'No complaints match the selected filter'}
                    </p>
                  </div>
                );
              })()}
          </div>
        )}
      </div>
    </div>
  );
}
