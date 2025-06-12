import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: lojas, error } = await supabase
      .from("lojas")
      .select("*")
      .eq("status", "ativa")
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar lojas:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lojas: lojas || [] });
  } catch (error) {
    console.error("Erro na API de lojas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
