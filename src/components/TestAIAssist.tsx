import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

// Component to format AI responses with better styling
function FormattedMessage({ content }: { content: string }) {
  const formatContent = (text: string) => {
    // Try to parse as JSON first
    try {
      const json = JSON.parse(text);
      if (typeof json === 'object' && json !== null) {
        return (
          <div className="space-y-3 bg-gradient-to-br from-violet-50 via-indigo-50 via-purple-50 to-pink-50 border-2 border-violet-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-pulse"></div>
              <div className="text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wide">Structured Response</div>
            </div>
            <div className="grid gap-3">
              {Object.entries(json).map(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const isNested = typeof value === 'object' && value !== null;
                
                return (
                  <div key={key} className="bg-gradient-to-br from-white to-violet-50/30 rounded-xl p-3 border-2 border-violet-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-full bg-gradient-to-b from-violet-400 via-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent text-sm mb-1">{formattedKey}</div>
                        <div className="text-gray-700 text-sm">
                          {isNested ? (
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto border border-gray-200">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            <span className="break-words">{String(value)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    } catch {
      // Not JSON, continue with text formatting
    }

    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return (
      <div className="space-y-3 prose prose-sm max-w-none">
        {paragraphs.map((para, idx) => {
          // Check for blockquotes
          if (para.trim().startsWith('>')) {
            const quoteLines = para.split(/\n/).filter(line => line.trim().startsWith('>'));
            const quoteText = quoteLines.map(line => line.replace(/^>\s*/, '')).join(' ');
            return (
              <blockquote key={idx} className="border-l-4 border-violet-400 bg-gradient-to-r from-violet-50 to-purple-50 pl-4 py-3 my-3 rounded-r-lg italic text-gray-700 shadow-sm">
                {quoteText}
              </blockquote>
            );
          }
          
          // Check if paragraph is a numbered list
          if (para.trim().match(/^\d+\.\s/)) {
            const items = para.split(/\n/).filter(line => line.trim().match(/^\d+\.\s/));
            return (
              <ol key={idx} className="list-decimal list-inside space-y-2 ml-3 my-3">
                {items.map((item, i) => {
                  const cleaned = item.replace(/^\d+\.\s+/, '');
                  return (
                    <li key={i} className="ml-2 text-sm leading-relaxed">
                      <span dangerouslySetInnerHTML={{ __html: cleaned
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                        .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 text-violet-700 px-1.5 py-0.5 rounded-md text-xs font-mono font-semibold border border-violet-200">$1</code>')
                      }} />
                    </li>
                  );
                })}
              </ol>
            );
          }
          
          // Check if paragraph is a bullet list
          if (para.trim().match(/^[\*\-\•]\s/)) {
            const items = para.split(/\n/).filter(line => line.trim().match(/^[\*\-\•]\s/));
            return (
              <ul key={idx} className="list-disc list-inside space-y-2 ml-3 my-3">
                {items.map((item, i) => {
                  const cleaned = item.replace(/^[\*\-\•]\s+/, '');
                  return (
                    <li key={i} className="ml-2 text-sm leading-relaxed">
                      <span dangerouslySetInnerHTML={{ __html: cleaned
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                        .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 text-violet-700 px-1.5 py-0.5 rounded-md text-xs font-mono font-semibold border border-violet-200">$1</code>')
                      }} />
                    </li>
                  );
                })}
              </ul>
            );
          }
          
          // Check for code blocks
          if (para.trim().startsWith('```')) {
            const codeMatch = para.match(/```(\w+)?\n([\s\S]*?)```/);
            if (codeMatch) {
              const language = codeMatch[1] || 'text';
              return (
                <div key={idx} className="my-4 rounded-xl overflow-hidden shadow-lg border border-gray-300">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 text-xs px-4 py-2 flex items-center justify-between">
                    <span className="font-mono font-semibold">{language}</span>
                    <span className="text-gray-400 text-xs">Code</span>
                  </div>
                  <pre className="bg-gray-950 text-green-400 p-4 overflow-x-auto text-xs font-mono leading-relaxed">
                    <code>{codeMatch[2].trim()}</code>
                  </pre>
                </div>
              );
            }
          }
          
          // Check for tables (simple markdown table format)
          if (para.includes('|') && para.split('\n').some(line => line.includes('|'))) {
            const lines = para.split('\n').filter(line => line.trim());
            const tableLines = lines.filter(line => line.includes('|') && !line.match(/^\|[\s\-:|]+\|$/));
            
            if (tableLines.length > 0) {
              return (
                <div key={idx} className="my-4 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableLines.map((line, i) => {
                        const cells = line.split('|').map(c => c.trim()).filter(c => c);
                        return (
                          <tr key={i} className={i === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                            {cells.map((cell, j) => (
                              <td key={j} className={`px-4 py-2 text-sm ${i === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                {cell.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
          }
          
          // Check for horizontal rules
          if (para.trim().match(/^[-*_]{3,}$/)) {
            return <hr key={idx} className="my-4 border-t-2 border-gray-300" />;
          }
          
          // Format inline elements
          let formatted = para;
          
          // Inline code
          formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 text-violet-700 px-2 py-0.5 rounded-md text-xs font-mono font-semibold border border-violet-300 shadow-sm">$1</code>');
          
          // Bold text
          formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
          
          // Italic text
          formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>');
          
          // Links
          formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors">$1</a>');
          
          // Emojis and special formatting
          formatted = formatted.replace(/✅|✓|✔/g, '<span class="text-green-600 text-lg">✓</span>');
          formatted = formatted.replace(/❌|✗|✘/g, '<span class="text-red-600 text-lg">✗</span>');
          formatted = formatted.replace(/⚠️|⚠/g, '<span class="text-yellow-600 text-lg">⚠</span>');
          formatted = formatted.replace(/ℹ️|ℹ/g, '<span class="text-blue-600 text-lg">ℹ</span>');
          
          // Regular paragraph with colorful background
          if (para.trim()) {
            return (
              <div key={idx} className="bg-gradient-to-r from-violet-50/50 via-purple-50/50 to-pink-50/50 rounded-lg p-3 my-2 border-l-4 border-violet-400">
                <p 
                  className="leading-relaxed text-sm text-gray-900 mb-0" 
                  dangerouslySetInnerHTML={{ __html: formatted }} 
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
      {formatContent(content)}
    </div>
  );
}

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
      content: 'Hi! I\'m your AI Assistant. 👋\n\n**I can help you report infrastructure issues.**\n\n✨ Upload a photo or describe the problem\n📝 I\'ll analyze and guide you\n🎯 Get real-time assistance',
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
        botResponse = json.reply || json.message || json.response || json.text || json.answer || json.content;
        
        // If no text found, try to format the JSON nicely
        if (!botResponse && typeof json === 'object') {
          // Format object as readable text
          const formatted = Object.entries(json)
            .map(([key, value]) => {
              const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
              return `**${label}:** ${value}`;
            })
            .join('\n\n');
          botResponse = formatted || JSON.stringify(json, null, 2);
        }
      } else {
        botResponse = await response.text();
      }

      // Clean up response - remove extra whitespace
      botResponse = botResponse.trim();

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

  // Function to get location name from coordinates (reverse geocoding)
  const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'InfraFix-App' // Required by Nominatim
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.address;
        
        // Build a readable address string
        let locationName = '';
        if (address.road || address.street) {
          locationName = address.road || address.street;
          if (address.house_number) {
            locationName = `${address.house_number} ${locationName}`;
          }
          if (address.city || address.town || address.village) {
            locationName += `, ${address.city || address.town || address.village}`;
          }
          if (address.state) {
            locationName += `, ${address.state}`;
          }
          if (address.country) {
            locationName += `, ${address.country}`;
          }
        } else if (address.display_name) {
          locationName = address.display_name.split(',')[0] + ', ' + address.display_name.split(',').slice(-2).join(', ');
        } else {
          // Fallback to formatted coordinates
          locationName = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
        
        return locationName || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
    
    // Fallback to coordinates
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Show coordinates first
          const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setInputMessage(coordinates);
          
          // Try to get location name
          try {
            const locationName = await getLocationName(latitude, longitude);
            setInputMessage(locationName);
            addBotMessage(`📍 Location detected: ${locationName}`);
          } catch (error) {
            setInputMessage(coordinates);
            addBotMessage(`📍 Location captured: ${coordinates}\n(Unable to fetch address name)`);
          } finally {
            setIsLoading(false);
          }
        },
        () => {
          setIsLoading(false);
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
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-200">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">InfraFix AI Assist</h1>
                <p className="text-xs text-gray-500">Smart Complaint Assistant</p>
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
            <div className="space-y-4 min-w-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} min-w-0`}
                >
                  <div
                    className={`max-w-[85%] min-w-0 rounded-2xl px-5 py-4 shadow-lg transition-all hover:shadow-xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white rounded-br-sm ring-2 ring-blue-300/50'
                        : 'bg-gradient-to-br from-violet-100 via-purple-100 via-pink-100 to-rose-100 text-gray-900 rounded-bl-sm border-2 border-violet-300 shadow-md'
                    }`}
                  >
                    {message.image && (
                      <div className="mb-4 rounded-xl overflow-hidden shadow-md border-2 border-white/20">
                        <img
                          src={message.image}
                          alt="Uploaded"
                          className="w-full max-w-sm rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className={`prose prose-sm max-w-none min-w-0 ${message.sender === 'user' ? 'prose-invert' : 'prose-gray'}`}>
                      <div className="break-words overflow-wrap-anywhere">
                        <FormattedMessage content={message.content} />
                      </div>
                    </div>
                    <div
                      className={`text-xs mt-3 pt-3 border-t flex items-center gap-2 ${
                        message.sender === 'user' 
                          ? 'text-blue-100 border-blue-400/40' 
                          : 'border-gradient-to-r from-violet-300 to-purple-300 border-violet-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-300">
                          <span className="text-xs font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {message.sender === 'bot' && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200 border-2 border-violet-400 shadow-sm">
                            <span className="text-lg">🤖</span>
                            <span className="font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-xs">
                              AI Response
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-violet-100 via-purple-100 via-pink-100 to-rose-100 border-2 border-violet-400 rounded-2xl rounded-bl-sm px-6 py-5 shadow-xl">
                    <div className="flex items-center gap-4">
                      {/* Animated AI Icon */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      </div>
                      
                      {/* Animated Dots */}
                      <div className="flex gap-2 items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-bounce shadow-md"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            AI is thinking...
                          </span>
                          <span className="text-lg animate-spin">⚡</span>
                        </div>
                        <span className="text-xs font-medium text-violet-700">Processing your request with intelligence</span>
                      </div>
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
                  id="infrafix-ai-image-input"
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

