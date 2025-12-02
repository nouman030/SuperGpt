import React, { useEffect, useState } from "react";
import { FaDownload, FaExpand, FaTimes } from "react-icons/fa";

const Community = () => {
  const [userCommunityImages, setUserCommunityImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchCommunityImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/getCommunityImages", {
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      if (data.Success) {
        setUserCommunityImages(data.images);
      } else {
        throw new Error(data.message || "Failed to fetch images");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load community images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityImages();
  }, []);

  const handleDownload = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `community-image-${prompt}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: try opening in new tab if fetch fails (e.g. CORS)
      window.open(imageUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-(--color-bg-primary)">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--color-accent)"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-(--color-bg-primary)">
        <div className="text-(--color-text-secondary) text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg-primary) p-6">
      <h1 className="text-center text-3xl font-bold mb-8 text-(--color-text-primary) animate-slideUp">
        Community Showcase
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
        {userCommunityImages.map((image, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-xl shadow-lg bg-(--color-bg-secondary) hover:shadow-xl transition-all duration-300"
          >
            <img
              src={image.imageUrl}
              alt={`Community image by ${image.prompt}`}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex justify-end gap-2 pointer-events-auto">
                 <button
                  onClick={() => setSelectedImage(image)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                  title="Preview"
                >
                  <FaExpand />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.imageUrl, image.prompt);
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                  title="Download"
                >
                  <FaDownload />
                </button>
              </div>
              
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-lg">@{image.prompt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl transition-colors cursor-pointer z-50"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={`Preview by ${selectedImage.prompt}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 flex items-center gap-4">
              <p className="text-white text-xl font-medium">@{selectedImage.prompt}</p>
              <button
                onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-(--color-accent) text-white rounded-lg hover:bg-(--color-accent-hover) transition-colors cursor-pointer"
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
