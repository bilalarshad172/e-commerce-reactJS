import React from "react";
import { Carousel } from "antd";
import bgImage from "../../../../../assets/bg-10.jpg";

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const ProductImages = () => {
  return (
    <div className="border rounded-md shadow-md ">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Product Media</h3>
        <label className="mx-5 font-semibold">Images</label>
        <div className="border border-dotted mx-5 flex flex-col justify-center items-center">
          <Carousel >
            <div>
              <img
                src={bgImage}
                              alt="Slide 1"
                              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
            <div>
              <img
                src={bgImage}
                              alt="Slide 1"
                              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
            <div>
              <img
                src={bgImage}
                              alt="Slide 1"
                              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
          </Carousel>

          <button className="border rounded-xl w-1/3 py-1 border-black text-black hover:bg-black hover:text-white">
            Add Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
