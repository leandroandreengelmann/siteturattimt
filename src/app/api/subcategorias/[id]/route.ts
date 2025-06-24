import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const subcategoriaId = parseInt(resolvedParams.id);

    if (isNaN(subcategoriaId)) {
      return NextResponse.json(
        { error: "ID da subcategoria inválido" },
        { status: 400 }
      );
    }

    const { data: subcategoria, error } = await supabase
      .from("subcategorias")
      .select(
        `
        *,
        categorias(
          id,
          nome
        )
      `
      )
      .eq("id", subcategoriaId)
      .eq("ativo", true)
      .single();

    if (error) {
      console.error("Erro ao buscar subcategoria:", error);
      return NextResponse.json(
        { error: "Subcategoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subcategoria,
    });
  } catch (error) {
    console.error("Erro na API de subcategoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
