import { motion } from 'framer-motion';
import { FiMapPin, FiUsers, FiAward, FiHeart, FiShield, FiTrendingUp, FiTarget, FiCompass } from 'react-icons/fi';

const AboutUs = () => {
  const features = [
    {
      icon: FiMapPin,
      title: "50+ Destinations",
      description: "Carefully curated locations across Bangladesh showcasing natural beauty and cultural heritage",
      color: "from-[#29AB87] to-[#06B6D4]",
    },
    {
      icon: FiUsers,
      title: "Expert Guides",
      description: "200+ certified local professionals passionate about sharing Bangladesh's wonders",
      color: "from-[#4F46E5] to-[#9333EA]",
    },
    {
      icon: FiShield,
      title: "Safe & Secure",
      description: "100% verified partners with comprehensive insurance and safety protocols",
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      icon: FiAward,
      title: "Award Winning",
      description: "Recognized as Bangladesh's #1 travel platform with 4.9/5 rating",
      color: "from-[#9333EA] to-[#29AB87]",
    },
  ];

  const values = [
    {
      icon: FiHeart,
      title: "Passion",
      description: "We love Bangladesh and are dedicated to showcasing its beauty to the world",
    },
    {
      icon: FiTarget,
      title: "Excellence",
      description: "Committed to delivering exceptional experiences that exceed expectations",
    },
    {
      icon: FiCompass,
      title: "Adventure",
      description: "Encouraging exploration and discovery of hidden gems across the nation",
    },
    {
      icon: FiTrendingUp,
      title: "Growth",
      description: "Supporting local communities and sustainable tourism development",
    },
  ];

  const stats = [
    { number: "10k+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "200+", label: "Expert Guides" },
    { number: "4.9", label: "Average Rating" },
  ];

  const team = [
    {
      name: "Rakib Hassan",
      role: "Founder & CEO",
      image: "https://i.pravatar.cc/300?img=12",
      description: "Passionate traveler with 15+ years exploring Bangladesh",
    },
    {
      name: "Nusrat Jahan",
      role: "Head of Operations",
      image: "https://i.pravatar.cc/300?img=47",
      description: "Expert in tourism management and customer experience",
    },
    {
      name: "Fahim Ahmed",
      role: "Lead Tour Guide",
      image: "https://i.pravatar.cc/300?img=33",
      description: "Certified guide specializing in cultural and heritage tours",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#29AB87]/30 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#4F46E5]/30 rounded-full filter blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 bg-[#29AB87]/10 text-[#29AB87] rounded-full text-sm font-bold mb-6"
            >
              Our Story
            </motion.span>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              About{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Wander BD
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connecting travelers with the authentic beauty and rich culture of Bangladesh through unforgettable experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Our{' '}
                <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At Wander BD, we believe Bangladesh is a treasure trove of natural wonders, cultural richness, and warm hospitality waiting to be discovered. Our mission is to make authentic travel experiences accessible to everyone while supporting local communities and promoting sustainable tourism.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We connect passionate travelers with expert local guides who share their knowledge, stories, and love for this beautiful country. Every journey with us is designed to create lasting memories while respecting local cultures and preserving natural environments.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-black text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  Join Our Community
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop"
                  alt="Bangladesh landscape"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 max-w-[250px]">
                <div className="text-4xl font-black text-[#29AB87] mb-2">10,000+</div>
                <div className="text-sm text-gray-600">Travelers have explored Bangladesh with us</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-5xl md:text-6xl font-black mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Why Choose{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Us
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Our{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="text-center"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full">
                  <div className="w-16 h-16 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Meet Our{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to your travel experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden">
                  <div className="relative h-80 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <div className="text-[#29AB87] font-semibold mb-3">{member.role}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of travelers discovering the beauty of Bangladesh
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-black font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Explore Trips Now →
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;