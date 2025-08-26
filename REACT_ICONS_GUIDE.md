# React Icons Integration Guide

React Icons has been successfully added to the NSBS project! This library
provides a comprehensive collection of popular icon libraries as React
components.

## Available Icon Libraries

React Icons includes the following icon families:

- **Font Awesome (FA)** - `react-icons/fa`
- **Material Design (MD)** - `react-icons/md`
- **Ant Design (AI)** - `react-icons/ai`
- **Bootstrap Icons (BI)** - `react-icons/bi`
- **Heroicons (HI)** - `react-icons/hi`
- **Ionicons (IO)** - `react-icons/io5`
- **Feather Icons (FI)** - `react-icons/fi`
- **React Icons (RI)** - `react-icons/ri`
- **Game Icons (GI)** - `react-icons/gi`
- **Weather Icons (WI)** - `react-icons/wi`
- **Dev Icons (DI)** - `react-icons/di`
- **Simple Icons (SI)** - `react-icons/si`
- **Tabler Icons (TB)** - `react-icons/tb`
- **VS Code Icons (VS)** - `react-icons/vsc`

## Basic Usage

### 1. Import the icons you need

```typescript
import { FaHome, FaUser, FaEnvelope } from "react-icons/fa"
import { MdSettings, MdNotifications } from "react-icons/md"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
```

### 2. Use them as React components

```typescript
function MyComponent() {
  return (
    <div>
      <FaHome />
      <FaUser className="text-blue-500" />
      <MdSettings size={24} color="red" />
    </div>
  );
}
```

## Common Props

All React Icons support these props:

- `size` - Icon size (number or string)
- `color` - Icon color
- `className` - CSS classes
- `style` - Inline styles
- `onClick` - Click handler
- Any other HTML attributes

```typescript
<FaHome
  size={24}
  color="#3B82F6"
  className="hover:text-blue-600 cursor-pointer"
  onClick={() => console.log('Home clicked')}
/>
```

## Integration with Tailwind CSS

React Icons work seamlessly with Tailwind CSS:

```typescript
<div className="flex items-center space-x-2">
  <FaUser className="text-blue-500 hover:text-blue-600 transition-colors" />
  <span>User Profile</span>
</div>

<button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  <MdSettings className="w-5 h-5" />
  <span>Settings</span>
</button>
```

## Usage Examples in NSBS Project

### Navigation Icons

```typescript
import { FaHome, FaBook, FaCertificate, FaUser } from 'react-icons/fa';

<nav>
  <FaHome /> Home
  <FaBook /> Courses
  <FaCertificate /> Certificates
  <FaUser /> Profile
</nav>;
```

### Form Icons

```typescript
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

<div className="relative">
  <MdEmail className="absolute left-3 top-3 text-gray-400" />
  <input className="pl-10" placeholder="Email" />
</div>;
```

### Action Icons

```typescript
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';

<div className="flex space-x-2">
  <AiOutlineEye className="cursor-pointer text-blue-500" />
  <AiOutlineEdit className="cursor-pointer text-green-500" />
  <AiOutlineDelete className="cursor-pointer text-red-500" />
</div>;
```

### Status Icons

```typescript
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

<div className="flex items-center space-x-2">
  <FaCheckCircle className="text-green-500" />
  <span>Course Completed</span>
</div>;
```

## Best Practices

1. **Consistent Icon Family**: Try to use icons from the same family within a
   component for visual consistency
2. **Size Consistency**: Use consistent sizes for similar actions/elements
3. **Accessibility**: Add `aria-label` for screen readers when icons are
   standalone
4. **Performance**: Only import the specific icons you need

```typescript
// Good - specific imports
import { FaHome, FaUser } from "react-icons/fa"

// Avoid - importing entire library
import * as Icons from "react-icons/fa"
```

## Finding Icons

Visit
[react-icons.github.io/react-icons](https://react-icons.github.io/react-icons/)
to:

- Browse all available icons
- Search for specific icons
- Copy import statements
- Preview icons

## TypeScript Support

React Icons includes full TypeScript support out of the box. All icons are
properly typed React components.

## Example Component

See `components/ui/icon-examples.tsx` for a comprehensive example showing
different icon families and usage patterns.

## Migration from Lucide React

If you're replacing Lucide React icons, here's a quick reference:

| Lucide     | React Icons Alternative            |
| ---------- | ---------------------------------- |
| `Home`     | `FaHome` (fa) or `HiHome` (hi)     |
| `User`     | `FaUser` (fa) or `HiUser` (hi)     |
| `Settings` | `FaCog` (fa) or `HiCog` (hi)       |
| `Mail`     | `FaEnvelope` (fa) or `HiMail` (hi) |

Both libraries can coexist in the project if needed.
