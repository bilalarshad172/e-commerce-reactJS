import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/background.jpg";
import OAuth from "../../components/OAuth";
import { message } from "antd";

const login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Create a new Image object.
    const img = new Image();
    img.src = bgImage;

    // When the image is fully loaded, update the state.
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    try {
      const resultAction = await dispatch(getUser({ email, password }));

      // Check if login was successful
      if (getUser.fulfilled.match(resultAction)) {
        // Navigate to the products page on successful login
        navigate("/products");
        message.success("Login successful!");
      } else {
        console.error("Login failed:", resultAction.payload || "Unknown error");
        message.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during login:", error.message);
    }

    // Clear form fields
    setLoginData({
      email: "",
      password: "",
    });
  };

  return (
    <div
      style={isImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
      className={` flex flex-col items-center justify-center h-screen bg-no-repeat bg-cover bg-center transition-opacity duration-700 ${
        isImageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {!isImageLoaded && (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      )}

      {isImageLoaded && (
      <form className="w-1/3" onSubmit={handleSubmit}>
        <div className="border rounded shadow-md backdrop-blur-md">
          <h1 className="text-3xl text-center mt-5  font-mono font-bold">
            Login
          </h1>
          <div className="flex flex-col gap-2 py-10 items-center">
            <input
              className="border rounded px-2 py-1 w-1/2"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              required
            />
            <input
              className="border rounded px-2 py-1 w-1/2"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              required
            />
            <button
              className="border rounded-xl w-1/2 py-1 bg-black text-white hover:opacity-80"
                type="submit"
                disabled={loading}
            >
             {loading ? "Logging in..." : "Login"}
              </button>
              <OAuth/>
            <div className="flex flex-col items-center">
              <p className="text-white">Dont have and account?</p>
              <Link className="text-blue-500 underline" to="/signup">
                Sign up
              </Link>
            </div>
           
          </div>
        </div>
        </form>
        )}
    </div>
  );
};

export default login;
