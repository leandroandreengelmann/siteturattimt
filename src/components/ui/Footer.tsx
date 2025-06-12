"use client";

import React, { useState, useEffect } from "react";
import { MapPinIcon, ClockIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface Loja {
  id: number;
  nome: string;
  endereco: string;
  horario_funcionamento: string;
  telefones?: string[];
}

interface Categoria {
  id: number;
  nome: string;
  subcategorias?: Subcategoria[];
}

interface Subcategoria {
  id: number;
  nome: string;
}

interface RedeSocial {
  id: number;
  nome: string;
  link: string;
  icone: string;
}

// Mapeamento de ícones das redes sociais
const getIconeSVG = (icone: string) => {
  const icons: { [key: string]: string } = {
    facebook:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    instagram:
      "M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM12 16.624c-2.563 0-4.624-2.061-4.624-4.624S9.437 7.376 12 7.376s4.624 2.061 4.624 4.624S14.563 16.624 12 16.624zm4.848-8.352c-.598 0-1.072-.474-1.072-1.072s.474-1.072 1.072-1.072 1.072.474 1.072 1.072-.474 1.072-1.072 1.072z",
    whatsapp:
      "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488",
    youtube:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    twitter:
      "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
    linkedin:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    telegram:
      "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
    tiktok:
      "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.48 2.79-1.18 3.94-1.3 2.23-3.88 3.85-6.5 3.94-2.81.23-5.72-1.13-7.33-3.61-1.14-1.61-1.29-3.68-.73-5.54.33-1.28 1.05-2.42 2.05-3.26 1.2-.98 2.73-1.57 4.3-1.52 2.28-.17 4.99.65 6.46 2.23-.24 2.08-.73 4.83-.22 6.91.28.64.84 1.12 1.53 1.23.53.08 1.08-.05 1.48-.44.77-.74.81-1.99.85-3.01.04-2.83-.04-5.66.02-8.49z",
  };

  return icons[icone.toLowerCase()] || icons.facebook;
};

export default function Footer() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [redesSociais, setRedesSociais] = useState<RedeSocial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);

        // Buscar dados em paralelo
        const [lojasRes, categoriasRes, redesRes] = await Promise.all([
          fetch("/api/lojas"),
          fetch("/api/categorias"),
          fetch("/api/redes-sociais"),
        ]);

        const [lojasData, categoriasData, redesData] = await Promise.all([
          lojasRes.json(),
          categoriasRes.json(),
          redesRes.json(),
        ]);

        if (lojasData.lojas) setLojas(lojasData.lojas);
        if (categoriasData.categorias) setCategorias(categoriasData.categorias);
        if (redesData.redesSociais) setRedesSociais(redesData.redesSociais);
      } catch (error) {
        console.error("Erro ao carregar dados do rodapé:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Carregando...</div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seção 1: Lojas */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2">
              Nossas Lojas
            </h3>

            {lojas.length > 0 ? (
              <div className="space-y-4">
                {lojas.map((loja) => (
                  <div
                    key={loja.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                  >
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 text-blue-400" />
                      {loja.nome}
                    </h4>

                    <p className="text-gray-300 text-sm mb-2 flex items-start">
                      <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      {loja.endereco}
                    </p>

                    <p className="text-gray-300 text-sm mb-2 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {loja.horario_funcionamento}
                    </p>

                    {loja.telefones && loja.telefones.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {loja.telefones.map((telefone, index) => (
                          <a
                            key={index}
                            href={`tel:${telefone}`}
                            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <PhoneIcon className="w-4 h-4 mr-1" />
                            {telefone}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nenhuma loja encontrada.</p>
            )}
          </div>

          {/* Seção 2: Categorias */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2">
              Categorias e Produtos
            </h3>

            {categorias.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
                {categorias.map((categoria) => (
                  <div key={categoria.id}>
                    <a
                      href={`/categoria/${categoria.id}`}
                      className="font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors duration-200 py-1 px-2 rounded hover:bg-gray-700 block"
                    >
                      {categoria.nome}
                    </a>
                  </div>
                ))}

                <div className="mt-4">
                  <a
                    href="/categorias"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                  >
                    Ver todas as categorias →
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Nenhuma categoria encontrada.</p>
            )}
          </div>

          {/* Seção 3: Redes Sociais */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2">
              Redes Sociais
            </h3>

            {redesSociais.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  Siga-nos nas redes sociais e fique por dentro das novidades!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {redesSociais.map((rede) => (
                    <a
                      key={rede.id}
                      href={rede.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 mr-3 text-gray-300 group-hover:text-white transition-colors duration-200">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-full h-full"
                        >
                          <path d={getIconeSVG(rede.icone)} />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200">
                        {rede.nome}
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">
                    Entre em Contato
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Entre em contato conosco através das redes sociais ou visite
                    uma de nossas lojas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400">Nenhuma rede social encontrada.</p>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">
                    Entre em Contato
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Visite uma de nossas lojas físicas para atendimento
                    personalizado.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Linha separadora e informações adicionais */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} TURATTI - Material de Construção.
              Todos os direitos reservados.
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <a
                href="/politica-privacidade"
                className="hover:text-white transition-colors duration-200"
              >
                Política de Privacidade
              </a>
              <span>•</span>
              <a
                href="/termos-uso"
                className="hover:text-white transition-colors duration-200"
              >
                Termos de Uso
              </a>
              <span>•</span>
              <a
                href="/contato"
                className="hover:text-white transition-colors duration-200"
              >
                Contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
