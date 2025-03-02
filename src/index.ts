import { scheduleRecurringJob, startWorker } from "./services/redisService";

async function main() {
  await scheduleRecurringJob();
  await startWorker();
}

main().catch(console.error);