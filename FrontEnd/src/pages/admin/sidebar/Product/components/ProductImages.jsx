import React,{ useState, useRef } from "react";
import { Carousel } from "antd";
import axios from "axios";
import image1 from "../../../../../assets/test.jpg";
import image2 from "../../../../../assets/test2.jpg";
import image3 from "../../../../../assets/test3.jpg";
import image4 from "../../../../../assets/test4.jpg";
import image5 from "../../../../../assets/test5.jpg";


const images = [image1, image2, image3, image4, image5];
const ProductImages = () => {
  const fileRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const handleFileSelect = (event) => {
    // event.target.files is a FileList
    const filesArray = Array.from(event.target.files);
    setSelectedFiles(filesArray);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const formData = new FormData();
      // Append each file in 'images' field
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // If you eventually want to tie to product ID, you can also do:
      // formData.append("productId", "12345");

      const response = await axios.post(
        "http://localhost:3000/api/upload-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // The server returns the uploaded file names in response.data.images
      const { images } = response.data;
      // Construct full URLs
      const newImageUrls = images.map((filename) => {
        return `http://localhost:3000/uploads/${filename}`;
      });

      // Update state with newly uploaded images
      setUploadedImageUrls((prev) => [...prev, ...newImageUrls]);

      // Clear the file input
      setSelectedFiles([]);
      if (fileRef.current) {
        fileRef.current.value = null; // clear input
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="border rounded-md shadow-md ">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Product Media</h3>
        <label className="mx-5 font-semibold">Images</label>
        <div className="border rounded-md mx-5 flex flex-col">
          <Carousel autoplay style={{ width: "100%" }}>
            {uploadedImageUrls.length > 0 && (
            <div>
              {uploadedImageUrls.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Uploaded ${index}`}
                  style={{ width: "100%", height: "260px", objectFit: "contain" }}
                />
              ))}
            </div>
          )}
          </Carousel>

          <div className="flex justify-center my-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"/>
            <button onClick={()=>fileRef.current.click()} className="border rounded-md w-1/3 py-1 border-black text-black hover:bg-black hover:text-white">
              Add Images
            </button>
               <button
              onClick={handleUpload}
              className="border rounded-md w-1/3 py-1 border-black text-black hover:bg-black hover:text-white"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
