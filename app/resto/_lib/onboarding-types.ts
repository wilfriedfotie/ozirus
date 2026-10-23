export interface GeoPosition {
  lat: number;
  lng: number;
}

export interface RestaurantSite {
  id: string;
  name: string;
  imageUrl: string | null;
  countryCode: string;
  city: string;
  address: string;
  position: GeoPosition | null;
  isMain?: boolean;
}

export interface TeamInvite {
  id: string;
  name: string;
  phone: string;
  role: "manager" | "cuisine" | "livraison";
  siteId: string | "all";
}

export interface Dish {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  siteId: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: string;
  threshold: string;
  siteId: string;
}

export interface OnboardingData {
  restaurantName: string;
  logoUrl: string | null;
  countryCode: string;
  city: string;
  address: string;
  position: GeoPosition | null;
  whatsappNumber: string;
  sites: RestaurantSite[];
  dishes: Dish[];
  stockItems: StockItem[];
  plan: "starter" | "pro" | "business";
  team: TeamInvite[];
}

export const ROLE_LABELS: Record<TeamInvite["role"], string> = {
  manager: "Manager",
  cuisine: "Cuisine",
  livraison: "Livraison",
};

export const MAIN_SITE_ID = "main";
