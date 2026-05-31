const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const noteToIndex = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
  'A#': 10, 'Bb': 10, 'B': 11
};

// Regex to capture the exact parts of a chord for safe string replacement
// Group 1: Root (A-G with optional # or b)
// Group 2: Modifiers before numbers (m, M, maj, min, dim, aug, sus, add, °, º)
// Group 3: Optional 'M' or 'm' after numbers (like in 7M)
// Group 4: Bass note after slash
const chordRegex = /^[[(]?([A-G][#b]?)(m|M|maj|min|dim|aug|sus|add|°|º)?[\d]*(M|m)?(?:\([^)]+\))?(?:\/([A-G][#b]?))?[\])]?$/;

/**
 * Heuristic to detect if a line is a chord line.
 */
function isChordLine(line) {
  const words = line.trim().split(/\s+/);
  if (words.length === 0 || words[0] === '') return false;

  let chordCount = 0;
  for (const word of words) {
    // Strip trailing punctuation that might be attached to a chord
    const cleanWord = word.replace(/[.,:;!]$/, '');
    if (chordRegex.test(cleanWord)) {
      chordCount++;
    }
  }

  return chordCount / words.length > 0.5;
}

function transposeNote(note, offset) {
  if (!note || noteToIndex[note] === undefined) return note;
  
  let newIndex = (noteToIndex[note] + offset) % 12;
  if (newIndex < 0) newIndex += 12;

  return SHARPS[newIndex];
}

function transposeChord(chordString, offset) {
  if (offset === 0) return chordString;

  const match = chordString.match(chordRegex);
  if (!match) return chordString;

  const root = match[1];
  const newRoot = transposeNote(root, offset);
  
  // Replace the first occurrence of the root note.
  // We must be careful if the bass is the same note, but string.replace replaces the first match.
  // Since the root is always at the beginning, this is safe.
  let transposed = chordString.replace(root, newRoot);

  const bass = match[4]; // Group 4 is the bass note
  if (bass) {
    const newBass = transposeNote(bass, offset);
    // The bass is always after the slash
    const parts = transposed.split('/');
    if (parts.length === 2) {
      transposed = parts[0] + '/' + newBass;
    }
  }

  return transposed;
}

/**
 * Parses the raw text, transposes chords, and formats as HTML.
 */
export function parseAndTranspose(content, transposeOffset = 0) {
  if (!content) return '';

  const lines = content.split('\n');
  const processedLines = lines.map(line => {
    if (isChordLine(line)) {
      // Replaces each whitespace-separated token that matches a chord
      let htmlLine = line.replace(/(\S+)/g, (match) => {
        const cleanMatch = match.replace(/[.,:;!]$/, '');
        if (chordRegex.test(cleanMatch)) {
          const transposed = transposeChord(cleanMatch, transposeOffset);
          // Re-attach the punctuation if it was stripped
          const suffix = match.slice(cleanMatch.length);
          return `<span class="chord text-primary font-bold" style="color: #c084fc;">${transposed}</span>${suffix}`;
        }
        return match;
      });
      return `<span class="chord-line">${htmlLine}</span>`;
    }

    return `<span class="lyric-line">${line || ' '}</span>`;
  });

  return processedLines.join('\n');
}

/**
 * Transposes the raw text but returns plain text instead of HTML.
 * Used for permanently modifying the text in the editor.
 */
export function transposePlainText(content, transposeOffset = 0) {
  if (!content || transposeOffset === 0) return content;

  const lines = content.split('\n');
  const processedLines = lines.map(line => {
    if (isChordLine(line)) {
      return line.replace(/(\S+)/g, (match) => {
        const cleanMatch = match.replace(/[.,:;!]$/, '');
        if (chordRegex.test(cleanMatch)) {
          const transposed = transposeChord(cleanMatch, transposeOffset);
          const suffix = match.slice(cleanMatch.length);
          return transposed + suffix;
        }
        return match;
      });
    }
    return line;
  });

  return processedLines.join('\n');
}
