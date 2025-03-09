"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Leaf, Heart, ShieldCheck, Users } from "lucide-react"
import AnimatedLeaf from "@/components/animated-leaf"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-green-800 mb-4">Our Story</h1>
          <p className="text-green-700 max-w-3xl mx-auto text-lg">
            Discover the journey behind Bayt Organic and our commitment to natural, handmade products
          </p>
        </motion.div>

        {/* Our Beginning */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-100 rounded-full -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-100 rounded-full -z-10" />
            <Image
              src="/placeholder.svg?height=600&width=600&text=Our+Beginning"
              alt="Bayt Organic Beginnings"
              width={600}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl font-bold text-green-800 mb-6">Our Beginning</h2>
            <p className="text-green-700 mb-4">
              Bayt Organic, meaning "home" in Arabic, was born from a passion for creating natural products that nurture
              both body and soul. Our journey began in 2018 in a small kitchen in Karachi, where our founder
              experimented with traditional soap-making techniques passed down through generations.
            </p>
            <p className="text-green-700 mb-4">
              What started as a hobby quickly grew into a mission: to provide people with truly natural alternatives to
              the chemical-laden products that dominate the market. We believe that what we put on our bodies should be
              as pure and natural as what we put in them.
            </p>
            <p className="text-green-700 mb-6">
              Every Bayt Organic product is handcrafted in small batches using traditional methods and the finest
              natural ingredients. We take pride in our commitment to sustainability, using eco-friendly packaging and
              ethically sourced materials.
            </p>
            <div className="flex items-center">
              <AnimatedLeaf className="h-6 w-6 mr-2" />
              <span className="text-green-800 font-medium">Est. 2018 in Karachi, Pakistan</span>
            </div>
          </motion.div>
        </div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl font-bold text-green-800 mb-4">Our Values</h2>
          <p className="text-green-700 max-w-3xl mx-auto">The principles that guide everything we do at Bayt Organic</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: <Leaf className="h-10 w-10 text-green-600" />,
              title: "Natural Ingredients",
              description:
                "We use only the finest natural ingredients, sourced ethically and sustainably. No harmful chemicals, ever.",
            },
            {
              icon: <Heart className="h-10 w-10 text-pink-500" />,
              title: "Handcrafted with Love",
              description:
                "Each product is handmade in small batches, ensuring quality and care in every item we create.",
            },
            {
              icon: <ShieldCheck className="h-10 w-10 text-green-700" />,
              title: "Environmental Responsibility",
              description:
                "We're committed to eco-friendly practices, from our ingredients to our minimal, recyclable packaging.",
            },
            {
              icon: <Users className="h-10 w-10 text-green-600" />,
              title: "Community Impact",
              description:
                "We support local communities by sourcing locally when possible and creating sustainable employment.",
            },
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                {value.icon}
              </div>
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-2">{value.title}</h3>
              <p className="text-green-700">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Process */}
        <div className="bg-green-50 rounded-lg p-8 md:p-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl font-bold text-green-800 mb-4">Our Process</h2>
            <p className="text-green-700 max-w-3xl mx-auto">How we create our natural, handmade products</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sourcing",
                description:
                  "We carefully select the finest natural ingredients, prioritizing organic and locally-sourced materials whenever possible.",
              },
              {
                step: "02",
                title: "Crafting",
                description:
                  "Each product is handmade in small batches using traditional methods that preserve the natural goodness of the ingredients.",
              },
              {
                step: "03",
                title: "Quality Control",
                description:
                  "Every item undergoes rigorous testing to ensure it meets our high standards for quality, effectiveness, and purity.",
              },
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-playfair font-bold text-green-200 absolute -top-6 left-0">
                  {process.step}
                </div>
                <div className="pt-8">
                  <h3 className="font-playfair text-xl font-bold text-green-800 mb-2">{process.title}</h3>
                  <p className="text-green-700">{process.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meet the Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl font-bold text-green-800 mb-4">Meet the Team</h2>
          <p className="text-green-700 max-w-3xl mx-auto">The passionate people behind Bayt Organic</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              name: "Amina Khan",
              role: "Founder & Creative Director",
              image: "/placeholder.svg?height=400&width=400&text=Amina",
              bio: "With a background in chemistry and a passion for natural living, Amina founded Bayt Organic to share her love for traditional, natural skincare.",
            },
            {
              name: "Tariq Ahmed",
              role: "Production Manager",
              image: "/placeholder.svg?height=400&width=400&text=Tariq",
              bio: "Tariq oversees our production process, ensuring each product meets our high standards for quality and sustainability.",
            },
            {
              name: "Zara Malik",
              role: "Herbalist & Formulator",
              image: "/placeholder.svg?height=400&width=400&text=Zara",
              bio: "With extensive knowledge of traditional herbal remedies, Zara develops our unique formulations using the finest natural ingredients.",
            },
          ].map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-1">{member.name}</h3>
              <p className="text-pink-500 mb-2">{member.role}</p>
              <p className="text-green-700">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-pink-50 rounded-lg p-8 md:p-12 text-center"
        >
          <h2 className="font-playfair text-3xl font-bold text-green-800 mb-4">Join the Bayt Organic Family</h2>
          <p className="text-green-700 max-w-3xl mx-auto mb-6">
            Experience the difference of truly natural, handmade products. Explore our collection and become part of our
            growing community of natural living enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/products/soaps">Shop Our Products</Link>
            </Button>
            <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

