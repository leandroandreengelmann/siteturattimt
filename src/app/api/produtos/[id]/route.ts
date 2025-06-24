import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const produtoId = parseInt(resolvedParams.id);

    if (isNaN(produtoId)) {
      return NextResponse.json(
        { error: "ID do produto inválido" },
        { status: 400 }
      );
    }

    const { data: produto, error } = await supabase
      .from("produtos")
      .select(
        `
        *,
        subcategorias(
          id,
          nome,
          descricao,
          categorias(
            id,
            nome,
            descricao
          )
        )
      `
      )
      .eq("id", produtoId)
      .eq("status", "ativo")
      .single();

    if (error) {
      console.error("Erro ao buscar produto:", error);
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ produto });
  } catch (error) {
    console.error("Erro na API de produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
