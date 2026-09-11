/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../public/index.html',
    '../public/admin.html',
  ],
  safelist: [
    // Staff login button style variants (styleVariants)
    'bg-blue-100', 'text-blue-800', 'border-blue-200', 'hover:bg-blue-200',
    'bg-purple-100', 'text-purple-800', 'border-purple-200', 'hover:bg-purple-200',
    'bg-green-100', 'text-green-800', 'border-green-200', 'hover:bg-green-200',
    'bg-pink-100', 'text-pink-800', 'border-pink-200', 'hover:bg-pink-200',
    // Slot occupancy map (renderSlotMap)
    'bg-red-500', 'border-red-700', 'text-white',
    'bg-amber-400', 'border-amber-600', 'text-amber-950',
    'bg-green-200', 'border-green-400', 'text-green-900',
    'bg-gray-100', 'border-gray-300', 'text-gray-500',
    // Inventory card RTS style (cardStyle)
    'bg-white', 'border-2', 'border-gray-200',
    'bg-red-50', 'border-red-400', 'shadow-md',
    // Scan log stage colors
    'bg-green-50', 'border-green-300', 'text-green-800',
    'bg-yellow-50', 'border-yellow-300', 'text-yellow-800',
    'bg-red-50', 'border-red-300', 'text-red-800',
    'bg-blue-50', 'border-blue-300', 'text-blue-800',
    'bg-purple-50', 'border-purple-300', 'text-purple-800',
    // Outbound result card (cardBg / cardBorder)
    'border-red-500', 'border-4',
    'bg-gray-50',
    // Toast colors
    'bg-green-600', 'bg-red-600', 'bg-blue-600', 'bg-yellow-500', 'text-gray-900',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
