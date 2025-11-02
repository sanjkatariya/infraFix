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
  image?: string;
}

interface TestAIAssistProps {
  onBack: () => void;
  aiAgentUrl: string;
}

export default function TestAIAssist({ onBack, aiAgentUrl }: TestAIAssistProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: 'Hi! I\'m your AI Assistant. 👋\n\nI can help you report infrastructure issues. You can upload a photo or describe the problem, and I\'ll assist you.',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const addUserMessage = (content: string, image?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
      image,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendToAIAgent = async (message: string, imageFile?: File) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(aiAgentUrl, {
        method: 'POST',
        body: formData,
      });

      let botResponse = '';
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        const json = await response.json();
        // Support different response formats
        botResponse = json.reply || json.message || json.response || json.text || JSON.stringify(json);
      } else {
        botResponse = await response.text();
      }

      if (botResponse) {
        addBotMessage(botResponse);
      } else {
        addBotMessage('I received your message but couldn\'t generate a response. Please try again.');
      }
    } catch (error: any) {
      console.error('Error calling AI Agent:', error);
      addBotMessage('Sorry, I encountered an error while processing your request. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        addBotMessage('The image file is too large. Please upload an image smaller than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        setSelectedFile(file);
        addUserMessage('📸 [Image uploaded]', imageUrl);
        
        // Automatically send image to AI Agent
        setTimeout(() => {
          sendToAIAgent('', file);
        }, 500);
      };
      reader.readAsDataURL(file);
    } else {
      addBotMessage('Please upload an image file (jpg, png, etc.)');
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
    if (!inputMessage.trim() && !selectedFile) return;

    const userText = inputMessage.trim();
    
    // Add user message to chat
    if (selectedFile && uploadedImage) {
      addUserMessage(userText || '📸 [Image uploaded]', uploadedImage);
    } else {
      addUserMessage(userText);
    }

    // Clear input
    setInputMessage('');
    const imageToSend = selectedFile;
    setUploadedImage(null);
    setSelectedFile(null);
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.value = '';
    }

    // Send to AI Agent
    sendToAIAgent(userText || '', imageToSend || undefined);
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
          const location = latitude.toFixed(6) + ', ' + longitude.toFixed(6);
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg">Test AI Assist</h1>
                <p className="text-xs text-gray-500">AI Agent Integration</p>
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
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="mb-2 w-full max-w-xs rounded-lg object-cover"
                      />
                    )}
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
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
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
                    <p className="text-xs text-gray-500">Ready to send</p>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setSelectedFile(null);
                      const fileInput = fileInputRef.current;
                      if (fileInput) {
                        fileInput.value = '';
                      }
                    }}
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
                  id="test-ai-image-input"
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
                  disabled={(!inputMessage.trim() && !selectedFile) || isLoading}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📤
                </Button>
              </div>
            </div>
          </div>
        </Card>

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

