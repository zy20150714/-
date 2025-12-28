import type { SoundType, SoundConfig } from '../types';

class AudioUtils {
  private audioContext: AudioContext | null = null;
  private soundConfigs: Record<SoundType, SoundConfig> = {
    click: {
      accentFrequency: 1000,
      secondaryFrequency: 600,
      normalFrequency: 400,
      duration: 0.08,
    },
    drum: {
      accentFrequency: 180,
      secondaryFrequency: 220,
      normalFrequency: 280,
      duration: 0.15,
    },
    wood: {
      accentFrequency: 700,
      secondaryFrequency: 550,
      normalFrequency: 450,
      duration: 0.12,
    },
    electronic: {
      accentFrequency: 1500,
      secondaryFrequency: 1100,
      normalFrequency: 900,
      duration: 0.08,
    },
    metal: {
      accentFrequency: 2500,
      secondaryFrequency: 1800,
      normalFrequency: 1500,
      duration: 0.2,
    },
  };

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, volume: number, duration: number, type: OscillatorType = 'sine'): void {
    const audioContext = this.getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    const normalizedVolume = Math.min(volume / 100, 0.8);
    gainNode.gain.setValueAtTime(normalizedVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }

  public playAccent(soundType: SoundType, volume: number): void {
    const config = this.soundConfigs[soundType];
    this.playTone(config.accentFrequency, volume, config.duration, 'sine');
  }

  public playSecondary(soundType: SoundType, volume: number): void {
    const config = this.soundConfigs[soundType];
    this.playTone(config.secondaryFrequency, volume * 0.7, config.duration * 0.8, 'sine');
  }

  public playNormal(soundType: SoundType, volume: number): void {
    const config = this.soundConfigs[soundType];
    this.playTone(config.normalFrequency, volume * 0.6, config.duration * 0.7, 'sine');
  }

  public playSound(soundType: SoundType, isAccent: boolean, isSecondary: boolean, volume: number): void {
    if (isAccent) {
      this.playAccent(soundType, volume);
    } else if (isSecondary) {
      this.playSecondary(soundType, volume);
    } else {
      this.playNormal(soundType, volume);
    }
  }

  public preload(): void {
    this.getAudioContext();
  }
}

export const audioUtils = new AudioUtils();