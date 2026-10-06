# Synthesises narration lines with Piper (free, offline). Usage: voice.py <lines.json>  where lines.json = [[outPath, text], ...]
import json, sys, wave
from piper import PiperVoice, SynthesisConfig

voice = PiperVoice.load("video/voice/jenny.onnx")
cfg = SynthesisConfig(length_scale=1.05, noise_scale=0.5, noise_w_scale=0.6)  # slightly slower and steadier: calm delivery
for path, text in json.load(open(sys.argv[1], encoding="utf8")):
    with wave.open(path, "wb") as w:
        voice.synthesize_wav(text, w, syn_config=cfg)
    print("ok", path)
