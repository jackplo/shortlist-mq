import { DBRestaurant } from "../models/DBrestaurant";
import { supabase } from "../supabaseClient";

export const insertIntoDatabase = async (restaurants: DBRestaurant[]) => {
  try {
    const { data, error } = await supabase.from("restaurants_new").upsert(restaurants);

    if (error) {
      throw error;
    }

    console.log(`Inserted ${restaurants.length} restaurants into the database.`)
  } catch (error) {
    console.error("Error inserting restaurants into database:", error)
  }
}