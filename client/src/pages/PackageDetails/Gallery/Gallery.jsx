import PropTypes from "prop-types";

const Gallery = ({ images }) => {
  return (
    <section className="my-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Tour Gallery</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            <img
              src={img}
              alt={`Tour Image ${idx + 1}`}
              className="w-full h-60 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Gallery;
