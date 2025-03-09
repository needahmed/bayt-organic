"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

export default function AnimatedLeaf({ className = "", delay = 0 }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const leafVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: delay,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.svg
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={leafVariants}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21 3C21 3 18.5 3 15.5 5.5C12.5 8 12 10 12 10C12 10 10 9.5 7.5 6.5C5 3.5 3 3 3 3C3 3 2 8 6 12C10 16 12 16 12 16C12 16 12 18 8 20M12 10C12 10 12 12 14 14C16 16 18 16 18 16C18 16 19 11 15 7C11 3 3 3 3 3"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

