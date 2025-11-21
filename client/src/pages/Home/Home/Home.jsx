import React from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismAndGuide from '../TourismAndGuide/TourismAndGuide';
import TouristStories from '../TouristStories/TouristStories';
import CoverageMap from '../CoverageMap/CoverageMap';
import PlanYourTrip from '../PlanYourTrip/PlanYourTrip';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Overview></Overview>
            <TourismAndGuide></TourismAndGuide>
            <TouristStories></TouristStories>
            <CoverageMap></CoverageMap>
            <PlanYourTrip></PlanYourTrip>
            
        </div>
    );
};

export default Home;