
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());

const API_KEY = 'AIzaSyDkriLZyNsAsZAATNwLFnhZDRyYE0wFFaE';      
const CHANNEL_ID = 'UC4a-Gbdw7vOaccHmFo40b9g';

const getPlaylists = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
      params: {
        part: 'snippet',
        channelId: CHANNEL_ID,
        maxResults: 12,
        key: API_KEY
      }
    });
    return response.data.items;
  } catch (error) {
    throw new Error('Error fetching playlists from YouTube API');
  }
};

const getPlaylistVideos = async (playlistId) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId,
        maxResults: 50,
        key: API_KEY
      }
    });
    return response.data.items;
  } catch (error) {
    throw new Error('Error fetching playlist videos from YouTube API');
  }
};

app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await getPlaylists();
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب القوائم' });
  }
});

app.get('/api/playlists/:playlistId/videos', async (req, res) => {
  const { playlistId } = req.params;
  try {
    const videos = await getPlaylistVideos(playlistId);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب فيديوهات القائمة' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
