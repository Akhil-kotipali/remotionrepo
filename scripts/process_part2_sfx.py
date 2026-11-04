import os
import wave
import numpy as np
import miniaudio

SR = 44100

def waveform_trim_silence(samples, sr=SR, threshold_db=-45, pad_pre_ms=15, pad_post_ms=30):
    amp = np.abs(samples)
    thresh = 10 ** (threshold_db / 20) * (np.max(amp) + 1e-9)
    window = int(sr * 0.01) # 10ms
    kernel = np.ones(window) / window
    env = np.convolve(amp, kernel, mode='same')
    active = np.where(env > thresh)[0]
    if len(active) == 0:
        return samples
    start = max(0, active[0] - int(sr * (pad_pre_ms / 1000.0)))
    end = min(len(samples), active[-1] + int(sr * (pad_post_ms / 1000.0)))
    trimmed = samples[start:end]
    return trimmed

def apply_fade(samples, fade_in_samples=200, fade_out_samples=500):
    n = len(samples)
    out = samples.copy()
    fi = min(n // 4, fade_in_samples)
    fo = min(n // 4, fade_out_samples)
    if fi > 0:
        out[:fi] *= np.linspace(0, 1, fi)
    if fo > 0:
        out[-fo:] *= np.linspace(1, 0, fo)
    return out

def normalize_peak(samples, target_db=-1.5):
    target_amp = 10 ** (target_db / 20)
    current_peak = np.max(np.abs(samples)) + 1e-9
    return samples * (target_amp / current_peak)

def decode_to_mono(filepath):
    dec = miniaudio.decode_file(filepath)
    raw = np.array(dec.samples, dtype=np.float32) / 32768.0
    if dec.nchannels == 2:
        # Average left and right
        mono = (raw[0::2] + raw[1::2]) * 0.5
    else:
        mono = raw
    # If sample rate differs, naive or linear resample
    if dec.sample_rate != SR:
        num_target = int(len(mono) * (SR / dec.sample_rate))
        mono = np.interp(np.linspace(0, len(mono), num_target, endpoint=False), np.arange(len(mono)), mono)
    return mono

def write_wav_stereo(filepath, mono_samples):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    # Ensure stereo
    stereo = np.empty(len(mono_samples) * 2, dtype=np.int16)
    clamped = np.clip(mono_samples, -1.0, 1.0)
    i16 = (clamped * 32767.0).astype(np.int16)
    stereo[0::2] = i16
    stereo[1::2] = i16
    with wave.open(filepath, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo.tobytes())

SFX_DIR = "sound effects"
PUBLIC_SFX = "public/audio/sfx"

def process_all():
    print("Processing and cutting sound effects using waveform analysis...")
    
    # 1. paper_flip
    raw = decode_to_mono(os.path.join(SFX_DIR, "liecio-crumping-paper-109585.mp3"))
    trimmed = waveform_trim_silence(raw, threshold_db=-38, pad_pre_ms=10, pad_post_ms=25)
    # Take the cleanest initial flip (~0.85s)
    max_len = int(SR * 0.85)
    if len(trimmed) > max_len:
        trimmed = trimmed[:max_len]
    trimmed = apply_fade(trimmed, 200, 1000)
    trimmed = normalize_peak(trimmed, -2.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "paper_flip.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "paper_flip.wav"), trimmed)
    print("  -> paper_flip.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 2. marker_write
    raw = decode_to_mono(os.path.join(SFX_DIR, "320017__vlatkoblazek__writing-on-paper-with-felt-pen.wav"))
    trimmed = waveform_trim_silence(raw, threshold_db=-40, pad_pre_ms=10, pad_post_ms=20)
    # Target 3.0s continuous writing sound
    max_len = int(SR * 3.0)
    if len(trimmed) > max_len:
        trimmed = trimmed[:max_len]
    trimmed = apply_fade(trimmed, 300, 1500)
    trimmed = normalize_peak(trimmed, -2.5)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "marker_write.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "marker_write.wav"), trimmed)
    print("  -> marker_write.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 3. lens_whir
    raw = decode_to_mono(os.path.join(SFX_DIR, "336556__humanoide9000__camera-lens-servo.wav"))
    trimmed = waveform_trim_silence(raw, threshold_db=-42, pad_pre_ms=15, pad_post_ms=30)
    max_len = int(SR * 1.3)
    if len(trimmed) > max_len:
        trimmed = trimmed[:max_len]
    trimmed = apply_fade(trimmed, 200, 800)
    trimmed = normalize_peak(trimmed, -3.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "lens_whir.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "lens_whir.wav"), trimmed)
    print("  -> lens_whir.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 4. camera_shutter
    raw = decode_to_mono(os.path.join(SFX_DIR, "360329__inspectorj__camera-shutter-fast-a.wav"))
    trimmed = waveform_trim_silence(raw, threshold_db=-44, pad_pre_ms=5, pad_post_ms=20)
    trimmed = apply_fade(trimmed, 50, 400)
    trimmed = normalize_peak(trimmed, -1.5)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "camera_shutter.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "camera_shutter.wav"), trimmed)
    print("  -> camera_shutter.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 5. morning_ambience
    raw = decode_to_mono(os.path.join(SFX_DIR, "238711__delandes__morning-birds-001.wav"))
    # Cut 60 seconds of morning ambience
    amb_len = int(SR * 60.0)
    trimmed = raw[:amb_len] if len(raw) >= amb_len else raw
    trimmed = apply_fade(trimmed, int(SR * 0.5), int(SR * 0.8))
    trimmed = normalize_peak(trimmed, -16.0) # soft ambient background level
    write_wav_stereo(os.path.join(PUBLIC_SFX, "morning_ambience.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "morning_ambience.wav"), trimmed)
    print("  -> morning_ambience.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 6. glass_shimmer
    raw = decode_to_mono(os.path.join(SFX_DIR, "shut_up_ghost-descending-tones-168472.mp3"))
    trimmed = waveform_trim_silence(raw, threshold_db=-42, pad_pre_ms=10, pad_post_ms=30)
    trimmed = apply_fade(trimmed, 150, 800)
    trimmed = normalize_peak(trimmed, -3.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "glass_shimmer.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "glass_shimmer.wav"), trimmed)
    print("  -> glass_shimmer.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 7. bubble_pop
    raw = decode_to_mono(os.path.join(SFX_DIR, "pop-click-ui-2-198302.mp3"))
    trimmed = waveform_trim_silence(raw, threshold_db=-42, pad_pre_ms=5, pad_post_ms=15)
    trimmed = apply_fade(trimmed, 50, 200)
    trimmed = normalize_peak(trimmed, -2.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "bubble_pop.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "bubble_pop.wav"), trimmed)
    print("  -> bubble_pop.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 8. name_tick
    raw = decode_to_mono(os.path.join(SFX_DIR, "u_a4gfvwagf1-tick-sound-effect-1-336779.mp3"))
    trimmed = waveform_trim_silence(raw, threshold_db=-42, pad_pre_ms=5, pad_post_ms=15)
    max_len = int(SR * 0.15)
    if len(trimmed) > max_len:
        trimmed = trimmed[:max_len]
    trimmed = apply_fade(trimmed, 50, 200)
    trimmed = normalize_peak(trimmed, -2.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "name_tick.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "name_tick.wav"), trimmed)
    print("  -> name_tick.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 9. match_beep
    raw = decode_to_mono(os.path.join(SFX_DIR, "202530__kalisemorrison__scanner-beep.wav"))
    trimmed = waveform_trim_silence(raw, threshold_db=-42, pad_pre_ms=5, pad_post_ms=20)
    max_len = int(SR * 0.25)
    if len(trimmed) > max_len:
        trimmed = trimmed[:max_len]
    trimmed = apply_fade(trimmed, 50, 300)
    trimmed = normalize_peak(trimmed, -2.5)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "match_beep.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "match_beep.wav"), trimmed)
    print("  -> match_beep.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 10. scan_sweep
    raw = decode_to_mono(os.path.join(SFX_DIR, "power on.wav"))
    trimmed = waveform_trim_silence(raw, threshold_db=-40, pad_pre_ms=10, pad_post_ms=25)
    max_len = int(SR * 1.0)
    if len(trimmed) > max_len:
        trimmed = trimmed[:max_len]
    trimmed = apply_fade(trimmed, 150, 500)
    trimmed = normalize_peak(trimmed, -3.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "scan_sweep.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "scan_sweep.wav"), trimmed)
    print("  -> scan_sweep.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    # 11. riser
    raw = decode_to_mono(os.path.join(SFX_DIR, "376771__meijstroaudio__dissonant-choir-rise-002.wav"))
    trimmed = waveform_trim_silence(raw, threshold_db=-42, pad_pre_ms=10, pad_post_ms=25)
    max_len = int(SR * 3.5)
    if len(trimmed) > max_len:
        trimmed = trimmed[-max_len:] # Take the climax rise
    trimmed = apply_fade(trimmed, 400, 1000)
    trimmed = normalize_peak(trimmed, -2.0)
    write_wav_stereo(os.path.join(PUBLIC_SFX, "riser.wav"), trimmed)
    write_wav_stereo(os.path.join(SFX_DIR, "riser.wav"), trimmed)
    print("  -> riser.wav processed (length: %.2fs)" % (len(trimmed)/SR))

    print("All Part 2 sound effects trimmed, normalized and written to both directories successfully!")

if __name__ == "__main__":
    process_all()

