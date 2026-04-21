import { useEffect, useMemo, useRef, useState } from 'react'
import { onValue } from 'firebase/database'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Center, Environment, useGLTF } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import {
  EDUCATIONAL_CONTENT,
  PARTS,
  resolvePartSelection,
} from '../data/dashboardContent.js'
import golfModelUrl from '../golf.glb?url'
import { activeCarPartRef, hasFirebaseConfig } from '../lib/firebase.js'

const defaultPart = 'Engine'
const CAMERA_TRANSITION_MS = 280
const MODEL_OFFSET = [0, 0, 0]
const MODEL_FRAME_SHIFT = 0
const MODEL_ROTATION = [0, 0, Math.PI]
const MODEL_SCALE = 0.055
const DEFAULT_CAMERA_POSITION = [0, 1.4, 4.8]
const DEFAULT_CAMERA_TARGET = [0, 0, 0]
const MotionSection = motion.section
const MotionDiv = motion.div
const MotionArticle = motion.article

function CarAssembly({ url }) {
  const { scene } = useGLTF(url)
  const centeredGroupRef = useRef(null)

  function handleModelPointerDown(event) {
    const localPoint = centeredGroupRef.current
      ? centeredGroupRef.current.worldToLocal(event.point.clone())
      : event.point.clone()

    const roundedPoint = localPoint.toArray().map((value) => Number(value.toFixed(3)))

    console.log('Model intersection point:', roundedPoint)
  }

  return (
    <Center ref={centeredGroupRef} position={MODEL_OFFSET}>
      <primitive
        object={scene}
        scale={MODEL_SCALE}
        rotation={MODEL_ROTATION}
        onPointerDown={handleModelPointerDown}
      />
    </Center>
  )
}

function SceneControls({ lessonStarted, selectedPart }) {
  const controlsRef = useRef(null)
  const selectedContent = EDUCATIONAL_CONTENT[selectedPart]

  useEffect(() => {
    if (!controlsRef.current) {
      return
    }

    if (!lessonStarted || !selectedContent) {
      const [cameraX, cameraY, cameraZ] = DEFAULT_CAMERA_POSITION
      const [targetX, targetY, targetZ] = DEFAULT_CAMERA_TARGET

      controlsRef.current.setLookAt(cameraX, cameraY, cameraZ, targetX, targetY, targetZ, true)
      return
    }

    const [cameraX, cameraY, cameraZ] = selectedContent.cameraPosition
    const [targetX, targetY, targetZ] = selectedContent.hotspotPosition
    const [offsetX, offsetY, offsetZ] = MODEL_OFFSET

    controlsRef.current.setLookAt(
      cameraX + offsetX,
      cameraY + offsetY,
      cameraZ + offsetZ,
      targetX + offsetX - MODEL_FRAME_SHIFT,
      targetY + offsetY,
      targetZ + offsetZ,
      true,
    )
  }, [lessonStarted, selectedContent])

  return (
    <>
      <CameraControls
        ref={controlsRef}
        makeDefault
        smoothTime={1}
        minDistance={1.4}
        maxDistance={7}
      />
      <CarAssembly url={golfModelUrl} />
    </>
  )
}

function Dashboard() {
  const [selectedPart, setSelectedPart] = useState(defaultPart)
  const [slideIndex, setSlideIndex] = useState(0)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [lessonStarted, setLessonStarted] = useState(false)
  const [completedParts, setCompletedParts] = useState([])
  const [manualMenuOpen, setManualMenuOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardDirection, setWizardDirection] = useState(1)
  const [currentView, setCurrentView] = useState('wizard')
  const [transitionStage, setTransitionStage] = useState('entered')
  const [remoteState, setRemoteState] = useState(
    hasFirebaseConfig
      ? 'Awaiting an NFC scan from the physical learning model'
      : 'Firebase not configured',
  )
  const viewTimerRef = useRef(null)
  const overlayTimerRef = useRef(null)
  const skipInitialRemoteSnapshotRef = useRef(true)
  const dashboardLoadTimeRef = useRef(0)

  const currentContent =
    EDUCATIONAL_CONTENT[selectedPart] ?? EDUCATIONAL_CONTENT[defaultPart]
  const currentSlide = currentContent.slides[slideIndex] ?? currentContent.slides[0]
  const isFirstSlide = slideIndex === 0
  const isLastSlide = slideIndex === currentContent.slides.length - 1
  const slideProgressPercent = Math.round(((slideIndex + 1) / currentContent.slides.length) * 100)
  const completedPercent = Math.round((completedParts.length / PARTS.length) * 100)

  function queueOverlayReveal() {
    if (overlayTimerRef.current) {
      window.clearTimeout(overlayTimerRef.current)
    }

    overlayTimerRef.current = window.setTimeout(() => {
      setOverlayVisible(true)
      overlayTimerRef.current = null
    }, CAMERA_TRANSITION_MS)
  }

  function focusPart(part, statusMessage) {
    setSelectedPart(part)
    setSlideIndex(0)
    setOverlayVisible(false)
    setLessonStarted(true)
    setManualMenuOpen(false)
    queueOverlayReveal()

    if (statusMessage) {
      setRemoteState(statusMessage)
    }
  }

  useEffect(() => {
    if (!hasFirebaseConfig || !activeCarPartRef) {
      return undefined
    }

    const unsubscribe = onValue(activeCarPartRef, (snapshot) => {
      const payload = snapshot.val()
      const nextPart =
        typeof payload === 'string'
          ? resolvePartSelection(payload)
          : resolvePartSelection(payload?.part)
      const updatedAt =
        payload && typeof payload === 'object' && typeof payload.updatedAt === 'number'
          ? payload.updatedAt
          : null

      if (skipInitialRemoteSnapshotRef.current) {
        skipInitialRemoteSnapshotRef.current = false

        const isFreshInitialEvent =
          nextPart && updatedAt && updatedAt >= dashboardLoadTimeRef.current

        if (!isFreshInitialEvent) {
          setRemoteState('Awaiting an NFC scan from the physical learning model')
          return
        }
      }

      if (nextPart) {
        if (overlayTimerRef.current) {
          window.clearTimeout(overlayTimerRef.current)
        }

        setSelectedPart(nextPart)
        setSlideIndex(0)
        setOverlayVisible(false)
        setLessonStarted(true)
        overlayTimerRef.current = window.setTimeout(() => {
          setOverlayVisible(true)
          overlayTimerRef.current = null
        }, CAMERA_TRANSITION_MS)
        setRemoteState(`Physical model selected ${nextPart}`)
        return
      }

      setRemoteState('Awaiting an NFC scan from the physical learning model')
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setTransitionStage('entered')
    }, 260)

    return () => window.clearTimeout(timerId)
  }, [currentView])

  useEffect(
    () => () => {
      if (viewTimerRef.current) {
        window.clearTimeout(viewTimerRef.current)
      }

      if (overlayTimerRef.current) {
        window.clearTimeout(overlayTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    dashboardLoadTimeRef.current = Date.now()
  }, [])

  const viewerStatusClass = useMemo(
    () => `status-chip ${hasFirebaseConfig ? 'active' : 'warning'}`,
    [],
  )

  const introSteps = [
    {
      eyebrow: 'Step 01',
      title: 'Start the exhibit',
      body: 'Open the dashboard, then let the car model become the main stage.',
      detail: 'The intro stays short so students get into the lesson fast.',
    },
    {
      eyebrow: 'Step 02',
      title: 'Scan the real model',
      body: 'An NFC tag on the physical car triggers the matching lesson on screen.',
      detail: 'The desktop view and the phone relay stay in sync through Firebase.',
    },
    {
      eyebrow: 'Step 03',
      title: 'Learn one idea at a time',
      body: 'The camera moves in, the overlay appears, and the lesson advances in short beats.',
      detail: 'Each screen is built to keep attention on one part and one concept.',
    },
  ]

  const currentIntroStep = introSteps[wizardStep]
  const showWizard = currentView === 'wizard'

  const wizardPageVariants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 80 : -80,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -64 : 64,
      transition: {
        duration: 0.28,
        ease: [0.4, 0, 1, 1],
      },
    }),
  }

  const wizardItemVariants = {
    enter: { opacity: 0, y: 18 },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  function transitionToView(nextView, callback) {
    if (viewTimerRef.current) {
      window.clearTimeout(viewTimerRef.current)
    }

    setTransitionStage('leaving')

    viewTimerRef.current = window.setTimeout(() => {
      callback?.()
      setCurrentView(nextView)
      setTransitionStage('entering')
      viewTimerRef.current = null
    }, 180)
  }

  function handleWizardBack() {
    if (wizardStep === 0) {
      transitionToView('dashboard')
      return
    }

    setWizardDirection(-1)
    setWizardStep((step) => Math.max(step - 1, 0))
  }

  function handleWizardNext() {
    if (wizardStep === introSteps.length - 1) {
      transitionToView('dashboard')
      return
    }

    setWizardDirection(1)
    setWizardStep((step) => Math.min(step + 1, introSteps.length - 1))
  }

  function handlePartSelect(part) {
    focusPart(part)
  }

  function handlePreviousSlide() {
    setSlideIndex((index) => Math.max(index - 1, 0))
  }

  function handleNextSlide() {
    setSlideIndex((index) => {
      const nextIndex = Math.min(index + 1, currentContent.slides.length - 1)

      if (nextIndex === currentContent.slides.length - 1) {
        setCompletedParts((parts) =>
          parts.includes(selectedPart) ? parts : [...parts, selectedPart],
        )
      }

      return nextIndex
    })
  }

  const overlayContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.24,
        ease: [0.4, 0, 1, 1],
      },
    },
  }

  const overlayItemVariants = {
    hidden: { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <main className="app-shell dashboard-shell">
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
                <AnimatePresence mode="wait" initial={false} custom={wizardDirection}>
                  <MotionDiv
                    key={wizardStep}
                    className="intro-story-page"
                    custom={wizardDirection}
                    variants={wizardPageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <MotionDiv className="intro-story-top" variants={wizardItemVariants}>
                      <p className="eyebrow">{currentIntroStep.eyebrow}</p>
                      <div className="intro-step-counter">
                        {wizardStep + 1} / {introSteps.length}
                      </div>
                    </MotionDiv>

                    <MotionDiv variants={wizardItemVariants}>
                      <h1 className="intro-title">{currentIntroStep.title}</h1>
                    </MotionDiv>

                    <MotionDiv variants={wizardItemVariants}>
                      <p className="intro-copy">{currentIntroStep.body}</p>
                    </MotionDiv>

                    <MotionDiv className="intro-note-card" variants={wizardItemVariants}>
                      <p>{currentIntroStep.detail}</p>
                    </MotionDiv>

                    <MotionDiv className="intro-actions" variants={wizardItemVariants}>
                      <button className="btn" type="button" onClick={handleWizardBack}>
                        {wizardStep === 0 ? 'Skip Intro' : 'Back'}
                      </button>
                      <button
                        className={`btn btn-primary ${wizardStep === introSteps.length - 1 ? 'intro-cta-large' : ''}`}
                        type="button"
                        onClick={handleWizardNext}
                      >
                        {wizardStep === introSteps.length - 1 ? 'Enter Dashboard' : 'Next'}
                      </button>
                    </MotionDiv>
                  </MotionDiv>
                </AnimatePresence>
              </div>

              <div className="intro-graphic" aria-hidden="true">
                <div className="intro-graphic-ring intro-graphic-ring-a" />
                <div className="intro-graphic-ring intro-graphic-ring-b" />
                <div className="intro-graphic-core">
                  <span className="intro-core-label">Current Lesson</span>
                  <strong>{selectedPart}</strong>
                </div>
                <article
                  className={`intro-preview intro-preview-connect ${wizardStep === 0 ? 'active' : ''}`}
                >
                  <span className="step-number">1</span>
                  <h2>Connect</h2>
                  <p>Open the relay phone.</p>
                </article>
                <article
                  className={`intro-preview intro-preview-tap ${wizardStep === 1 ? 'active' : ''}`}
                >
                  <span className="step-number">2</span>
                  <h2>Scan</h2>
                  <p>Tap a real NFC tag.</p>
                </article>
                <article
                  className={`intro-preview intro-preview-learn ${wizardStep === 2 ? 'active' : ''}`}
                >
                  <span className="step-number">3</span>
                  <h2>Learn</h2>
                  <p>Watch the lesson camera move.</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!showWizard ? (
        <section
          className={`panel dashboard-main dashboard-page dashboard-exhibit view-shell animated-panel ${transitionStage}`}
        >
          <div className="dashboard-topbar dashboard-topbar-floating">
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

          <div className="viewer-stage viewer-stage-exhibit">
            <Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[8, 8, 5]} intensity={1.15} />
              <Environment preset="city" />
              <SceneControls lessonStarted={lessonStarted} selectedPart={selectedPart} />
            </Canvas>

            <div className="dashboard-overlay-shell">
              <AnimatePresence mode="wait">
                {!lessonStarted ? (
                  <MotionSection
                    key="starter"
                    className="starter-overlay"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <MotionDiv className="starter-card">
                      <p className="eyebrow">Ready To Begin</p>
                      <h2 className="starter-title">Scan a car part to start the lesson</h2>
                      <p className="starter-copy">
                        Use the physical NFC model first. If you need a fallback, open manual
                        mode below.
                      </p>

                      <div className="lesson-overlay-manual starter-manual">
                        <button
                          type="button"
                          className="btn lesson-manual-toggle"
                          onClick={() => setManualMenuOpen((open) => !open)}
                          aria-expanded={manualMenuOpen}
                          aria-controls="starter-manual-menu"
                        >
                          {manualMenuOpen ? 'Hide Manual Mode' : 'Open Manual Mode'}
                        </button>

                        <AnimatePresence>
                          {manualMenuOpen ? (
                            <MotionDiv
                              id="starter-manual-menu"
                              className="lesson-overlay-parts starter-part-menu"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {PARTS.map((part) => (
                                <button
                                  key={part}
                                  type="button"
                                  className="lesson-mode-chip lesson-mode-chip-overlay"
                                  onClick={() => handlePartSelect(part)}
                                >
                                  {part}
                                </button>
                              ))}
                            </MotionDiv>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </MotionDiv>
                  </MotionSection>
                ) : overlayVisible && lessonStarted ? (
                  <MotionSection
                    key={selectedPart}
                    className="lesson-overlay"
                    variants={overlayContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <MotionDiv className="lesson-overlay-top" variants={overlayItemVariants}>
                      <div className="lesson-overlay-copy">
                        <p className="eyebrow lesson-overlay-eyebrow">{currentContent.category}</p>
                        <h2 className="lesson-overlay-title">{currentContent.label}</h2>
                        <p className="lesson-overlay-summary">{currentContent.summary}</p>
                      </div>

                      <div className="lesson-overlay-manual">
                        <p className="lesson-manual-label">Use NFC to switch parts</p>
                        <button
                          type="button"
                          className="btn lesson-manual-toggle"
                          onClick={() => setManualMenuOpen((open) => !open)}
                          aria-expanded={manualMenuOpen}
                          aria-controls="manual-part-menu"
                        >
                          {manualMenuOpen ? 'Hide Manual Menu' : 'Open Manual Menu'}
                        </button>

                        <AnimatePresence>
                          {manualMenuOpen ? (
                            <MotionDiv
                              id="manual-part-menu"
                              className="lesson-overlay-parts"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {PARTS.map((part) => (
                                <button
                                  key={part}
                                  type="button"
                                  className={`lesson-mode-chip lesson-mode-chip-overlay ${
                                    part === selectedPart ? 'active' : ''
                                  }`}
                                  onClick={() => handlePartSelect(part)}
                                >
                                  {part}
                                </button>
                              ))}
                            </MotionDiv>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </MotionDiv>

                    <MotionDiv className="lesson-overlay-card" variants={overlayItemVariants}>
                      <div className="lesson-slide-meta">
                        <span className="lesson-tag">{currentContent.kicker}</span>
                        <span className="lesson-slide-count">{slideProgressPercent}% complete</span>
                      </div>

                      <AnimatePresence mode="wait">
                        <MotionArticle
                          key={`${selectedPart}-${slideIndex}`}
                          className="lesson-slide"
                          initial={{ opacity: 0, y: 28 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -24 }}
                          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="lesson-pop-label">{currentSlide.eyebrow}</p>
                          <h3 className="lesson-slide-title">{currentSlide.title}</h3>
                          <p className="lesson-slide-body">{currentSlide.body}</p>
                          <p className="lesson-slide-accent">{currentSlide.accent}</p>
                        </MotionArticle>
                      </AnimatePresence>

                      {isLastSlide ? (
                        <div className="lesson-complete-card">
                          <p className="lesson-pop-label">Next move</p>
                          <p className="lesson-complete-copy">
                            Lesson complete. Scan another part to keep going.
                          </p>
                          <p className="lesson-complete-percent">
                            Overall exhibit progress: {completedPercent}%
                          </p>
                          <div className="lesson-progress-list">
                            {completedParts.map((part) => (
                              <span key={part} className="lesson-progress-chip">
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="lesson-slide-controls">
                        <button
                          className="btn lesson-nav-btn"
                          type="button"
                          onClick={handlePreviousSlide}
                          disabled={isFirstSlide}
                        >
                          Previous
                        </button>
                        <div className="lesson-slide-progress" aria-hidden="true">
                          {currentContent.slides.map((slide, index) => (
                            <span
                              key={`${currentContent.slug}-${slide.title}`}
                              className={`lesson-progress-dot ${
                                index === slideIndex ? 'active' : ''
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          className="btn btn-primary lesson-nav-btn"
                          type="button"
                          onClick={handleNextSlide}
                          disabled={isLastSlide}
                        >
                          Next
                        </button>
                      </div>
                    </MotionDiv>
                  </MotionSection>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default Dashboard
