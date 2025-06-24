"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}

interface Subcategoria {
  id: number;
  nome: string;
  descricao: string;
  categoria_id: number;
  ativo: boolean;
  categorias: Categoria;
  produtos_count?: number;
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

async function getSubcategorias(): Promise<Subcategoria[]> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/subcategorias`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar subcategorias");
    }

    const data = await response.json();
    return data.subcategorias || [];
  } catch (error) {
    console.error("Erro ao carregar subcategorias:", error);
    return [];
  }
}

async function getProdutosPorSubcategoria(
  subcategoriaId: number
): Promise<Produto[]> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/produtos?subcategoria=${subcategoriaId}&limit=8`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const data = await response.json();
    return data.produtos || [];
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }
}

export default function SubcategoriasPage() {
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [produtosPorSubcategoria, setProdutosPorSubcategoria] = useState<
    Record<number, Produto[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcategoriasData = await getSubcategorias();
        setSubcategorias(subcategoriasData);

        // Buscar produtos para cada subcategoria
        const produtosPromises = subcategoriasData.map(async (subcategoria) => {
          const produtos = await getProdutosPorSubcategoria(subcategoria.id);
          return { subcategoriaId: subcategoria.id, produtos };
        });

        const produtosResults = await Promise.all(produtosPromises);
        const produtosMap = produtosResults.reduce(
          (acc, { subcategoriaId, produtos }) => {
            acc[subcategoriaId] = produtos;
            return acc;
          },
          {} as Record<number, Produto[]>
        );

        setProdutosPorSubcategoria(produtosMap);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar subcategorias por categoria
  const subcategoriasPorCategoria = subcategorias.reduce(
    (acc, subcategoria) => {
      const categoriaId = subcategoria.categoria_id;
      if (!acc[categoriaId]) {
        acc[categoriaId] = {
          categoria: subcategoria.categorias,
          subcategorias: [],
        };
      }
      acc[categoriaId].subcategorias.push(subcategoria);
      return acc;
    },
    {} as Record<
      number,
      { categoria: Categoria; subcategorias: Subcategoria[] }
    >
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando subcategorias...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
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
            <li className="text-gray-900 font-medium">Categorias</li>
          </ol>
        </nav>

        {/* Título da página */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Todas as Categorias
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Explore nossa ampla variedade de produtos organizados por categoria
            e subcategoria
          </p>
          <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
            <span>
              {Object.keys(subcategoriasPorCategoria).length} categorias
            </span>
            <span>•</span>
            <span>{subcategorias.length} subcategorias</span>
            <span>•</span>
            <span>
              {Object.values(produtosPorSubcategoria).reduce(
                (total, produtos) => total + produtos.length,
                0
              )}{" "}
              produtos em destaque
            </span>
          </div>
        </div>

        {/* Seções por categoria */}
        {Object.keys(subcategoriasPorCategoria).length > 0 ? (
          <div className="space-y-16">
            {Object.values(subcategoriasPorCategoria).map(
              ({ categoria, subcategorias: subcategoriasGrupo }) => (
                <section
                  key={categoria.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Cabeçalho da categoria */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/categorias/${categoria.id}`}
                          className="group inline-block"
                        >
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 capitalize">
                            {categoria.nome}
                          </h2>
                        </Link>
                        {categoria.descricao && (
                          <p className="text-gray-600 text-lg leading-relaxed">
                            {categoria.descricao}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {subcategoriasGrupo.length} subcategoria
                          {subcategoriasGrupo.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Link
                        href={`/categorias/${categoria.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                      >
                        <span>Ver Categoria</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Subcategorias com produtos */}
                  <div className="p-8 space-y-12">
                    {subcategoriasGrupo.map((subcategoria) => {
                      const produtos =
                        produtosPorSubcategoria[subcategoria.id] || [];

                      return (
                        <div
                          key={subcategoria.id}
                          className="border-b border-gray-100 last:border-b-0 pb-12 last:pb-0"
                        >
                          {/* Cabeçalho da subcategoria */}
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <Link
                                href={`/subcategorias/${subcategoria.id}`}
                                className="group inline-block"
                              >
                                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                  {subcategoria.nome}
                                </h3>
                              </Link>
                              {subcategoria.descricao && (
                                <p className="text-gray-600">
                                  {subcategoria.descricao}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                {produtos.length} produto
                                {produtos.length !== 1 ? "s" : ""} em destaque
                              </p>
                            </div>
                            <Link
                              href={`/subcategorias/${subcategoria.id}`}
                              className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            >
                              <span>Ver Todos</span>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          </div>

                          {/* Grid de produtos */}
                          {produtos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {produtos.map((produto) => {
                                const desconto =
                                  produto.promocao_mes && produto.preco_promocao
                                    ? Math.round(
                                        ((produto.preco -
                                          produto.preco_promocao) /
                                          produto.preco) *
                                          100
                                      )
                                    : 0;

                                return (
                                  <div
                                    key={produto.id}
                                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
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
                                    <div className="aspect-square bg-white relative overflow-hidden">
                                      <img
                                        src={construirUrlImagem(
                                          produto.imagem_principal
                                        )}
                                        alt={produto.nome}
                                        className="w-full h-full object-cover transition-all duration-300"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/placeholder-product.jpg";
                                        }}
                                      />
                                    </div>

                                    {/* Informações do produto */}
                                    <div className="p-4">
                                      <h4 className="font-bold text-gray-900 mb-3 text-sm leading-tight min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-300">
                                        {abreviarNomeProduto(produto.nome)}
                                      </h4>

                                      <div className="space-y-2 mb-4">
                                        {produto.promocao_mes &&
                                        produto.preco_promocao ? (
                                          <>
                                            <div className="text-sm text-gray-500 line-through">
                                              {formatarMoeda(produto.preco)}
                                            </div>
                                            <div className="text-xl font-bold text-blue-600">
                                              {formatarMoeda(
                                                produto.preco_promocao
                                              )}
                                            </div>
                                            <div className="text-sm font-semibold text-blue-500">
                                              ↓ Economize{" "}
                                              {formatarMoeda(
                                                produto.preco -
                                                  produto.preco_promocao
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
                            <div className="text-center py-8">
                              <div className="text-4xl mb-3">📦</div>
                              <p className="text-gray-500">
                                Nenhum produto disponível nesta subcategoria
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma subcategoria encontrada
            </h3>
            <p className="text-gray-500">
              As subcategorias serão exibidas aqui quando estiverem disponíveis.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
