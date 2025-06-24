import Link from "next/link";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="mb-8">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Subcategoria não encontrada
          </h1>
          <p className="text-gray-600 mb-2">
            A subcategoria que você está procurando não existe ou foi removida.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Verifique se o servidor está rodando ou tente novamente mais tarde.
          </p>
          <div className="space-x-4">
            <Link
              href="/subcategorias"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Ver Todas as Subcategorias
            </Link>
            <Link
              href="/categorias"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Ver Categorias
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
