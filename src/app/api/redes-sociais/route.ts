import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: redesSociais, error } = await supabase
      .from("redes_sociais")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar redes sociais:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    return NextResponse.json({ redesSociais: redesSociais || [] });
  } catch (error) {
    console.error("Erro na API de redes sociais:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
