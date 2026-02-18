## Packages
recharts | Dashboard analytics charts for attendance and revenue
framer-motion | Page transitions and smooth animations
lucide-react | Icons for the interface (already in base, but emphasizing usage)
clsx | Utility for conditional class names (already in base)
tailwind-merge | Utility for merging tailwind classes (already in base)
date-fns | Date formatting for attendance and invoices

## Notes
- Theme: Education/Professional, clean blue/slate palette with vibrant accents.
- Layouts: Separate layouts for Public (Landing) and Dashboard (Admin/Student).
- Seat Map: 10x10 grid. Rows 1-2 restricted to '15_hours' plan.
- Charts: Recharts for attendance visualization.
- No real auth, using a mock login state stored in localStorage or Context.
