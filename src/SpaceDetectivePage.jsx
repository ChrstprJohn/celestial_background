import { useRef, useState } from 'react'
import DiscoveryPlanet from './DiscoveryPlanet.jsx'
import { ArrowRight, Lightbulb, RotateCcw } from 'lucide-react'
import DiscoveryLayout, { SourceNote } from './DiscoveryLayout.jsx'
import MoonVisual from './MoonVisual.jsx'
import { PLANETS } from './lib/planets.js'
import { shuffledQuestions } from './lib/detective.js'

export default function SpaceDetectivePage() {
  const [questions, setQuestions] = useState(shuffledQuestions)
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(null)
  const [hint, setHint] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)
  const heading = useRef(null)
  const question = questions[index]
  function answer(value) {
    if (choice !== null) return
    setChoice(value)
    if (value === question.answer) setScore((current) => current + 1)
  }
  function next() {
    if (index === questions.length - 1) setFinished(true)
    else { setIndex(index + 1); setChoice(null); setHint(false); setPhotoFailed(false) }
    heading.current?.focus({ preventScroll: true })
  }
  function restart() {
    setQuestions(shuffledQuestions()); setIndex(0); setChoice(null); setHint(false); setScore(0); setFinished(false); setPhotoFailed(false)
  }
  return <DiscoveryLayout resultFirst id="detective" title="A little mystery." emphasis="A universe of clues." description="Five gentle questions. Take your time, follow a clue, and see what you recognize." controls={<>
    <p className="quiz-progress">{finished ? 'Round complete' : `Question ${index + 1} of ${questions.length}`}</p>
    {!finished && <><h2 ref={heading} className="quiz-question" tabIndex={-1}>{question.question}</h2><div className="quiz-options">{question.options.map((option, optionIndex) => <button type="button" key={option} disabled={choice !== null} className={`${choice !== null && optionIndex === question.answer ? ' is-correct' : ''}${choice === optionIndex && choice !== question.answer ? ' is-incorrect' : ''}`} onClick={() => answer(optionIndex)}>{option}{choice !== null && optionIndex === question.answer && <span>Correct answer</span>}</button>)}</div>
      {choice === null ? <><button className="text-button" type="button" onClick={() => setHint(true)} disabled={hint}><Lightbulb size={16} aria-hidden="true" /> Give me a clue</button>{hint && <p className="discovery-note" role="status">{question.hint}</p>}</> : <div className="quiz-feedback" role="status"><p>{choice === question.answer ? 'You spotted it.' : 'A new discovery.'} {question.explanation}</p><button className="primary-button" type="button" onClick={next}>{index === questions.length - 1 ? 'See my result' : 'Next mystery'}<ArrowRight size={16} aria-hidden="true" /></button></div>}
    </>}
    {finished && <><p className="quiz-score" role="status">You spotted <strong>{score} of {questions.length}</strong>.</p><p className="discovery-note">{score === questions.length ? 'A lovely eye for the universe.' : 'Every answer is another little discovery.'}</p><button className="primary-button" type="button" onClick={restart}><RotateCcw size={16} aria-hidden="true" /> Play another round</button></>}
  </>}>
    {finished ? <div className="quiz-complete"><svg viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="128" fill="none" stroke="#3f4664" /><path d="M200 65 228 172 335 200 228 228 200 335 172 228 65 200 172 172Z" fill="#c9c1f0" /><circle cx="70" cy="80" r="4" fill="#f3f0e9" /><circle cx="330" cy="320" r="5" fill="#f3f0e9" /></svg><h2>Keep looking up.</h2></div> : <>
      <div className="quiz-art" aria-label="Mystery image or astronomy model" key={question.id}>
        {question.planet ? <DiscoveryPlanet planet={PLANETS.find((item) => item.id === question.planet)} /> : question.moon ? <MoonVisual fraction={.65} waxing label="A mystery astronomical object" /> : photoFailed ? <div className="discovery-empty"><p>The mystery image couldn’t load.</p><button className="secondary-button" onClick={() => setPhotoFailed(false)}>Try again</button></div> : <img src={question.image} alt="Mystery astronomy photograph: identify the object using its visible features." onError={() => setPhotoFailed(true)} />}
      </div><p className="discovery-note">{question.image ? 'Astronomy photograph' : 'Illustrative astronomy model'}</p>{choice !== null && <><SourceNote href={question.source}>Learn about this discovery</SourceNote>{question.credit && <p className="discovery-note">Image credit: {question.credit}</p>}</>}
    </>}
  </DiscoveryLayout>
}
