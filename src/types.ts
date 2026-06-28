export interface Launch {
  id: string;
  name: string;
  net: string;
  status: { name: string; abbrev: string };
  image: { image_url: string } | null;
  pad: {
    name: string;
    latitude: string;
    longitude: string;
    location: { name: string };
    map_url: string | null;
  };
  mission: {
    name: string;
    description: string;
    type: string;
    orbit: { name: string } | null;
  } | null;
  rocket: {
    configuration: {
      name: string;
      family: string;
    };
  };
  launch_service_provider: {
    name: string;
    country_code: string;
  };
  distance?: number;
}

export interface LaunchResponse {
  count: number;
  results: Launch[];
}
