import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupSuccess, clearError } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../../assets/bg-10.jpg";

const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Create a new Image object.
    const img = new Image();
    img.src = bgImage;

    // When the image is fully loaded, update the state.
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = signupData;
    dispatch(signupSuccess({ name, email, password }));
    if (!error) {
      // Navigate to login page on successful signup
      navigate("/");
    }
    setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  return (
    <div
      style={isImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
      className={`flex flex-col items-center justify-center h-screen bg-no-repeat bg-cover bg-center transition-opacity duration-700 ${
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
            <h1 className="text-3xl text-center mt-5 text-white font-mono font-bold">
              Signup
            </h1>
            <div className="flex flex-col gap-2 py-10 items-center">
              <input
                className="border rounded px-2 py-1 w-1/2"
                type="text"
                name="name"
                placeholder="Name"
                value={signupData.name}
                onChange={handelChange}
                required
              />
              <input
                className="border rounded px-2 py-1 w-1/2"
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handelChange}
                required
              />
              <input
                className="border rounded px-2 py-1 w-1/2"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handelChange}
                value={signupData.password}
                required
              />
              <input
                className="border rounded px-2 py-1 w-1/2"
                type="password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                placeholder="Confirm Password"
                onChange={handelChange}
                required
              />
              <button
                className="border rounded-xl w-1/3 py-1 bg-black text-white hover:opacity-80"
                disabled={signupData.password !== signupData.confirmPassword}
                type="submit"
              >
                Signup
              </button>
              <div className="flex flex-col items-center">
                <p className="text-white">Already have an account?</p>
                <Link className="text-blue-500 underline" to="/">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </form>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Signup;
