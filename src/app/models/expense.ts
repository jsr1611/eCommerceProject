export interface expense{
  id: string; // Unique identifier for each expense (e.g., UUID or MongoDB ObjectId)
  date: string; // Date in ISO format (yyyy-MM-dd)
  category: string; // Category of the expense (e.g., "Food", "Transport", etc.)
  amount: number; // Amount of the expense
  description?: string; // Optional description or note about the expense
  createdAt: string; // Timestamp when the expense was added (ISO format)
  updatedAt?: string; // Optional timestamp for when the expense was last updated
}