"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Banner {
  id: number;
  titulo: string;
  descricao?: string;
  imagem_url: string;
  link_destino?: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Buscar banners da API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/banners");
        const data = await response.json();

        // Filtrar apenas banners ativos e ordenar
        const activeBanners = data
          .filter((banner: Banner) => banner.ativo)
          .sort((a: Banner, b: Banner) => a.ordem - b.ordem);

        setBanners(activeBanners);
      } catch (error) {
        console.error("Erro ao buscar banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-navegação
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  // Navegação manual
  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Retoma auto-play após 10s
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Retoma auto-play após 10s
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Retoma auto-play após 10s
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-200 rounded-full animate-pulse mb-4 mx-auto"></div>
            <p className="text-gray-500 font-medium">Carregando banners...</p>
          </div>
        </div>
      </div>
    );
  }

  // Sem banners
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-blue-50 to-blue-100 animate-fade-in">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum banner disponível
            </h3>
            <p className="text-gray-500">
              Os banners serão exibidos aqui quando estiverem ativos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-900 group animate-fade-in">
      {/* Banner Principal com transições suaves */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {banner.link_destino ? (
              <a
                href={banner.link_destino}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={banner.imagem_url}
                  alt=""
                  className="w-full h-full object-fill"
                />
              </a>
            ) : (
              <img
                src={banner.imagem_url}
                alt=""
                className="w-full h-full object-fill"
              />
            )}
          </div>
        ))}
      </div>

      {/* Controles de navegação */}
      {banners.length > 1 && (
        <>
          {/* Botões anterior/próximo */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100"
            aria-label="Banner anterior"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white stroke-2" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100"
            aria-label="Próximo banner"
          >
            <ChevronRightIcon className="w-6 h-6 text-white stroke-2" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                  index === currentIndex
                    ? "bg-white shadow-lg shadow-white/30"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Indicador de auto-play */}
      {banners.length > 1 && isAutoPlaying && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-1 group-hover:translate-y-0">
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 transition-all duration-300 ease-out hover:bg-black/40">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Auto</span>
          </div>
        </div>
      )}

      {/* Estilos para animações suaves */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
