// import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
// import { createConfig, http} from 'wagmi';
// import { injected, walletConnect} from 'wagmi/connectors';
// import { del, get, set } from 'idb-keyval';
// import  { type CreateConfigParameters } from 'wagmi'
// import { cookieStorage, createStorage } from 'wagmi'
// import { bsc, bscTestnet} from 'wagmi/chains'

// // Get projectId from https://cloud.walletconnect.com
// export const projectId = "63558681e97bc637163b97886dd8bb75"

// if (!projectId) throw new Error('Project ID is not defined')

// const metadata = {
//   name: '   ',
//   description: 'Web3Modal Example',
//   url: 'https://web3modal.com', // origin must match your domain & subdomain
//   icons: ['https://avatars.githubusercontent.com/u/37784886']
// }

// // Create wagmiConfig

// export const config = createConfig({
//   chains : [ bsc, bscTestnet],
//   connectors: [
//     injected({ shimDisconnect : true}),
//     walletConnect({projectId: projectId, showQrModal: false, metadata})
//   ],
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage
//   }),
//   transports: {
//     [bsc.id]: http("https://bsc-dataseed1.defibit.io"),
//     [bscTestnet.id]: http("https://bsc-testnet-rpc.publicnode.com")
//   } 
// })

// declare module 'wagmi'{interface Register { config: typeof config}}