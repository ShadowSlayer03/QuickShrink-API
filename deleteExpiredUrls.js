import { URL } from "./models/url.model.js";

const deleteExpiredURLs = async () => {
    try {
      const now = new Date();
      const result = await URL.deleteMany({ expiryDate: { $lt: now } });
      console.log(`Deleted ${result.deletedCount} expired URLs.`);
    } catch (error) {
      console.error('Error deleting expired URLs:', error);
    }
  };

export default deleteExpiredURLs;