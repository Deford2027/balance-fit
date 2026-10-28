#!/usr/bin/env bash
# Видео для /imperial3 из фото клуба (своих роликов Империала нет, стоковые сайты из песочницы закрыты):
# медленный наезд/панорама по каждому фото и мягкие склейки. Заменить на съёмку клуба –
# положить mp4 с теми же именами в public/video/imperial3/ (H.264, без звука, 1920×1080 или как указано ниже).
set -euo pipefail
cd "$(dirname "$0")/.."
S=public/_t/static
OUT=public/video/imperial3
TMP=$(mktemp -d)
mkdir -p "$OUT"
FPS=25

# clip <фото> <секунды> <режим: in|out|left|right> <ширина> <высота> <файл>
clip() {
  local img=$1 sec=$2 mode=$3 w=$4 h=$5 out=$6 n=$(( $2 * FPS ))
  local z x y
  case $mode in
    in)    z="1+0.14*on/$n";           x="iw/2-(iw/zoom/2)";               y="ih/2-(ih/zoom/2)" ;;
    out)   z="1.14-0.14*on/$n";        x="iw/2-(iw/zoom/2)";               y="ih/2-(ih/zoom/2)" ;;
    left)  z="1.12";                   x="(iw-iw/zoom)*(1-on/$n)";         y="ih/2-(ih/zoom/2)" ;;
    right) z="1.12";                   x="(iw-iw/zoom)*on/$n";             y="ih/2-(ih/zoom/2)" ;;
  esac
  # фото увеличено в 4 раза перед zoompan – иначе движение идёт рывками по целым пикселям
  ffmpeg -loglevel error -y -loop 1 -i "$img" -vf \
    "scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},scale=$((w*4)):$((h*4)),zoompan=z='$z':x='$x':y='$y':d=$n:s=${w}x${h}:fps=$FPS,format=yuv420p" \
    -frames:v $n -c:v libx264 -preset slow -crf 18 "$out"
}

# join <выход> <crf> <клипы...> – склейка с растворением 0.8 с
join() {
  local out=$1 crf=$2; shift 2
  local inputs=() f="" prev="0:v" off=0 i=1 d=0.8 len
  for c in "$@"; do inputs+=(-i "$c"); done
  len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
  off=$(echo "$len - $d" | bc)
  for ((i=1; i<$#; i++)); do
    f+="[$prev][$i:v]xfade=transition=fade:duration=$d:offset=$off[v$i];"
    prev="v$i"
    len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${@:$((i+1)):1}")
    off=$(echo "$off + $len - $d" | bc)
  done
  ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "${f%;}" -map "[$prev]" -an \
    -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -movflags +faststart "$out"
}

# Первый экран: силовые, групповые, бокс, кардио, тренажёры – 1920×1080
clip $S/tild3066-3463-4139-b535-376534333435/image.png 5 in    1920 1080 $TMP/h1.mp4
clip $S/tild6536-6364-4532-b134-326432366464/_2025-11-11_13525106.png 5 right 1920 1080 $TMP/h2.mp4
clip $S/tild6264-6362-4931-a637-383131346435/image.png 5 out   1920 1080 $TMP/h3.mp4
clip $S/tild3034-6536-4262-a335-343136613663/image.png 5 left  1920 1080 $TMP/h4.mp4
clip $S/tild3132-6635-4532-b137-616631626131/image.png 5 in    1920 1080 $TMP/h5.mp4
join $OUT/hero.mp4 27 $TMP/h1.mp4 $TMP/h2.mp4 $TMP/h3.mp4 $TMP/h4.mp4 $TMP/h5.mp4

# Вставка «Свобода заниматься собой» (раскрывается на весь экран): бассейн – 1920×1080
clip $S/tild3061-3339-4236-b264-396234643866/image.png 6 in    1920 1080 $TMP/p1.mp4
clip $S/tild3934-6165-4265-b562-366136336363/Balance_fitness.jpg 6 out 1920 1080 $TMP/p2.mp4
clip $S/tild3365-6364-4035-b432-303737303836/image.png 6 right 1920 1080 $TMP/p3.mp4
join $OUT/pool.mp4 27 $TMP/p1.mp4 $TMP/p2.mp4 $TMP/p3.mp4

# Вставка у формы гостевого визита: аэройога и групповые – 1080×1350
clip $S/tild6538-3832-4135-b161-336563656363/image.png 6 in    1080 1350 $TMP/g1.mp4
clip $S/tild3730-3535-4137-a366-396631303033/image.png 6 out   1080 1350 $TMP/g2.mp4
join $OUT/guest.mp4 27 $TMP/g1.mp4 $TMP/g2.mp4

# Постеры – первый кадр, пока видео грузится
for v in hero pool guest; do
  ffmpeg -loglevel error -y -i $OUT/$v.mp4 -frames:v 1 -q:v 4 $OUT/$v.jpg
done
rm -rf "$TMP"
ls -la "$OUT"
