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
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});

// Make it available globally
window.MusicPlayer = MusicPlayer;