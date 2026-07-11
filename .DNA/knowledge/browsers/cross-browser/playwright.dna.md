# Cross-Browser — Playwright Matrix

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
]
```

Run smoke on all; full suite on chromium + webkit minimum.
