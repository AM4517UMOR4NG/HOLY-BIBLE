# Jesus Teaching Animation - Delivery Instructions

## 📦 Deliverables Checklist

Please deliver the following files to this directory (`/public/animations/`):

### 1. Video Files (Primary Background)

#### Desktop Version (1280×720)
- [ ] `bg_loop_1280.webm` - WebM (VP9 codec, bitrate ≤1500 kbps, size ≤5MB)
- [ ] `bg_loop_1280.mp4` - H.264 fallback (bitrate ≤2000 kbps, size ≤6MB)

#### Mobile Version (720×405)
- [ ] `bg_loop_720.webm` - WebM (VP9 codec, bitrate ≤600 kbps, size ≤2.5MB)
- [ ] `bg_loop_720.mp4` - H.264 fallback (bitrate ≤800 kbps, size ≤4MB)

#### Poster Image
- [ ] `poster.webp` - Low-res poster (720px wide, 40-80KB)
- [ ] `poster.jpg` - JPG fallback (720px wide, 60-100KB)

**Video Requirements:**
- Duration: 12-16 seconds seamless loop
- Frame rate: 24 fps (30 fps acceptable)
- Codec settings: Progressive streaming enabled, GOP 1-2s
- Audio: SILENT (no audio tracks)
- Loop: First and last frame must match for seamless loop
- Color space: sRGB or Rec.709

### 2. Lottie Overlay Files

- [ ] `overlay_dove.min.json` - Dove/spirit metaphor overlay (≤300KB, minified)
- [ ] `overlay_particles.min.json` - Particle effects overlay (≤300KB, minified)
- [ ] `overlay_[additional].min.json` - Any additional overlays (≤300KB each)

**Lottie Requirements:**
- Exported from After Effects via Bodymovin plugin
- Frame rate: 30 fps
- Keep vector shapes, minimize rasters
- Remove unused AE metadata
- Minified JSON (no whitespace)
- Duration: 0.7-2s per overlay, loopable

### 3. Source Files (for future edits)

Create a subfolder: `/public/animations/sources/`

- [ ] `ae_project_v1.aep` - After Effects project file (if used)
- [ ] `figma_design_v1.fig` - Figma export link or file
- [ ] Layered assets:
  - [ ] `jesus_body.svg`
  - [ ] `jesus_hands.svg`
  - [ ] `jesus_face_layers.svg`
  - [ ] `disciple_1.svg`
  - [ ] `disciple_2.svg`
  - [ ] `disciple_3.svg`
  - [ ] `background_lake.svg`
  - [ ] `background_sky.svg`
- [ ] `bodymovin_settings.json` - Your Bodymovin export settings
- [ ] `encoding_settings.txt` - Video encoding parameters used

### 4. Optional Audio (NOT used by default, but provide for future)

Create subfolder: `/public/animations/sound_optional/`

- [ ] `ambient_lake.wav` - Ambient sound (lake, wind)
- [ ] `sfx_gesture.wav` - Subtle gesture SFX
- [ ] Audio stems should be 48kHz, stereo, uncompressed WAV

### 5. Subtitle Files (if any on-screen text)

- [ ] `subtitles_en.srt` - English subtitles
- [ ] `subtitles_id.srt` - Indonesian subtitles

---

## 🎬 Storyboard Reference (12-16s Loop)

### Shot A - Establish (0.0 - 2.5s)
- Wide lakeside at golden hour
- Slow gentle push-in (Z scale +1.5%)
- Soft gradient sky with warm orange/gold
- Subtle parallax of background hills and water

### Shot B - Teaching Scene (2.5 - 7.5s)
- Medium composition: Jesus seated on rock, semicircle of disciples
- Jesus performs gentle gestures (palm open, pointing)
- Micro-animations:
  - Chest breathing (slow, long period)
  - Occasional head tilt
  - Eye blinks
  - Robe cloth follow-through

### Shot C - Close Detail + Metaphor (7.5 - 11.0s)
- Cut to hand drawing in sand (path animation)
- Small sand particle puffs
- Lottie overlay: Dove/fish/lamp appears, grows, dissolves
- Blend mode: screen, opacity 0.6

### Shot D - Pullback + Loop (11.0 - 12/16s)
- Slow pullback revealing full scene
- Subtle sun flare
- Crossfade 0.2s back to Shot A for seamless loop

---

## 🎨 Visual Specifications

### Color Palette
- **Primary:** Warm gold/orange (#F59E0B to #F97316) - sunset glow
- **Secondary:** Soft blue-gray (#64748B, #94A3B8) - water, sky
- **Accent:** Beige/sandy (#FEF3C7, #FDE68A) - shore, robes
- **Shadows:** Transparent black (#00000040-60) for depth

### Style Guide
- **Art Style:** 2D semi-realistic vector + painterly texture overlay
- **Character Design:** Simple, expressive, modest clothing
- **Tone:** Warm, peaceful, contemplative, reverent
- **Contrast:** Gentle contrast to preserve form text readability (4.5:1 minimum)

### Safe Zones
- **Center 60% area:** Keep this area lighter/less busy for form text overlay
- **Edges:** Darker vignette acceptable
- **Movement:** Slow, gentle - no jarring cuts or fast motion

---

## 🔧 Technical Integration Notes

### How the component will use your files:

```html
<video muted loop playsInline poster="/animations/poster.webp">
  <!-- Mobile -->
  <source src="/animations/bg_loop_720.webm" type="video/webm" media="(max-width: 768px)">
  <source src="/animations/bg_loop_720.mp4" type="video/mp4" media="(max-width: 768px)">
  
  <!-- Desktop -->
  <source src="/animations/bg_loop_1280.webm" type="video/webm" media="(min-width: 769px)">
  <source src="/animations/bg_loop_1280.mp4" type="video/mp4" media="(min-width: 769px)">
</video>
```

### Lottie Loading:
```javascript
lottie.loadAnimation({
  container: element,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/animations/overlay_dove.min.json'
})
```

### Behaviors Already Implemented:
✅ Lazy-load with IntersectionObserver  
✅ Auto-pause when user focuses on input fields  
✅ Reduced motion support (shows poster only)  
✅ aria-hidden="true" for accessibility  
✅ Responsive srcset for mobile/desktop  
✅ Gradient overlay for text safe-zone  

---

## ✅ Acceptance Criteria & Testing

### Must Pass All:

1. **Loop Seamless:** No visible jump/flash at loop point
2. **File Sizes:** 
   - Mobile WebM ≤ 2.5MB ✓
   - Desktop WebM ≤ 5MB ✓
   - Lottie files ≤ 300KB each ✓
3. **Browser Compatibility:** 
   - Chrome (latest) ✓
   - Firefox (latest) ✓
   - Safari iOS (latest) ✓
   - Edge (latest) ✓
4. **Performance:**
   - Video loads and plays within 3s on 3G connection
   - No layout shift on page load (poster prevents CLS)
   - Smooth 24-30 fps playback on mid-range devices
5. **Accessibility:**
   - Reduced motion shows static poster ✓
   - No audio auto-plays ✓
   - Does not interfere with form focus/readability ✓

### Testing Proof Required:
Please provide:
- [ ] Screen recording of full loop (desktop + mobile)
- [ ] Screenshots on Chrome, Firefox, Safari iOS
- [ ] File size confirmation (screenshot of folder)
- [ ] Statement: "Loop is seamless, tested on [devices]"

---

## 📋 Encoding Commands (Reference)

### WebM (VP9):
```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 600k -maxrate 800k -bufsize 1200k \
  -vf scale=720:405 -an -pix_fmt yuv420p -g 48 bg_loop_720.webm

ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 1500k -maxrate 2000k -bufsize 3000k \
  -vf scale=1280:720 -an -pix_fmt yuv420p -g 48 bg_loop_1280.webm
```

### MP4 (H.264):
```bash
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 23 -b:v 800k -maxrate 1000k \
  -bufsize 1600k -vf scale=720:405 -an -pix_fmt yuv420p -g 48 -movflags +faststart bg_loop_720.mp4

ffmpeg -i input.mov -c:v libx264 -preset slow -crf 21 -b:v 2000k -maxrate 2500k \
  -bufsize 4000k -vf scale=1280:720 -an -pix_fmt yuv420p -g 48 -movflags +faststart bg_loop_1280.mp4
```

### Poster:
```bash
ffmpeg -i bg_loop_1280.webm -ss 00:00:01 -vframes 1 -vf scale=720:-1 -q:v 3 poster.jpg
ffmpeg -i bg_loop_1280.webm -ss 00:00:01 -vframes 1 -vf scale=720:-1 poster.webp
```

---

## 📞 Contact & Revisions

### Revision Process:
- **Round 1 (Draft):** Submit low-res MP4 preview + animatic within 1 week
- **Round 2 (Polish):** Submit high-res files + Lottie within 2 weeks
- **Round 3 (Final):** All deliverables + sources within 2.5 weeks

### Included Revisions:
- 2 minor revisions (color, timing tweaks)
- Major changes (new shots, complete rework) are out of scope

### Questions?
Contact project lead via [insert contact method]

---

## 🎯 Quick Brief Summary (for proposals)

**Task:** 12-16s loop animation "Jesus Teaching Disciples" for login/register page background  
**Style:** 2D semi-realistic, warm golden hour lakeside, gentle peaceful tone  
**Deliverables:** WebM+MP4 (mobile+desktop), Lottie overlays, poster, source files  
**Technical:** React+TypeScript integration, aria-hidden, reduced-motion support, auto-pause on focus  
**Budget:** [To be discussed]  
**Timeline:** 2.5 weeks total (3 milestones)

---

**Thank you for your work! This animation will bring a peaceful, contemplative atmosphere to our Bible app's authentication experience. 🙏**
