import React, { useState, useEffect } from "react";
import { Avatar, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUserProfile, logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const hide = () => {
    navigate("/user/profile");
    setOpen(false);
  };

  const handleSignout = () => {
    dispatch(logout());
    if (!error) {
      // Navigate to login page on successful signup
      navigate("/");
    }
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
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

  return (
    <div>
      <Popover
        content={
          <div className="flex flex-col space-y-2">
            <a onClick={hide} className="hover:text-black cursor-pointer">Profile Setting</a>
            <a onClick={() => {
              navigate("/my-orders");
              setOpen(false);
            }} className="hover:text-black cursor-pointer">My Orders</a>
            <a onClick={handleSignout} className="hover:text-black cursor-pointer">Logout</a>
          </div>
        }
        title={user?.username}
        trigger="click"
        style={{
          cursor: "pointer",
        }}
        open={open}
        onOpenChange={handleOpenChange}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="profile test"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%", // makes it fully rounded
              objectFit: "cover", // ensures the image scales nicely within the circle
              cursor: "pointer", // optional, if you want a pointer on hover
            }}
            onError={() => console.log("Image failed to load")}
          />
        ) : (
          <Avatar
            style={{
              backgroundColor: "#87d068",
              cursor: "pointer",
            }}
            icon={<UserOutlined />}
          />
        )}
        {/* <Avatar
          style={{
            backgroundColor: "#87d068",
                      cursor: "pointer",

          }}
          icon={<UserOutlined />}
        /> */}
      </Popover>
    </div>
  );
};

export default Profile;
