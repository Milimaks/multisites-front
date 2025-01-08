import React, { useState, KeyboardEvent, useRef } from "react";
import { Smile, Paperclip, Image as ImageIcon, Send, X } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useFetcher } from "@remix-run/react";

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  conversationId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  conversationId,
}) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const messageFetcher = useFetcher();

  const handleSend = () => {
    if (message.trim() || selectedFiles.length > 0) {
      onSendMessage(message.trim(), selectedFiles);
      setMessage("");
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs for images
    const newPreviewUrls = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return "";
    });

    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      return newUrls;
    });
  };

  console.log(conversationId);

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith("image/") ? (
                <img
                  src={previewUrls[index]}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center px-2 break-words">
                    {file.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <messageFetcher.Form method="post" action={`/chat/${conversationId}`}>
        <div className="flex items-end gap-2">
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-10">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
            multiple
          />

          <div className="flex-1 relative">
            <textarea
              name="content"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-500 max-h-32"
              rows={1}
              style={{
                minHeight: "40px",
                height: "auto",
              }}
            />
          </div>

          <button
            type="submit"
            className={`p-2 rounded-full transition-colors ${
              message.trim() || selectedFiles.length > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
            disabled={!message.trim() && selectedFiles.length === 0}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </messageFetcher.Form>
    </div>
  );
};
