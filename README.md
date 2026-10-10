# Portfolio Frontend (React + Vite + Tailwind + React Router)
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```
- Edit your name/links: `src/data/site.js`
- Edit products & courses: `src/data/products.js`, `src/data/courses.js`
- Contact form posts to `VITE_API_URL/api/contact` (copy `.env.example` to `.env`)
- Hosting on Vercel/Netlify: add a rewrite of all routes to `/index.html` (Vercel: `vercel.json` included).
