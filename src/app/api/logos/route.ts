import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const posicao = searchParams.get("posicao");

    let query = supabase.from("logos").select("*").eq("ativo", true);

    if (tipo) {
      query = query.eq("tipo", tipo);
    }

    if (posicao) {
      query = query.eq("posicao", posicao);
    }

    const { data: logos, error } = await query;

    if (error) {
      console.error("Erro ao buscar logos:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    return NextResponse.json({ logos: logos || [] });
  } catch (error) {
    console.error("Erro na API de logos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
