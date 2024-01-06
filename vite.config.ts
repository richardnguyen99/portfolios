import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src", "components"),
      "@contexts": path.resolve(__dirname, "src", "contexts"),
      "@commands": path.resolve(__dirname, "src", "commands"),
    }
  }
});
