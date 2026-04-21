import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'node',
    restoreMocks: true,
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/components/**/*', 
        'src/app/**/*',        
        'src/db/**/*',         
        'src/types/**/*',      
        'src/lib/**/*',       
      ],
    },
  },
});