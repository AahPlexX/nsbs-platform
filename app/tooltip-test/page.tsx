import { Tooltip } from "@/components/ui/tooltip"

export default function TooltipTest() {
  return (
    <div className="p-8 space-y-4">
      <h1>Tooltip Test Page</h1>

      <div className="space-y-4">
        <Tooltip content="This is a top tooltip">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Hover me (top)
          </button>
        </Tooltip>

        <Tooltip content="This is a right tooltip" place="right">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Hover me (right)
          </button>
        </Tooltip>

        <Tooltip content="This is a bottom tooltip" place="bottom">
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Hover me (bottom)
          </button>
        </Tooltip>

        <Tooltip content="This is a left tooltip" place="left">
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Hover me (left)
          </button>
        </Tooltip>
      </div>

      <div>
        <p>The tooltips above should show when you hover over the buttons.</p>
        <p>This implementation uses a custom CSS-based tooltip instead of external libraries.</p>
        <p>✅ No external dependencies required</p>
        <p>✅ Lightweight and performant</p>
        <p>✅ Maintains compatibility with existing sidebar usage</p>
      </div>
    </div>
  )
}
