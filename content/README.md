# Course Content Directory

This directory contains all static course content for the NSBS platform. Courses are stored as files in the repository, **not in Supabase**.

## Directory Structure

```
content/
├── README.md                    # This file
├── courses/                      # All courses
│   ├── business-research-methods/  # Example course
│   │   ├── index.json              # Course metadata
│   │   ├── chapter-01.md           # Chapter content
│   │   ├── chapter-02.md
│   │   └── chapter-03.md
│   ├── change-management/
│   │   ├── index.json
│   │   └── ...
│   └── ...
└── catalog.json                 # All courses index
```

## Adding a New Course

### 1. Create Course Directory

```bash
mkdir -p content/courses/your-course-slug
```

### 2. Create Course Metadata (`index.json`)

```json
{
  "slug": "your-course-slug",
  "title": "Your Course Title",
  "description": "Brief description of the course",
  "status": "published",
  "chapters": [
    {
      "slug": "chapter-01",
      "title": "Introduction",
      "order": 1
    },
    {
      "slug": "chapter-02",
      "title": "Core Concepts",
      "order": 2
    }
  ],
  "outcomes": [
    "Understand key concepts",
    "Apply principles to real situations",
    "Develop practical skills"
  ],
  "author": "NSBS Faculty",
  "createdAt": "2026-01-07",
  "updatedAt": "2026-01-07"
}
```

### 3. Create Chapter Files (Markdown)

Create `chapter-01.md`:

```markdown
---
slug: chapter-01
title: Introduction
order: 1
---

# Introduction

Welcome to the course! This chapter covers...

## Learning Objectives

- Objective 1
- Objective 2
- Objective 3

## Content

Your course content here using standard Markdown:

- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)

### Code Examples (if applicable)

```python
def example():
    print("Hello, NSBS!")
```

### Tables

| Concept | Definition |
|---------|------------|
| Term 1  | Definition 1 |
| Term 2  | Definition 2 |

### Callouts

> **Note**: Important information to remember.

> **Warning**: Critical information to be aware of.

> **Tip**: Helpful advice for students.
```

### 4. Update Course Catalog

Edit `content/catalog.json` to add your course:

```json
{
  "courses": [
    {
      "slug": "your-course-slug",
      "title": "Your Course Title",
      "description": "Brief description",
      "status": "published",
      "featured": false
    }
  ],
  "lastUpdated": "2026-01-07T10:00:00Z"
}
```

### 5. Commit and Push

```bash
git add content/
git commit -m "Add new course: Your Course Title"
git push origin main
```

Koyeb will automatically redeploy with the new content.

## Access Control

### Free Access for Admins

Admins automatically get free access to all courses. This is handled in:
- `lib/rbac.ts` - Role checking
- Page components check user role before rendering

### User Access

Implement your own access logic:
- Free courses: Available to all users
- Paid courses: Require payment/subscription
- Member-only: Require active membership

## Content Guidelines

### Markdown Formatting

- Use heading tags 2-6 (`##` through `######`)
- Don't use heading 1 (`#`) - reserved for chapter title
- Keep paragraphs concise (2-3 sentences)
- Use lists for multiple related points
- Add code examples where relevant

### Writing Style

- Professional, academic tone
- Clear and concise explanations
- Define technical terms on first use
- Provide real-world examples
- Include visual aids when helpful

### Chapter Length

- Focus on clear, complete explanations
- Break long topics into multiple chapters
- Include summaries at chapter end

### Metadata Best Practices

- Use kebab-case for slugs (`business-research-methods`)
- Keep titles under 60 characters
- Write compelling descriptions (150-200 characters)

## Course Status

- `draft`: Work in progress, not visible
- `published`: Live and accessible
- `archived`: Historical, read-only
- `coming-soon`: Announced but not ready

## Example Course Structure

### Business Research Methods

```
content/courses/business-research-methods/
├── index.json
├── 01-introduction.md
├── 02-research-design.md
├── 03-data-collection.md
├── 04-quantitative-methods.md
├── 05-qualitative-methods.md
├── 06-data-analysis.md
├── 07-reporting-findings.md
└── 08-ethics-and-best-practices.md
```

### Minimal Course (Quick Start)

```
content/courses/intro-to-business/
├── index.json
├── chapter-01.md
└── chapter-02.md
```

## Integration with Application

The application reads course content from this directory:

1. **Course List**: `lib/courses.ts` reads `catalog.json`
2. **Course Details**: Reads `index.json` from course directory
3. **Chapter Content**: Parses markdown files on demand
4. **Caching**: Uses Next.js ISR for performance

## Local Development

Test course content locally:

```bash
pnpm dev
```

Navigation to see your courses:
- Homepage: `http://localhost:3000`
- Course Catalog: `http://localhost:3000/courses`
- Specific Course: `http://localhost:3000/courses/your-course-slug`

## Content Updates

### Updating Existing Content

1. Edit the relevant markdown or JSON file
2. Update `updatedAt` in `index.json`
3. Commit and push changes
4. Koyeb automatically redeploys

### Versioning

Consider adding version info to `index.json`:

```json
{
  "version": "1.0.0",
  "changelog": [
    {
      "version": "1.0.0",
      "date": "2026-01-07",
      "changes": "Initial release"
    }
  ]
}
```

## Assets (Images, PDFs, etc.)

### Add to Public Directory

```
public/
├── courses/
│   ├── business-research-methods/
│   │   ├── diagram-01.png
│   │   ├── example-data.csv
│   │   └── reference-guide.pdf
```

### Reference in Markdown

```markdown
![Research Process Diagram](/courses/business-research-methods/diagram-01.png)

[Download Example Data](/courses/business-research-methods/example-data.csv)
```

## SEO Optimization

Add SEO metadata to `index.json`:

```json
{
  "seo": {
    "metaTitle": "Business Research Methods | NSBS",
    "metaDescription": "Learn research methodologies...",
    "keywords": [
      "business research",
      "research methods",
      "data analysis"
    ],
    "ogImage": "/courses/business-research-methods/og-image.jpg"
  }
}
```

## Accessibility

- Use descriptive alt text for images
- Ensure proper heading hierarchy
- Provide transcripts for any video content
- Use sufficient color contrast
- Test with screen readers

## Support

For questions about course content:
- Technical issues: Check `lib/fs-data.ts`
- Content guidelines: Review this README
- Deployment: See `docs/KOYEB_DEPLOYMENT.md`

---

**Ready to add your first course?** Create a new directory and follow the template above!
