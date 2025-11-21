import PropTypes from "prop-types";

const AboutTour = ({ title, description }) => {
  return (
    <section className="my-10 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 border-b-2 pb-2 border-primary">{title}</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        {description}
      </p>
    </section>
  );
};

AboutTour.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default AboutTour;
