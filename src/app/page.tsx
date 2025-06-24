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
      {/* Header */}
      <Header />

      {/* Banner Carousel - totalmente integrado */}
      <BannerCarousel />

      {/* Seção de Boas-vindas */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Bem-vindo à <span className="text-blue-600">TurattiMT</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Sua loja especializada em materiais de construção, ferramentas e
              equipamentos profissionais. Encontre tudo o que precisa para seus
              projetos com a qualidade e confiança que você merece.
            </p>
          </div>
        </div>
      </section>

      {/* Produtos em Oferta */}
      <OffersCarousel />

      {/* Produtos de Tinta */}
      <TintasCarousel />

      {/* Produtos Elétricos */}
      <EletricosCarousel />

      {/* Novidades */}
      <NovidadesCarousel />

      {/* Footer */}
      <Footer />
    </div>
  );
}
