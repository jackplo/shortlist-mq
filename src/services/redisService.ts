import { Queue, Worker } from "bullmq";
import connection from "../connection";
import { BATCH_SIZE, REDIS_KEY } from "../constants/constants";
import { pullData } from "../pullData";

const queue = new Queue('fetchData', { connection });
connection.set(REDIS_KEY, 0);

export const getSavedIndex: () => Promise<number> = async () => {
    const index = await connection.get(REDIS_KEY);
    return index ? parseInt(index) : 0;
}

export const saveIndex: (index: number) => Promise<void> = async (index: number) => {
    await connection.set(REDIS_KEY, index);
}

export const scheduleFetchJob: () => Promise<void> = async () => {
    let currentIndex = await getSavedIndex();

    console.log(`Starting from index ${currentIndex}...`);

    const { data, lastIndex } = await pullData(currentIndex);

    console.log(`Processed ${data.length} valid entries.`);
    //console.log(data)
    const newIndex = lastIndex;
    await saveIndex(newIndex);
}

export const scheduleRecurringJob = async () => {
    console.log("scheduling job")
    await queue.add('fetchData', {}, { repeat: { every: 1000 } });
};

export const startWorker = () => {
    console.log("starting worker")
    new Worker('fetchData', 
        async () => {
            await scheduleFetchJob();
        },
        { connection }
    );
};