import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* AI will fill the H1 and P content here */}
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
            Building the future <span className="text-zinc-500">of SaaS.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Replace this text with the project summary.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button variant="primary">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="secondary">View Demo</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
