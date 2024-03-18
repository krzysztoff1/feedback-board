import { memo } from "react";
import { Spotlight } from "./spotlight";
import Link from "next/link";

export const Hero = memo(() => {
  return (
    <>
      <Spotlight fill="white" />
      <div className="flex h-[75vh] flex-col items-center justify-center px-4">
        <h1 className="text-balance text-center text-4xl font-bold text-white">
          Suggestion board your way
        </h1>
        <p className="mt-4 text-center text-white/90">
          Free and open source <i>forever</i>
        </p>

        <div className="mt-8">
          <Link href="/auth/signin">
            <button className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline  shadow-2xl shadow-zinc-900">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,var(--primary),rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10 ">
                <span>Get started</span>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.75 8.75L14.25 12L10.75 15.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="to-primary-400/0 absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-primary/90 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
});

Hero.displayName = "Hero";
