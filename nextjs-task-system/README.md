This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Drizzle set up

This project has 3 drizzle scripts set up on the package.json

To run migrations
`npm run orm:migrate`

To create a new migration
`npm run orm:generate`

To run the studio database manager
`npm run orm:studio`

## Oauth

For Oauth I used github as a session provider, to set up you only need to go to github.com and generate a new oauth integration, then fill in the
.env variables
