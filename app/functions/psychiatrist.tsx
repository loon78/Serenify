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

    // 👇 Placeholder for AI API call
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand. Can you tell me more about what’s been bothering you lately?",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  return (
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
  );
}