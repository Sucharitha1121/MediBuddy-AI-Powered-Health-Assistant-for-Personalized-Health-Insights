import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
     <div className='flex flex-col md:flex-row items-start px-8 md:px-0
     justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>

      <div className='flex flex-col md:items-start items-center w-full'>
          <h1 className='text-white text-2xl font-bold'>MediBuddy</h1>
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            MediBuddy is your AI-powered personal health assistant that offers personalized recommendations based on your medical records. We ensure complete privacy with local AI execution, intelligent document processing, and secure health data management.
          </p>
      </div>
      <div className='flex flex-col md:items-start items-center w-full'>
        <h2 className='font-semibold text-white mb-5'>MediBuddy</h2>
        <ul className='flex md:flex-col w-full justify-between text-sm text-white'>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About us</a>
          </li>
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">Privacy policy</a>
          </li>
        </ul>
      </div>
      <div className='hidden md:flex flex-col items-start w-full'>
        <h2 className='font-semibold text-white mb-5'>
          Stay updated on health innovations
        </h2>

        <p className='text-sm text-white/80'>
        Subscribe to receive the latest updates, health tips, and MediBuddy feature announcements.</p>

        <div className='mt-2 flex gap-2'>
          <input type="email" placeholder='Enter your email'
          className='border border-gray-500/30 bg-gray-800 text-gray-500
          placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'/>
          <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
        </div>
      </div>
     </div>
     <p className='py-4 text-center text-xs md:text-sm text-white/60'>
       Copyright 2025 © MediBuddy. All Rights Reserved. Powered by OpenHealth for All.
     </p>
    </footer>
  )
}

export default Footer