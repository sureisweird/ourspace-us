"use client";

import { motion } from "motion/react";
import { ArrowRight, Compass, Planet, Users, ShieldCheck } from "@phosphor-icons/react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
      },
    },
  } as const;

  return (
    <div className="min-h-dvh bg-black text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-900/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="h-20 w-full border-b border-zinc-900 px-6 md:px-12 flex items-center justify-between z-10 backdrop-blur-md bg-black/40 sticky top-0">
        <div className="flex items-center gap-2">
          <Planet size={24} weight="duotone" className="text-zinc-400" />
          <span className="font-mono text-xs tracking-[0.25em] font-semibold uppercase text-zinc-200">
            ourspace
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-zinc-400">
          <a href="#about" className="hover:text-white transition-colors">manifesto</a>
          <a href="#features" className="hover:text-white transition-colors">features</a>
          <a href="#docs" className="hover:text-white transition-colors">docs</a>
        </nav>

        <div>
          <button className="text-xs font-mono border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 text-zinc-300 px-4 py-2 rounded-full transition-all duration-300">
            connect
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-16 z-10">
        <motion.div 
          className="max-w-4xl w-full flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 mb-6"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
              Introducing OurSpace
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-7xl font-sans tracking-tighter leading-[1.05] text-white font-medium mb-6 max-w-3xl"
          >
            A shared space for <br />
            <span className="italic text-zinc-400 font-normal">collective minds</span>.
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            variants={itemVariants}
            className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-[60ch] mb-10"
          >
            A decentralized, secure digital sanctuary designed for creative groups to build, share, and collaborate together without friction.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center mb-24 justify-center"
          >
            <button className="group relative flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-mono font-medium text-black transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98]">
              Enter Space
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button className="flex h-11 items-center justify-center border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-6 text-xs font-mono font-medium text-zinc-400 hover:text-white rounded-full transition-all duration-300 active:scale-[0.98]">
              Read Manifesto
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-zinc-900"
        >
          {/* Card 1 */}
          <motion.div 
            variants={itemVariants}
            className="border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm p-8 rounded-2xl flex flex-col justify-between group hover:border-zinc-800 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400 group-hover:text-white transition-colors duration-300">
                <Compass size={20} weight="duotone" />
              </div>
              <h3 className="text-sm font-sans font-medium text-zinc-200 mb-2">Decentralized Hub</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Connect and sync peer-to-peer without relying on heavy centralized server silos.
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-600">01 / DECENTRALIZED</span>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={itemVariants}
            className="border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm p-8 rounded-2xl flex flex-col justify-between group hover:border-zinc-800 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400 group-hover:text-white transition-colors duration-300">
                <Users size={20} weight="duotone" />
              </div>
              <h3 className="text-sm font-sans font-medium text-zinc-200 mb-2">Group Spaces</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Create dedicated collaborative environments for your team, friends, or community.
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-600">02 / COLLABORATIVE</span>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={itemVariants}
            className="border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm p-8 rounded-2xl flex flex-col justify-between group hover:border-zinc-800 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={20} weight="duotone" />
              </div>
              <h3 className="text-sm font-sans font-medium text-zinc-200 mb-2">Zero-Knowledge Security</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Your content is fully encrypted end-to-end, keeping your private data genuinely private.
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-600">03 / END-TO-END</span>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="h-16 w-full border-t border-zinc-900 px-6 md:px-12 flex items-center justify-between text-xs font-mono text-zinc-600 z-10">
        <span>&copy; {new Date().getFullYear()} OurSpace Inc.</span>
        <span>built with intent.</span>
      </footer>
    </div>
  );
}
