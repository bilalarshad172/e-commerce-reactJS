import { buildAdminDashboardSummary } from "../services/adminDashboard.service.js";

export const getAdminDashboardSummary = async (req, res) => {
  try {
    const summary = await buildAdminDashboardSummary();
    return res.status(200).json({
      message: "Dashboard summary fetched successfully",
      summary,
    });
  } catch (error) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to fetch dashboard summary",
      details: error.message,
    });
  }
};
