import { render, screen } from "@testing-library/react"
import { CourseCard } from "@/components/course/course-card"
import type { Course } from "@/lib/types"

const mockCourse: Course = {
  slug: "business-analytics",
  title: "Business Analytics Certification",
  description: "Master data-driven decision making",
  price: 299,
  currency: "USD",
  thumbnail: "/images/courses/business-analytics.jpg",
  lessons: [
    {
      id: "001",
      title: "Introduction to Analytics",
      content: "Learn the basics",
      order: 1,
    },
  ],
  examQuestions: [],
}

describe("CourseCard", () => {
  it("renders course information correctly", () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText("Business Analytics Certification")).toBeInTheDocument()
    expect(screen.getByText("Master data-driven decision making")).toBeInTheDocument()
    expect(screen.getByText("$299")).toBeInTheDocument()
  })

  it("displays course thumbnail with correct alt text", () => {
    render(<CourseCard course={mockCourse} />)

    const thumbnail = screen.getByAltText("Business Analytics Certification")
    expect(thumbnail).toBeInTheDocument()
    expect(thumbnail).toHaveAttribute("src", "/images/courses/business-analytics.jpg")
  })

  it("shows lesson count", () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText("1 lesson")).toBeInTheDocument()
  })
})
