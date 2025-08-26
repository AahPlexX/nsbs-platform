import { courseMetadataSchema, examQuestionFileSchema } from "@/lib/validation"

describe("Validation Schemas", () => {
  describe("courseMetadataSchema", () => {
    it("validates correct course metadata", () => {
      const validCourse = {
        title: "Test Course",
        description: "A test course",
        price: 299,
        currency: "USD",
        thumbnail: "/test.jpg",
      }

      const result = courseMetadataSchema.safeParse(validCourse)
      expect(result.success).toBe(true)
    })

    it("rejects invalid price", () => {
      const invalidCourse = {
        title: "Test Course",
        description: "A test course",
        price: -100,
        currency: "USD",
        thumbnail: "/test.jpg",
      }

      const result = courseMetadataSchema.safeParse(invalidCourse)
      expect(result.success).toBe(false)
    })
  })

  describe("examQuestionFileSchema", () => {
    it("validates correct exam question", () => {
      const validQuestion = {
        id: "q1",
        question: "What is 2+2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
      }

      const result = examQuestionFileSchema.safeParse(validQuestion)
      expect(result.success).toBe(true)
    })

    it("rejects question with insufficient options", () => {
      const invalidQuestion = {
        id: "q1",
        question: "What is 2+2?",
        options: ["4"],
        correctAnswer: 0,
      }

      const result = examQuestionFileSchema.safeParse(invalidQuestion)
      expect(result.success).toBe(false)
    })
  })
})
