import mongoose from "mongoose";
import dotenv from "dotenv";
import seedAdminUser from "./userSeeder.js";

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection established.");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit process with failure
  }
};
// Run seeders
const runSeeder = async () => {
  try {
    await connectToDatabase(); // Ensure database connection
    await seedAdminUser(); // Seed the admin user
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error.message);
  } finally {
    mongoose.connection.close(); // Close the database connection
    process.exit(0); // Exit process successfully
  }
};

runSeeder();