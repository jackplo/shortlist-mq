import ABCResponse from "../models/ABCResponse";
import axios, { AxiosResponse } from "axios";
import { Place } from "../models/place";
import { primaryTypes } from "../constants/primaryTypes";
import { generateDescription } from "./descriptionService";
import { DBRestaurant } from "../models/DBrestaurant";

export const getPlaceDetailsWithTextSearch = async (restaurant: ABCResponse) => {
  try {
    const url = "https://places.googleapis.com/v1/places:searchText";
    const PADDING = 0.0072;
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const query = `${restaurant.EntityName}, ${restaurant.MostRecentVendingLocation}, ${restaurant.MostRecentVendingBoro}, NY ${restaurant.MostRecentZipCode}`;

    const requestBody = {
      textQuery: query,
      locationRestriction: {
        rectangle: {
          low: {
            latitude: restaurant.MostRecent_Latitude - PADDING,
            longitude: restaurant.MostRecent_Longitude - PADDING,
          },
          high: {
            latitude: restaurant.MostRecent_Latitude + PADDING,
            longitude: restaurant.MostRecent_Longitude + PADDING,
          },
        },
      },
    };

    const fieldMask =
      "places.displayName,places.formattedAddress,places.types,places.primaryType,places.editorialSummary,places.addressComponents,places.id";

    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": fieldMask,
      },
    });

    if (!response.data.places || response.data.places.length === 0) {
      console.log("No places found for query:", query);
      return null;
    }

    const place: Place = response.data.places[0];

    if (!primaryTypes.includes(place.primaryType)) {
      console.log("Primary type not of valid type:", place.primaryType);
      return null;
    }

    const description = place.editorialSummary ? await generateDescription(
      place.editorialSummary?.text,
      place.primaryType,
      place.types
    ) : "NO_DESC";

    const restaurantForUpload: DBRestaurant = {
      place_id: place.id,
      name: restaurant.EntityName,
      street: restaurant.MostRecentVendingLocation,
      city: restaurant.MostRecentVendingBoro,
      state: "NY",
      zipCode: restaurant.MostRecentZipCode,
      formattedAddress: place.formattedAddress,
      latitude: restaurant.MostRecent_Latitude,
      longitude: restaurant.MostRecent_Longitude,
      cuisine: restaurant.Cuisine,
      description: description || "NO_DESC",
      grade: restaurant.Grade,
    };

    console.log(restaurantForUpload)

    return restaurantForUpload;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}