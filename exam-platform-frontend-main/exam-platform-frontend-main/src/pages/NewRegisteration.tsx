import React from 'react';

const NewRegistration = () => {
  const isRegistrationOpen = false; // Toggle this to enable/disable form

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
        {isRegistrationOpen ? (
          <>
            {/* Registration Form goes here (you can paste the form code above here) */}
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registration Closed</h2>
            <p className="text-gray-600">Thank you for your interest. Registration for this event is currently closed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRegistration;
