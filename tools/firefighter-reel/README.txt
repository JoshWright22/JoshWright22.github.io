FIREFIGHTER project video (assets/firefighter.webm). reel.html draws frame t with window.draw(t); open it without #static to watch it loop.
Rebuild: py -3.13 rec.py (writes frames/), then
ffmpeg -framerate 30 -i frames/f%04d.png -c:v libvpx-vp9 -b:v 0 -crf 30 -pix_fmt yuv420p ../../assets/firefighter.webm
Poster: frame 200 (HUMAN DETECTED) as ../../assets/firefighter-poster.jpg
