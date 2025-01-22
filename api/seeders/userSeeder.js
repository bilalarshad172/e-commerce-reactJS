import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const adminUser = {
  username: "Admin User",
  email: "admin@admin.com",
  phone:{ fullPhoneNumber: "+923367327796", isoCode: "pk" },
  password: "admin123", // Plain text password, will hash this before saving
  role: "admin", // Admin role
};

const seedAdminUser = async () => {
  try {
    // Delete all existing users with the role 'admin'
    await User.deleteMany({ role: "admin" });
    await User.deleteMany({ role: "user" });
    console.log("All previous users have been deleted.");

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);

    // Create a new admin user
    const newAdminUser = { ...adminUser, password: hashedPassword };
    await User.create(newAdminUser);

    console.log("New admin user created successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

export default seedAdminUser;
