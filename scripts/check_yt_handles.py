import urllib.request
import urllib.error

HANDLES_TO_CHECK = [
    "DreadFrame",
    "DreadFrameHorror",
    "MemoryGlitchHorror",
    "NullMemoryHorror",
    "UnrememberedFiles",
    "MidnightBackup",
    "EchoArchiveHorror",
    "TheStaticRoom",
    "LostReelHorror",
    "Tape0217",
    "FalseRecall",
    "FalseRecallHorror",
    "EveryoneRemembers",
    "VoidEchoesHorror",
    "WhisperTape",
]

def check_handle(handle):
    url = f"https://www.youtube.com/@{handle}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                return "TAKEN (200)"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return "AVAILABLE (404)"
        return f"HTTP {e.code}"
    except Exception as e:
        return f"Error: {e}"
    return "UNKNOWN"

if __name__ == "__main__":
    for h in HANDLES_TO_CHECK:
        status = check_handle(h)
        print(f"@{h:22} -> {status}")

