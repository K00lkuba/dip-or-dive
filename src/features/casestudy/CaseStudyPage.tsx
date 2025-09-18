import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { caseStudy1 } from './sampleData';
import { CaseStudyState, Highlight } from './types';

// Helper function to extract key concepts from answers
const extractKeyConcepts = (answer: string): string[] => {
  const concepts: string[] = [];
  
  // Look for anatomical structures
  const anatomicalTerms = [
    'corticospinal tract', 'pons', 'medulla', 'cerebellum', 'cortex',
    'abducens nerve', 'facial nerve', 'cranial nerve', 'CN VI', 'CN VII',
    'medial longitudinal fasciculus', 'MLF', 'pyramids', 'decussation',
    'contralateral', 'ipsilateral', 'upper motor neuron', 'lower motor neuron'
  ];
  
  // Look for pathophysiological terms
  const pathophysTerms = [
    'ischemic stroke', 'TIA', 'thromboembolism', 'atrial fibrillation',
    'hypertension', 'atherosclerosis', 'infarction', 'lesion',
    'diplopia', 'dysarthria', 'dysphagia', 'paralysis', 'weakness'
  ];
  
  // Look for drug classes and treatments
  const treatmentTerms = [
    'DOAC', 'warfarin', 'anticoagulation', 'antiplatelet', 'aspirin',
    'clopidogrel', 'statin', 'ACE inhibitor', 'enalapril', 'atorvastatin'
  ];
  
  // Look for clinical assessments
  const clinicalTerms = [
    'CHA₂DS₂-VASc', 'ABCD₃I', 'neurological examination', 'motor signs',
    'sensory impairment', 'cranial nerve palsy', 'gaze preference'
  ];
  
  const allTerms = [...anatomicalTerms, ...pathophysTerms, ...treatmentTerms, ...clinicalTerms];
  
  allTerms.forEach(term => {
    if (answer.toLowerCase().includes(term.toLowerCase())) {
      concepts.push(term);
    }
  });
  
  // Remove duplicates and limit to most relevant
  return [...new Set(concepts)].slice(0, 8);
};

// Helper function to calculate a simple score based on key concepts
const calculateScore = (userAnswer: string, correctAnswer: string): number => {
  if (!userAnswer.trim()) return 0;
  
  const keyConcepts = extractKeyConcepts(correctAnswer);
  const userAnswerLower = userAnswer.toLowerCase();
  
  let matchedConcepts = 0;
  keyConcepts.forEach(concept => {
    if (userAnswerLower.includes(concept.toLowerCase())) {
      matchedConcepts++;
    }
  });
  
  // Return percentage of key concepts covered
  return Math.round((matchedConcepts / keyConcepts.length) * 100);
};

const CaseStudyPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const caseStudy = caseStudy1; // In future, this could be dynamic based on caseId
  
  const [state, setState] = useState<CaseStudyState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    showAnswer: false,
    scores: {},
    clueLevels: {},
    highlights: []
  });

  const caseTextRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);

  const currentQuestion = caseStudy.questions[state.currentQuestionIndex];
  const userAnswer = state.userAnswers[currentQuestion.id] || '';
  const currentClueLevel = state.clueLevels[currentQuestion.id] || 0;

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
    const score = calculateScore(userAnswer, currentQuestion.answer);
    setState(prev => ({
      ...prev,
      showAnswer: true,
      scores: {
        ...prev.scores,
        [currentQuestion.id]: score
      }
    }));
  };

  const handleShowClue = () => {
    if (currentClueLevel < currentQuestion.clues.length) {
      setState(prev => ({
        ...prev,
        clueLevels: {
          ...prev.clueLevels,
          [currentQuestion.id]: currentClueLevel + 1
        }
      }));
    }
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

  const handleQuestionJump = (index: number) => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      showAnswer: false
    }));
  };

  // Text highlighting functions

  const getTextOffset = (element: HTMLElement, range: Range): { start: number; end: number } => {
    const textContent = element.textContent || '';
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let offset = 0;
    let startOffset = 0;
    let endOffset = 0;
    let foundStart = false;
    let foundEnd = false;

    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent?.length || 0;
      
      if (!foundStart && node === range.startContainer) {
        startOffset = offset + range.startOffset;
        foundStart = true;
      }
      
      if (!foundEnd && node === range.endContainer) {
        endOffset = offset + range.endOffset;
        foundEnd = true;
        break;
      }
      
      offset += nodeLength;
    }

    return { start: startOffset, end: endOffset };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === caseTextRef.current || caseTextRef.current?.contains(e.target as Node)) {
      setIsSelecting(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isSelecting && caseTextRef.current) {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        
        // Get offsets relative to the original text content
        const { start: startOffset, end: endOffset } = getTextOffset(caseTextRef.current, range);
        
        // Check if this selection overlaps with existing highlights
        const overlappingHighlight = state.highlights.find(highlight => 
          (startOffset >= highlight.start && startOffset < highlight.end) ||
          (endOffset > highlight.start && endOffset <= highlight.end) ||
          (startOffset <= highlight.start && endOffset >= highlight.end)
        );

        if (overlappingHighlight) {
          // Remove the overlapping highlight
          setState(prev => ({
            ...prev,
            highlights: prev.highlights.filter(h => h.id !== overlappingHighlight.id)
          }));
        } else {
          // Add new highlight
          const newHighlight: Highlight = {
            id: `highlight-${Date.now()}-${Math.random()}`,
            start: startOffset,
            end: endOffset,
            text: selectedText,
            color: '#ffeb3b' // Yellow highlight
          };
          
          setState(prev => ({
            ...prev,
            highlights: [...prev.highlights, newHighlight]
          }));
        }
      }
      setIsSelecting(false);
      selection?.removeAllRanges();
    }
  };

  const applyHighlights = useCallback(() => {
    if (!caseTextRef.current) return;

    // Get the original text content
    const originalText = caseStudy.case;
    
    // Clear the container and add the original text
    caseTextRef.current.innerHTML = '';
    caseTextRef.current.textContent = originalText;

    // If no highlights, just return the original text
    if (state.highlights.length === 0) {
      return;
    }

    // Sort highlights by start position
    const sortedHighlights = [...state.highlights].sort((a, b) => a.start - b.start);
    
    // Build the highlighted content by processing the text once
    const text = caseTextRef.current.textContent || '';
    const parts: (string | { type: 'highlight'; text: string; color: string })[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight) => {
      // Add text before this highlight
      if (highlight.start > lastIndex) {
        parts.push(text.substring(lastIndex, highlight.start));
      }
      
      // Add the highlight
      parts.push({
        type: 'highlight',
        text: highlight.text,
        color: highlight.color
      });
      
      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Clear and rebuild the content
    caseTextRef.current.innerHTML = '';
    
    parts.forEach((part, index) => {
      if (typeof part === 'string') {
        caseTextRef.current?.appendChild(document.createTextNode(part));
      } else {
        const mark = document.createElement('mark');
        mark.className = 'text-highlight';
        mark.style.backgroundColor = part.color;
        mark.style.padding = '2px 0';
        mark.style.borderRadius = '2px';
        mark.textContent = part.text;
        caseTextRef.current?.appendChild(mark);
      }
    });
  }, [state.highlights, caseStudy.case]);

  // Apply highlights when they change
  useEffect(() => {
    applyHighlights();
  }, [applyHighlights]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseStudy.title}</h1>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Question {state.currentQuestionIndex + 1} of {caseStudy.questions.length}
            </div>
            {Object.keys(state.scores).length > 0 && (
              <div className="text-sm text-gray-600">
                Average Score: {Math.round(
                  Object.values(state.scores).reduce((sum, score) => sum + score, 0) / 
                  Object.values(state.scores).length
                )}%
              </div>
            )}
          </div>
        </div>

        {/* Case Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Case Information</h2>
          <div className="prose max-w-none">
            <div 
              ref={caseTextRef}
              className="whitespace-pre-wrap text-gray-700 leading-relaxed select-text cursor-text"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              style={{ userSelect: 'text' }}
            >
              {caseStudy.case}
            </div>
          </div>
          {state.highlights.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-800">
                  {state.highlights.length} highlight{state.highlights.length !== 1 ? 's' : ''} 
                </span>
                <button
                  onClick={() => setState(prev => ({ ...prev, highlights: [] }))}
                  className="text-xs text-yellow-600 hover:text-yellow-800 underline"
                >
                  Clear all highlights
                </button>
              </div>
            </div>
          )}
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

          {/* Clue System */}
          {!state.showAnswer && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Clues:</h3>
                <button
                  onClick={handleShowClue}
                  disabled={currentClueLevel >= currentQuestion.clues.length}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {currentClueLevel === 0 ? 'Show Clue 1' : 
                   currentClueLevel < currentQuestion.clues.length ? `Show Clue ${currentClueLevel + 1}` : 
                   'All Clues Shown'}
                </button>
              </div>
              
              {currentClueLevel > 0 && (
                <div className="space-y-3">
                  {currentQuestion.clues.slice(0, currentClueLevel).map((clue, index) => (
                    <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-purple-800 text-sm leading-relaxed">{clue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
            <div className="mt-6 space-y-4">
              {/* Score Display */}
              {state.scores[currentQuestion.id] !== undefined && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-yellow-800">Your Score:</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-yellow-700">
                        {state.scores[currentQuestion.id]}%
                      </div>
                      <div className="w-32 bg-yellow-200 rounded-full h-3">
                        <div 
                          className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${state.scores[currentQuestion.id]}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    Based on key medical concepts covered in your answer
                  </p>
                </div>
              )}

              {/* Your Answer vs Correct Answer Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Your Answer */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Your Answer:</h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-blue-700 leading-relaxed text-sm">
                      {userAnswer || "No answer provided"}
                    </pre>
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Correct Answer:</h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-green-700 leading-relaxed text-sm">
                      {currentQuestion.answer}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Key Concepts Analysis */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Concepts to Review:</h3>
                <div className="text-sm text-gray-600 mb-2">
                  Compare your answer with the correct answer above. Look for these important concepts:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {extractKeyConcepts(currentQuestion.answer).map((concept, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{concept}</span>
                    </div>
                  ))}
                </div>
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
                onClick={() => handleQuestionJump(index)}
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
