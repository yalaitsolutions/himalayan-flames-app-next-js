import MenuClient from "@/components/MenuClient";
import { getMenuSections } from "@/lib/data";
import "@/styles/menu.css";

// Reads the menu from MongoDB at request time.
export const dynamic = "force-dynamic";

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
