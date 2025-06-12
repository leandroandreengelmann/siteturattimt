"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";

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
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Buscar banners da API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/banners");
        const data = await response.json();

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

  // Barra de progresso dinâmica
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1 || isHovered) {
      setProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5000ms / 100 = 50ms por incremento

    return () => clearInterval(progressInterval);
  }, [isAutoPlaying, banners.length, isHovered, currentIndex]);

  // Auto-navegação com progress
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1 || isHovered) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners.length, isAutoPlaying, isHovered]);

  // Navegação manual
  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
    setProgress(0);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
    setProgress(0);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setProgress(0);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setProgress(0);
  };

  // Touch handlers para mobile - melhorados
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 30; // Reduzido para ser mais sensível
    const isRightSwipe = distance < -30;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  // Loading state responsivo
  if (isLoading) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-blue-50 via-white to-blue-50 animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-200 rounded-full animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state responsivo
  if (banners.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-blue-50 via-gray-50 to-white">
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Principal - altamente responsivo */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 transform scale-100"
                : "opacity-0 transform scale-102"
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
                  alt={banner.titulo || "Promoção TurattiMT"}
                  className="w-full h-full object-cover"
                />

                {/* Overlay sutil - mais visível no mobile */}
                <div className="absolute inset-0 bg-black/10 sm:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>
            ) : (
              <div className="block w-full h-full">
                <img
                  src={banner.imagem_url}
                  alt={banner.titulo || "Promoção TurattiMT"}
                  className="w-full h-full object-cover"
                />

                {/* Overlay sutil - mais visível no mobile */}
                <div className="absolute inset-0 bg-black/10 sm:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles responsivos */}
      {banners.length > 1 && (
        <>
          {/* Botões laterais - otimizados para mobile */}
          <button
            onClick={goToPrevious}
            className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white/95 backdrop-blur-sm rounded-full transition-all duration-300 opacity-70 group-hover:opacity-100 shadow-md hover:shadow-lg flex items-center justify-center touch-manipulation"
            aria-label="Banner anterior"
          >
            <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white/95 backdrop-blur-sm rounded-full transition-all duration-300 opacity-70 group-hover:opacity-100 shadow-md hover:shadow-lg flex items-center justify-center touch-manipulation"
            aria-label="Próximo banner"
          >
            <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Play/Pause Control - escondido no mobile pequeno */}
          <button
            onClick={toggleAutoPlay}
            className="hidden sm:flex absolute top-2 sm:top-3 right-2 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 items-center justify-center touch-manipulation"
            aria-label={isAutoPlaying ? "Pausar" : "Reproduzir"}
          >
            {isAutoPlaying ? (
              <PauseIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            ) : (
              <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-0.5" />
            )}
          </button>

          {/* Barra de progresso responsiva */}
          {isAutoPlaying && (
            <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-black/20">
              <div
                className="h-full bg-blue-600 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Indicadores responsivos */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 touch-manipulation ${
                  index === currentIndex
                    ? "w-4 sm:w-6 h-1 sm:h-1.5 bg-white/95 rounded-full shadow-sm"
                    : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/60 hover:bg-white/80 rounded-full"
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Badge de auto-play - escondido no mobile pequeno */}
      {isAutoPlaying && banners.length > 1 && (
        <div className="hidden sm:block absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/20 backdrop-blur-sm rounded text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          AUTO
        </div>
      )}
    </div>
  );
}
