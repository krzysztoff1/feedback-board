"use client";

import { memo } from "react";
import { Spotlight } from "./spotlight";
import { type Variants, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

const heroVariants: Variants = {
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.16,
      damping: 20,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      staggerChildren: 0.16,
      damping: 20,
      stiffness: 100,
    },
  },
};

export const Hero = memo(() => {
  return (
    <>
      <Spotlight fill="white" />

      <motion.div
        className="flex h-[75vh] flex-col justify-center px-4 sm:items-center"
        variants={heroVariants}
        animate="animate"
        initial="hidden"
      >
        <motion.h1
          className="relative z-10 max-w-xl text-balance bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text font-sans text-4xl font-bold text-transparent sm:text-center md:text-7xl"
          variants={heroVariants}
        >
          Feedback-driven product development
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl text-balance text-foreground/80 sm:text-center"
          variants={heroVariants}
        >
          {`Prioritize what to build next. Listen to your users. Keep track of what you're working on. Share your roadmap with the world.`}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col space-y-4 sm:items-center"
          variants={heroVariants}
        >
          <Button variant={"default"} className="max-w-xs px-8" asChild>
            <Link href="/auth/signin">Get started</Link>
          </Button>
          <Link
            href="https://suggestli.suggest.li?utm_source=suggestli&utm_medium=landing&utm_campaign=demo"
            className="text-md text-primary hover:underline"
          >
            See demo &rarr;
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
});

Hero.displayName = "Hero";
