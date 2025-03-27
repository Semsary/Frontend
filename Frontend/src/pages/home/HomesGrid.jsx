import React from "react";
import { Heart } from "lucide-react";

const HomesGrid = ({ homes }) => {
  return (
    <div className=" mx-auto px-10 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 text-right">
        {homes.map((home) => (
          <div
            key={home.id}
            className="bg-white shad ow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
          >
            <div className="relative">
              <img
                src={home.image}
                alt={home.name}
                className="w-full h-64 object-cover"
              />
              <button className="absolute top-4 left-4 bg-white/70 p-2 rounded-full hover:bg-white transition-colors">
                <Heart
                  className="text-gray-700 hover:text-red-500"
                  size={24}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Home Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                {home.rating && (
                  <div className="flex items-center">
                    <span className="text-black text-sm">★</span>
                    <span className="ml-1 text-gray-700 text-sm">
                      {home.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 truncate">
                    {home.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {home.location || "Location not specified"}
                  </p>
                </div>
              </div>

              {/* Description and Price */}
              <p className="text-gray-600 text-sm mb- 2 line-clamp-2">
                {home.description}
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">
                    ${home.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ night</span>
                </div>

                {!home.superhost && (
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py- 1 rounded-full">
                    Superhost
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomesGrid;
