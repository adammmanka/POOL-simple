// https://mainnet.infura.io/v3/9f6eb0e0e09b4214bdbdd08344e8b338
// 0xc2e9213fe0aaf5ee55e4bbe665935c2df94af13d

// for commonJS compile 
// const { ethers } = require('ethers')
// node --loader ts-node/esm --experimental-json-modules --experimental-specifier-resolution=node 

import { ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
// import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import pkg from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
const { abi: IUniswapV3PoolABI } = pkg;
const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/9f6eb0e0e09b4214bdbdd08344e8b338");

const poolAddress = "0xc2e9213fe0aaf5ee55e4bbe665935c2df94af13d";

const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  provider
);

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

async function getPoolImmutables() {
  const immutables: Immutables = {
    factory: await poolContract.factory(),
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    fee: await poolContract.fee(),
    tickSpacing: await poolContract.tickSpacing(),
    maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
  };
  return immutables;
}

async function getPoolState() {
  const slot = await poolContract.slot0();
  const PoolState: State = {
    liquidity: await poolContract.liquidity(),
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };
  return PoolState;
}

async function main() {
  const immutables = await getPoolImmutables();
  const state = await getPoolState();
  const TokenA = new Token(1, immutables.token0, 8, "USDC", "USD Coin");
  const TokenB = new Token(1, immutables.token1, 6, "PCUSDC", "PoolTogether USDC Tickets");

  const poolExample = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );
  console.log(poolExample);
}

export default main();