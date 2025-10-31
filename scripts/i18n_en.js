// i18n_en.js - English translations (Updated with questions and results)
const translations_en = {
    general_rules: {
        language_name: "English",
        language_code: "en",
        language_english_name: "English",
        dir: "ltr"
	},
    SC1: {
        header: {
            title: "Spiritual Guide",
            subtitle: "Discover your spiritual pattern through this interactive test",
			iconTooltip: "Return to home and reset test",
			installTooltip: "Install App",
            language: {
                ar: "Arabic",
                en: "English"
			}
		},
        login: {
            usernamePlaceholder: "Email or username",
            passwordPlaceholder: "Password",
            button: "Login"
		},
        welcome: {
            title: "Welcome to the Spiritual Guide Test",
            description1: "This test will help you discover your spiritual pattern by analyzing your answers to a set of questions.",
            description2: "8 questions will be displayed, each with 4 options. Choose the option that reflects your true state.",
            startButton: "Start Test"
		},
        questions: {
            questionCounter: "Question {current} of {total}",
            previousButton: "Previous",
            nextButton: "Next",
            finishButton: "Show Result",
            // Questions
            q1: {
                question: "When faced with a major challenge, what is your instinctual reaction?",
                options: {
                    a: "I take charge and create a decisive action plan.",
                    b: "I seek the spiritual meaning and higher purpose of the crisis.",
                    c: "I gather information and calmly analyze all potential outcomes.",
                    d: "I completely change direction and use the crisis to rebuild myself."
				}
			},
            q2: {
                question: "What is your deepest professional motivator?",
                options: {
                    a: "The pursuit of authority, influence, and reaching the pinnacle of success.",
                    b: "Inner dreams, emotional connection, and inspiring collective consciousness.",
                    c: "The accumulation of knowledge and understanding complex systems.",
                    d: "Constant evolution, self-improvement, and pushing beyond past boundaries."
				}
			},
            q3: {
                question: "What role do you naturally assume in a team or social setting?",
                options: {
                    a: "The Leader who delegates tasks and clarifies the core vision.",
                    b: "The Motivator who inspires the team with positive energy and vision.",
                    c: "The Consultant who offers deep analysis and strategic solutions.",
                    d: "The Innovator who proposes radical, effective, and unconventional ideas."
				}
			},
            q4: {
                question: "Where do you feel the greatest sense of profound peace?",
                options: {
                    a: "In open spaces that grant a broad, commanding view (e.g., mountains, high vantage points).",
                    b: "Near water or in deep nature, where intuition flows freely.",
                    c: "In libraries or quiet places allowing for contemplation and analysis.",
                    d: "In moments of radical change or moving into a completely new environment."
				}
			},
            q5: {
                question: "When feeling burnt out, what brings you back to center?",
                options: {
                    a: "Completing an outstanding task to regain control and momentum.",
                    b: "Engaging in creative writing, dreaming, or symbolic reflection.",
                    c: "Learning a new skill or solving a complex puzzle.",
                    d: "Changing my physical appearance or drastically reorganizing my space."
				}
			},
            q6: {
                question: "What is the most critical symbolic loss you fear?",
                options: {
                    a: "Losing control over your life's direction and destiny.",
                    b: "Losing your deep connection to intuition or 'collective soul'.",
                    c: "Losing the clarity of your mind or analytical capacity.",
                    d: "Losing the opportunity to evolve, transform, or start anew."
				}
			},
            q7: {
                question: "How do you approach someone who has betrayed your trust?",
                options: {
                    a: "I confront them directly and decisively to establish boundaries.",
                    b: "I quietly distance myself, offering forgiveness if sincerity is felt.",
                    c: "I analyze their motives to prevent future risks, setting calculated limits.",
                    d: "I focus on developing my own resilience so their actions cannot affect me again."
				}
			},
            q8: {
                question: "Which strength do you invoke to overcome life's pressures?",
                options: {
                    a: "Absolute courage and unyielding will.",
                    b: "Empathy and the knowing that all things pass.",
                    c: "Wisdom derived from past failures and lessons.",
                    d: "Flexibility and the power to rebuild myself continuously."
				}
			}
		},
        results: {
            title: "Spiritual Guide Test Result",
            symbolicMeaning: "Symbolic Meaning",
            coreChallenge: "Core Challenge",
            mission90Days: "90-Day Mission",
            kpi: "Key Performance Indicator",
            allianceTip: "Alliance Tip",
			saveButton: "Save Results",
            restartButton: "Restart Test",
			saveSuccess: "Results saved successfully!",
			saveError: "Error saving results. Please try again.",
            // Results by pattern
            A: {
                guide: "The Eagle/Hawk",
                title: "The Guide of Will",
                symbolicMeaning: "Leadership, Vision, and Willpower. The Eagle executes the strategy with pinpoint accuracy.",
                coreChallenge: "The Trap of Total Control. Risk of burnout from attempting to do everything yourself. This hinders necessary Delegation.",
                mission90Days: "Mandatory Delegation: Identify and train someone to manage 3 routine tasks. Free up 10 hours per week solely for strategic planning.",
                kpi: "Execution KPI: Your daily focus metric is: 'Number of critical decisions made by a team member without my intervention.'",
                allianceTip: "To find balance, seek the Intuitive (Pattern B) to temper your drive, and the Transformation (Pattern D) to ensure flexible pivots."
			},
            B: {
                guide: "The Whale/Dolphin",
                title: "The Guide of Depth",
                symbolicMeaning: "Intuition, Collective Consciousness, and Creative Depth. The Whale carries the deep wisdom of time.",
                coreChallenge: "The Trap of Scope Creep. Your vast imagination leads to parallel projects, preventing deep completion and physical grounding.",
                mission90Days: "Physical Grounding: Commit to one single MVP project aligned with your vision. Your mission is to physically complete 70% of it before entertaining any other major idea.",
                kpi: "Execution KPI: Your daily focus metric is: 'Hours spent on physical execution versus hours spent on abstract planning.'",
                allianceTip: "To find balance, seek the Leadership (Pattern A) to enforce boundaries and execution, and the Wisdom (Pattern C) to structure your insights."
			},
            C: {
                guide: "The Owl/Wolf",
                title: "The Guide of Wisdom",
                symbolicMeaning: "Hidden Knowledge, Strategy, and Protection. The Owl sees truth in the darkness; the Wolf protects its core.",
                coreChallenge: "The Trap of Analysis Paralysis. Your drive for complete knowledge (100% data) can halt critical action. You risk missing calculated opportunities.",
                mission90Days: "Action Threshold: Define an '80% Confidence Threshold' for critical decisions. Once 80% of data is collected, you must execute within 72 hours, even if minor unknowns remain.",
                kpi: "Execution KPI: Your daily focus metric is: 'Number of major decisions executed (not just planned) this week.'",
                allianceTip: "To find balance, seek the Intuitive (Pattern B) to inspire emotional connection, and the Transformation (Pattern D) to push you into necessary change."
			},
            D: {
                guide: "The Snake/Butterfly",
                title: "The Guide of Cycles",
                symbolicMeaning: "Radical Transformation, Healing, and Resilience. The Snake sheds its skin; the Butterfly emerges reborn.",
                coreChallenge: "The Trap of Instability. Constant, major transformations prevent you from establishing the Sustainable Foundation needed for a multi-decade legacy.",
                mission90Days: "Core Stability: Define a 'Non-Negotiable Core' for your life/business (e.g., your income goal or core value). Ensure all transformations serve to strengthen this core.",
                kpi: "Execution KPI: Your daily focus metric is: 'Number of consecutive days passed without starting a new project or changing the core direction of the primary MVP.'",
                allianceTip: "To find balance, seek the Leadership (Pattern A) to enforce discipline and focus, and the Wisdom (Pattern C) to provide stability during your rapid evolutions."
			}
		},
        settings: {
            title: "Settings",
            tooltip: "Settings",
            language: "Language"
		},
        footer: {
            developedBy: "Developed by Mejri Ziad",
            version: "spiritual-guide-v2.1.6",
            project: "Atlantis Platform"
		},
		music: {
			title: "Music Player",
			tooltipTitle: "Play/Stop background music",
			tooltipExpand: "Click to expand/collapse music player",
			noTrack: "No track playing",
			error: "Cannot play audio. Please check your music files.",
			tracks: {
				track1: "velvetkeys-zen meditation buddhist",
				track2: "velvetkeys1-zen meditation buddhist",
				track3: "spiritualite nature"
			},
			playlistModal: {
				title: "Playlist Management",
				currentTracks: "Current Tracks",
				tooltip: "Manage Playlist",
				trackPlaying: "Playing",
				trackPaused: "Paused",
				trackStopped: "Stopped",
				removeTrack: "Remove from playlist",
				playTrack: "Play this track",
				resetToDefault: "Reset to Default",
				savePlaylist: "Save Playlist",
				resetConfirm: "Reset playlist to default tracks?",
				saveSuccess: "Playlist saved successfully!",
				resetSuccess: "Playlist reset to default!"
			}
		}
	}
};