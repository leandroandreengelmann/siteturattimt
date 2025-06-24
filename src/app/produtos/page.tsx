"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import LojaVendedorPopup from "@/components/ui/LojaVendedorPopup";
import Link from "next/link";
import { useEffect, useState, use } from "react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  promocao_mes?: boolean;
  preco_promocao?: number;
  imagem_principal?: string;
  status: string;
  subcategorias?: {
    id: number;
    nome: string;
    categorias?: {
      id: number;
      nome: string;
    };
  };
}

interface Categoria {
  id: number;
  nome: string;
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

async function getProdutos(searchParams: URLSearchParams): Promise<Produto[]> {
  try {
    const params = new URLSearchParams();

    // Adicionar parâmetros de filtro
    if (searchParams.get("categoria")) {
      params.set("categoria", searchParams.get("categoria")!);
    }
    if (searchParams.get("subcategoria")) {
      params.set("subcategoria", searchParams.get("subcategoria")!);
    }
    if (searchParams.get("promocao")) {
      params.set("promocao", searchParams.get("promocao")!);
    }

    params.set("limit", "50");

    const response = await fetch(`/api/produtos?${params.toString()}`, {
      cache: "no-store",
    });

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

async function getCategoria(id: string): Promise<Categoria | null> {
  try {
    const response = await fetch(`/api/categorias/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.categoria || null;
  } catch (error) {
    console.error("Erro ao carregar categoria:", error);
    return null;
  }
}

export default function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const resolvedSearchParams = use(searchParams);
  const categoriaId = resolvedSearchParams.categoria as string;
  const isPromocao = resolvedSearchParams.promocao === "true";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlSearchParams = new URLSearchParams();

        // Converter resolvedSearchParams para URLSearchParams
        Object.entries(resolvedSearchParams).forEach(([key, value]) => {
          if (value && typeof value === "string") {
            urlSearchParams.set(key, value);
          }
        });

        const produtosData = await getProdutos(urlSearchParams);
        setProdutos(produtosData);

        // Buscar informações da categoria se especificada
        if (categoriaId) {
          const categoriaData = await getCategoria(categoriaId);
          setCategoria(categoriaData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedSearchParams, categoriaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
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
            {categoria ? (
              <>
                <li>
                  <Link
                    href="/categorias"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Categorias
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href={`/categorias/${categoria.id}`}
                    className="hover:text-blue-600 transition-colors capitalize"
                  >
                    {categoria.nome}
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Produtos</li>
              </>
            ) : (
              <li className="text-gray-900 font-medium">
                {isPromocao ? "Produtos em Promoção" : "Produtos"}
              </li>
            )}
          </ol>
        </nav>

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {categoria
              ? `Produtos de ${categoria.nome}`
              : isPromocao
              ? "Produtos em Promoção"
              : "Todos os Produtos"}
          </h1>
          <p className="text-sm text-gray-500">
            {produtos.length} produto{produtos.length !== 1 ? "s" : ""}{" "}
            encontrado{produtos.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            href="/produtos"
            className={`px-4 py-2 rounded-lg border transition-colors ${
              !categoriaId && !isPromocao
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
            }`}
          >
            Todos os Produtos
          </Link>
          <Link
            href="/produtos?promocao=true"
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isPromocao
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
            }`}
          >
            Em Promoção
          </Link>
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
                    <h3 className="font-bold text-gray-900 mb-3 text-sm leading-tight min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-300">
                      {abreviarNomeProduto(produto.nome)}
                    </h3>

                    {/* Categoria/Subcategoria */}
                    {produto.subcategorias && (
                      <p className="text-xs text-gray-500 mb-2">
                        {produto.subcategorias.categorias?.nome} •{" "}
                        {produto.subcategorias.nome}
                      </p>
                    )}

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
              Não há produtos disponíveis com os filtros selecionados.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos os produtos
            </Link>
          </div>
        )}

        {/* Bloco de Descrição */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sobre Nossos Produtos
            </h2>
            <p className="text-blue-100">
              Qualidade e variedade para seus projetos
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="prose prose-gray max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      🏗️
                    </span>
                    Materiais de Construção
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Oferecemos uma linha completa de materiais para construção
                    civil, desde produtos básicos até soluções especializadas.
                    Nossa seleção inclui cimentos, argamassas, blocos, telhas e
                    muito mais, todos de fabricantes reconhecidos no mercado.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Garantimos produtos de alta qualidade para que seu projeto
                    seja executado com segurança e durabilidade.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      🎨
                    </span>
                    Tintas e Acabamentos
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Nossa seção de tintas oferece uma ampla variedade de cores e
                    tipos para todos os ambientes. Trabalhamos com as melhores
                    marcas do mercado, oferecendo tintas acrílicas, esmaltes,
                    vernizes e texturas.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Além das tintas, você encontra todos os acessórios
                    necessários: pincéis, rolos, bandejas e solventes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      ⚡
                    </span>
                    Materiais Elétricos
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Seção completa de materiais elétricos com fios, cabos,
                    disjuntores, tomadas, interruptores e muito mais. Todos os
                    produtos seguem as normas técnicas brasileiras e são ideais
                    para instalações residenciais e comerciais.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Conte com nossa equipe especializada para orientações
                    técnicas e escolha dos produtos adequados.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      🔧
                    </span>
                    Ferramentas e Equipamentos
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Ferramentas profissionais e equipamentos de segurança para
                    todos os tipos de obra. Desde ferramentas manuais básicas
                    até equipamentos elétricos especializados.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Produtos de marcas reconhecidas que garantem eficiência e
                    segurança no trabalho.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    💡 Dica da TurattiMT
                  </h3>
                  <p className="text-blue-800 leading-relaxed">
                    Precisa de ajuda para escolher os produtos certos para seu
                    projeto? Nossa equipe técnica está sempre disponível para
                    orientações gratuitas. Entre em contato conosco e tenha a
                    certeza de fazer a escolha certa!
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => setIsPopupOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      Fale com um Especialista
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup de Lojas e Vendedores */}
        <LojaVendedorPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </main>

      <Footer />
    </div>
  );
}
