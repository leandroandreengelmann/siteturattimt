import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lojaId = searchParams.get("loja_id");

    let query = supabase
      .from("vendedores")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    // Filtrar por loja se especificada
    if (lojaId) {
      query = query.eq("loja_id", parseInt(lojaId));
    }

    const { data: vendedores, error } = await query;

    if (error) {
      console.error("Erro ao buscar vendedores:", error);

      // Fallback com dados de exemplo se a tabela não existir
      const vendedoresExemplo = [
        {
          id: 1,
          nome: "João Silva",
          whatsapp: "65999887766",
          cargo: "Consultor de Vendas",
          ativo: true,
          loja_id: lojaId ? parseInt(lojaId) : 1,
        },
        {
          id: 2,
          nome: "Maria Santos",
          whatsapp: "65998776655",
          cargo: "Especialista em Tintas",
          ativo: true,
          loja_id: lojaId ? parseInt(lojaId) : 1,
        },
        {
          id: 3,
          nome: "Carlos Oliveira",
          whatsapp: "65997665544",
          cargo: "Especialista em Materiais Elétricos",
          ativo: true,
          loja_id: lojaId ? parseInt(lojaId) : 1,
        },
        {
          id: 4,
          nome: "Ana Costa",
          whatsapp: "65996554433",
          cargo: "Especialista em Ferramentas",
          ativo: true,
          loja_id: lojaId ? parseInt(lojaId) : 1,
        },
      ];

      return NextResponse.json({
        vendedores: vendedoresExemplo,
        fallback: true,
      });
    }

    return NextResponse.json({ vendedores: vendedores || [] });
  } catch (error) {
    console.error("Erro na API de vendedores:", error);

    // Fallback em caso de erro
    const vendedoresExemplo = [
      {
        id: 1,
        nome: "João Silva",
        whatsapp: "65999887766",
        cargo: "Consultor de Vendas",
        ativo: true,
        loja_id: 1,
      },
      {
        id: 2,
        nome: "Maria Santos",
        whatsapp: "65998776655",
        cargo: "Especialista em Tintas",
        ativo: true,
        loja_id: 1,
      },
    ];

    return NextResponse.json({
      vendedores: vendedoresExemplo,
      fallback: true,
    });
  }
}
