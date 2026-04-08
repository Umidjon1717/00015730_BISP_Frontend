import { Building2, Users, Trophy, Truck, Clock, Shield } from "lucide-react";
import aboutHeroImage from "../../assets/images/aboutHeroImage.jpeg";
import Umidjon from "../../assets/images/Umidjon.jpg";
import Shaxriyor from "../../assets/images/Shaxriyor.jpg";
import Sitora from "../../assets/images/Sitora.jpg";
import Jaloliddin from "../../assets/images/Jaloliddin.jpg";
import Jahongir from "../../assets/images/Jahongir.jpg";

const leaders = [
  {
    name: "Shaxriyor Ziyodullayev",
    role: "CEO",
    image: Shaxriyor,
  },
  {
    name: "Umidjon Izzatullayev",
    role: "Head of Design",
    image: Umidjon,
  },
  {
    name: "Sitora Rashidova",
    role: "Operations Director",
    image: Sitora,
  },
  {
    name: "Jaloliddin Bahodirov",
    role: "Marketing Head",
    image: Jaloliddin,
  },
  {
    name: "Jahongir Qadamov",
    role: "Finance Manager",
    image: Jahongir,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[500px]">
        <img
          src={aboutHeroImage}
          alt="Modern furniture showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-6xl font-bold mb-6">
              Crafting Comfort & Style
            </h1>
            <p className="text-xl font-light">
              Since 2025, we've been transforming captivating furnitures into homes with our
              commitment to exceptional craftsmanship and timeless design.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            At Furnishings, we believe that every home deserves beautiful,
            high-quality furniture that brings comfort and joy to daily living.
            Our mission is to provide exceptional furniture pieces that combine
            timeless design with modern functionality, all while maintaining our
            unwavering commitment to sustainability and craftsmanship.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <Building2 className="w-16 h-16 text-[#B8860B] mx-auto mb-6" />
              <h3 className="text-5xl font-bold text-gray-900 mb-3">50+</h3>
              <p className="text-lg text-gray-600">Showrooms Worldwide</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <Users className="w-16 h-16 text-[#B8860B] mx-auto mb-6" />
              <h3 className="text-5xl font-bold text-gray-900 mb-3">
                100,000+
              </h3>
              <p className="text-lg text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <Trophy className="w-16 h-16 text-[#B8860B] mx-auto mb-6" />
              <h3 className="text-5xl font-bold text-gray-900 mb-3">25+</h3>
              <p className="text-lg text-gray-600">Design Awards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Shield className="w-12 h-12 text-[#B8860B] mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Quality Guaranteed
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Every piece of furniture undergoes rigorous quality testing to
              ensure lasting durability and satisfaction.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Truck className="w-12 h-12 text-[#B8860B] mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              White Glove Delivery
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Experience our premium delivery service with professional
              installation and setup in your home.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Clock className="w-12 h-12 text-[#B8860B] mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Expert Support
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our design consultants are available 24/7 to help you make the
              perfect choice for your space.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {leaders.map((leader, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover ring-4 ring-[#B8860B]/20 group-hover:ring-[#B8860B] transition-all duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <p className="text-lg text-[#B8860B]">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
