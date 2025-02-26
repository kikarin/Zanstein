import { FaCode, FaMobileAlt, FaPalette, FaServer } from "react-icons/fa";

const services = [
  {
    title: "Website Development",
    icon: <FaCode className="text-4xl text-primary" />,
    description: "Membangun website cepat, responsif, dan SEO-friendly.",
  },
  {
    title: "Mobile App Development",
    icon: <FaMobileAlt className="text-4xl text-primary" />,
    description: "Membuat aplikasi mobile Android & iOS berkualitas tinggi.",
  },
  {
    title: "UI/UX Design",
    icon: <FaPalette className="text-4xl text-primary" />,
    description: "Merancang antarmuka pengguna yang menarik dan fungsional.",
  },
  {
    title: "Backend Development",
    icon: <FaServer className="text-4xl text-primary" />,
    description: "Membangun sistem backend yang scalable dan aman.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Judul Section */}
        <h2 className="text-4xl font-bold text-center text-primary mb-8">
          Layanan Kami
        </h2>

        {/* Grid Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2 text-center"
            >
              {/* Ikon */}
              <div className="mb-4 flex justify-center">{service.icon}</div>
              {/* Judul */}
              <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
              {/* Deskripsi */}
              <p className="text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
