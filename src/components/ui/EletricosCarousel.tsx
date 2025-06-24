"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "./CountdownTimer";

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const construirUrlImagem = (
  caminhoImagem: string | null | undefined
): string => {
  if (!caminhoImagem) {
    return createPlaceholderDataUrl();
  }

  if (caminhoImagem.startsWith("http")) {
    return caminhoImagem;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = "produtos";

  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_SUPABASE_URL não definida");
    return createPlaceholderDataUrl();
  }

  const path = caminhoImagem.startsWith("/")
    ? caminhoImagem.substring(1)
    : caminhoImagem;

  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

interface Produto {
  id: number;
  nome: string;
  preco: number;
  promocao_mes?: boolean;
  preco_promocao?: number;
  imagem_principal?: string;
  promocao_data_fim?: string;
  tipo_eletrico?: boolean;
  voltagem?: string;
  subcategorias?: {
    id: number;
    nome: string;
    categorias?: {
      id: number;
      nome: string;
    };
  };
}

const createPlaceholderDataUrl = () => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f8f9fa"/>
      <defs>
        <linearGradient id="turattiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="35" fill="url(#turattiGradient)" opacity="0.1"/>
      <circle cx="60" cy="130" r="20" fill="url(#turattiGradient)" opacity="0.08"/>
      <circle cx="140" cy="130" r="25" fill="url(#turattiGradient)" opacity="0.08"/>
      <text x="100" y="105" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="url(#turattiGradient)" text-anchor="middle">TURATTI</text>
      <text x="100" y="125" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">Material de Construção</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const ajustarImagemNoCampo = () => {
  return "object-cover";
};

const abreviarNomeProduto = (nome: string): string => {
  const palavras = nome.split(" ");
  const primeiras4 = palavras.slice(0, 4);
  return primeiras4.join(" ");
};

const useImageFit = () => {
  const [imageFits, setImageFits] = useState<{ [key: string]: string }>({});

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement>,
    productId: number
  ) => {
    const fitClass = ajustarImagemNoCampo();

    setImageFits((prev) => ({
      ...prev,
      [productId]: fitClass,
    }));
  };

  const getImageFit = (productId: number) => {
    return imageFits[productId] || "object-contain";
  };

  return { handleImageLoad, getImageFit };
};

export default function EletricosCarousel() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const { handleImageLoad, getImageFit } = useImageFit();

  const cardWidth = 280;
  const visibleCards = 5;

  const produtosDuplicados = React.useMemo(() => {
    if (produtos.length === 0) return [];

    // Se temos poucos produtos (menos de 4), não duplicar
    // Apenas mostrar os produtos reais
    if (produtos.length < 4) {
      return produtos;
    }

    // Só duplicar se temos produtos suficientes para justificar um carrossel infinito
    const minProdutos = visibleCards * 2;
    let produtosParaExibir = [...produtos];

    while (produtosParaExibir.length < minProdutos) {
      produtosParaExibir = [...produtosParaExibir, ...produtos];
    }

    return produtosParaExibir;
  }, [produtos, visibleCards]);

  const maxIndex = Math.max(0, produtosDuplicados.length - visibleCards);
  const maxNavegacao = Math.min(maxIndex + 1, 9);
  const maxIndexLimitado = maxNavegacao - 1;

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/api/produtos?tipo_eletrico=true&limit=20"
        );
        const data = await response.json();

        if (data.produtos && data.produtos.length > 0) {
          setProdutos(data.produtos);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos elétricos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    if (
      !isAutoPlaying ||
      produtos.length < 4 ||
      produtosDuplicados.length <= visibleCards ||
      isHovered
    )
      return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndexLimitado) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [
    produtos.length,
    produtosDuplicados.length,
    isAutoPlaying,
    maxIndex,
    visibleCards,
    maxIndexLimitado,
    isHovered,
  ]);

  useEffect(() => {
    if (trackRef.current) {
      const translateX = currentIndex * cardWidth;
      trackRef.current.style.transform = `translateX(-${translateX}px)`;
    }
  }, [currentIndex, cardWidth]);

  const moveCarousel = (direction: "prev" | "next") => {
    let newIndex = currentIndex;

    if (direction === "next") {
      newIndex = currentIndex >= maxIndexLimitado ? 0 : currentIndex + 1;
    } else if (direction === "prev") {
      newIndex = currentIndex <= 0 ? maxIndexLimitado : currentIndex - 1;
    }

    setIsAutoPlaying(false);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  if (isLoading || produtos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 animate-fade-in">
            ⚡ Ferramentas Elétricas
          </h2>
          <p className="text-gray-600 mt-2 animate-fade-in-delay">
            {produtos.length} ferramentas profissionais para seus projetos
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {produtos.length >= 4 && produtosDuplicados.length > visibleCards && (
            <button
              onClick={() => moveCarousel("prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-white hover:border-orange-400 hover:shadow-xl hover:scale-110 transition-all duration-300 group animate-slide-in-left opacity-80 hover:opacity-100"
              aria-label="Produtos anteriores"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300" />
            </button>
          )}

          {produtos.length >= 4 && produtosDuplicados.length > visibleCards && (
            <button
              onClick={() => moveCarousel("next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-white hover:border-orange-400 hover:shadow-xl hover:scale-110 transition-all duration-300 group animate-slide-in-right opacity-80 hover:opacity-100"
              aria-label="Próximos produtos"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300" />
            </button>
          )}

          <div className="overflow-hidden rounded-xl shadow-sm">
            <div
              ref={trackRef}
              className={`flex gap-5 transition-all duration-700 ease-in-out ${
                produtos.length < 4 ? "justify-center" : ""
              }`}
              style={{
                width:
                  produtos.length < 4
                    ? "auto"
                    : `${produtosDuplicados.length * cardWidth}px`,
              }}
            >
              {produtosDuplicados.map((produto, index) => {
                const desconto =
                  produto.promocao_mes && produto.preco_promocao
                    ? Math.round(
                        ((produto.preco - produto.preco_promocao) /
                          produto.preco) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={`${produto.id}-${index}`}
                    className={`flex-shrink-0 h-[520px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 group cursor-pointer animate-fade-in-up flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-transparent hover:before:from-orange-500/5 hover:before:to-transparent before:transition-all before:duration-500`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      width: "260px",
                    }}
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        ⚡ ELÉTRICO
                      </span>
                    </div>

                    {produto.voltagem && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce-in">
                          {produto.voltagem}
                        </span>
                      </div>
                    )}

                    {desconto > 0 && (
                      <div className="absolute top-12 right-3 z-10">
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse-glow">
                          -{desconto}%
                        </span>
                      </div>
                    )}

                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-orange-100 transition-all duration-500">
                      <img
                        src={construirUrlImagem(produto.imagem_principal)}
                        alt={produto.nome}
                        className={`w-full h-full ${getImageFit(
                          produto.id
                        )} transition-all duration-500 group-hover:scale-105`}
                        onLoad={(e) => handleImageLoad(e, produto.id)}
                        onError={(e) => {
                          e.currentTarget.src = createPlaceholderDataUrl();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>

                    <div className="p-4 relative flex-1 flex flex-col min-h-0 group-hover:bg-gradient-to-b group-hover:from-transparent group-hover:to-orange-50/30 transition-all duration-500">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-sm leading-tight min-h-[2.5rem] group-hover:text-orange-700 transition-all duration-300 group-hover:scale-[1.02]">
                          {abreviarNomeProduto(produto.nome)}
                        </h3>

                        <div className="space-y-2 min-h-[4.5rem]">
                          {produto.promocao_mes && produto.preco_promocao ? (
                            <>
                              <div className="text-sm text-gray-500 line-through transition-all duration-300 group-hover:text-gray-600">
                                {formatarMoeda(produto.preco)}
                              </div>
                              <div className="text-xl font-bold text-orange-600 transition-all duration-300 group-hover:text-orange-700 group-hover:scale-105">
                                {formatarMoeda(produto.preco_promocao)}
                              </div>
                              <div className="text-sm font-semibold text-green-600 transition-all duration-300 group-hover:text-green-700">
                                ↓ Economize{" "}
                                {formatarMoeda(
                                  produto.preco - produto.preco_promocao
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="text-xl font-bold text-gray-900 transition-all duration-300 group-hover:text-orange-700 group-hover:scale-105">
                              {formatarMoeda(produto.preco)}
                            </div>
                          )}
                        </div>

                        <div className="min-h-[3rem] flex items-center justify-center mt-2 mb-0">
                          {produto.promocao_mes &&
                            produto.promocao_data_fim && (
                              <div className="w-full">
                                <CountdownTimer
                                  endDate={produto.promocao_data_fim}
                                  size="large"
                                />
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link
                          href={`/produtos/${produto.id}`}
                          className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm text-center"
                        >
                          Ver Produto
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {produtos.length >= 4 && produtosDuplicados.length > visibleCards && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxNavegacao }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(Math.min(index, maxIndexLimitado));
                    setTimeout(() => setIsAutoPlaying(true), 6000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-orange-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir para grupo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-10px) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(10px) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out 0.1s both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out both;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
