import React, { useState, useRef, useEffect } from "react";

export default function FileComplaint() {
    const [messages, setMessages] = useState([
        { id: 0, role: "bot", text: "Hi — upload a photo (optional) and describe the issue. I can help identify it and ask for location/details." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        // clear native input value (if necessary)
        const input = document.getElementById("chat-image-input");
        if (input) input.value = "";
    };

    const handleSend = async () => {
        if (!inputValue.trim() && !selectedFile) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            text: inputValue.trim() || (selectedFile ? `Image: ${selectedFile.name}` : ""),
            image: previewUrl || null,
        };

        setMessages((m) => [...m, userMessage]);
        setInputValue("");
        clearFile();

        setIsSending(true);
        try {
            const form = new FormData();
            form.append("message", userMessage.text);
            if (selectedFile) {
                form.append("image", selectedFile);
            }

            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                body: form,
            });

            let botText = "";
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                const json = await res.json();
                // accept { reply: "..." } or { message: "..." }
                botText = json.reply || json.message || JSON.stringify(json);
            } else {
                botText = await res.text();
            }

            const botMessage = {
                id: Date.now() + 1,
                role: "bot",
                text: botText,
            };
            setMessages((m) => [...m, botMessage]);
        } catch (err) {
            const errMessage = {
                id: Date.now() + 2,
                role: "bot",
                text: "Error contacting server. Please try again.",
            };
            setMessages((m) => [...m, errMessage]);
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">File Complaint — AI Helper</h2>

            <div className="border rounded-lg h-96 flex flex-col bg-white shadow-sm overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} rounded-lg p-3 max-w-[75%]`}>
                                {msg.image && (
                                    <img src={msg.image} alt="uploaded" className="mb-2 w-full h-auto object-cover rounded" />
                                )}
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="border-t p-3 bg-gray-50">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                rows={2}
                                className="w-full resize-none p-2 border rounded"
                            />
                            {previewUrl && (
                                <div className="mt-2 flex items-center gap-2">
                                    <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded border" />
                                    <div className="text-sm text-gray-700">
                                        {selectedFile?.name}
                                        <div>
                                            <button onClick={clearFile} className="text-xs text-red-600 hover:underline">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="inline-block">
                                <input id="chat-image-input" type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                                <span className="px-3 py-2 bg-white border rounded cursor-pointer text-sm">Attach</span>
                            </label>

                            <button
                                onClick={handleSend}
                                disabled={isSending || (!inputValue.trim() && !selectedFile)}
                                className={`px-4 py-2 rounded text-white ${isSending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                            >
                                {isSending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}