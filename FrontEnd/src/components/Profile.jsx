import React, { useState } from "react";
import { Avatar, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <div>
      <Popover
        content={<a onClick={hide}>Close</a>}
        title="Title"
        trigger="click"
        style={{
          cursor: "pointer",
        }}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Avatar
          style={{
            backgroundColor: "#87d068",
            cursor: "pointer",
          }}
          icon={<UserOutlined />}
        />
      </Popover>
    </div>
  );
};

export default Profile;
