import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface AIChatbotComplaintProps {
  onBack: () => void;
}

export default function AIChatbotComplaint({ onBack }: AIChatbotComplaintProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: 'Hi! I\'m your AI Complaint Assistant. 👋\n\nI\'m here to help you report infrastructure issues. You can start by uploading a photo of the problem, or simply describe what you\'ve noticed.',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    issueType: string;
    priority: number;
    crewRequired: number;
    estimatedCost: string;
  } | null>(null);
  const [complaintData, setComplaintData] = useState({
    location: '',
    issueType: '',
    confirmed: false,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      issueType: 'Pothole',
      priority: 8.5,
      crewRequired: 3,
      estimatedCost: '$1,200 - $1,500',
    };
    
    setAnalysisResult(mockAnalysis);
    setComplaintData(prev => ({ ...prev, issueType: mockAnalysis.issueType }));
    setIsAnalyzing(false);
    
    addBotMessage(
      `I've analyzed the image. This looks like a ${mockAnalysis.issueType.toLowerCase()}. 🔍\n\nBased on my analysis:\n• Priority Score: ${mockAnalysis.priority}/10 (High Priority)\n• Estimated Crew Size: ${mockAnalysis.crewRequired} workers\n• Estimated Cost: ${mockAnalysis.estimatedCost}\n\nCan you confirm the location of this issue?`
    );
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        addUserMessage('📸 [Image uploaded]');
        
        setTimeout(() => {
          addBotMessage('Great! Let me analyze this image for you...');
          analyzeImage();
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userInput = inputMessage.trim();
    addUserMessage(userInput);
    setInputMessage('');

    // Simulate bot responses based on conversation state
    setTimeout(() => {
      if (!analysisResult) {
        addBotMessage('Thank you for that information. To help you better, could you please upload a photo of the issue? This will help me provide a more accurate assessment.');
      } else if (!complaintData.location) {
        setComplaintData(prev => ({ ...prev, location: userInput }));
        addBotMessage(
          `Perfect! I've recorded the location as "${userInput}". ✅\n\nIs there anything else you'd like to add about this ${complaintData.issueType.toLowerCase()}? For example:\n• How long has this been an issue?\n• Is it causing any immediate danger?\n• Are there any landmarks nearby?`
        );
      } else if (!complaintData.confirmed) {
        setComplaintData(prev => ({ ...prev, confirmed: true }));
        addBotMessage(
          `Thank you for the additional details! I have all the information I need.\n\nI'll now create a complaint with the following details:\n• Issue Type: ${complaintData.issueType}\n• Location: ${complaintData.location}\n• Priority: ${analysisResult.priority}/10\n• Crew Required: ${analysisResult.crewRequired} workers\n\nWould you like to submit this complaint?`
        );
      } else {
        addBotMessage('Your complaint has been successfully submitted! 🎉\n\nComplaint ID: CPL-' + Math.floor(5000 + Math.random() * 1000) + '\n\nYou can track the progress in your complaint history. A work order will be created shortly and assigned to the appropriate crew.');
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setInputMessage(location);
        },
        () => {
          addBotMessage('I couldn\'t access your location. Please enter it manually or check your browser permissions.');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg">AI Complaint Assistant</h1>
                <p className="text-xs text-gray-500">Powered by IBM watsonx Orchestrate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="overflow-hidden shadow-lg">
          {/* Chat Window */}
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Analyzing indicator */}
              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Analyzing image...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Uploaded Image Preview */}
          {uploadedImage && (
            <div className="px-6 pb-4">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <img
                    src={uploadedImage}
                    alt="Uploaded issue"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm">Uploaded Image</p>
                    <p className="text-xs text-gray-500">Being analyzed by AI</p>
                  </div>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          {!uploadedImage && (
            <div className="px-6 pb-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <div className="text-3xl mb-2">📎</div>
                <p className="text-sm text-gray-600 mb-3">
                  Drag and drop an image here, or click to upload
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mx-auto"
                >
                  <span className="mr-2">📸</span>
                  Choose Photo
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="resize-none min-h-[60px]"
                rows={2}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="icon"
                  title="Get current location"
                >
                  📍
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📤
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Analysis Result Card */}
        {analysisResult && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Priority Score</h3>
                  <p className="text-2xl">{analysisResult.priority}/10</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    analysisResult.priority >= 7
                      ? 'bg-red-500'
                      : analysisResult.priority >= 4
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${analysisResult.priority * 10}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {analysisResult.priority >= 7
                  ? 'High Priority - Requires immediate attention'
                  : analysisResult.priority >= 4
                  ? 'Medium Priority - Should be addressed soon'
                  : 'Low Priority - Can be scheduled'}
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👷</span>
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Crew Estimation</h3>
                  <p className="text-2xl">{analysisResult.crewRequired} Workers</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Issue Type:</span>
                  <span>{analysisResult.issueType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Cost:</span>
                  <span>{analysisResult.estimatedCost}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
