import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { moodStyles } from "../styles/moodCardStyles";

interface MoodModalProps {
  visible: boolean;
  onClose: () => void;
  mood: string;
  setMood: (value: string) => void;
  onSave: () => void;
}

const MoodModal: React.FC<MoodModalProps> = ({
  visible,
  onClose,
  mood,
  setMood,
  onSave,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={moodStyles.modalBackground}>
        <View style={moodStyles.modalContainer}>
          <Text style={moodStyles.modalTitle}>How are you feeling today?</Text>

          <TextInput
            value={mood}
            onChangeText={setMood}
            placeholder="Enter a mood score (1–10)"
            keyboardType="numeric"
            style={moodStyles.textInput}
          />

          <View style={moodStyles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={moodStyles.cancelButton}>
              <Text style={moodStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSave} style={moodStyles.saveButton}>
              <Text style={moodStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MoodModal;
