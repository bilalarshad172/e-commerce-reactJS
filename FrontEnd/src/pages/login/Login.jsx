import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, clearError } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/background.jpg";
import OAuth from "../../components/OAuth";

const login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    // Dispatch login action
    dispatch(loginSuccess({ email, password }));
    if (!error) {
      // Navigate to login page on successful signup
      navigate("/products");
    }
    // Clear form
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
            >
              Login
              </button>
              <OAuth/>
            <div className="flex flex-col items-center">
              <p className="text-white">Dont have and account?</p>
              <Link className="text-blue-500 underline" to="/signup">
                Sign up
              </Link>
            </div>
            {/* Display error messages */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Show success message if authenticated */}
            {isAuthenticated && (
              <p className="text-green-500">Login successful!</p>
            )}
          </div>
        </div>
        </form>
        )}
    </div>
  );
};

export default login;
