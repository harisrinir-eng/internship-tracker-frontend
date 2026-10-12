import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The React dev server runs on port 5173 (the Express API runs on 5000).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
