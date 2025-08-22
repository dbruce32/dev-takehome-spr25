"use client";

import { useState } from "react";

export default function Kewl() {
  const [cookies, setCookies] = useState(0);
  const [addend, setAddend] = useState(1);
  const [cost, setCost] = useState(15);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary text-white gap-5 text-2xl text-center">
      {/* 
      Write something unique about you here! 
      It could be a club you're part of, a weird skill you have, or something special that happened to you.
      Feel free to put links, images, whatever! 
      Don't worry about styling- we aren't grading you on this- it's just to get to know you better! :) 
      */}
      Hi, I'm Dylan! I'm a third year CS major + Mathematics Minor with a passion for building cool stuff! I enjoy working with React.js and have the most experience with it.
      <br />
      Even though TypeScript is new to me, I enjoy learning new technologies! It's a challenge, but a welcome one especially when it comes to simplifying my the difficulty of my work.
      <br />
      In my free time, I enjoy hiking, going to the gym, and playing video games. I've recently been addicted to Pokemon Go and Cookie Clicker.
      <br />
      <br />
      Here's a picture of me playing Pokemon Go on a recent hike:
      <br />
      <img src="https://drive.google.com/thumbnail?id=1yRr71TTjmhK-l7JTIGCw0Isp6CyW19ZQ&sz=w1000" alt="Hiking" className="w-[430px] h-auto rounded-lg shadow-lg mt-2"/>
      <br />
      And here's a mini version of Cookie Clicker to showcase the required amount of "cool":


      {/* Cookie Clicker Game */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <span className="text-3xl">🍪 Cookies: {cookies}</span>
        <button
          className="px-6 py-2 bg-yellow-400 text-black rounded-full shadow-lg hover:bg-yellow-500 transition font-bold text-xl"
          onClick={() => setCookies(cookies + addend)}
        >
          Click for Cookie! (+{addend} cookies)
        </button>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition font-bold text-xl"
          onClick={() => {
            if (cookies >= 15) {
              setCookies(cookies - cost);
              setAddend(addend + 1);
              var log = customLogarithm(2, cost);
              setCost(Math.trunc(cost + log));
            }
          }}
          disabled={cookies < cost}
        >
          Upgrade: +1 cookies/click (Cost: {cost} cookies)
        </button>
      </div>
      <br />
      Thank you for considering my application! I hope this gives you a glimpse into who I am and what I can bring to the team. Looking forward to hearing from you!
    </div>
  );

  /* I made this because bc I thought I'd be using something other than base 2 for the cost growth function lol */
  function customLogarithm(base: number, value: number) {
    return Math.log(value) / Math.log(base);
  }
}
