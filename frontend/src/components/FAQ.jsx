import React, { useState } from "react";

const responses = {
  "What is a cavity and how is it treated?":
    "A cavity means tooth decay has created a hole in your enamel. We can treat it with a filling to prevent further damage. Schedule an appointment for an evaluation!",
  "What is scaling and why do I need it?":
    "Scaling is a deep cleaning procedure to remove plaque and tartar buildup, keeping your gums healthy. Let's book you in for a session!",
  "Why are my teeth stained and how can I fix it?":
    "Teeth stains can be caused by food, drinks, or habits like smoking. We offer professional teeth whitening and polishing to restore your bright smile!",
  "What are calcium stones on teeth?":
    "Calcium deposits can form on teeth due to mineral buildup. Scaling and polishing can help remove them and improve oral hygiene.",
  "What is a root canal and when is it needed?":
    "A root canal is a procedure to treat an infected or damaged tooth nerve. It helps relieve pain and save your tooth from extraction. Let's schedule a consultation!",
  "What causes tooth pain?":
    "Tooth pain can be caused by cavities, infections, sensitivity, or trauma. It's best to have an exam to determine the cause and provide the right treatment.",
  "Why do I have pain in multiple teeth?":
    "If you're experiencing pain in multiple teeth, it could be due to gum disease, cavities, or other dental issues. A check-up will help identify the cause.",
  "What dental services do you offer?":
    "We offer a range of dental services, including cleanings, fillings, orthodontics, teeth whitening, and more!",
  "What are your clinic hours?":
    "Our clinic is open from 10:00 AM to 11:00 PM, Saturday to Thursday. We are closed on Fridays. Feel free to book an appointment!",
  "Where is your clinic located?":
    "Aezal Dental Clinic is located at Shop # 03, R-74, Block-B, Gulshan-e-Millat, Korangi, Sector 10, Karachi. We'd love to see you!",
  "How can I book an appointment?":
    "You can book an appointment by calling 0315-2924704 or visiting our website at aezaldentalclinic.com. We look forward to seeing you!",
  "Do you offer emergency dental services?":
    "Yes, we provide emergency dental care. If you're experiencing severe pain or a dental emergency, contact us immediately!",
  "How much does dental treatment cost?":
    "The cost of treatment depends on the service provided. We offer consultations to discuss your needs and provide cost estimates.",
  "Do you accept insurance?":
    "Yes! We accept various insurance plans. Please check with us to see if your provider is covered.",
  "How often should I visit the dentist?":
    "It's recommended to visit the dentist every six months for routine checkups and cleanings to maintain optimal oral health.",
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Start with 3 questions

  const questions = Object.keys(responses);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, questions.length));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#661043] mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {questions.slice(0, visibleCount).map((question, index) => (
            <div key={index} className="bg-white rounded-xl shadow">
              <button
                className="w-full text-left p-4 font-medium text-fuchsia-700 hover:bg-fuchsia-50 rounded-t-xl flex justify-between items-center"
                onClick={() => toggleIndex(index)}
              >
                <span className="capitalize">{question}</span>
                <span>{activeIndex === index ? "−" : "+"}</span>
              </button>
              {activeIndex === index && (
                <div className="p-4 border-t text-gray-700">
                  {responses[question]}
                </div>
              )}
            </div>
          ))}
        </div>

        {visibleCount < questions.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-[#661043] hover:bg-[#47062b] text-white rounded transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
