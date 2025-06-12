import Header from "@/components/ui/Header";
import BannerCarousel from "@/components/ui/BannerCarousel";
import OffersCarousel from "@/components/ui/OffersCarousel";
import TintasCarousel from "@/components/ui/TintasCarousel";
import NovidadesCarousel from "@/components/ui/NovidadesCarousel";
import EletricosCarousel from "@/components/ui/EletricosCarousel";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Offers Carousel */}
      <OffersCarousel />

      {/* Tintas Carousel */}
      <TintasCarousel />

      {/* Novidades Carousel */}
      <NovidadesCarousel />

      {/* Elétricos Carousel */}
      <EletricosCarousel />

      {/* Footer */}
      <Footer />
    </div>
  );
}
