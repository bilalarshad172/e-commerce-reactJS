import React from "react";
import { Carousel } from "antd";
import image1 from "../../../../../assets/test.jpg";
import image2 from "../../../../../assets/test2.jpg";
import image3 from "../../../../../assets/test3.jpg";
import image4 from "../../../../../assets/test4.jpg";
import image5 from "../../../../../assets/test5.jpg";

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const images = [image1, image2, image3, image4, image5];
const ProductImages = () => {
  return (
    <div className="border rounded-md shadow-md ">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Product Media</h3>
        <label className="mx-5 font-semibold">Images</label>
        <div className="border rounded-md mx-5 flex flex-col">
          <Carousel autoplay style={{ width: "100%" }}>
            {images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
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
            <button className="border rounded-md w-1/3 py-1 border-black text-black hover:bg-black hover:text-white">
              Add Images
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
