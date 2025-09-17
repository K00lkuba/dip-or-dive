import React from 'react';
import { useNavigate } from 'react-router-dom';

const CaseStudyFAB: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/study/case/1');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[80] bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      title="Case Studies"
      aria-label="Open Case Studies"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
};

export default CaseStudyFAB;
