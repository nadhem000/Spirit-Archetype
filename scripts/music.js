// music.js - Enhanced Background music player with full controls
class MusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = 0;
        this.volume = 0.5; // Default volume
        this.tracks = [
            'assets/musics/default/velvetkeys-zen-meditation-buddhist.mp3',
            'assets/musics/default/velvetkeys-zen-meditation-buddhist-1.mp3', 
            'assets/musics/default/spiritualite-nature.mp3'
		];
        // Track names will be set using translations
        this.trackNames = [];
        this.initializeElements();
        this.setupEventListeners();
        this.updateTrackNames(); // Set initial track names
        this.updateTrackInfo(); // Set initial display text
        this.setVolume(this.volume); // Set initial volume
	}
	
    initializeElements() {
        this.toggleBtn = document.getElementById('SC1-music-toggle');
        this.prevBtn = document.getElementById('SC1-music-prev');
        this.nextBtn = document.getElementById('SC1-music-next');
        this.musicTitle = document.getElementById('SC1-music-title');
        this.progressBar = document.getElementById('SC1-music-progress-bar');
        this.progressContainer = document.querySelector('.SC1-music-progress');
        this.currentTimeElement = document.getElementById('SC1-music-current-time');
        this.totalTimeElement = document.getElementById('SC1-music-total-time');
        this.volumeBtn = document.getElementById('SC1-music-volume-btn');
        this.volumeSlider = document.getElementById('SC1-music-volume-slider');
        
        // Add these two lines for expand/collapse
        this.musicPlayerElement = document.getElementById('SC1-music-player');
        this.musicHeaderElement = document.getElementById('SC1-music-header');
	}
	
    setupEventListeners() {
        // Toggle play/pause
        this.toggleBtn.addEventListener('click', () => {
            this.togglePlay();
		});
		
        // Previous track
        this.prevBtn.addEventListener('click', () => {
            this.previousTrack();
		});
		
        // Next track
        this.nextBtn.addEventListener('click', () => {
            this.nextTrack();
		});
		
        // Progress bar click to seek
        this.progressContainer.addEventListener('click', (e) => {
            this.seek(e);
		});
		
        // Volume slider change
        this.volumeSlider.addEventListener('input', () => {
            this.setVolume(this.volumeSlider.value / 100);
		});
		
        // Volume button click to mute/unmute
        this.volumeBtn.addEventListener('click', () => {
            this.toggleMute();
		});
		
        // Update progress bar and time
        setInterval(() => {
            this.updateProgress();
            this.updateTime();
		}, 1000);
		
        // Listen for language changes to update track names
        document.addEventListener('languageChanged', () => {
            this.updateTrackNames();
            this.updateTrackInfo();
		});
		
        // Add expand/collapse functionality HERE
        if (this.musicHeaderElement) {
            this.musicHeaderElement.addEventListener('click', () => {
                this.musicPlayerElement.classList.toggle('SC1-expanded');
			});
		}
	}
	
    // Update track names based on current language
    updateTrackNames() {
        this.trackNames = [
            translate('SC1.music.tracks.track1'),
            translate('SC1.music.tracks.track2'),
            translate('SC1.music.tracks.track3')
		];
	}
	
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
			} else {
            this.play();
		}
	}
	
    play() {
        if (!this.audio) {
            this.audio = new Audio(this.tracks[this.currentTrack]);
            this.audio.volume = this.volume;
            // When track ends, play next one
            this.audio.addEventListener('ended', () => {
                this.nextTrack();
			});
            // When metadata is loaded, update total time
            this.audio.addEventListener('loadedmetadata', () => {
                this.updateTime();
			});
		}
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.toggleBtn.classList.add('playing');
            this.updateTrackInfo();
			}).catch(error => {
            console.error('Error playing audio:', error);
            this.showError(translate('SC1.music.error'));
		});
	}
	
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.toggleBtn.classList.remove('playing');
		}
	}
	
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.changeTrack();
	}
	
    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.changeTrack();
	}
	
    changeTrack() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
		}
        if (this.isPlaying) {
            this.play();
			} else {
            // If not playing, still update the track info
            this.updateTrackInfo();
		}
	}
	
    updateTrackInfo() {
		if (this.isPlaying && this.audio) {
			this.musicTitle.textContent = this.trackNames[this.currentTrack];
			} else {
			this.musicTitle.textContent = translate('SC1.music.noTrack');
		}
	}
	
    updateProgress() {
        if (this.audio && this.isPlaying && this.progressBar) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.style.width = progress + '%';
		}
	}
	
    updateTime() {
        if (this.audio && this.currentTimeElement && this.totalTimeElement) {
            // Update current time
            const currentMinutes = Math.floor(this.audio.currentTime / 60);
            const currentSeconds = Math.floor(this.audio.currentTime % 60);
            this.currentTimeElement.textContent = 
			`${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
            // Update total time
            if (this.audio.duration) {
                const totalMinutes = Math.floor(this.audio.duration / 60);
                const totalSeconds = Math.floor(this.audio.duration % 60);
                this.totalTimeElement.textContent = 
				`${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
			}
		}
	}
	
    seek(e) {
        if (this.audio && this.isPlaying) {
            const rect = this.progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
		}
	}
	
    setVolume(volume) {
        this.volume = volume;
        if (this.audio) {
            this.audio.volume = volume;
		}
        // Update the volume slider position
        this.volumeSlider.value = volume * 100;
        // Update volume icon based on volume level
        this.updateVolumeIcon();
	}
	
    toggleMute() {
        if (this.volume > 0) {
            this.lastVolume = this.volume;
            this.setVolume(0);
			} else {
            this.setVolume(this.lastVolume || 0.5);
		}
	}
	
    updateVolumeIcon() {
        if (this.volumeBtn) {
            let iconPath = '';
            if (this.volume === 0) {
                iconPath = 'M3 9v6h4l5 5V4L7 9H3z';
				} else if (this.volume < 0.5) {
                iconPath = 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM3 9v6h4l5 5V4L7 9H3z';
				} else {
                iconPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
			}
            this.volumeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="${iconPath}"/></svg>`;
		}
	}
	
    updateTrackNames() {
        this.trackNames = [
            translate('SC1.music.tracks.track1'),
            translate('SC1.music.tracks.track2'),
            translate('SC1.music.tracks.track3')
		];
	}
	
    showError(message) {
        const errorMessage = translate(message);
        if (window.showError) {
            window.showError(errorMessage);
			} else {
            console.error(errorMessage);
		}
	}

    // method to update Track Names
    updateTrackNames() {
        this.trackNames = [
            translate('SC1.music.tracks.track1'),
            translate('SC1.music.tracks.track2'),
            translate('SC1.music.tracks.track3')
        ];
    }

    // method to handle track changes properly
    changeTrack() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        
        if (this.isPlaying) {
            this.play();
        } else {
            this.updateTrackInfo();
        }
        
        // Dispatch event for playlist modal to listen to
        this.dispatchTrackChange();
    }

    // Add event dispatching for track changes
    dispatchTrackChange() {
        const event = new CustomEvent('trackChanged', {
            detail: {
                currentTrack: this.currentTrack,
                isPlaying: this.isPlaying
            }
        });
        document.dispatchEvent(event);
    }
}

// Playlist Modal Management
class PlaylistModal {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.modal = document.getElementById('SC1-playlist-modal');
        this.tracksContainer = document.getElementById('SC1-playlist-tracks');
        this.closeBtn = document.getElementById('SC1-playlist-modal-close');
        this.resetBtn = document.getElementById('SC1-reset-playlist-btn');
        this.saveBtn = document.getElementById('SC1-save-playlist-btn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Open modal when playlist button is clicked
        document.getElementById('SC1-playlist-btn').addEventListener('click', () => {
            this.open();
        });

        // Close modal
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });

        // Close when clicking outside modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('SC1-active')) {
                this.close();
            }
        });

        // Reset playlist button
        this.resetBtn.addEventListener('click', () => {
            this.resetToDefault();
        });

        // Save playlist button
        this.saveBtn.addEventListener('click', () => {
            this.savePlaylist();
        });
    }

    open() {
        this.modal.classList.add('SC1-active');
        this.renderTrackList();
    }

    close() {
        this.modal.classList.remove('SC1-active');
    }

    renderTrackList() {
        this.tracksContainer.innerHTML = '';
        
        this.musicPlayer.tracks.forEach((trackPath, index) => {
            const trackElement = this.createTrackElement(trackPath, index);
            this.tracksContainer.appendChild(trackElement);
        });
    }

    createTrackElement(trackPath, index) {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'SC1-playlist-track';
        
        // Add active class if this is the current track
        if (index === this.musicPlayer.currentTrack) {
            trackDiv.classList.add('active');
        }

        // Extract filename from path for display
        const fileName = trackPath.split('/').pop();
        const trackName = this.musicPlayer.trackNames[index] || fileName;

        trackDiv.innerHTML = `
            <div class="SC1-track-info">
                <div class="SC1-track-name">${trackName}</div>
                <div class="SC1-track-duration">${this.getTrackDuration(index)}</div>
            </div>
            <div class="SC1-track-status">${this.getTrackStatus(index)}</div>
            <div class="SC1-track-actions">
                <button class="SC1-track-action-btn SC1-track-play" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span class="SC1-tooltip">${translate('SC1.music.playlistModal.playTrack')}</span>
                </button>
                <button class="SC1-track-action-btn SC1-track-remove" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    <span class="SC1-tooltip">${translate('SC1.music.playlistModal.removeTrack')}</span>
                </button>
            </div>
        `;

        // Add event listeners for the buttons
        const playBtn = trackDiv.querySelector('.SC1-track-play');
        const removeBtn = trackDiv.querySelector('.SC1-track-remove');

        playBtn.addEventListener('click', () => {
            this.playTrack(index);
        });

        removeBtn.addEventListener('click', () => {
            this.removeTrack(index);
        });

        return trackDiv;
    }

    getTrackDuration(index) {
        // This is a placeholder - in a real implementation, you'd load the audio file
        // and get its duration. For now, we'll return a placeholder.
        return '2:30'; // Placeholder duration
    }

    getTrackStatus(index) {
        if (index === this.musicPlayer.currentTrack && this.musicPlayer.isPlaying) {
            return translate('SC1.music.playlistModal.trackPlaying');
        } else if (index === this.musicPlayer.currentTrack && !this.musicPlayer.isPlaying) {
            return translate('SC1.music.playlistModal.trackPaused');
        } else {
            return translate('SC1.music.playlistModal.trackStopped');
        }
    }

    playTrack(index) {
        this.musicPlayer.currentTrack = index;
        this.musicPlayer.changeTrack();
        this.renderTrackList(); // Refresh to update status
        this.close(); // Close modal after selecting track
    }

    removeTrack(index) {
        // Don't remove if it's the last track
        if (this.musicPlayer.tracks.length <= 1) {
            showError('Cannot remove the last track');
            return;
        }

        // Remove track from arrays
        this.musicPlayer.tracks.splice(index, 1);
        this.musicPlayer.trackNames.splice(index, 1);

        // Adjust currentTrack index if needed
        if (this.musicPlayer.currentTrack >= index) {
            this.musicPlayer.currentTrack = Math.max(0, this.musicPlayer.currentTrack - 1);
        }

        // If we removed the currently playing track, change to the new current track
        if (index === this.musicPlayer.currentTrack) {
            this.musicPlayer.changeTrack();
        }

        this.renderTrackList();
        showSuccess('Track removed from playlist');
    }

    resetToDefault() {
        if (confirm(translate('SC1.music.playlistModal.resetConfirm'))) {
            // Reset to default tracks
            this.musicPlayer.tracks = [
                'assets/musics/default/velvetkeys-zen-meditation-buddhist.mp3',
                'assets/musics/default/velvetkeys-zen-meditation-buddhist-1.mp3', 
                'assets/musics/default/spiritualite-nature.mp3'
            ];
            
            this.musicPlayer.updateTrackNames();
            this.musicPlayer.currentTrack = 0;
            this.musicPlayer.changeTrack();
            this.renderTrackList();
            
            showSuccess(translate('SC1.music.playlistModal.resetSuccess'));
        }
    }

    savePlaylist() {
        // Save current playlist to localStorage
        const playlistData = {
            tracks: this.musicPlayer.tracks,
            trackNames: this.musicPlayer.trackNames,
            lastSaved: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('SC1-music-playlist', JSON.stringify(playlistData));
            showSuccess(translate('SC1.music.playlistModal.saveSuccess'));
        } catch (error) {
            showError('Failed to save playlist: ' + error.message);
        }
    }

    loadPlaylist() {
        // Load saved playlist from localStorage
        try {
            const saved = localStorage.getItem('SC1-music-playlist');
            if (saved) {
                const playlistData = JSON.parse(saved);
                this.musicPlayer.tracks = playlistData.tracks;
                this.musicPlayer.trackNames = playlistData.trackNames;
                return true;
            }
        } catch (error) {
            console.error('Error loading playlist:', error);
        }
        return false;
    }
}

// Initialize music player and playlist modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
    window.playlistModal = new PlaylistModal(window.musicPlayer);
    
    // Load saved playlist if available
    window.playlistModal.loadPlaylist();
    
    // Listen for track changes to update the modal if it's open
    document.addEventListener('trackChanged', () => {
        if (window.playlistModal.modal.classList.contains('SC1-active')) {
            window.playlistModal.renderTrackList();
        }
    });
    
    // Listen for language changes to update track names
    document.addEventListener('languageChanged', () => {
        window.musicPlayer.updateTrackNames();
        if (window.playlistModal.modal.classList.contains('SC1-active')) {
            window.playlistModal.renderTrackList();
        }
    });
});


// Make it available globally
window.MusicPlayer = MusicPlayer;
// Make playlist functions available globally
window.openPlaylistModal = function() {
    if (window.playlistModal) {
        window.playlistModal.open();
    }
};

window.resetMusicPlaylist = function() {
    if (window.playlistModal) {
        window.playlistModal.resetToDefault();
    }
};

// Update the existing MusicPlayer instance to work with playlist
if (window.musicPlayer) {
    // Override the updateTrackNames method to be accessible
    window.musicPlayer.updateTrackNames = function() {
        this.trackNames = [
            translate('SC1.music.tracks.track1'),
            translate('SC1.music.tracks.track2'),
            translate('SC1.music.tracks.track3')
        ];
    };
}