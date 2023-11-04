import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';

interface SearchResult {
  id: number;
  name: string;
  artist: string;
  image: string;
}

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<'album' | 'song' | 'artist'>('song');

  useEffect(() => {
    if (searchText) {
      // Thực hiện tìm kiếm dựa trên loại (album, song, artist)
      // Ví dụ: gửi yêu cầu API tới dịch vụ tìm kiếm Spotify dựa trên searchType
      // Trong ví dụ này, tôi sẽ giả định kết quả tìm kiếm là một mảng các mục
      const mockSearchResults: SearchResult[] = [
        { id: 1, name: 'Song 1', artist: 'Artist 1', image: 'image-url-1' },
        { id: 2, name: 'Song 2', artist: 'Artist 2', image: 'image-url-2' },
        { id: 3, name: 'Song 3', artist: 'Artist 3', image: 'image-url-3' },
      ];
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchText, searchType]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for songs on Spotify"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setIsSearching(true);
          }}
        />
      </View>

      <View style={styles.searchTypeContainer}>
        <Button
          title="Album"
          onPress={() => setSearchType('album')}
          color={searchType === 'album' ? '#1DB954' : 'gray'}
        />
        <Button
          title="Song"
          onPress={() => setSearchType('song')}
          color={searchType === 'song' ? '#1DB954' : 'gray'}
        />
        <Button
          title="Artist"
          onPress={() => setSearchType('artist')}
          color={searchType === 'artist' ? '#1DB954' : 'gray'}
        />
      </View>

      {isSearching && <Text style={styles.searchingText}>Searching...</Text>}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem}>
            <Image
              style={styles.image}
              source={{ uri: item.image }}
            />
            <View style={styles.info}>
              <Text style={styles.songName}>{item.name}</Text>
              <Text style={styles.artistName}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#1DB954',
    borderWidth: 1,
    padding: 8,
    fontSize: 16,
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#333',
  },
  searchTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    color: 'white',
  },
  artistName: {
    fontSize: 14,
    color: 'gray',
  },
  searchingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1DB954',
  },
});

export default SearchScreen;
