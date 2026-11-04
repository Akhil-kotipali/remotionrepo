import os
import wave
import numpy as np
import miniaudio

SR = 44100
OUT_SFX = "public/audio/sfx"
os.makedirs(OUT_SFX, exist_ok=True)

def load_audio(filepath):
    dec = miniaudio.decode_file(filepath)
    raw = np.array(dec.samples, dtype=np.float32) / 32768.0
    if dec.nchannels == 2:
        raw = (raw[0::2] + raw[1::2]) * 0.5
    if dec.sample_rate != SR:
        from scipy.signal import resample
        target_len = int(len(raw) * SR / dec.sample_rate)
        raw = resample(raw, target_len)
    return raw

def save_wav(name, samples, peak=0.9):
    p = np.max(np.abs(samples)) + 1e-9
    norm = samples / p * peak
    # stereo expansion for depth
    stereo = np.stack([norm, norm], axis=1)
    out_16 = (np.clip(stereo, -1.0, 1.0) * 32767).astype(np.int16)
    out_path = os.path.join(OUT_SFX, f"{name}.wav")
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(out_16.tobytes())
    print(f"Upgraded SFX: {name}.wav ({len(samples)/SR:.2f}s)")

def main():
    print("Upgrading synthesized SFX with real recorded sound effects...")

    # 1. Heartbeat
    hb_path = "sound effects/22440__lunardrive__single-heartbeat-clean-hq_beatsmith.wav"
    if os.path.exists(hb_path):
        hb = load_audio(hb_path)
        # trim to 0.7s punch
        hb = hb[:int(0.7 * SR)]
        save_wav("heartbeat", hb, peak=0.92)

    # 2. Camera Shutter
    cam_path = "sound effects/360329__inspectorj__camera-shutter-fast-a.wav"
    if os.path.exists(cam_path):
        cam = load_audio(cam_path)
        cam = cam[:int(0.8 * SR)]
        save_wav("camera_shutter", cam, peak=0.95)

    # 3. Phone Buzz
    buzz_path = "sound effects/763261__kev_durr__vibrating-cell-phones-in-various-areas.wav"
    if os.path.exists(buzz_path):
        buzz = load_audio(buzz_path)
        # take first 0.6s of strong vibration
        buzz = buzz[int(0.1*SR):int(0.7*SR)]
        save_wav("phone_buzz", buzz, peak=0.88)

    # 4. Glitch Hit
    glitch_path = "sound effects/virtual_vibes-glitch-sound-effect-hd-379466.mp3"
    if os.path.exists(glitch_path):
        glitch = load_audio(glitch_path)
        glitch = glitch[:int(0.5 * SR)]
        save_wav("glitch_hit", glitch, peak=0.90)

    # 5. Whoosh
    whoosh_path = "sound effects/855844__sadiquecat__whoosh-long-bamboo-stick-os-st-13.wav"
    if os.path.exists(whoosh_path):
        whoosh = load_audio(whoosh_path)
        whoosh = whoosh[int(0.2*SR):int(0.8*SR)]
        save_wav("whoosh", whoosh, peak=0.85)

    # 6. Static Burst
    static_path = "sound effects/633174__oliwoli__vintage-tv-static-noise.wav"
    if os.path.exists(static_path):
        stat = load_audio(static_path)
        stat = stat[:int(0.5 * SR)]
        save_wav("static_burst", stat, peak=0.85)

    # 7. Footstep
    step_path = "sound effects/547993__federico_casazza__footstep-on-wooden-floor.wav"
    if os.path.exists(step_path):
        step = load_audio(step_path)
        step = step[int(0.1*SR):int(0.4*SR)]
        save_wav("footstep", step, peak=0.75)

    # 8. Breath / gasp
    breath_path = "sound effects/30709__unclesigmund__breath.wav"
    if os.path.exists(breath_path):
        br = load_audio(breath_path)
        br = br[int(0.2*SR):int(1.2*SR)]
        save_wav("breath", br, peak=0.70)

    print("Sound effects upgraded successfully.")

if __name__ == "__main__":
    main()

