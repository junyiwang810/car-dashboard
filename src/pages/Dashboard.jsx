import { useEffect, useMemo, useRef, useState } from 'react'
import { onValue } from 'firebase/database'
import '@google/model-viewer'
import {
  CAMERA_PRESETS,
  CURRICULUM,
  LESSON_INTERACTIONS,
  PARTS,
} from '../data/dashboardContent.js'
import golfModelUrl from '../golf.glb?url'
import { activePartRef, hasFirebaseConfig } from '../lib/firebase.js'

const defaultPart = 'Engine'

function Dashboard() {
  const [activePart, setActivePart] = useState(defaultPart)
  const [slideIndex, setSlideIndex] = useState(0)
  const [wizardStep, setWizardStep] = useState(0)
  const [currentView, setCurrentView] = useState('wizard')
  const [transitionStage, setTransitionStage] = useState('entered')
  const [lessonMode, setLessonMode] = useState('big-idea')
  const [selectedHotspot, setSelectedHotspot] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const viewTimerRef = useRef(null)
  const [remoteState, setRemoteState] = useState(
    hasFirebaseConfig ? 'Awaiting NFC tag notification on phone' : 'Firebase not configured',
  )

  useEffect(() => {
    if (!activePartRef) {
      return undefined
    }

    const unsubscribe = onValue(activePartRef, (snapshot) => {
      const nextPart = snapshot.val()

      if (typeof nextPart === 'string' && PARTS.includes(nextPart)) {
        setActivePart(nextPart)
        setSlideIndex(0)
        setRemoteState(`Remote selected ${nextPart}`)
        return
      }

      setRemoteState('Awaiting NFC tag notification on phone')
    })

    return () => unsubscribe()
  }, [])

  const slides = CURRICULUM[activePart] ?? CURRICULUM[defaultPart]
  const currentSlide = slides[slideIndex]
  const cameraPreset = CAMERA_PRESETS[activePart] ?? CAMERA_PRESETS[defaultPart]
  const interactions = LESSON_INTERACTIONS[activePart] ?? LESSON_INTERACTIONS[defaultPart]
  const currentInteraction = interactions[slideIndex] ?? interactions[0]

  const viewerStatusClass = useMemo(() => {
    if (!hasFirebaseConfig) {
      return 'status-chip warning'
    }

    return 'status-chip active'
  }, [])

  const introSteps = [
    {
      eyebrow: 'Welcome',
      title: 'Start your interactive car-part adventure',
      body:
        'This dashboard guides you from phone setup to a live 3D model and a focused lesson on the selected vehicle system.',
    },
    {
      eyebrow: 'How It Works',
      title: 'Scan, tap, then watch the lesson change',
      body:
        'Use the relay phone, tap an NFC tag, and the dashboard will switch the car part, camera angle, and lesson content automatically.',
    },
    {
      eyebrow: 'Main Goal',
      title: 'The lesson page is the destination',
      body:
        'Once you enter, the main screen keeps the 3D model and the learning notes visible together so the whole story stays on one page.',
    },
  ]

  const currentIntroStep = introSteps[wizardStep]
  const showWizard = currentView === 'wizard'

  useEffect(() => {
    setTransitionStage('entering')

    const timerId = window.setTimeout(() => {
      setTransitionStage('entered')
    }, 260)

    return () => window.clearTimeout(timerId)
  }, [currentView])

  useEffect(() => {
    return () => {
      if (viewTimerRef.current) {
        window.clearTimeout(viewTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setLessonMode('big-idea')
    setSelectedHotspot(0)
    setShowAnswer(false)
  }, [activePart, slideIndex])

  function transitionToView(nextView, callback) {
    if (viewTimerRef.current) {
      window.clearTimeout(viewTimerRef.current)
    }

    setTransitionStage('leaving')

    viewTimerRef.current = window.setTimeout(() => {
      callback?.()
      setCurrentView(nextView)
      viewTimerRef.current = null
    }, 180)
  }

  function handleWizardBack() {
    if (wizardStep === 0) {
      transitionToView('dashboard')
      return
    }

    setWizardStep((step) => Math.max(step - 1, 0))
  }

  function handleWizardNext() {
    if (wizardStep === introSteps.length - 1) {
      transitionToView('dashboard')
      return
    }

    setWizardStep((step) => Math.min(step + 1, introSteps.length - 1))
  }

  return (
    <main className="app-shell">
      {showWizard ? (
        <section className={`intro-wizard panel view-shell animated-panel ${transitionStage}`}>
          <div className="intro-progress" aria-hidden="true">
            {introSteps.map((step, index) => (
              <span
                key={step.title}
                className={`intro-dot ${index === wizardStep ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="intro-card">
            <div className="intro-layout">
              <div className="intro-story">
                <p className="eyebrow">{currentIntroStep.eyebrow}</p>
                <h1 className="intro-title">{currentIntroStep.title}</h1>
                <p className="intro-copy">{currentIntroStep.body}</p>

                <div className="intro-actions">
                  <button className="btn" type="button" onClick={handleWizardBack}>
                    {wizardStep === 0 ? 'Skip Intro' : 'Back'}
                  </button>
                  <button className="btn btn-primary" type="button" onClick={handleWizardNext}>
                    {wizardStep === introSteps.length - 1 ? 'Enter Dashboard' : 'Next'}
                  </button>
                </div>
              </div>

              <div className="intro-graphic" aria-hidden="true">
                <div className="intro-graphic-ring intro-graphic-ring-a" />
                <div className="intro-graphic-ring intro-graphic-ring-b" />
                <div className="intro-graphic-core">
                  <span className="intro-core-label">Adventure Flow</span>
                  <strong>{activePart}</strong>
                </div>
                <article
                  className={`intro-preview intro-preview-connect ${
                    wizardStep === 0 ? 'active' : ''
                  }`}
                >
                  <span className="step-number">1</span>
                  <h2>Connect</h2>
                  <p>Prepare the relay phone.</p>
                </article>
                <article
                  className={`intro-preview intro-preview-tap ${
                    wizardStep === 1 ? 'active' : ''
                  }`}
                >
                  <span className="step-number">2</span>
                  <h2>Tap</h2>
                  <p>Trigger the part with NFC.</p>
                </article>
                <article
                  className={`intro-preview intro-preview-learn ${
                    wizardStep === 2 ? 'active' : ''
                  }`}
                >
                  <span className="step-number">3</span>
                  <h2>Learn</h2>
                  <p>See the model and lesson update.</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!showWizard ? (
        <div className="page-grid dashboard-center">
          <section
            className={`panel dashboard-main dashboard-page view-shell animated-panel ${transitionStage}`}
          >
            <div className="step-page step-page-learn">
              <div className="dashboard-topbar">
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setWizardStep(0)
                    transitionToView('wizard')
                  }}
                >
                  Back to Wizard
                </button>
                <div className={viewerStatusClass}>{remoteState}</div>
              </div>

              <div className="lesson-sandwich">
                <section className="content-card model-card model-card-large animated-card">
                  <div className="model-header">
                    <div className="section-heading">
                      <p className="eyebrow">Selected Car Part</p>
                      <h2 className="lesson-hero-title">{activePart}</h2>
                      <p className="lesson-hero-copy">{cameraPreset.summary}</p>
                    </div>
                    <div className="part-pill">{currentSlide.title}</div>
                  </div>

                  <div className="viewer-stage viewer-stage-clean viewer-stage-large">
                    <model-viewer
                      src={golfModelUrl}
                      alt="Interactive 3D vehicle dashboard model"
                      camera-controls
                      disable-pan
                      touch-action="pan-y"
                      interpolation-decay="120"
                      shadow-intensity="0.85"
                      exposure="1"
                      environment-image="neutral"
                      camera-target={cameraPreset.target}
                      camera-orbit={cameraPreset.orbit}
                      orientation="90deg 0deg 0deg"
                      min-camera-orbit="auto 55deg auto"
                      max-camera-orbit="auto 90deg auto"
                      interaction-prompt="none"
                      field-of-view="32deg"
                    />
                  </div>
                </section>

                <section className="content-card lesson-card lesson-card-priority animated-card animated-card-delay">
                  <div className="wizard-controls wizard-controls-clean">
                    <span className="wizard-step">
                      Lesson {slideIndex + 1} of {slides.length}
                    </span>
                    <div className="button-row">
                      <button
                        className="btn"
                        type="button"
                        onClick={() => setSlideIndex((index) => Math.max(index - 1, 0))}
                        disabled={slideIndex === 0}
                      >
                        Prev
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() =>
                          setSlideIndex((index) => Math.min(index + 1, slides.length - 1))
                        }
                        disabled={slideIndex === slides.length - 1}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="lesson-content-fade" key={`${activePart}-${slideIndex}`}>
                    <p className="eyebrow">Interactive Lesson</p>
                    <div className="lesson-copy-stack lesson-copy-stack-interactive">
                      <div className="lesson-title-row">
                        <h3 className="curriculum-title">{currentSlide.title}</h3>
                        <span className="lesson-tag">Tap through the ideas</span>
                      </div>

                      <div className="lesson-mode-switch" role="tablist" aria-label="Lesson views">
                        <button
                          className={`lesson-mode-chip ${
                            lessonMode === 'big-idea' ? 'active' : ''
                          }`}
                          type="button"
                          onClick={() => setLessonMode('big-idea')}
                        >
                          Big Idea
                        </button>
                        <button
                          className={`lesson-mode-chip ${
                            lessonMode === 'hotspots' ? 'active' : ''
                          }`}
                          type="button"
                          onClick={() => setLessonMode('hotspots')}
                        >
                          Explore
                        </button>
                        <button
                          className={`lesson-mode-chip ${lessonMode === 'quiz' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setLessonMode('quiz')}
                        >
                          Quick Check
                        </button>
                      </div>

                      {lessonMode === 'big-idea' ? (
                        <div className="lesson-pop-card">
                          <p className="lesson-pop-label">Simple version</p>
                          <p className="lesson-pop-copy">{currentInteraction.simple}</p>
                          <p className="lesson-support-copy">{currentInteraction.explainer}</p>
                        </div>
                      ) : null}

                      {lessonMode === 'hotspots' ? (
                        <div className="lesson-interactive-zone">
                          <div className="hotspot-list" aria-label="Lesson hotspots">
                            {currentInteraction.hotspots.map((hotspot, index) => (
                              <button
                                key={hotspot.label}
                                className={`hotspot-pill ${
                                  selectedHotspot === index ? 'active' : ''
                                }`}
                                type="button"
                                onClick={() => setSelectedHotspot(index)}
                              >
                                {hotspot.label}
                              </button>
                            ))}
                          </div>

                          <div className="lesson-pop-card lesson-pop-card-detail">
                            <p className="lesson-pop-label">What this means</p>
                            <p className="lesson-pop-copy">
                              {currentInteraction.hotspots[selectedHotspot].detail}
                            </p>
                            <p className="lesson-support-copy">{currentSlide.body}</p>
                          </div>
                        </div>
                      ) : null}

                      {lessonMode === 'quiz' ? (
                        <div className="lesson-pop-card lesson-quiz-card">
                          <p className="lesson-pop-label">Check yourself</p>
                          <p className="lesson-pop-copy">{currentInteraction.question}</p>
                          <button
                            className="btn btn-primary lesson-answer-btn"
                            type="button"
                            onClick={() => setShowAnswer((visible) => !visible)}
                          >
                            {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                          </button>
                          {showAnswer ? (
                            <p className="lesson-answer">{currentInteraction.answer}</p>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="lesson-facts-grid">
                        {currentSlide.bullets.map((bullet) => (
                          <article key={bullet} className="lesson-fact-card">
                            <span className="lesson-fact-dot" aria-hidden="true" />
                            <p>{bullet}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default Dashboard
