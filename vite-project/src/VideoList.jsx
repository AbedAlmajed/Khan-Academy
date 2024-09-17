

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/playlists');
        setPlaylists(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = async (playlistId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/playlists/${playlistId}/videos`);
      setVideos(response.data);
      setSelectedPlaylist(playlistId);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4 text-lg">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-1/4 bg-white shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Playlists</h2>
        <ul className="space-y-4">
          {playlists.map(playlist => (
            <li
              key={playlist.id}
              className="cursor-pointer text-blue-600 hover:text-blue-800  text-lg"
              onClick={() => handlePlaylistSelect(playlist.id)}
            >
              {playlist.snippet.title}
            </li>
          ))}
        </ul>
      </aside>

      <main className="w-3/4 p-6">
        <h1 className="text-4xl font-bold mb-8 text-blue-800">Khan Academy Playlists</h1>
        {selectedPlaylist && (
          <>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Videos in Playlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map(video => (
                <div key={video.snippet.resourceId.videoId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="180"
                    src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                    title={video.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-40 object-cover"
                  ></iframe>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{video.snippet.title}</h3>
                    <p className="text-gray-600 text-sm">{video.snippet.description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VideoList;
