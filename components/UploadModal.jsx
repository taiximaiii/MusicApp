// UploadModal.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const UploadModal = ({
  isModalVisible,
  setModalVisible,
  newTrack,
  setNewTrack,
  isUploading,
  handleNewTrack,
  pickImage,
  pickAudio,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(!isModalVisible)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload New Track</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Title"
            value={newTrack.title}
            onChangeText={(text) => setNewTrack({ ...newTrack, title: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Artist"
            value={newTrack.artist}
            onChangeText={(text) => setNewTrack({ ...newTrack, artist: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Genre"
            value={newTrack.genre}
            onChangeText={(text) => setNewTrack({ ...newTrack, genre: text })}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
          {newTrack.imageFile && (
            <Text style={styles.uploadedFile}>
              Image: {newTrack.imageFile.name}
            </Text>
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={pickAudio}>
            <Text style={styles.uploadButtonText}>Upload Audio</Text>
          </TouchableOpacity>
          {newTrack.mp3File && (
            <Text style={styles.uploadedFile}>
              Audio: {newTrack.mp3File.name}
            </Text>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={handleNewTrack}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.modalButtonText}>Create</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1ED760',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadedFile: {
    color: 'white',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#121212',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButtonText: {
    color: 'black',
  },
});

export default UploadModal;
