import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const categoriaId = parseInt(resolvedParams.id);

    if (isNaN(categoriaId)) {
      return NextResponse.json(
        { error: "ID da categoria inválido" },
        { status: 400 }
      );
    }

    const { data: categoria, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", categoriaId)
      .eq("ativo", true)
      .single();

    if (error) {
      console.error("Erro ao buscar categoria:", error);
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      categoria,
    });
  } catch (error) {
    console.error("Erro na API de categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
