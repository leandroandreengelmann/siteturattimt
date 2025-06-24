"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import LojaVendedorPopup from "@/components/ui/LojaVendedorPopup";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  promocao_mes?: boolean;
  preco_promocao?: number;
  novidade?: boolean;
  descricao?: string;
  imagem_principal?: string;
  imagem_2?: string;
  imagem_3?: string;
  imagem_4?: string;
  subcategoria_id: number;
  status: string;
  tipo_tinta?: boolean;
  cor_rgb?: string;
  tipo_eletrico?: boolean;
  voltagem?: string;
  promocao_data_inicio?: string;
  promocao_data_fim?: string;
  promocao_status?: string;
  subcategorias: {
    id: number;
    nome: string;
    descricao: string;
    categorias: {
      id: number;
      nome: string;
      descricao: string;
    };
  };
}

async function getProduto(id: string): Promise<Produto | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/produtos/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.produto || null;
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    return null;
  }
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
    return "/placeholder-product.svg";
  }

  if (caminhoImagem.startsWith("http")) {
    return caminhoImagem;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = "produtos";

  if (!baseUrl) {
    return "/placeholder-product.svg";
  }

  const path = caminhoImagem.startsWith("/")
    ? caminhoImagem.substring(1)
    : caminhoImagem;

  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const calcularDesconto = (
  precoOriginal: number,
  precoPromocao: number
): number => {
  return Math.round(((precoOriginal - precoPromocao) / precoOriginal) * 100);
};

export default function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtoData = await getProduto(resolvedParams.id);

        if (!produtoData) {
          notFound();
          return;
        }

        setProduto(produtoData);
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
            <p className="text-gray-600">Carregando produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!produto) {
    notFound();
  }

  // Preparar imagens do produto
  const imagens = [
    produto.imagem_principal,
    produto.imagem_2,
    produto.imagem_3,
    produto.imagem_4,
  ].filter(Boolean);

  const desconto =
    produto.promocao_mes && produto.preco_promocao
      ? calcularDesconto(produto.preco, produto.preco_promocao)
      : 0;

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
                href={`/categorias/${produto.subcategorias.categorias.id}`}
                className="hover:text-blue-600 transition-colors capitalize"
              >
                {produto.subcategorias.categorias.nome}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/subcategorias/${produto.subcategorias.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {produto.subcategorias.nome}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{produto.nome}</li>
          </ol>
        </nav>

        {/* Conteúdo principal do produto */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Galeria de imagens */}
            <div className="space-y-4">
              {/* Imagem principal */}
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={construirUrlImagem(imagens[imagemAtiva])}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Miniaturas */}
              {imagens.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {imagens.map((imagem, index) => (
                    <button
                      key={index}
                      onClick={() => setImagemAtiva(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        imagemAtiva === index
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={construirUrlImagem(imagem)}
                        alt={`${produto.nome} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do produto */}
            <div className="space-y-6">
              {/* Cabeçalho */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {produto.novidade && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Novidade
                    </span>
                  )}
                  {produto.promocao_mes && (
                    <span className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Promoção
                    </span>
                  )}
                  {produto.tipo_tinta && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                      Tinta
                    </span>
                  )}
                  {produto.tipo_eletrico && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Elétrico
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {produto.nome}
                </h1>
                <p className="text-gray-600">
                  Categoria: {produto.subcategorias.categorias.nome} •{" "}
                  {produto.subcategorias.nome}
                </p>
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  {produto.promocao_mes && produto.preco_promocao ? (
                    <>
                      <span className="text-3xl font-bold text-blue-600">
                        {formatarMoeda(produto.preco_promocao)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatarMoeda(produto.preco)}
                      </span>
                      <span className="bg-blue-600 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                        -{desconto}%
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {formatarMoeda(produto.preco)}
                    </span>
                  )}
                </div>
              </div>

              {/* Especificações técnicas */}
              {produto.voltagem && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Especificações
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        Voltagem:
                      </span>
                      <span className="text-sm text-gray-600">
                        {produto.voltagem}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de contato */}
              <div>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Fale com um Especialista
                </button>
              </div>

              {/* Cor do produto */}
              {produto.cor_rgb && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Cor</h3>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: produto.cor_rgb }}
                    ></div>
                    <span className="text-sm text-gray-600 font-medium">
                      {produto.cor_rgb}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bloco de Descrição Detalhada */}
        {produto.descricao && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-4 sm:py-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Descrição Detalhada
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                Informações técnicas e características do produto
              </p>
            </div>

            <div className="px-6 sm:px-8 py-6 sm:py-8">
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {produto.descricao.split("\n").map((paragrafo, index) => {
                    if (paragrafo.trim() === "") return null;

                    // Detectar se é um título/seção (texto em maiúsculo ou com dois pontos)
                    const isTitle =
                      paragrafo.includes(":") ||
                      paragrafo === paragrafo.toUpperCase();

                    if (isTitle) {
                      return (
                        <h3
                          key={index}
                          className="text-lg font-semibold text-gray-900 mt-6 mb-3 flex items-center"
                        >
                          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                          {paragrafo}
                        </h3>
                      );
                    }

                    return (
                      <p key={index} className="text-gray-600 leading-relaxed">
                        {paragrafo}
                      </p>
                    );
                  })}
                </div>

                {/* Seção de características técnicas se for tinta */}
                {produto.tipo_tinta && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        🎨 Características da Tinta
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-800 font-medium">
                              Tipo:
                            </span>
                            <span className="text-blue-700">
                              Tinta para parede
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-800 font-medium">
                              Acabamento:
                            </span>
                            <span className="text-blue-700">Fosco</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-800 font-medium">
                              Aplicação:
                            </span>
                            <span className="text-blue-700">
                              Interior/Exterior
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-800 font-medium">
                              Resistência:
                            </span>
                            <span className="text-blue-700">Alta</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seção de características técnicas se for elétrico */}
                {produto.tipo_eletrico && produto.voltagem && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-yellow-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                        ⚡ Especificações Elétricas
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-yellow-800 font-medium">
                              Voltagem:
                            </span>
                            <span className="text-yellow-700">
                              {produto.voltagem}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-800 font-medium">
                              Tipo:
                            </span>
                            <span className="text-yellow-700">
                              Material Elétrico
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-yellow-800 font-medium">
                              Certificação:
                            </span>
                            <span className="text-yellow-700">INMETRO</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-800 font-medium">
                              Garantia:
                            </span>
                            <span className="text-yellow-700">
                              Conforme fabricante
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dica de instalação/uso */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                      💡 Dica da TurattiMT
                    </h3>
                    <p className="text-green-800 leading-relaxed text-sm">
                      {produto.tipo_tinta
                        ? "Para melhores resultados, prepare adequadamente a superfície antes da aplicação. Use primer quando necessário e siga as instruções do fabricante quanto ao tempo de secagem entre demãos."
                        : produto.tipo_eletrico
                        ? "Para instalações elétricas, sempre consulte um eletricista qualificado. Certifique-se de que a voltagem do produto seja compatível com sua instalação."
                        : "Precisa de orientações técnicas para usar este produto? Nossa equipe está disponível para ajudar você a fazer a escolha certa e usar o produto adequadamente."}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-sm"
                      >
                        Fale com um Especialista
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup de Lojas e Vendedores */}
        <LojaVendedorPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          produtoNome={produto?.nome}
        />
      </main>

      <Footer />
    </div>
  );
}
