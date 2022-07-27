# 🏵 GLD Vendor

## About

This project is a set of smart contracts and a UI which enables a user to buy and sells ERC-20 tokens (GLDs).

I am leveraging eth-hooks, and using [this design](https://www.figma.com/file/KXrIvKLSGnH3AfIzFIJvu6/GLD-Token-Vendor?node-id=0%3A1) to style the page.

The smart contract logic is sourced from my submission to [scaffold-eth challenge 2](https://speedrunethereum.com/challenge/token-vendor).
The contract and out-of-the-box UI can be found on my [buidlguidl profile](https://buidlguidl.com/builders/0x74503D89E994e5e6FE44Ba3BBD09e048F0185403).

You can watch the live coding session for this project [here](https://tinyurl.com/2p9mn5ks) (starts at 34:00).

## Quick Start

### Commands to run the app

Running the app

1. install your dependencies, `open a new command prompt`

   ```bash
   yarn install
   ```

2. start a hardhat node

   ```bash
   yarn chain
   ```

3. run the app, `open a new command prompt`

   ```bash
   # build hardhat & external contracts types
   yarn contracts:build
   # deploy your hardhat contracts
   yarn deploy
   # start the app (vite)
   yarn start
   ```

4. If you'd like to run the nextjs app, `open a new command prompt`

   ```bash
   # start nextjs app
   yarn start:next

   ```

5. other commands

   ```bash
   # rebuild all contracts, incase of inconsistent state
   yarn contracts:rebuild
   # run hardhat commands for the workspace, or see all tasks
   yarn hardhat 'xxx'
   # get eth for testing locally
   yarn hardhat faucet xxx
   ```



### Environment Variables

Vite and NextJs app folders have `.env` files. To create local variables that overrride these, create a file called `.env.local`, or `.env.development.local` or `.env.production.local` and put your overrides in there.

You can set your `TARGET_NETWORK` with them.


<br/><br/><br/>
