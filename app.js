// Audio Context and Synth Setup
let synth;
let isPlaying = false;
let isLooping = false;

// Tuning Systems Constants
const REFERENCE_FREQUENCY = 440; // A4
const SEMITONES_PER_OCTAVE = 12;

// Tuning System Calculations
const tuningSystem = {
    '12-tet': {
        name: '12-Tone Equal Temperament',
        getFrequency: (semitones) => REFERENCE_FREQUENCY * Math.pow(2, semitones / SEMITONES_PER_OCTAVE),
        mathContent: `
            <p>In 12-TET, each semitone is calculated using the formula:</p>
            <p>f = f₀ × 2^(n/12)</p>
            <p>where f₀ is the reference frequency (440 Hz) and n is the number of semitones from A4</p>
            <p>All intervals except the octave are slightly impure, but equally so in all keys.</p>
        `
    },
    'pythagorean': {
        name: 'Pythagorean Tuning',
        ratios: {
            0: 1,      // Perfect unison
            2: 9/8,    // Major second
            4: 81/64,  // Major third
            5: 4/3,    // Perfect fourth
            7: 3/2,    // Perfect fifth
            9: 27/16,  // Major sixth
            11: 243/128, // Major seventh
            12: 2      // Octave
        },
        getFrequency: (semitones) => {
            const baseFreq = REFERENCE_FREQUENCY * Math.pow(2, -9/12); // Convert A4 to C4
            const ratios = tuningSystem.pythagorean.ratios;
            const ratio = ratios[Math.abs(semitones % 12)] || Math.pow(2, semitones / 12);
            return baseFreq * ratio;
        },
        mathContent: `
            <p>Pythagorean tuning uses pure perfect fifths (3:2 ratio):</p>
            <ul>
                <li>Perfect Fifth: 3:2 (pure)</li>
                <li>Major Third: 81:64 (sharper than 5:4)</li>
                <li>Pythagorean Comma: 531441:524288</li>
            </ul>
            <p>Perfect fifths are pure but thirds are very sharp.</p>
        `
    },
    'just': {
        name: 'Just Intonation',
        ratios: {
            0: 1,      // Perfect unison
            2: 9/8,    // Major second
            4: 5/4,    // Major third
            5: 4/3,    // Perfect fourth
            7: 3/2,    // Perfect fifth
            9: 5/3,    // Major sixth
            11: 15/8,  // Major seventh
            12: 2      // Octave
        },
        getFrequency: (semitones) => {
            const baseFreq = REFERENCE_FREQUENCY * Math.pow(2, -9/12); // Convert A4 to C4
            const ratios = tuningSystem.just.ratios;
            const ratio = ratios[Math.abs(semitones % 12)] || Math.pow(2, semitones / 12);
            return baseFreq * ratio;
        },
        mathContent: `
            <p>Just Intonation uses simple integer ratios:</p>
            <ul>
                <li>Perfect Fifth: 3:2</li>
                <li>Major Third: 5:4 (pure)</li>
                <li>Major Sixth: 5:3</li>
            </ul>
            <p>Pure intervals in the home key, but doesn't modulate well.</p>
        `
    },
    'meantone': {
        name: 'Quarter-Comma Meantone',
        getFrequency: (semitones) => {
            const baseFreq = REFERENCE_FREQUENCY * Math.pow(2, -9/12); // Convert A4 to C4
            const fifthRatio = Math.pow(5, 1/4);
            return baseFreq * Math.pow(fifthRatio, semitones);
        },
        mathContent: `
            <p>Quarter-comma meantone tempering adjusts the perfect fifth to:</p>
            <p>Fifth = ⁵√5 ≈ 1.495 (instead of 3:2 = 1.5)</p>
            <p>This creates pure major thirds at the expense of slightly flat fifths.</p>
        `
    }
};

// Musical Patterns that highlight tuning differences
const melodies = {
    scale: [0, 2, 4, 5, 7, 9, 11, 12],
    triad: [0, 4, 7, 0], // Root position major triad
    dominantSeventh: [0, 4, 7, 10, 0], // Dominant seventh chord
    minorThird: [0, 3, 0], // Minor third interval
    majorThird: [0, 4, 0], // Major third interval (very different in Pythagorean vs Just)
    perfectFifth: [0, 7, 0], // Perfect fifth interval
    diminishedFifth: [0, 6, 0], // Diminished fifth (tritone)
    sustain: { // Sustained major chord to hear beating
        notes: [0, 4, 7],
        duration: '2n',
        simultaneous: true
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing application...');
        
        // Start audio context with user interaction
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Audio';
        startButton.style.position = 'fixed';
        startButton.style.top = '50%';
        startButton.style.left = '50%';
        startButton.style.transform = 'translate(-50%, -50%)';
        startButton.style.padding = '20px';
        startButton.style.fontSize = '20px';
        startButton.style.backgroundColor = '#3498db';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '8px';
        startButton.style.cursor = 'pointer';
        
        document.body.appendChild(startButton);
        
        startButton.onclick = async () => {
            try {
                await Tone.start();
                console.log('Tone.js started successfully');
                document.body.removeChild(startButton);
                
                setupSynth();
                setupEventListeners();
                updateMathContent();
                updateHistoricalContext();
                initializePlot();
                
                // Show initial state
                console.log('Current tuning:', getCurrentTuning());
                console.log('Current melody:', getCurrentMelody());
            } catch (error) {
                console.error('Error during audio initialization:', error);
                alert('Error initializing audio. Please check the console for details.');
            }
        };
    } catch (error) {
        console.error('Error in initialization:', error);
        alert('Error initializing application. Please check the console for details.');
    }
});

function setupSynth() {
    try {
        console.log('Setting up synthesizer...');
        synth = new Tone.Synth({
            oscillator: {
                type: 'sine'
            },
            envelope: {
                attack: 0.05,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toDestination();
        
        // Test tone
        synth.triggerAttackRelease('C4', '8n');
        console.log('Synth setup complete and test tone played');
        
        // Set initial volume
        const volumeControl = document.getElementById('volume');
        synth.volume.value = Tone.gainToDb(parseFloat(volumeControl.value));
        console.log('Initial volume set to:', volumeControl.value);
    } catch (error) {
        console.error('Error setting up synthesizer:', error);
        alert('Error setting up audio synthesizer. Please check the console for details.');
    }
}

function setupEventListeners() {
    // Tuning System Selection
    document.getElementById('tuningSelect').addEventListener('change', (e) => {
        updateMathContent();
        updateHistoricalContext();
        if (isPlaying) playCurrentMelody();
    });

    // Melody Selection
    document.getElementById('melodySelect').addEventListener('change', () => {
        if (isPlaying) playCurrentMelody();
    });

    // Playback Controls
    document.getElementById('playBtn').addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playCurrentMelody();
            document.getElementById('playBtn').textContent = 'Pause';
        } else {
            Tone.Transport.stop();
            document.getElementById('playBtn').textContent = 'Play';
        }
    });

    document.getElementById('stopBtn').addEventListener('click', () => {
        isPlaying = false;
        Tone.Transport.stop();
        document.getElementById('playBtn').textContent = 'Play';
    });

    document.getElementById('loopBtn').addEventListener('click', () => {
        isLooping = !isLooping;
        document.getElementById('loopBtn').style.backgroundColor = 
            isLooping ? '#2ecc71' : '#3498db';
    });

    // Volume Control
    document.getElementById('volume').addEventListener('input', (e) => {
        synth.volume.value = Tone.gainToDb(parseFloat(e.target.value));
    });
}

function getCurrentTuning() {
    return document.getElementById('tuningSelect').value;
}

function getCurrentMelody() {
    return document.getElementById('melodySelect').value;
}

function playCurrentMelody() {
    try {
        console.log('Starting melody playback...');
        Tone.Transport.stop();
        
        const tuning = getCurrentTuning();
        const melodyName = getCurrentMelody();
        const pattern = melodies[melodyName];
        const noteLength = '4n';
        
        if (!pattern) {
            throw new Error(`Invalid melody pattern: ${melodyName}`);
        }
        
        console.log('Playing melody:', melodyName);
        console.log('Using tuning:', tuningSystem[tuning].name);
        console.log('Pattern:', pattern);
        
        let index = 0;
        let lastFreq = null;
        
        Tone.Transport.scheduleRepeat((time) => {
            try {
                const semitones = pattern[index];
                const freq = tuningSystem[tuning].getFrequency(semitones);
                console.log(`Playing note ${index}: ${freq.toFixed(2)} Hz (${semitones} semitones)`);
                
                if (lastFreq !== freq) {
                    synth.triggerAttackRelease(freq, noteLength, time);
                    updatePlot(freq);
                    lastFreq = freq;
                }
                
                index = (index + 1) % pattern.length;
                
                if (index === 0 && !isLooping) {
                    isPlaying = false;
                    Tone.Transport.stop();
                    document.getElementById('playBtn').textContent = 'Play';
                    console.log('Melody playback complete');
                }
            } catch (error) {
                console.error('Error during note playback:', error);
                Tone.Transport.stop();
                isPlaying = false;
                document.getElementById('playBtn').textContent = 'Play';
            }
        }, noteLength);
        
        Tone.Transport.start();
        console.log('Transport started');
    } catch (error) {
        console.error('Error playing melody:', error);
        alert('Error during playback. Please check the console for details.');
        isPlaying = false;
        document.getElementById('playBtn').textContent = 'Play';
    }
}

function updateMathContent() {
    const tuning = getCurrentTuning();
    document.getElementById('mathContent').innerHTML = tuningSystem[tuning].mathContent;
}

function updateHistoricalContext() {
    const historicalInfo = {
        '12-tet': `
            <p>12-TET was developed gradually across cultures, with key contributions from:</p>
            <ul>
                <li>Zhu Zaiyu (1584) - First mathematical solution</li>
                <li>Simon Stevin (1585) - Independent European development</li>
                <li>Andreas Werckmeister (late 17th century) - Practical implementation</li>
            </ul>
        `,
        'just': `
            <p>Just Intonation is based on the natural harmonic series and was the dominant 
            system in early music. Pythagoras (6th century BCE) discovered these fundamental 
            ratios through experiments with string lengths.</p>
        `,
        'meantone': `
            <p>Quarter-comma meantone was widely used in the Renaissance and early Baroque periods. 
            It provided a compromise between the pure intervals of just intonation and the 
            flexibility needed for modulation between keys.</p>
        `
    };
    
    const tuning = getCurrentTuning();
    document.getElementById('historyContent').innerHTML = historicalInfo[tuning];
}

function initializePlot() {
    try {
        console.log('Initializing frequency plot...');
        const trace = {
            y: [0],
            mode: 'lines+markers',
            line: {
                color: '#3498db',
                width: 2
            },
            marker: {
                size: 8,
                color: '#2980b9'
            },
            name: 'Frequency'
        };

        const layout = {
            title: {
                text: 'Current Frequency',
                font: { size: 24 }
            },
            yaxis: {
                title: 'Frequency (Hz)',
                range: [200, 1000],
                gridcolor: '#e1e1e1',
                zerolinecolor: '#969696'
            },
            xaxis: {
                title: 'Time',
                showticklabels: false,
                gridcolor: '#e1e1e1'
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            margin: { t: 50, l: 60, r: 40, b: 50 }
        };

        const config = {
            responsive: true,
            displayModeBar: false
        };

        Plotly.newPlot('frequencyPlot', [trace], layout, config);
        console.log('Plot initialization complete');
    } catch (error) {
        console.error('Error initializing plot:', error);
    }
}

function updatePlot(frequency) {
    try {
        // Keep only last 50 points for performance
        const plotDiv = document.getElementById('frequencyPlot');
        const currentData = plotDiv.data[0];
        
        if (currentData.y.length > 50) {
            currentData.y.shift();
        }
        
        Plotly.extendTraces('frequencyPlot', {
            y: [[frequency]]
        }, [0]);

        // Update note name display
        const noteInfo = getNoteInfo(frequency);
        const title = `Current Frequency: ${frequency.toFixed(1)} Hz (${noteInfo})`;
        Plotly.relayout('frequencyPlot', {'title.text': title});
        
        console.log(`Updated plot with frequency: ${frequency.toFixed(1)} Hz (${noteInfo})`);
    } catch (error) {
        console.error('Error updating plot:', error);
    }
}

function getNoteInfo(frequency) {
    try {
        // Calculate the MIDI note number
        const midiNote = 69 + 12 * Math.log2(frequency / 440);
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor((midiNote - 12) / 12);
        const noteName = noteNames[Math.round(midiNote) % 12];
        return `${noteName}${octave}`;
    } catch (error) {
        console.error('Error getting note info:', error);
        return 'Unknown';
    }
}