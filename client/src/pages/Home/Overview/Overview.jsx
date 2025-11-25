const Overview = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-10">
        
        {/* Text Content */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            Discover Bangladesh with Wander BD
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Wander BD is your ultimate travel companion. From the serene beaches of Cox’s Bazar to the lush greenery of Sylhet, we bring the most iconic and hidden destinations of Bangladesh to your fingertips. Learn about culture, food, heritage, and more — all in one place.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Explore top-rated tourist destinations</li>
            <li>Watch travel guides and trip stories</li>
            <li>Get inspired by real travel experiences</li>
            <li>Plan your own journey with ease</li>
          </ul>
        </div>

        {/* Responsive Video Embed */}
        <div className="lg:w-1/2 w-full">
          <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/ZEbc1hBX4Z4"
              title="The Most Amazing Places in Bangladesh"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
