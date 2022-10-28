This is a [lens](https://lens.xyz/) with [Next.js](https://nextjs.org/) and [Tailwind](https://tailwindcss.com/) template to bootstrap your web3 social-media dApp 🚀

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
```

Create an env.local file (like the env.example one)
Then set up your endpoint (infura / alchemy / ...).
Explain how

Run `npm run dev`. It will generate lens types and documents that will
be used in your queries and mutation later on.

## Stack

- apollo
- wagmi
- connectkit
- [codegen](https://the-guild.dev/graphql/codegen/docs/getting-started) to generate lens type and get
  a better developer experience (auto-completion) and a safer code. The typescript-react-apollo plugin lets
  you consume your graphql trough a generated react hook:

```js
# Put an example here
```

## login flow

1. In that file, the user clicks on connect button, selects its account. Under the hood, Lens API is called for authentication and if the user has got an account, sends back a token that is set in localstorage
2. During re-renderig, apollo (link to the file) set the token in his header
3. Login logic(login, logout, errors) is in that file.

## Typescript

Set to `"strict": true`. baseUrl is `"."` so imports are always relative to base directory (no more `"../.."`), and baseUrl is set for `"src/*"` as `"@/*"` and for `"public/images"` as "`@images/*"`
