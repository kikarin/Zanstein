const UpdateInfo = () => {
    const updates = [
      { date: "24 Feb 2025", info: "Kami menambahkan layanan baru: AI Development!" },
      { date: "10 Feb 2025", info: "Website baru kami kini lebih cepat dan responsif." },
    ];
  
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-primary text-center">Update Terbaru</h2>
        <ul className="mt-4 space-y-4">
          {updates.map((update, index) => (
            <li key={index} className="p-4 border border-primary rounded-lg">
              <p className="text-sm text-gray-400">{update.date}</p>
              <p className="mt-1">{update.info}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  };
  
  export default UpdateInfo;
  