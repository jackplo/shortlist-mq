export interface DBRestaurant {
  place_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string
  formattedAddress: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  description: string;
  grade: string;
}