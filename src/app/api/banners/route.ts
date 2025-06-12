import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ativo = searchParams.get("ativo") !== "false"; // Por padrão, busca apenas ativos

    const { data: banners, error } = await supabase
      .from("banners")
      .select("*")
      .eq("ativo", ativo)
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar banners:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Erro na API de banners:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
