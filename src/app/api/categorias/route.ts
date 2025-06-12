import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubcategorias =
      searchParams.get("include_subcategorias") === "true";

    if (includeSubcategorias) {
      // Buscar categorias com suas subcategorias
      const { data: categorias, error } = await supabase
        .from("categorias")
        .select(
          `
          *,
          subcategorias (
            id,
            nome,
            descricao,
            ativo,
            ordem
          )
        `
        )
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar categorias com subcategorias:", error);
        return NextResponse.json(
          { error: "Erro interno do servidor" },
          { status: 500 }
        );
      }

      // Filtrar subcategorias ativas
      const categoriasComSubcategoriasAtivas =
        categorias?.map((categoria) => ({
          ...categoria,
          subcategorias:
            categoria.subcategorias?.filter(
              (sub: { ativo: boolean }) => sub.ativo
            ) || [],
        })) || [];

      return NextResponse.json({
        categorias: categoriasComSubcategoriasAtivas,
      });
    } else {
      // Buscar apenas categorias
      const { data: categorias, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar categorias:", error);
        return NextResponse.json(
          { error: "Erro interno do servidor" },
          { status: 500 }
        );
      }

      return NextResponse.json({ categorias: categorias || [] });
    }
  } catch (error) {
    console.error("Erro na API de categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
