"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  tipo_tinta?: boolean;
  cor_rgb?: string;
  subcategorias?: {
    id: number;
    nome: string;
    categorias?: {
      id: number;
      nome: string;
    };
  };
}

// Função para criar placeholder SVG com tema de tinta
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

const abreviarNomeProduto = (nome: string): string => {
  const palavras = nome.split(" ");
  const primeiras4 = palavras.slice(0, 4);
  return primeiras4.join(" ");
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

export default function TintasCarousel() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const { handleImageLoad, getImageFit } = useImageFit();

  // Largura do card + gap para exatamente 5 produtos visíveis
  const cardWidth = 280; // 260px card + 20px gap para caber exatamente 5
  const visibleCards = 5; // Exatamente 5 cards por vez

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

  // Buscar produtos de tinta reais do banco de dados
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        console.log("Iniciando busca de produtos de tinta...");

        // Buscar produtos que tenham tipo_tinta=true OU que sejam de subcategorias relacionadas a tinta
        const response = await fetch("/api/produtos?tipo_tinta=true&limit=20");
        console.log(
          "Resposta da API tintas:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados de tintas recebidos:", data);

        if (data.produtos && data.produtos.length > 0) {
          setProdutos(data.produtos);
          console.log(`${data.produtos.length} produtos de tinta carregados`);
        } else {
          console.log(
            "Nenhum produto com tipo_tinta encontrado, buscando por nome..."
          );
          // Se não houver produtos com tipo_tinta, buscar por nome que contenha "tinta"
          const responseNome = await fetch("/api/produtos?limit=50");
          if (responseNome.ok) {
            const dataNome = await responseNome.json();

            if (dataNome.produtos) {
              const produtosTinta = dataNome.produtos.filter(
                (produto: Produto) =>
                  produto.nome.toLowerCase().includes("tinta") ||
                  produto.nome.toLowerCase().includes("verniz") ||
                  produto.nome.toLowerCase().includes("esmalte") ||
                  produto.nome.toLowerCase().includes("primer") ||
                  produto.nome.toLowerCase().includes("pintura")
              );

              setProdutos(produtosTinta.slice(0, 20));
              console.log(
                `${
                  produtosTinta.slice(0, 20).length
                } produtos de tinta encontrados por nome`
              );
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar produtos de tinta:", error);
        // Fallback: buscar produtos normais como última opção
        try {
          const fallbackResponse = await fetch("/api/produtos?limit=20");
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.produtos && fallbackData.produtos.length > 0) {
              setProdutos(fallbackData.produtos.slice(0, 10));
              console.log(
                `Fallback tintas: ${
                  fallbackData.produtos.slice(0, 10).length
                } produtos normais carregados`
              );
            }
          }
        } catch (fallbackError) {
          console.error("Erro no fallback tintas:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  // Auto-navegação infinita
  useEffect(() => {
    if (
      !isAutoPlaying ||
      produtosDuplicados.length <= visibleCards ||
      isHovered
    )
      return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Se chegou no final limitado, volta para o início
        if (prevIndex >= maxIndexLimitado) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3500); // Auto-navegação a cada 3.5 segundos (mais dinâmico)

    return () => clearInterval(interval);
  }, [
    produtosDuplicados.length,
    isAutoPlaying,
    maxIndex,
    visibleCards,
    maxIndexLimitado,
    isHovered,
  ]);

  // Atualizar posição do carrossel com easing mais suave
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
    setTimeout(() => setIsAutoPlaying(true), 6000); // Retoma auto-play após 6s
  };

  // Se não há produtos ou está carregando, não renderizar o componente
  if (isLoading || produtos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 animate-fade-in">
            🎨 Tintas e Vernizes
          </h2>
          <p className="text-gray-600 mt-2 animate-fade-in-delay">
            {produtos.length} produtos para dar vida aos seus projetos
          </p>
        </div>

        {/* Carrossel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Seta Esquerda */}
          {produtosDuplicados.length > visibleCards && (
            <button
              onClick={() => moveCarousel("prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-white hover:border-purple-400 hover:shadow-xl hover:scale-110 transition-all duration-300 group animate-slide-in-left opacity-80 hover:opacity-100"
              aria-label="Produtos anteriores"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300" />
            </button>
          )}

          {/* Seta Direita */}
          {produtosDuplicados.length > visibleCards && (
            <button
              onClick={() => moveCarousel("next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-white hover:border-purple-400 hover:shadow-xl hover:scale-110 transition-all duration-300 group animate-slide-in-right opacity-80 hover:opacity-100"
              aria-label="Próximos produtos"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300" />
            </button>
          )}

          {/* Carrossel Track Container */}
          <div className="overflow-hidden rounded-xl shadow-sm">
            <div
              ref={trackRef}
              className="flex gap-5 transition-all duration-700 ease-in-out"
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
                    className={`flex-shrink-0 h-[520px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 group cursor-pointer animate-fade-in-up flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-transparent hover:before:from-purple-500/5 hover:before:to-transparent before:transition-all before:duration-500`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      width: "260px",
                    }}
                  >
                    {/* Badge de Tinta */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        🎨 TINTA
                      </span>
                    </div>

                    {/* Badge de Desconto */}
                    {desconto > 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse-glow">
                          -{desconto}%
                        </span>
                      </div>
                    )}

                    {/* Imagem do Produto */}
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-purple-100 transition-all duration-500">
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
                      {/* Overlay sutil no hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-4 relative flex-1 flex flex-col min-h-0 group-hover:bg-gradient-to-b group-hover:from-transparent group-hover:to-purple-50/30 transition-all duration-500">
                      {/* Conteúdo Superior */}
                      <div>
                        {/* Título */}
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-sm leading-tight min-h-[2.5rem] group-hover:text-purple-700 transition-all duration-300 group-hover:scale-[1.02]">
                          {abreviarNomeProduto(produto.nome)}
                        </h3>

                        {/* Preços - Layout Padronizado */}
                        <div className="space-y-2 min-h-[4.5rem]">
                          {produto.promocao_mes && produto.preco_promocao ? (
                            <>
                              {/* Preço Antigo */}
                              <div className="text-sm text-gray-500 line-through transition-all duration-300 group-hover:text-gray-600">
                                {formatarMoeda(produto.preco)}
                              </div>

                              {/* Preço Novo */}
                              <div className="text-xl font-bold text-purple-600 transition-all duration-300 group-hover:text-purple-700 group-hover:scale-105">
                                {formatarMoeda(produto.preco_promocao)}
                              </div>

                              {/* Economia */}
                              <div className="text-sm font-semibold text-green-600 transition-all duration-300 group-hover:text-green-700">
                                ↓ Economize{" "}
                                {formatarMoeda(
                                  produto.preco - produto.preco_promocao
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="text-xl font-bold text-gray-900 transition-all duration-300 group-hover:text-purple-700 group-hover:scale-105">
                              {formatarMoeda(produto.preco)}
                            </div>
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
                        <Link
                          href={`/produtos/${produto.id}`}
                          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm text-center"
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

          {/* Indicadores de posição */}
          {produtosDuplicados.length > visibleCards && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.min(maxNavegacao, 9) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(Math.min(index, maxIndexLimitado));
                      setTimeout(() => setIsAutoPlaying(true), 6000);
                    }}
                    className={`carousel-indicator ${
                      index === currentIndex ? "active" : ""
                    }`}
                    style={{
                      background:
                        index === currentIndex
                          ? "linear-gradient(45deg, #8b5cf6, #7c3aed)"
                          : undefined,
                    }}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                )
              )}
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
