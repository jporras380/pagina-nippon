import PromoModal from "../components/PromoModal";
import HeroSlider from "../components/HeroSlider";
import CategoriesSection from "../components/CategoriesSection";
import BrandsSection from "../components/BrandsSection";

export default function Home() {
  return (
    <main className="bg-black min-h-screen font-sans">
      <PromoModal />
      <HeroSlider />
      <CategoriesSection />   {/* ← NUEVO */}
      <BrandsSection />
    </main>
  );
}