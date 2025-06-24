"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

interface Logo {
  id: string;
  nome: string;
  tipo: string;
  posicao: string;
  imagem_url: string;
  ativo: boolean;
}

// Mapeamento de ícones das redes sociais com SVGs otimizados
const getIconeSVG = (icone: string) => {
  const icons: { [key: string]: string } = {
    // Facebook - ícone oficial atualizado
    facebook:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",

    // Instagram - ícone simplificado e moderno
    instagram:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",

    // WhatsApp - ícone oficial
    whatsapp:
      "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488",

    // YouTube - ícone oficial
    youtube:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",

    // Twitter/X - ícone clássico do Twitter
    twitter:
      "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",

    // X (novo logo do Twitter)
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",

    // LinkedIn - ícone oficial
    linkedin:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",

    // Telegram - ícone oficial
    telegram:
      "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",

    // TikTok - ícone oficial
    tiktok:
      "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.48 2.79-1.18 3.94-1.3 2.23-3.88 3.85-6.5 3.94-2.81.23-5.72-1.13-7.33-3.61-1.14-1.61-1.29-3.68-.73-5.54.33-1.28 1.05-2.42 2.05-3.26 1.2-.98 2.73-1.57 4.3-1.52 2.28-.17 4.99.65 6.46 2.23-.24 2.08-.73 4.83-.22 6.91.28.64.84 1.12 1.53 1.23.53.08 1.08-.05 1.48-.44.77-.74.81-1.99.85-3.01.04-2.83-.04-5.66.02-8.49z",

    // Discord - para comunidades
    discord:
      "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",

    // Pinterest - para inspirações
    pinterest:
      "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017.001 12.017 0z",

    // Threads (Meta)
    threads:
      "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.01c0-3.49.989-6.38 2.934-8.584C6.04 1.39 8.645.287 11.907.287c3.04 0 5.509 1.054 7.336 3.133 1.855 2.115 2.757 4.954 2.757 8.68 0 3.491-.989 6.38-2.934 8.584-1.606 1.825-4.211 2.928-7.473 2.928zm.321-2.161c2.424 0 4.457-.811 6.043-2.412 1.671-1.689 2.458-4.15 2.458-7.327 0-3.263-.678-5.851-2.014-7.688-1.314-1.808-3.235-2.724-5.712-2.724-2.424 0-4.457.811-6.043 2.412-1.671 1.689-2.458 4.15-2.458 7.327 0 3.263.678 5.851 2.014 7.688 1.314 1.808 3.235 2.724 5.712 2.724z",

    // Snapchat - para público jovem
    snapchat:
      "M12.166 3c.445 0 .817.383.829.829v4.895c-.012.127-.012.254 0 .381-.012.381-.178.445-.381.445h-.895c-.381 0-.445-.178-.445-.445v-4.895C11.274 3.383 11.721 3 12.166 3zm-2.195 6.963c.318-.012.572.064.763.229.127.127.191.318.191.508s-.064.381-.191.508c-.191.165-.445.241-.763.229-.318.012-.572-.064-.763-.229-.127-.127-.191-.318-.191-.508s.064-.381.191-.508c.191-.165.445-.241.763-.229zm4.39 0c.318-.012.572.064.763.229.127.127.191.318.191.508s-.064.381-.191.508c-.191.165-.445.241-.763.229-.318.012-.572-.064-.763-.229-.127-.127-.191-.318-.191-.508s.064-.381.191-.508c.191-.165.445-.241.763-.229z",
  };

  return icons[icone.toLowerCase()] || icons.facebook;
};

export default function Footer() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [redesSociais, setRedesSociais] = useState<RedeSocial[]>([]);
  const [logo, setLogo] = useState<Logo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);

        // Buscar dados em paralelo
        const [lojasRes, categoriasRes, redesRes, logoRes] = await Promise.all([
          fetch("/api/lojas"),
          fetch("/api/categorias"),
          fetch("/api/redes-sociais"),
          fetch("/api/logos?tipo=branca"),
        ]);

        const [lojasData, categoriasData, redesData, logoData] =
          await Promise.all([
            lojasRes.json(),
            categoriasRes.json(),
            redesRes.json(),
            logoRes.json(),
          ]);

        if (lojasData.lojas) setLojas(lojasData.lojas);
        if (categoriasData.categorias) setCategorias(categoriasData.categorias);
        if (redesData.redesSociais) setRedesSociais(redesData.redesSociais);
        if (logoData.logos && logoData.logos.length > 0) {
          setLogo(logoData.logos[0]);
        } else {
          // Fallback: buscar qualquer logo disponível
          try {
            const fallbackRes = await fetch("/api/logos");
            const fallbackData = await fallbackRes.json();
            if (fallbackData.logos && fallbackData.logos.length > 0) {
              setLogo(fallbackData.logos[0]);
            }
          } catch (error) {
            console.error("Erro ao buscar logo fallback:", error);
          }
        }
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
                  <Link
                    href="/categorias"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                  >
                    Ver todas as categorias →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Nenhuma categoria encontrada.</p>
            )}
          </div>

          {/* Seção 3: Redes Sociais */}
          <div className="space-y-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2 w-full text-center">
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
                <div className="flex justify-center mt-4">
                  {logo ? (
                    <img
                      src={logo.imagem_url}
                      alt="Turatti Materiais para Construção"
                      className="w-56 max-w-full h-auto drop-shadow-xl"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
                      }}
                    />
                  ) : (
                    <div className="w-56 h-16 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        Logo não encontrada
                      </span>
                    </div>
                  )}
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
                <div className="flex justify-center mt-4">
                  {logo ? (
                    <img
                      src={logo.imagem_url}
                      alt="Turatti Materiais para Construção"
                      className="w-56 max-w-full h-auto drop-shadow-xl"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
                      }}
                    />
                  ) : (
                    <div className="w-56 h-16 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        Logo não encontrada
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Linha separadora e informações adicionais */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="text-center text-sm text-gray-400">
            © 2025 TURATTI - Material de Construção. Todos os direitos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
