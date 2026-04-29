import React, { useState, useEffect } from "react";
import { Avatar, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUserProfile, logoutUser, clearAuthState } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const goToProfile = () => {
    navigate("/user/profile");
    setOpen(false);
  };

  const handleSignout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (_) {
      dispatch(clearAuthState());
    }

    navigate("/login");
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    dispatch(getUserProfile())
      .unwrap()
      .catch((err) => {
        if (err === "Unauthorized") {
          dispatch(clearAuthState());
        }
      });
  }, [dispatch, isAuthenticated]);

  const authenticatedMenu = (
    <div className="flex flex-col space-y-2">
      <a onClick={goToProfile} className="hover:text-black cursor-pointer">Profile Setting</a>
      <a
        onClick={() => {
          navigate("/my-orders");
          setOpen(false);
        }}
        className="hover:text-black cursor-pointer"
      >
        My Orders
      </a>
      <a onClick={handleSignout} className="hover:text-black cursor-pointer">Logout</a>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="px-3 py-2 border border-black rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors"
      >
        Login / Signup
      </button>
    );
  }

  return (
    <div>
      <Popover
        content={authenticatedMenu}
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
            alt="profile"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onError={() => {}}
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
      </Popover>
    </div>
  );
};

export default Profile;
