/**
 * Voice Recording Service
 * Handles audio recording for journal entries
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface RecordingStatus {
  canRecord: boolean;
  isRecording: boolean;
  durationMillis: number;
}

class VoiceRecordingService {
  private recording: Audio.Recording | null = null;
  private recordingUri: string | null = null;
  private startTime: number = 0;

  /**
   * Request audio recording permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  /**
   * Check if recording permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking audio permissions:', error);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      // Request permissions if not already granted
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Audio recording permission not granted');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and prepare recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.startTime = Date.now();
      this.recordingUri = null;

      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and get the file URI
   */
  async stopRecording(): Promise<{
    uri: string;
    duration: number;
  } | null> {
    if (!this.recording) {
      console.warn('No active recording to stop');
      return null;
    }

    try {
      const status = await this.recording.stopAndUnloadAsync();
      const duration = this.calculateDuration(status);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = this.recording.getURI();
      
      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      this.recordingUri = uri;
      this.recording = null;
      this.startTime = 0;

      console.log('Recording stopped:', uri);

      return {
        uri,
        duration,
      };
    } catch (error) {
      console.error('Error stopping recording:', error);
      this.recording = null;
      throw error;
    }
  }

  /**
   * Get current recording status
   */
  async getStatus(): Promise<RecordingStatus | null> {
    if (!this.recording) {
      return null;
    }

    try {
      const status = await this.recording.getStatusAsync();
      return {
        canRecord: status.canRecord ?? false,
        isRecording: status.isRecording ?? false,
        durationMillis: status.durationMillis ?? 0,
      };
    } catch (error) {
      console.error('Error getting recording status:', error);
      return null;
    }
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.recording !== null;
  }

  /**
   * Get duration in seconds
   */
  private calculateDuration(status: any): number {
    if (status.durationMillis) {
      return Math.floor(status.durationMillis / 1000);
    }
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Play a recorded audio file
   */
  async playRecording(uri: string): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing recording:', error);
      throw error;
    }
  }

  /**
   * Delete a recording file
   */
  async deleteRecording(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting recording:', error);
      return false;
    }
  }

  /**
   * Get recording file info
   */
  async getRecordingInfo(uri: string): Promise<{
    exists: boolean;
    size?: number;
    modificationTime?: number;
  }> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return {
        exists: fileInfo.exists,
        size: fileInfo.size,
        modificationTime: fileInfo.modificationTime,
      };
    } catch (error) {
      console.error('Error getting recording info:', error);
      return { exists: false };
    }
  }

  /**
   * Cancel current recording
   */
  async cancelRecording(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        this.recording = null;
        this.startTime = 0;
      } catch (error) {
        console.error('Error canceling recording:', error);
      }
    }
  }

  /**
   * Format duration (seconds) to HH:MM:SS or MM:SS
   */
  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

export const voiceRecording = new VoiceRecordingService();

