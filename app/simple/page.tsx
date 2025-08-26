export default function SimpleHomePage() {
  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <header
        style={{
          padding: "20px",
          backgroundColor: "white",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ margin: 0, color: "#333" }}>National Society of Business Sciences</h1>
        <nav style={{ marginTop: "10px" }}>
          <a href="/coursecatalog" style={{ marginRight: "20px", color: "#666" }}>
            Courses
          </a>
          <a href="/verification" style={{ marginRight: "20px", color: "#666" }}>
            Verify Certificate
          </a>
          <a href="/contact" style={{ color: "#666" }}>
            Contact
          </a>
        </nav>
      </header>

      <main>
        <section
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "16px" }}>
            Professional Business Certifications
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            Advance your career with industry-recognized certifications in business sciences.
          </p>
          <a
            href="/coursecatalog"
            style={{
              backgroundColor: "#2d5a27",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            Get Started
          </a>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ color: "#333", marginBottom: "12px" }}>📚 Expert-Led Courses</h3>
            <p style={{ color: "#666" }}>
              Learn from industry professionals with real-world experience.
            </p>
          </div>

          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ color: "#333", marginBottom: "12px" }}>🏆 Industry Recognition</h3>
            <p style={{ color: "#666" }}>Earn certificates recognized by leading employers.</p>
          </div>

          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ color: "#333", marginBottom: "12px" }}>👥 Career Support</h3>
            <p style={{ color: "#666" }}>Get ongoing support for your professional development.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
