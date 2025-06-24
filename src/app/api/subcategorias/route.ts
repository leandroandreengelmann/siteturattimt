import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get("categoria");

    let query = supabase
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
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true });

    // Filtrar por categoria se especificado
    if (categoriaId) {
      const categoriaIdNum = parseInt(categoriaId);
      if (!isNaN(categoriaIdNum)) {
        query = query.eq("categoria_id", categoriaIdNum);
      }
    }

    const { data: subcategorias, error } = await query;

    if (error) {
      console.error("Erro ao buscar subcategorias:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subcategorias,
      total: subcategorias?.length || 0,
    });
  } catch (error) {
    console.error("Erro na API de subcategorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
