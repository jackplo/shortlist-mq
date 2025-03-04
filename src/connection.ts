import Redis from "ioredis";

const connection = process.env.DEV_MODE === "TRUE" 
  ? new Redis({ maxRetriesPerRequest: null }) 
  : new Redis(parseInt(process.env.REDIS_PORT!), process.env.REDIS_URL!, { maxRetriesPerRequest: null });
  
export default connection;