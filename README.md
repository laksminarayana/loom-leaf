# Loom & Leaf

A React and Vite storefront for kidswear, festive outfits, and family looks.

## Run locally

```powershell
npm ci
npm run dev
```

## Build

```powershell
npm run build
```

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys
the site to GitHub Pages whenever changes are pushed to `main`.

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**. The project is configured for the repository URL:

`https://laksminarayana.github.io/loom-leaf/`

The storefront sends checkout order details to WhatsApp for confirmation.
It does not process online payments.
