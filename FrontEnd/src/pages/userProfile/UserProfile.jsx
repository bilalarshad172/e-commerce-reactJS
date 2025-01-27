import React, { useEffect, useState, useRef } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUserProfile, updateUserProfile } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import PhoneInputField from "../../components/PhoneInput";
const UserProfile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || {},
    photoURL: user?.photoURL || "",
  });

  console.log(user);
  useEffect(() => {
    dispatch(getUserProfile())
      .unwrap()
      .catch((err) => {
        if (err === "Unauthorized") {
          // handle redirect or some other logic
        }
      });
  }, [dispatch]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // get the first file
    if (!file) return;

    // Create form data for the single file
    const formData = new FormData();
    formData.append("files", file);
    // If your backend expects `file` instead of `files`, change accordingly

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        // no 'Content-Type' header — let fetch handle the boundary
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Parse the JSON
      const data = await response.json();
      // Suppose your server returns { urls: [ 'http://...' ] }
      const { urls } = data;

      if (urls && urls.length > 0) {
        // Update the local state to reflect the new image URL
        setProfileData((prev) => ({
          ...prev,
          photoURL: urls[0],
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updated profile =>", profileData);
    // // Build the data object to match your backend
    // const updatedData = {
    //   username,
    //   email,
    //   phone,
    //   // photoURL or whichever field you want
    // };

    dispatch(
      updateUserProfile({ userId: user?._id, updatedData: profileData })
    );
  };
  return (
    <div className="container w-1/2 mx-auto px-4">
      <div className="border rounded-md shadow-md mt-5 text-center">
        <h3 className="text-2xl font-semibold mt-5">User Profile</h3>

        <form onSubmit={handleUpdate}>
          <div className=" flex flex-col justify-center items-center gap-4 mt-5 ">
            {profileData.photoURL ? (
              <img
                src={profileData.photoURL}
                alt="profile preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onError={() => console.log("Image failed to load")}
              />
            ) : (
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                  cursor: "pointer",
                }}
                size={100}
                icon={<UserOutlined />}
              />
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload} // Make sure to actually call your handler
            />
            <button onClick={() => fileRef.current.click()} className="">
              Update Image
            </button>
          </div>
          <div className="w-1/2 mx-auto mt-5">
            <div className="flex flex-col ">
              <label className="">Name</label>
              <input
                className="border rounded p-1"
                type="text"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col ">
              <label className="">Email</label>
              <input
                className="border rounded p-1"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
              />
            </div>
            {/* <div className="flex flex-col ">
              <label className="">Password</label>
              <input className="border rounded p-1" type="text" />
            </div> */}
            <div className="flex flex-col ">
              <label className="">Phone</label>
              <PhoneInputField
                phoneData={profileData.phone}
                setPhoneData={(phoneObj) =>
                  setProfileData({ ...profileData, phone: phoneObj })
                }
              />
            </div>
          </div>
          <div className=" my-5">
            <button
              type="submit"
              className="border rounded-md w-1/3 py-1 border-black text-black hover:bg-black hover:text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
