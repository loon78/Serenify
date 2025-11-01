import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatResponse, Message as GeminiMessage, sendMessageToGemini } from "../services";
import { psychiatristStyles } from "../styles/psychiatristStyles";

export default function AIPsychiatristScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, I'm your AI Psychiatrist. How are you feeling today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    // Build conversation history expected by gemini service.
    // The server requires the first item in history to be a user message.
    // Slice the combined messages so the first element is the first user message.
    const combined = [
      ...messages,
      { id: newMessage.id, text: newMessage.text, sender: newMessage.sender },
    ];
    const firstUserIndex = combined.findIndex((m: any) => m.sender === 'user');
    const sliced = firstUserIndex >= 0 ? combined.slice(firstUserIndex) : combined;
    const conversationHistory: GeminiMessage[] = sliced.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    // Call the Gemini API service
    (async () => {
      try {
        const res: ChatResponse = await sendMessageToGemini(newMessage.text, conversationHistory as any);
        if (res.success && res.message) {
          const aiResponse = { id: Date.now() + 1, text: res.message, sender: 'ai' };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          const aiResponse = { id: Date.now() + 1, text: res.error || 'Sorry, something went wrong.', sender: 'ai' };
          setMessages((prev) => [...prev, aiResponse]);
        }
      } catch (err) {
        console.error('Error calling Gemini service:', err);
        const aiResponse = { id: Date.now() + 1, text: 'Failed to reach the AI service.', sender: 'ai' };
        setMessages((prev) => [...prev, aiResponse]);
      }
    })();
  };

  return (
    <SafeAreaView style={psychiatristStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={psychiatristStyles.container}
      >
        <View style={psychiatristStyles.innerContainer}>
          <Text style={psychiatristStyles.header}>AI Psychiatrist</Text>

          <ScrollView
            style={psychiatristStyles.chatContainer}
            contentContainerStyle={psychiatristStyles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  psychiatristStyles.messageRow,
                  msg.sender === "user"
                    ? psychiatristStyles.userMessageRow
                    : psychiatristStyles.aiMessageRow,
                ]}
              >
                <View
                  style={[
                    psychiatristStyles.messageBubble,
                    msg.sender === "user"
                      ? psychiatristStyles.userBubble
                      : psychiatristStyles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      psychiatristStyles.messageText,
                      msg.sender === "user"
                        ? psychiatristStyles.userText
                        : psychiatristStyles.aiText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={psychiatristStyles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your thoughts..."
              placeholderTextColor="#999"
              style={psychiatristStyles.input}
            />
            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={24} color="#4f9cf9" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
}