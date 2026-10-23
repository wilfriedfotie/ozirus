import type { OnboardingData } from "@/app/resto/_lib/onboarding-types";
import { MAIN_SITE_ID } from "@/app/resto/_lib/onboarding-types";
import { DEMO_LOGO } from "@/app/resto/_lib/demo-images";
import { DEMO_DISH_PHOTOS, DEMO_SITE_PHOTOS } from "@/app/resto/_lib/demo-photos";

const SITE_YAOUNDE = "site-yaounde";
const SITE_BAFOUSSAM = "site-bafoussam";

export const DEMO_ONBOARDING_DATA: OnboardingData = {
  restaurantName: "Chez Ozirus",
  logoUrl: DEMO_LOGO,
  countryCode: "CM",
  city: "Douala",
  address: "Rue Njo-Njo, Bonapriso",
  position: { lat: 4.0287, lng: 9.7 },
  whatsappNumber: "690 12 34 56",
  sites: [
    {
      id: SITE_YAOUNDE,
      name: "Chez Ozirus — Bastos",
      imageUrl: DEMO_SITE_PHOTOS.yaounde,
      countryCode: "CM",
      city: "Yaoundé",
      address: "Avenue des Banques, Bastos",
      position: { lat: 3.888, lng: 11.5021 },
    },
    {
      id: SITE_BAFOUSSAM,
      name: "Chez Ozirus — Centre-ville",
      imageUrl: DEMO_SITE_PHOTOS.bafoussam,
      countryCode: "CM",
      city: "Bafoussam",
      address: "Marché A, Centre-ville",
      position: { lat: 5.4737, lng: 10.4179 },
    },
  ],
  dishes: [
    { id: "dish-1", name: "Poulet DG", price: "6500", imageUrl: DEMO_DISH_PHOTOS.pouletDG, siteId: MAIN_SITE_ID },
    { id: "dish-2", name: "Ndolé + plantain", price: "4500", imageUrl: DEMO_DISH_PHOTOS.ndole, siteId: MAIN_SITE_ID },
    { id: "dish-3", name: "Brochettes de bœuf", price: "3000", imageUrl: DEMO_DISH_PHOTOS.brochettes, siteId: MAIN_SITE_ID },
    { id: "dish-4", name: "Eru + water fufu", price: "4000", imageUrl: DEMO_DISH_PHOTOS.eru, siteId: SITE_YAOUNDE },
    { id: "dish-5", name: "Poisson braisé", price: "5500", imageUrl: DEMO_DISH_PHOTOS.poisson, siteId: SITE_YAOUNDE },
    { id: "dish-6", name: "Jus de gingembre", price: "1000", imageUrl: DEMO_DISH_PHOTOS.jusGingembre, siteId: SITE_BAFOUSSAM },
  ],
  stockItems: [
    { id: "stock-1", name: "Poulet entier", quantity: "14", threshold: "10", siteId: MAIN_SITE_ID },
    { id: "stock-2", name: "Huile de palme (L)", quantity: "10", threshold: "5", siteId: MAIN_SITE_ID },
    { id: "stock-3", name: "Feuilles de ndolé (kg)", quantity: "8", threshold: "4", siteId: SITE_YAOUNDE },
    { id: "stock-4", name: "Poisson frais (kg)", quantity: "12", threshold: "6", siteId: SITE_YAOUNDE },
    { id: "stock-5", name: "Gingembre frais (kg)", quantity: "5", threshold: "2", siteId: SITE_BAFOUSSAM },
  ],
  plan: "pro",
  team: [
    { id: "team-1", name: "Marie Kamga", phone: "677 11 22 33", role: "manager", siteId: "all" },
    { id: "team-2", name: "Alain Biya", phone: "655 22 33 44", role: "cuisine", siteId: MAIN_SITE_ID },
    { id: "team-3", name: "Josué Tchoua", phone: "699 33 44 55", role: "livraison", siteId: SITE_YAOUNDE },
    { id: "team-4", name: "Rosine Ngo", phone: "677 44 55 66", role: "cuisine", siteId: SITE_BAFOUSSAM },
  ],
};
