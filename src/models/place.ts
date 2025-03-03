export interface Place {
  id: string;
  displayName: DisplayName;
  formattedAddress: string;
  addressComponents: AddressComponent[];
  location: {
    latitude: number;
    longitude: number;
  };
  googleMapsUri: string;
  types: string[];
  rating: number;
  websiteUri: string;
  regularOpeningHours: RegularOpeningHours;
  nationalPhoneNumber: string;
  primaryType: string;
  priceLevel: string;
  photos: Photo[];
  editorialSummary: { text: string; languageCode: string };
}

interface DisplayName {
  text: string,
  languageCode: string
}

interface RegularOpeningHours {
  openNow: boolean;
  periods: Period[];
}

interface Time {
  day: number;
  hour: number;
  minute: number;
}

interface Period {
  open: Time;
  close: Time; 
}

interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: Attribution[];
  flagContentUri: string;
  googleMapsUri: string;
}

interface Attribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}