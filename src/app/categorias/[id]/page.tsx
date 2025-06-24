"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";

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

async function getCategoria(id: string): Promise<Categoria | null> {
  try {
    const response = await fetch(`/api/categorias/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Erro HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.categoria || null;
  } catch (error) {
    console.error("Erro ao carregar categoria:", error);
    // Verificar se é erro de conexão
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      console.error(
        "Erro de conexão: Verifique se o servidor da API está funcionando"
      );
    }
    return null;
  }
}

async function getSubcategorias(categoriaId: string): Promise<Subcategoria[]> {
  try {
    const response = await fetch(
      `/api/subcategorias?categoria=${categoriaId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Erro na API subcategorias: ${response.status} ${response.statusText}`
      );
      throw new Error("Erro ao buscar subcategorias");
    }

    const data = await response.json();
    return data.subcategorias || [];
  } catch (error) {
    console.error("Erro ao carregar subcategorias:", error);
    return [];
  }
}

async function getProdutosPorCategoria(
  categoriaId: string
): Promise<Produto[]> {
  try {
    const response = await fetch(
      `/api/produtos?categoria=${categoriaId}&limit=100`,
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

export default function CategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriaData = await getCategoria(resolvedParams.id);

        if (!categoriaData) {
          notFound();
          return;
        }

        setCategoria(categoriaData);

        const [subcategoriasData, produtosData] = await Promise.all([
          getSubcategorias(resolvedParams.id),
          getProdutosPorCategoria(resolvedParams.id),
        ]);

        setSubcategorias(subcategoriasData);
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  // Agrupar produtos por subcategoria
  const produtosPorSubcategoria = produtos.reduce((acc, produto) => {
    const subcategoriaId = produto.subcategoria_id;
    if (!acc[subcategoriaId]) {
      acc[subcategoriaId] = [];
    }
    acc[subcategoriaId].push(produto);
    return acc;
  }, {} as Record<number, Produto[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando categoria...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!categoria) {
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
                href="/categorias"
                className="hover:text-blue-600 transition-colors"
              >
                Categorias
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium capitalize">
              {categoria.nome}
            </li>
          </ol>
        </nav>

        {/* Cabeçalho da categoria */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 capitalize">
            {categoria.nome}
          </h1>
          {categoria.descricao && (
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {categoria.descricao}
            </p>
          )}
          <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
            <span>{subcategorias.length} subcategorias</span>
            <span>•</span>
            <span>{produtos.length} produtos</span>
          </div>
        </div>

        {/* Seções por subcategoria */}
        {subcategorias.map((subcategoria) => {
          const produtosSubcategoria =
            produtosPorSubcategoria[subcategoria.id] || [];

          if (produtosSubcategoria.length === 0) return null;

          return (
            <section key={subcategoria.id} className="mb-16">
              {/* Cabeçalho da subcategoria */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {subcategoria.nome}
                  </h2>
                  {subcategoria.descricao && (
                    <p className="text-gray-600">{subcategoria.descricao}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {produtosSubcategoria.length} produto
                    {produtosSubcategoria.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Link
                  href={`/subcategorias/${subcategoria.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
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

              {/* Grid de produtos da subcategoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produtosSubcategoria.slice(0, 8).map((produto) => {
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
                        <h3 className="font-bold text-gray-900 mb-3 text-sm leading-tight min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-300">
                          {abreviarNomeProduto(produto.nome)}
                        </h3>

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

                        <button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                          onClick={() => {
                            console.log(
                              `Ver produto: ${produto.nome} - ID: ${produto.id}`
                            );
                          }}
                        >
                          Ver Produto
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mostrar mais produtos se houver */}
              {produtosSubcategoria.length > 8 && (
                <div className="mt-6 text-center">
                  <Link
                    href={`/subcategorias/${subcategoria.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver mais {produtosSubcategoria.length - 8} produtos de{" "}
                    {subcategoria.nome}
                    <svg
                      className="w-4 h-4 ml-1"
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
              )}
            </section>
          );
        })}

        {/* Caso não haja produtos */}
        {produtos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Não há produtos disponíveis nesta categoria no momento.
            </p>
            <Link
              href="/categorias"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Ver outras categorias
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
