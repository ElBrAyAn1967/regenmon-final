// ==============================================
// ERROR HANDLING UTILITIES
// ==============================================
// Manejo consistente de errores en todas las APIs

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// ==============================================
// CLASE PERSONALIZADA DE ERROR API
// ==============================================
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ==============================================
// MANEJADOR CENTRAL DE ERRORES
// ==============================================
/**
 * Maneja errores de forma consistente y retorna Response apropiado
 * @param error - Error capturado
 * @returns NextResponse con formato de error consistente
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // ==============================================
  // ERRORES DE VALIDACIÓN (ZOD)
  // ==============================================
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
      },
      { status: 400 }
    );
  }

  // ==============================================
  // ERRORES DE PRISMA
  // ==============================================
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (duplicado)
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[])?.[0] || "field";
      return NextResponse.json(
        {
          error: "Resource already exists",
          details: {
            field,
            message: `A record with this ${field} already exists`,
          },
        },
        { status: 409 }
      );
    }

    // Record not found
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Resource not found",
          details: {
            message: "The requested resource does not exist",
          },
        },
        { status: 404 }
      );
    }

    // Foreign key constraint failed
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Invalid reference",
          details: {
            message: "Referenced resource does not exist",
          },
        },
        { status: 400 }
      );
    }

    // Otros errores de Prisma
    return NextResponse.json(
      {
        error: "Database error",
        details: {
          code: error.code,
          message: "An error occurred while processing your request",
        },
      },
      { status: 500 }
    );
  }

  // ==============================================
  // ERRORES DE API PERSONALIZADOS
  // ==============================================
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  // ==============================================
  // ERRORES GENÉRICOS
  // ==============================================
  if (error instanceof Error) {
    // Errores conocidos con mensajes específicos
    const knownErrors: Record<string, number> = {
      "Insufficient balance": 400,
      "Regenmon not found": 404,
      "Invalid token": 401,
      "Unauthorized": 401,
      "Forbidden": 403,
    };

    for (const [message, statusCode] of Object.entries(knownErrors)) {
      if (error.message.includes(message)) {
        return NextResponse.json(
          { error: error.message },
          { status: statusCode }
        );
      }
    }

    // Error genérico con mensaje
    return NextResponse.json(
      {
        error: "Internal server error",
        details: {
          message: error.message,
        },
      },
      { status: 500 }
    );
  }

  // ==============================================
  // ERROR COMPLETAMENTE DESCONOCIDO
  // ==============================================
  return NextResponse.json(
    {
      error: "Internal server error",
      details: {
        message: "An unexpected error occurred",
      },
    },
    { status: 500 }
  );
}

// ==============================================
// UTILIDADES DE RESPUESTA
// ==============================================

/**
 * Respuesta de éxito consistente
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    { status }
  );
}

/**
 * Respuesta de error consistente
 */
export function errorResponse(
  message: string,
  statusCode: number = 400,
  details?: any
) {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status: statusCode }
  );
}

/**
 * Respuesta con paginación
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
) {
  return NextResponse.json({
    success: true,
    ...(message && { message }),
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}
