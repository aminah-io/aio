import Head from 'next/head';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = process.env.CONTRACT_ADDRESS;

export default function Home() {
  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        console.log('data: ', data);
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className='container w-96 mx-auto'>
      <Head>
        <title>aio</title>
        <meta name="description" content="Ethereum fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-10 mx-auto text-center max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <h1 className='text-8xl md:text-5xl sm:text-4xl xs:text-3xl'>The <span className='font-bold text-indigo-500'>AIO</span> Token</h1>
        <div className='container mx-auto box-content h-40'>
          <div className='flex-col'>
            <button className='bg-indigo-800 w-48 h-10 text-white rounded-sm' onClick={fetchGreeting}>Fetch Greeting</button>
            <button onClick={setGreeting}>Set Greeting</button>
            <input onChange={e => setGreetingValue(e.target.value)} placeholder='Set greeting' />
          </div>
        </div>
      </main>
    </div>
  )
}
