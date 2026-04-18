import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Category, SourceType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sourceConfigSchemas } from "@/app/lib/sourceConfig";
import { buildSourceUrl } from "@/app/lib/urlBuilder";

const SUBMITTABLE_SOURCE_TYPES = ["RSS", "REDDIT", "TELEGRAM", "GITHUB"];
const VALID_CATEGORIES = Object.values(Category);

const createSourceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["RSS", "REDDIT", "TELEGRAM", "GITHUB"]),
  category: z.nativeEnum(Category),
  tags: z.array(z.string()).max(10).default([]),
  iconUrl: z.string().url().optional().or(z.literal("")),
  config: z.record(z.string(), z.any()).default({}),
  submitterId: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const validation = createSourceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, description, type, category, tags, iconUrl, config } =
      validation.data;

    const configSchema = sourceConfigSchemas[type];
    if (!configSchema) {
      return NextResponse.json(
        { error: `No config schema found for type: ${type}` },
        { status: 400 }
      );
    }

    const configValidation = configSchema.safeParse(config);
    if (!configValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid configuration for source type",
          details: configValidation.error.issues,
        },
        { status: 400 }
      );
    }

    let url: string;
    try {
      url = buildSourceUrl(type, configValidation.data as any);
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Failed to construct URL from config",
        },
        { status: 400 }
      );
    }

    if (!url || url.trim() === "") {
      return NextResponse.json(
        { error: "Could not construct valid URL from provided configuration" },
        { status: 400 }
      );
    }

    const validatedTags = tags.filter(
      (tag): tag is string => typeof tag === "string" && tag.trim() !== ""
    );

    const source = await prisma.source.create({
      data: {
        url: url.trim(),
        name: name.trim(),
        description: description?.trim() || null,
        type,
        category,
        tags: validatedTags,
        iconUrl: iconUrl?.trim() || null,
        config: configValidation.data as any,
        submitterId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Source submitted successfully and is pending review",
        source: {
          ...source,
          config: configValidation.data,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This URL has already been submitted" },
        { status: 409 }
      );
    }

    console.error("Error submitting source:", error);
    return NextResponse.json(
      { error: "Failed to submit source" },
      { status: 500 }
    );
  }
}
