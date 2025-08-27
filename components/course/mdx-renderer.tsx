interface MDXRendererProps {
  content: string
  courseSlug: string
  lessonSlug: string
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  // Note: This is a simplified renderer. Future enhancement will include
  // proper MDX serialization and custom component rendering.
  return (
    <div className="prose prose-neutral max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
