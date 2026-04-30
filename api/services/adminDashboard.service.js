import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

const LOW_STOCK_THRESHOLD = 10;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

// Normalize any date to local start-of-day for consistent window filtering.
const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Calculate percentage change between two values while guarding divide-by-zero.
const calculateGrowthPercentage = (currentValue, previousValue) => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(2));
};

// Build current and previous 30-day windows for growth calculations.
const getDateWindows = () => {
  const now = new Date();
  const currentStart = startOfDay(new Date(now.getTime() - 29 * MS_IN_DAY));
  const previousEnd = new Date(currentStart.getTime() - 1);
  const previousStart = startOfDay(new Date(previousEnd.getTime() - 29 * MS_IN_DAY));

  return { currentStart, previousStart, previousEnd };
};

// Fetch top-level counts used in dashboard summary cards.
const getBaseCounts = async () => {
  const [totalOrders, totalCustomers, totalProducts, lowStockCount] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: { $ne: "admin" } }),
    Product.countDocuments(),
    Product.countDocuments({ countInStock: { $lte: LOW_STOCK_THRESHOLD } }),
  ]);

  return { totalOrders, totalCustomers, totalProducts, lowStockCount };
};

// Calculate total sales from all non-cancelled orders.
const getTotalSales = async () => {
  const sales = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  return sales[0]?.total || 0;
};

// Compute growth metrics for orders, customers, and sales across two periods.
const getGrowthMetrics = async () => {
  const { currentStart, previousStart, previousEnd } = getDateWindows();

  const [currentOrders, previousOrders, currentCustomers, previousCustomers, currentSales, previousSales] =
    await Promise.all([
      Order.countDocuments({ createdAt: { $gte: currentStart } }),
      Order.countDocuments({ createdAt: { $gte: previousStart, $lte: previousEnd } }),
      User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: currentStart } }),
      User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: previousStart, $lte: previousEnd } }),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" }, createdAt: { $gte: currentStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
            createdAt: { $gte: previousStart, $lte: previousEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

  const currentSalesTotal = currentSales[0]?.total || 0;
  const previousSalesTotal = previousSales[0]?.total || 0;

  return {
    ordersGrowth: calculateGrowthPercentage(currentOrders, previousOrders),
    customersGrowth: calculateGrowthPercentage(currentCustomers, previousCustomers),
    salesGrowth: calculateGrowthPercentage(currentSalesTotal, previousSalesTotal),
  };
};

// Build 12-month revenue trend used in charts.
const getMonthlyRevenue = async () => {
  const now = new Date();
  const yearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthly = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" }, createdAt: { $gte: yearAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return monthly.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    totalRevenue: Number(item.totalRevenue.toFixed(2)),
  }));
};

// Fetch latest orders for the "Recent Orders" section.
const getRecentOrders = async () => {
  const recentOrders = await Order.find()
    .populate("user", "username email")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("_id totalPrice status createdAt user");

  return recentOrders;
};

// Fetch top-selling products based on aggregated ordered quantity.
const getTopProducts = async () => {
  const topProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        soldQuantity: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { soldQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: "$product._id",
        title: "$product.title",
        price: "$product.price",
        soldQuantity: 1,
        countInStock: "$product.countInStock",
        images: "$product.images",
      },
    },
  ]);

  return topProducts;
};

// Compose all dashboard sections into one summary payload.
export const buildAdminDashboardSummary = async () => {
  const [counts, totalSales, growth, monthlyRevenue, recentOrders, topProducts] = await Promise.all([
    getBaseCounts(),
    getTotalSales(),
    getGrowthMetrics(),
    getMonthlyRevenue(),
    getRecentOrders(),
    getTopProducts(),
  ]);

  return {
    ...counts,
    totalSales: Number(totalSales.toFixed(2)),
    ...growth,
    monthlyRevenue,
    recentOrders,
    topProducts,
  };
};
