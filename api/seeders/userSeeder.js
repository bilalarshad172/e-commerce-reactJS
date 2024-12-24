import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const adminUser = {
  username: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123', // Plain text password, will hash this before saving
  role: 'admin', // Add role field if required
};

const seedAdminUser = async () => {
  try {
    // Check if the admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      console.log('Admin user already exists. Skipping seeding.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    adminUser.password = hashedPassword;

    // Save the admin user to the database
    await User.create(adminUser);
    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

export default seedAdminUser;