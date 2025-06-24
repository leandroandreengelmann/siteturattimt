"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";

interface Subcategoria {
  id: number;
  nome: string;
  descricao: string;
  categoria_id: number;
  ativo: boolean;
  categorias: {
    id: number;
    nome: string;
  };
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  promocao_mes?: boolean;
  preco_promocao?: number;
  imagem_principal?: string;
  subcategoria_id: number;
  status: string;
}

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
    return "/placeholder-product.jpg";
  }

  if (caminhoImagem.startsWith("http")) {
    return caminhoImagem;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = "produtos";

  if (!baseUrl) {
    return "/placeholder-product.jpg";
  }

  const path = caminhoImagem.startsWith("/")
    ? caminhoImagem.substring(1)
    : caminhoImagem;

  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const abreviarNomeProduto = (nome: string): string => {
  const palavras = nome.split(" ");
  const primeiras4 = palavras.slice(0, 4);
  return primeiras4.join(" ");
};

async function getSubcategoria(id: string): Promise<Subcategoria | null> {
  try {
    const response = await fetch(`/api/subcategorias/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Erro na API subcategorias: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    return data.subcategoria || null;
  } catch (error) {
    console.error("Erro ao carregar subcategoria:", error);
    return null;
  }
}

async function getProdutos(subcategoriaId: string): Promise<Produto[]> {
  try {
    const response = await fetch(
      `/api/produtos?subcategoria=${subcategoriaId}&status=ativo&limit=100`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Erro na API produtos: ${response.status} ${response.statusText}`
      );
      throw new Error("Erro ao buscar produtos");
    }

    const data = await response.json();
    return data.produtos || [];
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }
}

export default function SubcategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [subcategoria, setSubcategoria] = useState<Subcategoria | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcategoriaData, produtosData] = await Promise.all([
          getSubcategoria(resolvedParams.id),
          getProdutos(resolvedParams.id),
        ]);

        if (!subcategoriaData) {
          notFound();
          return;
        }

        setSubcategoria(subcategoriaData);
        setProdutos(produtosData);
        setTotalProdutos(produtosData.length);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando subcategoria...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!subcategoria) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Início
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/categorias/${subcategoria.categoria_id}`}
                className="hover:text-blue-600 transition-colors capitalize"
              >
                {subcategoria.categorias.nome}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{subcategoria.nome}</li>
          </ol>
        </nav>

        {/* Cabeçalho da subcategoria */}
        <div className="mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {subcategoria.nome}
              </h1>
              {subcategoria.descricao && (
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-4">
                  {subcategoria.descricao}
                </p>
              )}
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  {totalProdutos} produto{totalProdutos !== 1 ? "s" : ""}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {subcategoria.categorias.nome}
                </span>
              </div>
            </div>
          </div>

          {/* Filtros e ordenação */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                Todos
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors">
                Em Promoção
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors">
                Menor Preço
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors">
                Maior Preço
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Ordenar por:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Relevância</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Nome A-Z</option>
                <option>Nome Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de produtos */}
        {produtos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => {
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
                  key={produto.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  {/* Badge de desconto */}
                  {desconto > 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                        -{desconto}%
                      </span>
                    </div>
                  )}

                  {/* Imagem do produto */}
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <img
                      src={construirUrlImagem(produto.imagem_principal)}
                      alt={produto.nome}
                      className="w-full h-full object-cover transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>

                  {/* Informações do produto */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm leading-tight min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-300">
                      {abreviarNomeProduto(produto.nome)}
                    </h4>

                    <div className="space-y-2 mb-4">
                      {produto.promocao_mes && produto.preco_promocao ? (
                        <>
                          <div className="text-sm text-gray-500 line-through">
                            {formatarMoeda(produto.preco)}
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatarMoeda(produto.preco_promocao)}
                          </div>
                          <div className="text-sm font-semibold text-blue-500">
                            ↓ Economize{" "}
                            {formatarMoeda(
                              produto.preco - produto.preco_promocao
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-xl font-bold text-gray-900">
                          {formatarMoeda(produto.preco)}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/produtos/${produto.id}`}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm text-center"
                    >
                      Ver Produto
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Não há produtos disponíveis nesta subcategoria no momento.
            </p>
            <Link
              href={`/categorias/${subcategoria.categoria_id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Voltar para {subcategoria.categorias.nome}
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
