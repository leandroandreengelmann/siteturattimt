"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import type { Produto } from "@/lib/supabase";
import LojaVendedorPopup from "@/components/ui/LojaVendedorPopup";

interface Categoria {
  id: number;
  nome: string;
  subcategorias?: Subcategoria[];
}

interface Subcategoria {
  id: number;
  nome: string;
  categoria_id: number;
}

interface Logo {
  id: string;
  nome: string;
  tipo: string;
  posicao: string;
  imagem_url: string;
  ativo: boolean;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logo, setLogo] = useState<Logo | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<Produto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          "/api/categorias?include_subcategorias=true"
        );
        const data = await response.json();
        setCategorias(data.categorias || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/logos?tipo=azul&posicao=cabecalho");
        const data = await response.json();
        if (data.logos && data.logos.length > 0) {
          setLogo(data.logos[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar logo:", error);
      }
    };

    fetchCategorias();
    fetchLogo();
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 10);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/produtos?busca=${encodeURIComponent(searchQuery)}&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.produtos || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = () => {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    };
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showSuggestions]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      if (selectedSuggestion >= 0 && selectedSuggestion < suggestions.length) {
        handleSuggestionClick(suggestions[selectedSuggestion]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (produto: Produto) => {
    setShowSuggestions(false);
    setSearchQuery(produto.nome);
    router.push(`/produtos/${produto.id}`);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/produtos?busca=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit();
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isMounted && isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-white shadow-md"
      }`}
    >
      {/* Cabeçalho Principal */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 py-2 sm:py-4">
          {/* Logo */}
          <Link href="/" className="group flex-shrink-0">
            {logo ? (
              <div className="h-10 sm:h-16 transition-all duration-300 group-hover:scale-105">
                <img
                  src={logo.imagem_url}
                  alt="TurattiMT"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">TurattiMT</h1>
                  <p className="text-xs text-gray-500">
                    Materiais de Construção
                  </p>
                </div>
              </div>
            )}
          </Link>

          {/* Campo de Busca - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 lg:mx-12">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <input
                  type="text"
                  placeholder="Buscar produtos, ferramentas, tintas..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSuggestion(-1);
                  }}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onKeyDown={handleInputKeyDown}
                  className="relative w-full px-4 lg:px-6 py-3 lg:py-4 pr-14 lg:pr-16 text-sm bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 p-2.5 lg:p-3 text-gray-400 hover:text-blue-600 transition-all duration-200"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 lg:w-6 lg:h-6 stroke-2" />
                </button>
              </div>
            </form>
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center gap-2">
            {/* Botão Fale com um Especialista - Desktop */}
            <button
              onClick={() => setIsPopupOpen(true)}
              className="hidden md:inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200 shadow-lg text-sm"
            >
              Fale com um Especialista
            </button>
            {/* Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
              ) : (
                <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
              )}
            </button>
          </div>
        </div>

        {/* Campo de Busca Mobile */}
        <div className="md:hidden pb-4 sm:pb-6 px-1 sm:px-2">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSuggestion(-1);
                }}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onKeyDown={handleInputKeyDown}
                className="relative w-full px-4 sm:px-6 py-3 sm:py-4 pr-14 sm:pr-16 text-sm bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-2.5 sm:p-3 text-gray-400 hover:text-blue-600 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
              </button>
            </div>
          </form>
          {/* Botão Fale com um Especialista - Mobile */}
          <button
            onClick={() => setIsPopupOpen(true)}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 shadow-lg text-sm"
          >
            Fale com um Especialista
          </button>
        </div>
      </div>

      {/* Mega Menu - Desktop */}
      <div className="hidden md:block bg-gradient-to-r from-gray-50/30 via-white/50 to-gray-50/30 backdrop-blur-sm border-t border-gray-100/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center h-14 py-2">
            <div
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              className="relative"
            >
              <button className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:text-blue-600 rounded-2xl transition-all duration-300 font-medium group">
                <div className="relative p-1 rounded-lg group-hover:bg-blue-50 transition-all duration-300">
                  <Squares2X2Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 stroke-2" />
                </div>
                <span className="text-gray-700 group-hover:text-blue-600 transition-all duration-300 font-semibold">
                  Todas as Categorias
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-all duration-300 group-hover:text-blue-600 stroke-2 ${
                    isMegaMenuOpen ? "rotate-180 scale-110" : ""
                  }`}
                />
              </button>
            </div>

            {/* Separador Visual */}
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent ml-8"></div>

            <nav className="flex items-center space-x-3 ml-8">
              {[{ href: "/", label: "Início" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-6 py-3 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300 relative group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {isMegaMenuOpen && (
          <div
            className="absolute left-0 right-0 bg-white/97 backdrop-blur-lg shadow-xl border-t border-gray-100 animate-in slide-in-from-top-2 duration-300"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {categorias
                  .filter(
                    (categoria) =>
                      categoria.subcategorias &&
                      categoria.subcategorias.length > 0
                  )
                  .map((categoria) => (
                    <div key={categoria.id} className="space-y-5 group">
                      <Link
                        href={`/categorias/${categoria.id}`}
                        className="block font-bold text-gray-900 text-sm uppercase tracking-wider pb-4 relative border-b border-gray-200 hover:text-blue-600 transition-colors duration-300"
                      >
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-500"></div>
                        {categoria.nome}
                      </Link>
                      <ul className="space-y-1">
                        {categoria.subcategorias!.map((subcategoria) => (
                          <li key={subcategoria.id}>
                            <Link
                              href={`/subcategorias/${subcategoria.id}`}
                              className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-300 block py-2 px-3 rounded-lg hover:bg-gray-50/70 relative group"
                            >
                              <span className="relative z-10">
                                {subcategoria.nome}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>

              {categorias.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <SparklesIcon className="w-10 h-10 text-blue-600 stroke-2" />
                  </div>
                  <p className="text-gray-500 font-semibold text-lg">
                    Carregando categorias...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 animate-in slide-in-from-top-2 duration-300 max-h-screen overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
            <nav className="space-y-2 sm:space-y-3">
              {[{ href: "/", label: "Início" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 sm:py-4 px-4 sm:px-5 text-base sm:text-lg text-gray-700 hover:text-blue-600 font-medium rounded-xl hover:bg-blue-50/50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Categorias Mobile */}
            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="font-bold text-gray-900 mb-4 sm:mb-6 text-lg sm:text-xl">
                Categorias
              </h3>
              <div className="space-y-4 sm:space-y-5 max-h-96 overflow-y-auto">
                {categorias
                  .filter(
                    (categoria) =>
                      categoria.subcategorias &&
                      categoria.subcategorias.length > 0
                  )
                  .map((categoria) => (
                    <div
                      key={categoria.id}
                      className="bg-gray-50/50 rounded-xl p-4 sm:p-5"
                    >
                      <Link
                        href={`/categorias/${categoria.id}`}
                        className="block font-semibold text-gray-800 hover:text-blue-600 text-sm sm:text-base mb-3 sm:mb-4 uppercase tracking-wide transition-colors duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {categoria.nome}
                      </Link>
                      <div className="space-y-0.5 sm:space-y-1">
                        {categoria
                          .subcategorias!.slice(0, 8)
                          .map((subcategoria) => (
                            <Link
                              key={subcategoria.id}
                              href={`/subcategorias/${subcategoria.id}`}
                              className="block py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subcategoria.nome}
                            </Link>
                          ))}
                        {categoria.subcategorias!.length > 8 && (
                          <Link
                            href={`/categorias/${categoria.id}`}
                            className="block py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Ver todas ({categoria.subcategorias!.length - 8}+
                            itens)
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autocomplete Sugestões - Desktop */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-auto">
          {suggestions.map((produto, idx) => (
            <li
              key={produto.id}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                selectedSuggestion === idx ? "bg-blue-100" : ""
              }`}
              onMouseDown={() => handleSuggestionClick(produto)}
            >
              {produto.imagem_principal && (
                <img
                  src={produto.imagem_principal}
                  alt={produto.nome}
                  className="w-8 h-8 rounded mr-3 object-cover"
                />
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-800 font-medium truncate">
                    {produto.nome}
                  </span>
                  {produto.promocao_mes && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-1">
                      Promoção
                    </span>
                  )}
                  {produto.novidade && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-1">
                      Novidade
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {produto.promocao_mes && produto.preco_promocao ? (
                    <>
                      <span className="text-blue-600 font-bold text-sm">
                        R$ {produto.preco_promocao.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-xs line-through">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                    </>
                  ) : produto.preco ? (
                    <span className="text-gray-700 text-sm font-semibold">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Autocomplete Sugestões - Mobile */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-auto">
          {suggestions.map((produto, idx) => (
            <li
              key={produto.id}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                selectedSuggestion === idx ? "bg-blue-100" : ""
              }`}
              onMouseDown={() => handleSuggestionClick(produto)}
            >
              {produto.imagem_principal && (
                <img
                  src={produto.imagem_principal}
                  alt={produto.nome}
                  className="w-8 h-8 rounded mr-3 object-cover"
                />
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-800 font-medium truncate">
                    {produto.nome}
                  </span>
                  {produto.promocao_mes && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-1">
                      Promoção
                    </span>
                  )}
                  {produto.novidade && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-1">
                      Novidade
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {produto.promocao_mes && produto.preco_promocao ? (
                    <>
                      <span className="text-blue-600 font-bold text-sm">
                        R$ {produto.preco_promocao.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-xs line-through">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                    </>
                  ) : produto.preco ? (
                    <span className="text-gray-700 text-sm font-semibold">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popup de Lojas e Vendedores */}
      <LojaVendedorPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </header>
  );
}
