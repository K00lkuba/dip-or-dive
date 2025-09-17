import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { caseStudy1 } from './sampleData';
import { CaseStudyState } from './types';

const CaseStudyPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const caseStudy = caseStudy1; // In future, this could be dynamic based on caseId
  
  const [state, setState] = useState<CaseStudyState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    showAnswer: false
  });

  const currentQuestion = caseStudy.questions[state.currentQuestionIndex];
  const userAnswer = state.userAnswers[currentQuestion.id] || '';

  const handleAnswerChange = (value: string) => {
    setState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQuestion.id]: value
      }
    }));
  };

  const handleCheckAnswer = () => {
    setState(prev => ({
      ...prev,
      showAnswer: true
    }));
  };

  const handleNextQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, caseStudy.questions.length - 1),
      showAnswer: false
    }));
  };

  const handlePrevQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
      showAnswer: false
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseStudy.title}</h1>
          <div className="text-sm text-gray-600">
            Question {state.currentQuestionIndex + 1} of {caseStudy.questions.length}
          </div>
        </div>

        {/* Case Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Case Information</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {caseStudy.case}
            </pre>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Question {currentQuestion.number}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {currentQuestion.text}
          </p>

          {/* Answer Input */}
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Type your answer here..."
              disabled={state.showAnswer}
            />
          </div>

          {/* Check Answer Button */}
          {!state.showAnswer && (
            <button
              onClick={handleCheckAnswer}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Check Answer
            </button>
          )}

          {/* Answer Display */}
          {state.showAnswer && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Answer:</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-green-700 leading-relaxed">
                  {currentQuestion.answer}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevQuestion}
            disabled={state.currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex space-x-2">
            {caseStudy.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setState(prev => ({
                  ...prev,
                  currentQuestionIndex: index,
                  showAnswer: false
                }))}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  index === state.currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={state.currentQuestionIndex === caseStudy.questions.length - 1}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPage;
