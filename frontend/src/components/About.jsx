import React, { useState } from 'react';
import { Clock, Award, Heart, Smile } from "lucide-react";

const features = [
  {
    icon: <Clock className="h-8 w-8 text-[#47062b]" />,
    title: "Convenient Hours", 
    description: "Open 7 days a week with extended evening hours"
  },
  {
    icon: <Award className="h-8 w-8 text-[#47062b]" />,
    title: "Certified Experts", 
    description: "Board-certified dentists with specialized training"
  },
  {
    icon: <Heart className="h-8 w-8 text-[#47062b]" />,
    title: "Patient-Focused Care", 
    description: "Personalized treatment plans for every patient"
  },
  {
    icon: <Smile className="h-8 w-8 text-[#47062b]" />,
    title: "Modern Techniques", 
    description: "State-of-the-art equipment and procedures"
  }
];

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#661043] mb-12">About Our Practice</h2>
        
        <div className="mb-8 flex flex-wrap justify-center border-b">
          <button 
            onClick={() => setActiveTab('mission')}
            className={`px-4 py-2 mx-2 mb-4 font-medium transition-colors ${activeTab === 'mission' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-600 hover:text-fuchsia-500'}`}
          >
            Our Mission
          </button>
          <button 
            onClick={() => setActiveTab('story')}
            className={`px-4 py-2 mx-2 mb-4 font-medium transition-colors ${activeTab === 'story' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-600 hover:text-fuchsia-500'}`}
          >
            Our Story
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'mission' && (
            <div className="fade-in">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-xl font-semibold text-fuchsia-700 mb-4">Our Mission & Values</h3>
                <p className="text-gray-700 mb-6">
                  At Aezal Dental Clinic, our mission is to provide exceptional dental care in a comfortable, friendly environment. We believe everyone deserves a healthy smile and access to quality dental services.
                </p>
                <p className="text-gray-700 mb-8">
                  Our practice is built on the core values of integrity, compassion, excellence, and innovation. We strive to use the latest dental technologies while maintaining the personal touch that makes our patients feel at home.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="mb-4 flex justify-center">
                        {feature.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-fuchsia-700 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'story' && (
            <div className="fade-in">
              <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl mx-auto">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <h3 className="text-center text-xl font-semibold text-fuchsia-700 mb-4">Our Journey</h3>
                  <p className="text-gray-700 mb-4">
                    Aezal Dental Clinic was founded in 2024 by Dr. Babar Mansoor with a vision to create a dental practice that combines clinical excellence with genuine patient care.
                  </p>
                  <p className="text-gray-700 mb-4">
                    What started as a small practice with just two treatment rooms has grown into a comprehensive dental center serving thousands of patients in our community.
                  </p>
                  <p className="text-gray-700">
                    Today, our modern facility features state-of-the-art equipment, a team of specialized dentists, and a commitment to the same personalized approach that has been our hallmark since day one.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-blue-700 mb-4">Our Achievements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
                    <p className="text-gray-700">Happy Patients</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
                    <p className="text-gray-700">Years Combined Experience</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                    <p className="text-gray-700">Industry Awards</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default About;
