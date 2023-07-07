/* eslint-disable no-prototype-builtins */
import axios from "axios";

const API_KEY = import.meta.env.API_KEY;
// symbol api key
const BASE_URL = import.meta.env.BASE_URL;
let isFetchingData = false;

export const getHistoricalDataBySymbol = async (symbol) => {
    if (isFetchingData) {
        // If a request is already in progress, wait until it completes
        await new Promise((resolve) => setTimeout(resolve, 100));
        return getHistoricalDataBySymbol(symbol); // Retry the request after waiting
    }
    try {
        isFetchingData = true;
        console.log("starting getHistoricalDataBySymbol");
        const { data } = await axios.get(BASE_URL + API_KEY +
            `&function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${symbol}`);
        if (data.hasOwnProperty("Time Series (Daily)")) {
            console.log("ending getHistoricalDataBySymbol");
            return data["Time Series (Daily)"];
        }
        console.log("ending getHistoricalDataBySymbol without data");
        return data;
    }
    finally {
        isFetchingData = false;
    }
};
