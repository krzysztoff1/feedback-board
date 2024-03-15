import { memo } from "react";
import { Spotlight } from "./spotlight";
import Link from "next/link";

const ButtonRotateBorder = () => {
  return (
    <button className="relative inline-flex overflow-hidden rounded-xl p-px">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c2c2c2_0%,#505050_50%,#bebebe_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-neutral-950 px-4 py-2 text-sm font-medium text-gray-50 backdrop-blur-3xl">
        Get started
      </span>
    </button>
  );
};

export const Hero = memo(() => {
  return (
    <>
      <Spotlight fill="white" />
      <div className="flex h-[75vh] flex-col items-center justify-center px-4">
        <h1 className="balance text-center text-4xl font-bold text-white">
          Suggestion board your way
        </h1>
        <p className="mt-4 text-center text-white/90">
          Free and open source <i>forever</i>
        </p>

        <div className="mt-8">
          <Link href="/auth/signin">
            <ButtonRotateBorder />
          </Link>
        </div>
      </div>
    </>
  );
});

Hero.displayName = "Hero";
