import React, { useState, useRef } from "react";
import { Carousel } from "antd";
import axios from "axios";

const ProductImages = ({ uploadedImages, setUploadedImages }) => {
  const fileRef = useRef(null);

  const handleImageUpload = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  // Use "files" as the field name since your backend uses upload.array('files', 5)
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      // Do NOT set Content-Type. Let the browser set the correct boundary for FormData
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse JSON response. There's no "response.data" in fetch
    const data = await response.json();
    const { urls } = data;

    console.log("Uploaded URLs:", urls);

    // Update your React state
    setUploadedImages((prevUrls) => [...prevUrls, ...urls]);
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};


  // const handleUpload = async () => {
  //   if (selectedFiles.length === 0) return;

  //   try {
  //     const formData = new FormData();
  //     selectedFiles.forEach((file) => {
  //       formData.append("images", file);
  //     });

  //     const response = await axios.post(
  //       "http://localhost:3000/api/upload-images",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     const { images } = response.data;
  //     const newImageUrls = images.map((filename) => {
  //       return `http://localhost:3000/uploads/${filename}`;
  //     });

  //     // Update parent's state with newly uploaded images
  //     setUploadedImages((prev) => [...prev, ...newImageUrls]);

  //     // Clear the file input
  //     setSelectedFiles([]);
  //     if (fileRef.current) {
  //       fileRef.current.value = null;
  //     }
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //   }
  // };

  return (
    <div className="border rounded-md shadow-md">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Product Media</h3>
        <label className="mx-5 font-semibold">Images</label>
        <div className="border rounded-md mx-5 flex flex-col">
          <Carousel autoplay style={{ width: "100%" }}>
            {uploadedImages.map((imgUrl, index) => (
              <div key={index}>
                <img
                  src={imgUrl}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </Carousel>

          <div className="flex justify-center my-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current.click()}
              className="border rounded-md w-1/3 py-1 border-black text-black hover:bg-black hover:text-white"
            >
              Add Images
            </button>
            {/* <button
              onClick={handleUpload}
              className="border rounded-md w-1/3 py-1 border-black text-black hover:bg-black hover:text-white"
            >
              Upload
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
