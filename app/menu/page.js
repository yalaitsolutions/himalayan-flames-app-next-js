import MenuClient from "@/components/MenuClient";
import { getMenuSections } from "@/lib/data";
import "@/styles/menu.css";

// Cache menu for 60 seconds, then revalidate. Admin saves trigger immediate revalidation.
export const revalidate = 60;

export const metadata = {
  title: "Menu | Himalayan Flames",
  description: "Authentic flavors of Nepal & India — explore our full menu.",
};

export default async function MenuPage() {
  let sections = [];
  try {
    sections = await getMenuSections();
  } catch {
    sections = [];
  }
  return <MenuClient sections={sections} />;
}
