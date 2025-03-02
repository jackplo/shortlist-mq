import Redis from "ioredis";

const connection = new Redis({ maxRetriesPerRequest: null });

export default connection;