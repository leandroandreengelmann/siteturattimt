"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface Vendedor {
  id: number;
  nome: string;
  whatsapp: string;
  cargo?: string;
  foto?: string;
  ativo: boolean;
  loja_id: number;
}

interface Loja {
  id: number;
  nome: string;
  endereco: string;
  telefone?: string;
  whatsapp?: string;
  horario_funcionamento?: string;
  status: string;
  ordem?: number;
}

interface LojaVendedorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  produtoNome?: string;
}

export default function LojaVendedorPopup({
  isOpen,
  onClose,
  produtoNome,
}: LojaVendedorPopupProps) {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"lojas" | "vendedores">("lojas");

  useEffect(() => {
    if (isOpen) {
      fetchLojas();
    }
  }, [isOpen]);

  const fetchLojas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/lojas");
      const data = await response.json();
      setLojas(data.lojas || []);
    } catch (error) {
      console.error("Erro ao carregar lojas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendedores = async (lojaId: number) => {
    setLoading(true);
    try {
      // Simulando API de vendedores - você pode ajustar conforme sua estrutura
      const response = await fetch(`/api/vendedores?loja_id=${lojaId}`);
      if (response.ok) {
        const data = await response.json();
        setVendedores(data.vendedores || []);
      } else {
        // Fallback com dados de exemplo
        setVendedores([
          {
            id: 1,
            nome: "João Silva",
            whatsapp: "65999887766",
            cargo: "Consultor de Vendas",
            ativo: true,
            loja_id: lojaId,
          },
          {
            id: 2,
            nome: "Maria Santos",
            whatsapp: "65998776655",
            cargo: "Especialista em Tintas",
            ativo: true,
            loja_id: lojaId,
          },
          {
            id: 3,
            nome: "Carlos Oliveira",
            whatsapp: "65997665544",
            cargo: "Especialista em Materiais Elétricos",
            ativo: true,
            loja_id: lojaId,
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao carregar vendedores:", error);
      // Fallback com dados de exemplo
      setVendedores([
        {
          id: 1,
          nome: "João Silva",
          whatsapp: "65999887766",
          cargo: "Consultor de Vendas",
          ativo: true,
          loja_id: lojaId,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLojaClick = (loja: Loja) => {
    setLojaSelecionada(loja);
    setView("vendedores");
    fetchVendedores(loja.id);
  };

  const handleVendedorClick = (vendedor: Vendedor) => {
    const mensagem = produtoNome
      ? `Olá! Gostaria de mais informações sobre o produto: ${produtoNome}`
      : "Olá! Gostaria de mais informações sobre os produtos da TurattiMT.";

    const mensagemEncoded = encodeURIComponent(mensagem);
    const whatsappUrl = `https://wa.me/55${vendedor.whatsapp}?text=${mensagemEncoded}`;

    window.open(whatsappUrl, "_blank");
    onClose();
  };

  const handleBack = () => {
    setView("lojas");
    setLojaSelecionada(null);
    setVendedores([]);
  };

  const handleClose = () => {
    setView("lojas");
    setLojaSelecionada(null);
    setVendedores([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {view === "lojas"
                    ? "Escolha uma Loja"
                    : "Nossos Especialistas"}
                </h2>
                <p className="text-green-100 text-sm">
                  {view === "lojas"
                    ? "Selecione a loja mais próxima"
                    : `${lojaSelecionada?.nome}`}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-green-100 transition-colors p-1"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Botão Voltar */}
            {view === "vendedores" && (
              <button
                onClick={handleBack}
                className="mt-3 text-green-100 hover:text-white text-sm font-medium flex items-center"
              >
                ← Voltar para lojas
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Carregando...</span>
              </div>
            ) : view === "lojas" ? (
              <div className="p-6 space-y-4">
                {lojas.length > 0 ? (
                  lojas.map((loja) => (
                    <button
                      key={loja.id}
                      onClick={() => handleLojaClick(loja)}
                      className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <MapPinIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                            {loja.nome}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {loja.endereco}
                          </p>
                          {loja.telefone && (
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <PhoneIcon className="w-4 h-4 mr-1" />
                              {loja.telefone}
                            </div>
                          )}
                          {loja.horario_funcionamento && (
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {loja.horario_funcionamento}
                            </div>
                          )}
                        </div>
                        <div className="text-green-600 group-hover:text-green-700">
                          →
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Nenhuma loja encontrada</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {vendedores.length > 0 ? (
                  vendedores.map((vendedor) => (
                    <button
                      key={vendedor.id}
                      onClick={() => handleVendedorClick(vendedor)}
                      className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          {vendedor.foto ? (
                            <img
                              src={vendedor.foto}
                              alt={vendedor.nome}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                            {vendedor.nome}
                          </h3>
                          {vendedor.cargo && (
                            <p className="text-sm text-gray-600">
                              {vendedor.cargo}
                            </p>
                          )}
                          <div className="flex items-center mt-2 text-xs text-green-600">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                            WhatsApp: ({vendedor.whatsapp.slice(0, 2)}){" "}
                            {vendedor.whatsapp.slice(2, 7)}-
                            {vendedor.whatsapp.slice(7)}
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Nenhum vendedor encontrado para esta loja
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {view === "lojas"
                ? "Clique em uma loja para ver os especialistas disponíveis"
                : "Clique em um especialista para iniciar conversa no WhatsApp"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
