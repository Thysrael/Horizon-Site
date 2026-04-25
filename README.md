# Horizon Site

> After building [Horizon](https://github.com/Thysrael/Horizon), I found myself reflecting on a key question: What sets Horizon apart from the sea of **AI-powered** news aggregators?
>
> The answer lies in being **human-driven**.
>
> I believe the soul of a great news experience is the human touch. We all have our own unique tastes and go-to sources that define how we see the world.
>
> While Horizon already allows users to customize their feeds and engage with community discussions, I realized there was still a missing link: there was no simple way for people to actually share their curated news sources with others.
>
> That’s why I built this site to bridge that gap and celebrate personal curation.

## Getting Started

Clone the repository and initialize the Horizon submodule before running the site:

```bash
git clone https://github.com/Thysrael/Horizon-Site.git
cd Horizon-Site
git submodule update --init --recursive
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation Sources

This site serves docs from two places:

- `content/quick_start.md`
- `content/api.md`
- `content/about_us.md`
- `external/horizon/docs/configuration.md`
- `external/horizon/docs/scoring.md`
- `external/horizon/docs/scrapers.md`

The Horizon product repository is the single source of truth for `configuration`, `scoring`, and `scrapers`. Do not edit those pages in this repo.

If the docs submodule is missing, the app will fail loudly during startup/build so broken deployments do not silently ship empty docs.

## Commands

Use the following command to start the server after dependencies are installed:

```bash
yarn dev
```

Use the following command to migrate scheme when it changes:

```bash
npx prisma migrate dev --name <migrate_name>
```

Use the following command to edit database manually:

```bash
npx prisma studio
```
