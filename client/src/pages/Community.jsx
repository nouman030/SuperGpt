import React from "react";
import { dummyPublishedImages } from "../assets/asset/assets";
function community() {
  return <div className="">
    <h1 className="text-center text-2xl font-bold my-4 ">Community Images</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-h-[90vh] overflow-y-auto">
      {dummyPublishedImages.map((image, index) => (
        <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={image.imageUrl}
            alt={`Community image by ${image.userName}`}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-3 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
            <p className="text-white text-sm font-semibold">@{image.userName}</p>
          </div>
        </div>
      ))}
    </div>
  </div>;
}

export default community;
