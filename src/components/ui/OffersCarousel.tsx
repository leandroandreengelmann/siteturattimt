"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "./CountdownTimer";

// Função para formatar moeda no padrão brasileiro
const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

// Função para construir URL completa da imagem
const construirUrlImagem = (
  caminhoImagem: string | null | undefined
): string => {
  if (!caminhoImagem) return createPlaceholderDataUrl();

  // Se já é uma URL completa, retornar como está
  if (
    caminhoImagem.startsWith("http://") ||
    caminhoImagem.startsWith("https://")
  ) {
    return caminhoImagem;
  }

  // Se começa com /, remover para evitar barra dupla
  const caminho = caminhoImagem.startsWith("/")
    ? caminhoImagem.slice(1)
    : caminhoImagem;

  // Construir URL do storage do Supabase usando variável de ambiente
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = "produtos";

  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_SUPABASE_URL não definida");
    return createPlaceholderDataUrl();
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${caminho}`;
};

interface Produto {
  id: number;
  nome: string;
  preco: number;
  promocao_mes?: boolean;
  preco_promocao?: number;
  imagem_principal?: string;
  promocao_data_fim?: string;
  subcategorias?: {
    id: number;
    nome: string;
    categorias?: {
      id: number;
      nome: string;
    };
  };
}

// Função para criar placeholder SVG
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

// Função para ajustar imagem no campo automaticamente
const ajustarImagemNoCampo = () => {
  // Sempre usar object-cover para preencher todo o espaço sem deixar áreas vazias
  return "object-cover";
};

// Hook para gerenciar o ajuste dinâmico da imagem
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

export default function OffersCarousel() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const { handleImageLoad, getImageFit } = useImageFit();

  // Largura do card + gap
  const cardWidth = 296; // 256px card + 40px gap
  const visibleCards = 4; // Quantos cards mostrar por vez

  // Duplicar produtos se necessário para preencher o carrossel
  const produtosDuplicados = React.useMemo(() => {
    if (produtos.length === 0) return [];

    const minProdutos = visibleCards * 2; // Mínimo para navegação suave
    let produtosParaExibir = [...produtos];

    // Se temos menos produtos que o mínimo, duplicar até atingir
    while (produtosParaExibir.length < minProdutos) {
      produtosParaExibir = [...produtosParaExibir, ...produtos];
    }

    return produtosParaExibir;
  }, [produtos, visibleCards]);

  const maxIndex = Math.max(0, produtosDuplicados.length - visibleCards);

  // Limitar navegação a máximo 9 posições
  const maxNavegacao = Math.min(maxIndex + 1, 9);
  const maxIndexLimitado = maxNavegacao - 1;

  // Buscar produtos em promoção do banco
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/produtos?promocao=true&limit=20");
        const data = await response.json();

        if (data.produtos && data.produtos.length > 0) {
          setProdutos(data.produtos);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos em promoção:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  // Auto-navegação infinita
  useEffect(() => {
    if (!isAutoPlaying || produtosDuplicados.length <= visibleCards) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Se chegou no final limitado, volta para o início
        if (prevIndex >= maxIndexLimitado) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 4000); // Auto-navegação a cada 4 segundos

    return () => clearInterval(interval);
  }, [produtosDuplicados.length, isAutoPlaying, maxIndex, visibleCards]);

  // Atualizar posição do carrossel
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
    setTimeout(() => setIsAutoPlaying(true), 8000); // Retoma auto-play após 8s
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-80 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (produtos.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Principais ofertas para você
            </h2>
          </div>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma promoção ativa no momento
            </h3>
            <p className="text-gray-500">
              Volte em breve para conferir nossas ofertas especiais!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 animate-fade-in">
            Principais ofertas para você
          </h2>
          <p className="text-gray-600 mt-2 animate-fade-in-delay">
            {produtos.length} produtos em promoção especial
          </p>
        </div>

        {/* Carrossel Container */}
        <div className="relative">
          {/* Seta Esquerda */}
          {produtosDuplicados.length > visibleCards && (
            <button
              onClick={() => moveCarousel("prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group animate-slide-in-left"
              aria-label="Produtos anteriores"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            </button>
          )}

          {/* Seta Direita */}
          {produtosDuplicados.length > visibleCards && (
            <button
              onClick={() => moveCarousel("next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group animate-slide-in-right"
              aria-label="Próximos produtos"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            </button>
          )}

          {/* Carrossel Track Container */}
          <div className="overflow-hidden rounded-lg">
            <div
              ref={trackRef}
              className="flex gap-6 transition-transform duration-300 ease-out"
              style={{ width: `${produtosDuplicados.length * cardWidth}px` }}
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
                    className={`flex-shrink-0 w-64 h-[520px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer animate-fade-in-up flex flex-col`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Badge de Desconto */}
                    {desconto > 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          -{desconto}%
                        </span>
                      </div>
                    )}

                    {/* Imagem do Produto */}
                    <div className="aspect-square bg-gray-50 relative overflow-hidden flex-shrink-0">
                      <img
                        src={construirUrlImagem(produto.imagem_principal)}
                        alt={produto.nome}
                        className={`w-full h-full ${getImageFit(
                          produto.id
                        )} transition-all duration-300`}
                        onLoad={(e) => handleImageLoad(e, produto.id)}
                        onError={(e) => {
                          e.currentTarget.src = createPlaceholderDataUrl();
                        }}
                      />
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-4 relative flex-1 flex flex-col min-h-0">
                      {/* Conteúdo Superior */}
                      <div>
                        {/* Título */}
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-sm leading-tight min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-300">
                          {produto.nome}
                        </h3>

                        {/* Preços - Layout Padronizado */}
                        <div className="space-y-2 min-h-[4.5rem]">
                          {produto.promocao_mes && produto.preco_promocao ? (
                            <>
                              {/* Preço Antigo */}
                              <div className="text-sm text-gray-500 line-through">
                                {formatarMoeda(produto.preco)}
                              </div>

                              {/* Preço Novo */}
                              <div className="text-xl font-bold text-blue-600">
                                {formatarMoeda(produto.preco_promocao)}
                              </div>

                              {/* Economia */}
                              <div className="text-sm font-semibold text-blue-500">
                                ↓ Economize{" "}
                                {formatarMoeda(
                                  produto.preco - produto.preco_promocao
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Espaçamento para manter altura consistente */}
                              <div className="text-sm text-transparent">
                                R$ 00,00
                              </div>

                              {/* Preço Normal */}
                              <div className="text-xl font-bold text-gray-900">
                                {formatarMoeda(produto.preco)}
                              </div>

                              {/* Espaçamento inferior */}
                              <div className="text-sm text-transparent">
                                ↓ Economize R$ 0,00
                              </div>
                            </>
                          )}
                        </div>

                        {/* Contador Regressivo da Promoção - com altura fixa para padronização */}
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

                      {/* Botão Ver Produto - sempre na parte inferior */}
                      <div className="mt-auto">
                        <button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                          onClick={() => {
                            // TODO: Implementar navegação para página do produto
                            console.log(
                              `Ver produto: ${produto.nome} - ID: ${produto.id}`
                            );
                          }}
                        >
                          Ver Produto
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indicadores de posição - máximo 9 */}
          {produtosDuplicados.length > visibleCards && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxNavegacao }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(Math.min(index, maxIndexLimitado));
                    setTimeout(() => setIsAutoPlaying(true), 8000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-blue-600 scale-110"
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
      `}</style>
    </section>
  );
}
