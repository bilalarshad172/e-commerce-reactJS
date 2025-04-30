import { cleanupExpiredReservations } from "../services/inventory.service.js";

/**
 * Start the scheduled tasks
 */
export const startScheduledTasks = () => {
  // Clean up expired reservations every 5 minutes
  setInterval(async () => {
    try {
      const count = await cleanupExpiredReservations();
      if (count > 0) {
        console.log(`Cleaned up ${count} expired inventory reservations`);
      }
    } catch (error) {
      console.error("Error in scheduled task:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  console.log("Scheduled tasks started");
};
