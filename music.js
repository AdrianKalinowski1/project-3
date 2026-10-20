// Wspólne, oryginalne motywy muzyczne używane w próbkach i podczas gry.
window.platformerMusic = (function () {
  const tracks = {
    adventure: {
      stepMs: 180,
      melody: [392, 0, 392, 523, 587, 523, 392, 0, 330, 0, 330, 392, 440, 392, 330, 0, 349, 0, 349, 440, 523, 440, 392, 0, 330, 392, 440, 523, 587, 523, 392, 0],
      chords: [[130.81, 164.81, 196], [98, 123.47, 146.83], [110, 130.81, 164.81], [87.31, 110, 130.81]],
      bass: [[130.81, 196], [98, 146.83], [110, 164.81], [87.31, 130.81]],
      leadWave: "triangle",
      leadCutoff: 1200,
      leadVolume: 0.025,
      padVolume: 0.008,
      bassVolume: 0.035,
      drums: true
    },
    retro: {
      stepMs: 155,
      melody: [523, 659, 784, 659, 523, 659, 880, 784, 587, 698, 880, 698, 587, 698, 988, 880, 523, 659, 784, 1047, 880, 784, 659, 523, 587, 698, 880, 1047, 880, 698, 587, 523],
      chords: [[130.81, 164.81, 196], [110, 130.81, 164.81], [98, 123.47, 146.83], [110, 130.81, 164.81]],
      bass: [[130.81, 196], [110, 164.81], [98, 146.83], [110, 164.81]],
      leadWave: "square",
      leadCutoff: 1800,
      leadVolume: 0.012,
      padVolume: 0.004,
      bassVolume: 0.025,
      drums: false
    },
    chill: {
      stepMs: 260,
      melody: [392, 0, 523, 0, 587, 0, 523, 0, 440, 0, 523, 0, 659, 0, 523, 0, 349, 0, 440, 0, 523, 0, 440, 0, 330, 0, 392, 0, 523, 0, 392, 0],
      chords: [[130.81, 164.81, 196], [110, 130.81, 164.81], [98, 123.47, 146.83], [87.31, 110, 130.81]],
      bass: [[130.81, 196], [110, 164.81], [98, 146.83], [87.31, 130.81]],
      leadWave: "sine",
      leadCutoff: 1000,
      leadVolume: 0.018,
      padVolume: 0.012,
      bassVolume: 0.025,
      drums: false
    },
    arcade: {
      stepMs: 135,
      melody: [392, 392, 523, 659, 784, 659, 523, 392, 440, 440, 587, 698, 880, 698, 587, 440, 523, 587, 659, 784, 988, 784, 659, 587, 440, 523, 587, 698, 880, 698, 587, 523],
      chords: [[130.81, 164.81, 196], [110, 130.81, 164.81], [98, 123.47, 146.83], [110, 130.81, 164.81]],
      bass: [[130.81, 196], [110, 164.81], [98, 146.83], [110, 164.81]],
      leadWave: "sawtooth",
      leadCutoff: 950,
      leadVolume: 0.012,
      padVolume: 0.005,
      bassVolume: 0.032,
      drums: true
    }
  };

  function playTone(context, frequency, duration, volume, waveform, cutoff) {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const startsAt = context.currentTime;
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, startsAt);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, startsAt);
    gain.gain.setValueAtTime(0.0001, startsAt);
    gain.gain.linearRampToValueAtTime(volume, startsAt + 0.035);
    gain.gain.setTargetAtTime(0.0001, startsAt + duration * 0.55, duration * 0.18);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startsAt);
    oscillator.stop(startsAt + duration);
  }

  function playDrum(context, isKick) {
    const gain = context.createGain();
    const startsAt = context.currentTime;
    if (isKick) {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(125, startsAt);
      oscillator.frequency.exponentialRampToValueAtTime(48, startsAt + 0.13);
      gain.gain.setValueAtTime(0.045, startsAt);
      gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 0.14);
      oscillator.connect(gain);
      oscillator.start(startsAt);
      oscillator.stop(startsAt + 0.15);
    } else {
      const frameCount = Math.floor(context.sampleRate * 0.12);
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let index = 0; index < frameCount; index++) {
        samples[index] = Math.random() * 2 - 1;
      }
      const noise = context.createBufferSource();
      const filter = context.createBiquadFilter();
      noise.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1500, startsAt);
      gain.gain.setValueAtTime(0.0001, startsAt);
      gain.gain.linearRampToValueAtTime(0.018, startsAt + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 0.11);
      noise.connect(filter);
      filter.connect(gain);
      noise.start(startsAt);
      noise.stop(startsAt + 0.12);
    }
    gain.connect(context.destination);
  }

  function playStep(context, trackId, step) {
    const track = tracks[trackId] || tracks.adventure;
    const currentStep = step % track.melody.length;
    const bar = Math.floor(currentStep / 8) % track.chords.length;
    const beat = currentStep % 8;
    const note = track.melody[currentStep];
    if (beat === 0) {
      track.chords[bar].forEach(function (frequency) {
        playTone(context, frequency, track.stepMs * 0.0075, track.padVolume, "triangle", 700);
      });
    }
    if (beat % 2 === 0) {
      playTone(context, track.bass[bar][beat === 0 ? 0 : 1], track.stepMs * 0.0014, track.bassVolume, "sine", 260);
      if (track.drums) {
        playDrum(context, beat === 0);
      }
    }
    if (note > 0) {
      playTone(context, note, track.stepMs * 0.0016, track.leadVolume, track.leadWave, track.leadCutoff);
    }
  }

  return { tracks: tracks, playStep: playStep };
})();
