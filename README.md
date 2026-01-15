Running the Project (Vite)

### Prerequisites
- Node.js
- npm

### Install Dependencies
- `npm install`
- `npm run dev -- --host`
-  open at `http://localhost:5173`


### Setup Vite

- `npm create vite@latest`
- `touch vite.config.js`
```
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ["code.sunnyvault.com"],
    hmr: {
      clientPort: 443
    }
  }
});
```

### env vite configs

- env variables have to start with VITE. example : `VITE_API_KEY`
- to call env in Vite with JS `import.meta.env.VITE_API_KEY` 