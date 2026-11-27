"""원어민 발음 mp3 만들기 — src/raw_v43.json 의 영어 문장을 Kokoro(af_heart)로 읽어 audio/<해시>.mp3 로 저장.
이미 있는 파일은 건너뛴다. 새 문장을 추가한 뒤 다시 돌리면 그 문장만 만든다.
모델 파일(kokoro.onnx, voices.bin)은 저장소 밖 폴더를 인자로 준다.
  python3 tools/make_voice.py /path/to/model_dir
"""
import sys, json, hashlib, subprocess, pathlib, tempfile
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"; OUT.mkdir(exist_ok=True)
VOICE, SPEED = "af_heart", 0.95

def norm(en):
    return en.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').strip()

def key(en):
    return hashlib.sha1(norm(en).encode("utf-8")).hexdigest()[:10]

def main():
    md = pathlib.Path(sys.argv[1])
    rows = json.loads((ROOT / "src" / "raw_v43.json").read_text(encoding="utf-8"))["rows"]
    todo = []
    for r in rows:
        k = key(r[1])
        if not (OUT / (k + ".mp3")).exists() and (k, r[1]) not in todo: todo.append((k, r[1]))
    print("to make:", len(todo), flush=True)
    if not todo: return
    tts = Kokoro(str(md / "kokoro.onnx"), str(md / "voices.bin"))
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i, (k, en) in enumerate(todo):
        s, sr = tts.create(norm(en), voice=VOICE, speed=SPEED, lang="en-us")
        w = tmp / (k + ".wav"); sf.write(w, s, sr)
        # 앞뒤 무음을 잘라 정답 직후 바로 들리게, 모노 48kbps
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(w),
                        "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.05",
                        "-ac", "1", "-b:a", "48k", str(OUT / (k + ".mp3"))], check=True)
        if i % 25 == 0: print(i, en, flush=True)
    print("done", flush=True)

if __name__ == "__main__":
    main()
