import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowRight,
    FaCheck,
    FaTimes
} from 'react-icons/fa';
import confetti from 'canvas-confetti';

const steps = [
    {
        id: 'intro',
        targetId: null, // Center screen
        title: "Wake Up, Time Traveler.",
        content: "You’re drawing boxes manually? Bro, what next — sending emails with a pigeon? This tool exists so your workflow doesn’t look like a documentary on ancient civilizations.",
        image: "/demo/tired_engineer.png",
        position: 'center'
    },
    {
        id: 'projects',
        targetId: 'nav-projects',
        title: "Digital Hoarding 101",
        content: "Put all your projects here — even the ones you swore you’d finish ‘after exams’. We both know those exams happened in 2021. 🎓",
        image: "/demo/project_chaos.png",
        position: 'bottom'
    },
    {
        id: 'templates',
        targetId: 'nav-templates',
        title: "Steal Like an Artist",
        content: "Why reinvent the wheel? 🦸‍♂️ Grab a pro template. We won't tell anyone you didn't build it.",
        image: "/demo/template_gallery.png",
        position: 'bottom'
    },
    {
        id: 'canvas-intro',
        targetId: null, // Center screen
        title: "No More Sad Blue Boxes",
        content: "We have other colors, you know. 🎨 Use them. Make a diagram that doesn't look like a depressed spreadsheet.",
        image: "/demo/infinite_canvas.png",
        position: 'center'
    },
    {
        id: 'drag-drop',
        targetId: 'btn-tool-select',
        title: "Feng Shui Master",
        content: "Don't like that box there? Move it. Still ugly? Move it again. It's cheaper than therapy. 🧘‍♂️",
        image: "/demo/drag_drop.png",
        position: 'bottom'
    },
    {
        id: 'minimap',
        targetId: 'btn-minimap',
        title: "Lost in Her Eyes?",
        content: "Wait, sorry... frequently lost in your diagram? 😳 Don't worry. The Minimap is here. It's easier to read than her mixed signals.",
        image: "/demo/minimap.png",
        position: 'bottom'
    },
    {
        id: 'undo',
        targetId: 'btn-undo',
        title: "The Time Machine",
        content: "Oops? Ctrl+Z to the rescue! ⏪ The only time machine that actually works. Use it wisely.",
        image: "/demo/undo_redo.png",
        position: 'bottom'
    },
    {
        id: 'ai',
        targetId: 'nav-ai',
        title: "Lazy? Good.",
        content: "Tell AI to build it. 🤖 Then take all the credit. It's our little secret.",
        image: "/demo/ai_magic.png",
        position: 'bottom'
    },
    {
        id: 'export',
        targetId: 'nav-export',
        title: "Frame It",
        content: "Show off your masterpiece. 🚀 Export it, print it, put it on the fridge. Mom will be proud.",
        image: "/demo/export_rocket.png",
        position: 'bottom'
    },
    {
        id: 'smart-suggestions',
        targetId: null,
        title: "Psychic Powers? 🔮",
        content: "It predicts what you need before you do. If only it could also predict when your crush will finally reply — but hey, one miracle at a time.",
        image: "/demo/smart_suggestions.png",
        position: 'center'
    },
    {
        id: 'magic-connect',
        targetId: 'btn-magic-connect',
        title: "Laziness: Unlocked 🔓",
        content: "Too tired to drag lines? Same. Just push the nodes together like two cousins at a wedding. We’ll force the connection.",
        image: "/demo/magic_connect.png",
        position: 'bottom'
    },
    {
        id: 'thematic-styles',
        targetId: 'btn-theme-switch',
        title: "Chaotic Personality Pack 🎭",
        content: "Blueprint when you're pretending to be an adult, Sketch when you're surviving on vibes, Cyberpunk when you want your screen to look cooler than your actual life.",
        image: "/demo/themes.png",
        position: 'bottom'
    },
    {
        id: '3d-tilt',
        targetId: 'btn-3d-tilt',
        title: "Drama Tilt (3D)",
        content: "It moves when you move. Zero delay. Pure responsiveness. Your crush would never — her reply speed makes glaciers look fast.",
        image: "/demo/3d_tilt.png",
        position: 'bottom'
    },
    {
        id: 'focus-mode',
        targetId: 'btn-focus-mode',
        title: "Can't Focus? 😵‍�",
        content: "Hides everything except your canvas. Finally, a mode where you can focus… unlike when she texts ‘hey’ and your brain forgets how electricity works.",
        image: "/demo/focus_mode.png",
        position: 'bottom'
    },
    {
        id: 'outro',
        targetId: null, // Center screen
        title: "You're Dangerous Now",
        content: "Go build something awesome. 😎 Or just dream about her. We won't judge. (But let's be real, she's still not gonna say yes. 💀)",
        image: "/demo/chilling_cartoon.png",
        position: 'center'
    }
];

export default function OnboardingDemo({ onClose }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const currentStep = steps[currentStepIndex];

    // Update window size
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Find target position
    useEffect(() => {
        if (currentStep.targetId) {
            const element = document.getElementById(currentStep.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    bottom: rect.bottom,
                    right: rect.right
                });
            } else {
                setTargetRect(null);
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStepIndex, windowSize]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => {
            localStorage.setItem('showOnboarding', 'false');
            onClose();
        }, 1500);
    };

    const handleSkip = () => {
        localStorage.setItem('showOnboarding', 'false');
        onClose();
    };

    // Calculate card position
    const getCardStyle = () => {
        if (!targetRect) {
            return {
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
            };
        }

        // Default to bottom center of target
        let top = targetRect.bottom + 20;
        let left = targetRect.left + (targetRect.width / 2) - 160; // Center 320px card

        // Adjust if off screen
        if (left < 20) left = 20;
        if (left + 320 > windowSize.width - 20) left = windowSize.width - 340;

        // If bottom is too close to edge, flip to top
        if (top + 400 > windowSize.height) {
            top = targetRect.top - 420; // Card height approx 400
        }

        return { top, left, position: 'absolute' };
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
            {/* SVG Overlay for Spotlight */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto transition-all duration-300">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 5}
                                y={targetRect.top - 5}
                                width={targetRect.width + 10}
                                height={targetRect.height + 10}
                                rx="8"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.7)"
                    mask="url(#spotlight-mask)"
                />

                {/* Spotlight Border */}
                {targetRect && (
                    <motion.rect
                        initial={false}
                        animate={{
                            x: targetRect.left - 5,
                            y: targetRect.top - 5,
                            width: targetRect.width + 10,
                            height: targetRect.height + 10
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        rx="8"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="10 5"
                        className="animate-pulse"
                    />
                )}
            </svg>

            {/* Content Card */}
            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        style={getCardStyle()}
                        className="w-[320px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
                    >
                        {/* Image Area */}
                        <div className="h-40 bg-gray-100 dark:bg-gray-900 relative overflow-hidden flex items-center justify-center">
                            <motion.img
                                src={currentStep.image}
                                alt={currentStep.title}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 5 }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/600x400/1a1a2e/FFF?text=Fun+Image";
                                }}
                            />

                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {currentStep.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                                {currentStep.content}
                            </p>

                            <div className="mt-auto flex justify-between items-center">
                                <div className="flex gap-1">
                                    {steps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all ${idx === currentStepIndex
                                                ? 'w-6 bg-blue-600'
                                                : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {currentStepIndex > 0 && (
                                        <button
                                            onClick={handlePrev}
                                            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-0.1"
                                    >
                                        {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                                        {currentStepIndex === steps.length - 1 ? <FaCheck size={12} /> : <FaArrowRight size={12} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
