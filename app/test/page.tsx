export default function TestPage() {
  return (
    <div style={{ padding: "20px", fontSize: "18px", color: "black", backgroundColor: "white" }}>
      <h1>Test Page</h1>
      <p>If you can see this, Next.js is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  )
}
