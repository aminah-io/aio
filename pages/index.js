import Head from 'next/head';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = process.env.CONTRACT_ADDRESS;

export default function Home() {
  const [greeting, setGreetingValue] = useState('');
  const [fetchedGreeting, setFetchedGreeting] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        setFetchedGreeting(data)
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
    <div className='container mx-auto'>
      <Head>
        <title>aio</title>
        <meta name="description" content="Ethereum fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-10 mx-auto text-center max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <h1 className='text-8xl md:text-5xl sm:text-4xl xs:text-3xl'>The <span className='font-bold text-indigo-500'>AIO</span> Token</h1>
        <div className='container h-40 mt-8'>
          <div className='flex flex-col items-center bg-gray-200 w-8/12 mx-auto gap-y-1.5 p-2'>
            <button className='bg-indigo-800 w-48 h-10 text-white rounded-sm' onClick={fetchGreeting}>Fetch Greeting</button>
            <button className='bg-indigo-700 text-white rounded-sm w-48 h-10' onClick={setGreeting}>Set Greeting</button>
            <input className='text-center bg-gray-100 w-48 h-10 rounded-sm' onChange={e => setGreetingValue(e.target.value)} placeholder='Set greeting' />
          </div>
          <div className='container h-40 mt-8'>
            <div className='flex flex-col items-center bg-gray-200 w-8/12 h-16 mx-auto justify-center'>
              <div className='flex items-center justify-center bg-white w-4/12 h-12'>
                <p>{fetchedGreeting}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
