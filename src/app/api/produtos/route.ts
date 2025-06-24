import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const categoria = searchParams.get("categoria");
    const subcategoria = searchParams.get("subcategoria");
    const subcategorias = searchParams.get("subcategorias"); // Múltiplas subcategorias separadas por vírgula
    const promocao = searchParams.get("promocao");
    const novidade = searchParams.get("novidade");
    const tipo_tinta = searchParams.get("tipo_tinta");
    const tipo_eletrico = searchParams.get("tipo_eletrico");
    const status = searchParams.get("status") || "ativo";
    const busca = searchParams.get("busca"); // Novo parâmetro de busca

    // Parâmetros de paginação
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Query base
    let query = supabase
      .from("produtos")
      .select(
        `
        *,
        subcategorias(
          id,
          nome,
          categorias(
            id,
            nome
          )
        )
      `
      )
      .eq("status", status)
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false });

    // Aplicar filtros
    if (promocao === "true") {
      query = query.eq("promocao_mes", true);
    }

    if (novidade === "true") {
      query = query.eq("novidade", true);
    }

    if (tipo_tinta === "true") {
      query = query.eq("tipo_tinta", true);
    }

    if (tipo_eletrico === "true") {
      query = query.eq("tipo_eletrico", true);
    }

    if (busca) {
      // Busca por nome ou descrição (case-insensitive)
      query = query.or(`nome.ilike.%${busca}%,descricao.ilike.%${busca}%`);
    }

    if (subcategoria) {
      query = query.eq("subcategoria_id", parseInt(subcategoria));
    }

    // Filtrar por múltiplas subcategorias (ex: "1,2,3")
    if (subcategorias) {
      const subcategoriaIds = subcategorias
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      if (subcategoriaIds.length > 0) {
        query = query.in("subcategoria_id", subcategoriaIds);
      }
    }

    // Se especificar categoria, filtrar por ela através da subcategoria
    if (categoria && !subcategoria && !subcategorias) {
      const { data: subcategoriasData } = await supabase
        .from("subcategorias")
        .select("id")
        .eq("categoria_id", parseInt(categoria))
        .eq("ativo", true);

      if (subcategoriasData && subcategoriasData.length > 0) {
        const subcategoriaIds = subcategoriasData.map((sub) => sub.id);
        query = query.in("subcategoria_id", subcategoriaIds);
      }
    }

    // Aplicar paginação
    query = query.range(offset, offset + limit - 1);

    const { data: produtos, error } = await query;

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    // Contar total de registros para paginação
    const { count: totalCount } = await supabase
      .from("produtos")
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      produtos,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
