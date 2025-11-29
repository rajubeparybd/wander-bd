import { motion } from 'framer-motion';
import { FiMap, FiUsers, FiCamera, FiCompass, FiShield, FiStar, FiHeadphones, FiTrendingUp } from 'react-icons/fi';

const Overview = () => {
  const features = [
    {
      icon: FiMap,
      title: "50+ Destinations",
      description: "Handpicked locations across Bangladesh",
      color: "from-[#29AB87] to-[#06B6D4]",
    },
    {
      icon: FiUsers,
      title: "200+ Expert Guides",
      description: "Certified local professionals",
      color: "from-[#4F46E5] to-[#9333EA]",
    },
    {
      icon: FiShield,
      title: "100% Safe Travel",
      description: "Verified partners & insurance",
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      icon: FiStar,
      title: "4.9 Rating",
      description: "Based on 10k+ reviews",
      color: "from-[#9333EA] to-[#29AB87]",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      description: "Always here to help you",
      color: "from-[#29AB87] to-[#4F46E5]",
    },
    {
      icon: FiTrendingUp,
      title: "Best Prices",
      description: "Guaranteed lowest rates",
      color: "from-[#4F46E5] to-[#06B6D4]",
    },
  ];

  return (
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
              Wander BD
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best of Bangladesh with our trusted platform
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Overview;
