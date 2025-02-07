# Tuning Explorer

An interactive web application for exploring and comparing different musical tuning systems through real-time audio synthesis and visualization.

## Overview

Tuning Explorer helps musicians, students, and enthusiasts understand the mathematical and historical foundations of different tuning systems. By providing interactive demonstrations of how various tuning methods affect pitch relationships, it bridges the gap between music theory, mathematics, and practical acoustics.

## Features

### Multiple Tuning Systems
- **12-Tone Equal Temperament (12-TET)**: The modern standard tuning system where each octave is divided into 12 equal semitones
- **Pythagorean Tuning**: Based on pure perfect fifths (3:2 ratio), historically significant
- **Just Intonation**: Uses simple integer ratios for pure intervals in a single key
- **Quarter-Comma Meantone**: A historical compromise between pure thirds and usable fifths

### Interactive Audio Features
- Real-time synthesis of musical patterns
- Simultaneous chord playback for hearing beats and harmonies
- Dynamic switching between tuning systems during playback
- Volume control and loop functionality

### Visualization and Analysis
- Frequency comparison tables showing differences between tuning systems
- Real-time pitch tracking and visualization
- Mathematical explanations of each tuning system's ratios and calculations
- Historical context and development of different tuning methods

### Educational Tools
- Preset patterns demonstrating key interval relationships
- Interactive frequency calculations
- Cents deviation display for comparing tuning systems
- Historical annotations and context for each tuning method

## Math Behind the Music

### 12-TET (Equal Temperament)
- Each semitone is calculated using: f = f₀ × 2^(n/12)
- Where f₀ is the reference frequency (typically A4 = 440 Hz)
- n is the number of semitones from the reference note

### Just Intonation
- Based on simple integer ratios
- Major third: 5:4
- Perfect fifth: 3:2
- Major sixth: 5:3

### Pythagorean Tuning
- Built on pure perfect fifths (3:2)
- Major third is derived as (3/2)⁴ × (1/2)²
- Creates the Pythagorean comma: difference between 12 perfect fifths and 7 octaves

## Historical Context

The development of tuning systems reflects humanity's ongoing attempt to reconcile mathematical purity with musical practicality:

- Ancient Greek theory (Pythagoras): Based on pure fifths
- Renaissance innovations: Meantone temperaments
- Modern equal temperament: Enables modulation to all keys
- Contemporary exploration: Revival of historical tunings and microtonal systems

## Future Development

Planned enhancements include:
- Additional historical tuning systems
- Microtuning support
- MIDI input capabilities
- Extended visualization options
- Mobile device optimization
- Social sharing features for musical discoveries

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/JDerekLomas/tuning-explorer.git
```

2. Open `index.html` in a modern web browser

3. Click "Start Audio" to begin exploring different tuning systems

## Requirements
- Modern web browser with Web Audio API support
- JavaScript enabled
- No additional dependencies needed

## Contributing

Contributions are welcome! Whether you're interested in:
- Adding new tuning systems
- Improving visualizations
- Enhancing audio quality
- Fixing bugs
- Adding educational content

Please feel free to submit issues and pull requests.

## License

This project is released under the MIT License. See the LICENSE file for details.

## Acknowledgments

Special thanks to the music theory and mathematics communities for preserving and advancing our understanding of tuning systems throughout history.