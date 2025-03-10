import axios, { AxiosResponse } from "axios";
import ABCResponse from "./models/ABCResponse";

export const pullData = async (index: number) => {
    const url = "https://a816-health.nyc.gov/ABCEatsRestaurants/App/GetEntitiesByBoro/Manhattan"

    let dataForUpload: { data: ABCResponse[], lastIndex: number } = { data: [], lastIndex: index};

    await axios.get(url)
        .then((response: AxiosResponse<ABCResponse[]>) => {
            const allRestaurants = response.data;
            let lastIndex = index;
            let count = 0;

            // Last index logic needs to be revisited
            const validRestaurants = allRestaurants
            .slice(index)
            .filter((restaurant: ABCResponse, idx) => {
                if (count >= 100) return false;

                const isValid = restaurant.Grade === "A" || restaurant.Grade === "B" || restaurant.Grade === "Pending";

                if (!isValid) {
                    return false;
                }

                lastIndex = idx + index;
                count++;

                return restaurant;
            })
            .slice(0, parseInt(process.env.BATCH_SIZE!));

            dataForUpload =  { data: validRestaurants, lastIndex };
        })
        .catch((error) => {
            console.error("Failed to fetch data:", error);
            dataForUpload = { data: [], lastIndex: index };
        })

    return dataForUpload;
}