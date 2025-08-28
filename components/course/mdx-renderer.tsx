"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MDXRemote } from "next-mdx-remote/rsc"
import { serialize } from "next-mdx-remote/serialize"
import type React from "react"
import { useMemo } from "react"

interface MDXRendererProps {
  content: string
  courseSlug: string
  lessonSlug: string
}

// Custom MDX components for consistent styling
const mdxComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl font-bold text-foreground mb-6 border-b border-border pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-medium text-foreground mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
  ),
  hr: () => <Separator className="my-8" />,
  // Custom components for enhanced learning content
  LearningObjective: ({ children }: { children: React.ReactNode }) => (
    <Card className="mb-6 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default">Learning Objective</Badge>
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  ),
  KeyConcept: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="mb-6 border-accent/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">Key Concept</Badge>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  ),
  Example: ({ children }: { children: React.ReactNode }) => (
    <Card className="mb-6 border-secondary/20 bg-secondary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">Example</Badge>
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  ),
}

export default function MDXRenderer({ content, courseSlug, lessonSlug }: MDXRendererProps) {
  const serializedContent = useMemo(async () => {
    try {
      return await serialize(content, {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
          development: process.env.NODE_ENV === "development",
        },
        scope: { courseSlug, lessonSlug },
      })
    } catch (error) {
      console.error("MDX serialization error:", error)
      return null
    }
  }, [content, courseSlug, lessonSlug])

  if (!serializedContent) {
    return (
      <div className="prose prose-neutral max-w-none">
        <div className="text-muted-foreground italic">
          Error rendering content. Please check the MDX syntax.
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-neutral max-w-none">
      <MDXRemote {...serializedContent} components={mdxComponents} />
    </div>
  )
}
