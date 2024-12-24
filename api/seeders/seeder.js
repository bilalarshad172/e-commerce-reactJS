import mongoose from "mongoose";
import dotenv from "dotenv";
import seedAdminUser from "./userSeeder.js";

dotenv.config();

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
    useUnifiedTopology: true,
  
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(`Error: ${err.message}`));

// Run seeders
const runSeeders = async () => {
  await seedAdminUser(); // Seed the admin user
  mongoose.connection.close(); // Close connection after seeding
};

runSeeders();