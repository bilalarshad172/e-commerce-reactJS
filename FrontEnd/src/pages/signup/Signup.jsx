import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../../assets/bg-10.jpg";
import OAuth from "../../components/OAuth";
import PhoneInputField from "../../components/PhoneInput";

const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = signupData;
    console.log(signupData);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const resultAction = await dispatch(
        signupUser({ name, email, password, phone })
      );

      // Check if signup was successful
      if (signupUser.fulfilled.match(resultAction)) {
        // Navigate to login page on successful signup
        navigate("/products");
      } else {
        console.error(
          "Signup failed:",
          resultAction.payload || "Unknown error"
        );
      }
    } catch (error) {
      console.error("An error occurred during signup:", error.message);
    }

    // Reset form fields
    setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
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
              <PhoneInputField
                setSignupData={setSignupData}
                signupData={signupData}
              />
              <button
                className="border rounded-xl w-1/2 py-1 bg-black text-white hover:opacity-80"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
              <OAuth />
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
