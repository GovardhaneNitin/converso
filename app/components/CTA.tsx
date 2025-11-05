"use client";

import Image from "next/image";
import { useNavigation } from "./NavigationProvider";

const Cta = () => {
  const { navigate, isLoading } = useNavigation();

  const handleBuildCompanion = () => {
    navigate("/companions/new");
  };

  return (
    <section className="cta-section">
      <div className="cta-badge">Start learning your way.</div>
      <h2 className="text-3xl font-bold">
        Build and Personalize Learning Companion
      </h2>
      <p>
        Pick a name, subject, voice, & personality — and start learning through
        voice conversations that feel natural and fun.
      </p>
      <Image src="images/cta.svg" alt="cta" width={362} height={232} />
      <button
        onClick={handleBuildCompanion}
        disabled={isLoading}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <p>{isLoading ? "Loading..." : "Build a New Companion"}</p>
      </button>
    </section>
  );
};

export default Cta;
