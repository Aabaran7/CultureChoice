# Roulette Wheel Psychological Research Experiment - Cursor Documentation

## Project Overview
This is a complete psychological research experiment interface for studying decision-making, agency, and satisfaction. The application runs 40 trials where participants choose between three equivalent roulette wheels at different probability levels (20%, 40%, 60%, 80%).

## Architecture Overview

```
Application Flow:
┌─────────────┐
│   App.tsx   │ ────► Entry point, renders RouletteExperiment
└─────────────┘

┌──────────────────────────────┐
│  RouletteExperiment.tsx      │ ────► Main orchestrator
│  - Trial management          │      - 7-phase state machine
│  - Phase transitions          │      - Data collection
│  - Mini-block integration     │      - Export functionality
└──────────────────────────────┘
         │
         ├──► RouletteWheel.tsx (wheel rendering & animation)
         ├──► RatingScale.tsx (confidence & satisfaction ratings)
         └──► miniBlockGenerator.ts (outcome matrix generation)

UI Components (shadcn/ui):
  - Button, Progress, Slider
```

## Experiment Design Specifications

### Trial Structure
- **Total trials**: 40
- **Mini-blocks**: 5 blocks of 8 trials each
- **Probabilities**: 20%, 40%, 60%, 80% (4 levels)
- **Agency**: 50/50 split (approved/vetoed)
- **Distribution**: 2 trials per probability per mini-block

### Mini-Block System
- 4×5 matrix (4 probabilities × 5 mini-blocks)
- Each row has k wins where k ∈ {1,2,3,4}
- Joint random column permutations
- Validation: No column can be all 0s or all 1s
- Regenerates up to 1000 times if invalid

### Roulette Wheels
- **40 equal segments** (9° each)
- **Three wheels**: Rotated versions (0°, +120°, -120°)
- **Seeded randomization**: Consistent pattern across wheels
- **Visual**: Green for wins, red for losses
- **Animation**: 2.5s spin with easeOut easing
- **Pointer**: Clock-hand style from center

### Experimental Phases (per trial)
1. **Instructions** (first trial only)
2. **Choice** - Select one of three wheels
3. **Approval** - Computer approves or vetoes choice
4. **Confidence** - Rate 0-100
5. **Spin** - Wheel animation with outcome
6. **Satisfaction** - Rate 0-100
7. **ITI** - Implicit transition to next trial

## Essential Files & Code

### 1. `/App.tsx` - Entry Point
```tsx
import { RouletteExperiment } from './components/RouletteExperiment';

export default function App() {
  return (
    <div className="min-h-screen">
      <RouletteExperiment />
    </div>
  );
}
```

**Purpose**: Simple root component that renders the main experiment.

---

### 2. `/components/RouletteExperiment.tsx` - Main Orchestrator (348 lines)

**Key Responsibilities**:
- Trial generation with mini-blocking
- State management for 7 experimental phases
- Phase transition logic
- Data collection and export
- Integration of all child components

**Critical State Variables**:
```tsx
currentTrial: number            // 0-39 trial index
phase: ExperimentPhase         // 7 phases: instructions | choice | approval | confidence | spin | satisfaction | iti | complete
trials: Trial[]                // Array of 40 pre-generated trials
selectedWheel: number | null   // 0, 1, or 2
confidenceRating: number | null // 0-100
satisfactionRating: number | null // 0-100
isApproved: boolean | null     // Agency status
results: any[]                 // Accumulated trial data
spinComplete: boolean          // Animation state
```

**Trial Interface**:
```tsx
interface Trial {
  trialNumber: number;         // 1-40
  probability: number;         // 0.2, 0.4, 0.6, or 0.8
  miniBlock: number;           // 1-5
  outcomeWin: boolean;         // Predetermined outcome
  agency: boolean;             // Approved/vetoed
}
```

**Trial Generation Logic**:
```tsx
// Generate 40 trials from mini-block matrix
const miniBlocks = generateMiniBlocks(); // 4×5 matrix

for (let miniBlock = 0; miniBlock < 5; miniBlock++) {
  for (let probIndex = 0; probIndex < 4; probIndex++) {
    for (let trialInProb = 0; trialInProb < 2; trialInProb++) {
      // Create trial with predetermined outcome from matrix
      // Add 50/50 agency randomization
    }
  }
}

// Shuffle all 40 trials to randomize presentation order
const shuffledTrials = shuffleArray(generatedTrials);
```

**Data Export Structure**:
```json
{
  "summary": {
    "participantId": "timestamp",
    "completedTrials": 40,
    "averageConfidence": 0-100,
    "averageSatisfaction": 0-100,
    "agencyRate": 0-1,
    "winRate": 0-1,
    "completedAt": "ISO timestamp"
  },
  "trials": [
    {
      "trialNumber": 1,
      "probability": 0.6,
      "miniBlock": 2,
      "outcomeWin": true,
      "agency": true,
      "selectedWheel": 1,
      "isApproved": true,
      "confidenceRating": 75,
      "satisfactionRating": 82,
      "timestamp": 1234567890
    }
  ],
  "miniBlocks": [[0,1,0,1,0], ...]
}
```

**Key Functions**:
- `startExperiment()` - Begin from instructions
- `handleWheelChoice(wheelIndex)` - Record selection
- `proceedToApproval()` - Reveal agency status
- `proceedToConfidence()` - Show confidence rating
- `proceedToSpin()` - Start wheel animation
- `proceedToSatisfaction()` - Show satisfaction rating
- `completeCurrentTrial()` - Save data and advance
- `downloadResults()` - Export JSON file

---

### 3. `/components/RouletteWheel.tsx` - Wheel Rendering (243 lines)

**Purpose**: Renders individual roulette wheels with 40 segments, handles selection state, and animates spinning.

**Props Interface**:
```tsx
interface RouletteWheelProps {
  probability: number;        // 0.2, 0.4, 0.6, 0.8
  wheelIndex: number;        // 0, 1, or 2 for three wheels
  isSelected: boolean;       // Selection state
  onClick?: () => void;      // Selection handler
  disabled?: boolean;        // Prevent interaction
  isSpinning?: boolean;      // Animation state
  outcome?: boolean;         // Win/loss for landing
  onSpinComplete?: () => void; // Animation callback
}
```

**Critical Algorithm - Base Pattern Generation**:
```tsx
const createBaseWheelPattern = (probability: number) => {
  const totalSegments = 40;
  const winSegments = Math.round(probability * totalSegments);
  
  // Create win/loss array
  const segmentTypes = [
    ...Array(winSegments).fill(true),
    ...Array(totalSegments - winSegments).fill(false)
  ];
  
  // SEEDED SHUFFLE using probability as seed
  // This ensures all three wheels have identical patterns
  const seed = Math.floor(probability * 1000);
  let random = seed;
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };
  
  // Fisher-Yates shuffle with seeded random
  for (let i = segmentTypes.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [segmentTypes[i], segmentTypes[j]] = [segmentTypes[j], segmentTypes[i]];
  }
  
  return segmentTypes;
};
```

**Wheel Rotation System**:
```tsx
const baseSegmentTypes = createBaseWheelPattern(probability);
const wheelRotation = wheelIndex * 120; // 0°, 120°, 240°

// Each segment angle calculation includes wheel rotation
const angle = i * segmentAngle - 90 + wheelRotation;
```

**Spin Animation**:
```tsx
const getOutcomeRotation = () => {
  // Find all segments matching the outcome
  const targetSegments = baseSegmentTypes
    .map((isWin, i) => isWin === outcome ? i : -1)
    .filter(i => i !== -1);
  
  // Random segment of correct type
  const targetSegmentIndex = targetSegments[Math.floor(Math.random() * targetSegments.length)];
  
  // Calculate angle + 720° (2 full rotations)
  const targetAngle = targetSegmentIndex * segmentAngle + Math.random() * segmentAngle + wheelRotation;
  return targetAngle + 720;
};

<motion.g
  animate={{ rotate: isSpinning ? getOutcomeRotation() : 0 }}
  transition={{ duration: 2.5, ease: "easeOut" }}
  onAnimationComplete={handleAnimationComplete}
  style={{ transformOrigin: "64px 64px" }}
>
  {/* Clock hand pointer */}
</motion.g>
```

**SVG Structure**:
- 40 path segments (pie slices) - green/red based on win/loss
- White center circle (r=12) with black border
- Black center dot (r=3)
- Animated clock hand (line from center to edge)
- Arrow tip at pointer end
- Selection ring (pulse animation when selected)

---

### 4. `/components/RatingScale.tsx` - Rating Interface (81 lines)

**Purpose**: Reusable slider-based rating component for confidence and satisfaction.

**Props**:
```tsx
interface RatingScaleProps {
  label: string;              // "Confidence" or "Satisfaction"
  min: number;               // 0
  max: number;               // 100
  value: number | null;      // Current rating
  onChange: (value: number) => void; // Update callback
}
```

**Features**:
- Slider component (0-100, step=1)
- Large numeric display of current value
- Quick-select buttons:
  - Very Low (10)
  - Low (25)
  - Medium (50)
  - High (75)
  - Very High (90)
- Min/Mid/Max labels below slider
- Visual highlighting of selected quick-rating

**Usage in Experiment**:
```tsx
<RatingScale
  label="Confidence"
  min={0}
  max={100}
  value={confidenceRating}
  onChange={handleConfidenceRating}
/>
```

---

### 5. `/components/utils/miniBlockGenerator.ts` - Outcome Matrix (116 lines)

**Purpose**: Generates and validates the 4×5 mini-block outcome matrix.

**Core Function**:
```tsx
export function generateMiniBlocks(): number[][] {
  // Attempts up to 1000 times to generate valid matrix
  
  // Create 4×5 matrix
  const matrix: number[][] = [[], [], [], []];
  
  // Each row has k wins: [1, 2, 3, 4]
  const winsPerRow = [1, 2, 3, 4];
  
  for (let row = 0; row < 4; row++) {
    const numWins = winsPerRow[row];
    const outcomes = [
      ...Array(numWins).fill(1),
      ...Array(5 - numWins).fill(0)
    ];
    matrix[row] = shuffleArray(outcomes);
  }
  
  // Apply joint random column permutation
  const columnPermutation = generatePermutation(5);
  const permutedMatrix = applyColumnPermutation(matrix, columnPermutation);
  
  // Validate: no column can be all 0s or all 1s
  for (let col = 0; col < 5; col++) {
    const columnSum = permutedMatrix.reduce((sum, row) => sum + row[col], 0);
    if (columnSum === 0 || columnSum === 4) {
      // Invalid - regenerate
      continue;
    }
  }
  
  return permutedMatrix;
}
```

**Matrix Structure**:
```
       MB1  MB2  MB3  MB4  MB5
20%  [  1    0    1    0    0  ]  ← 1 win
40%  [  1    1    0    1    0  ]  ← 2 wins
60%  [  1    1    1    0    1  ]  ← 3 wins
80%  [  1    1    1    1    0  ]  ← 4 wins
```

**Validation Function**:
```tsx
export function validateMiniBlocks(matrix: number[][]): boolean {
  // Check dimensions (4×5)
  // Check each row has correct number of wins
  // Check no column is all 0s or all 1s
  return true/false;
}
```

**Fallback Matrix**: If generation fails after 1000 attempts, returns hardcoded valid matrix.

---

## Dependencies

### Required npm Packages
```json
{
  "react": "latest",
  "motion": "latest",           // For wheel animations (formerly framer-motion)
  "lucide-react": "latest",     // Icons (if needed)
  "tailwindcss": "^4.0",        // Styling
  "shadcn/ui": "latest"         // UI components
}
```

### Shadcn Components Used
- `Button` - Confirm/continue buttons
- `Progress` - Trial progress bar
- `Slider` - Rating scale input

### Import Statements
```tsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
```

---

## File Structure (Essential Only)

```
/
├── App.tsx                                    [ESSENTIAL]
├── components/
│   ├── RouletteExperiment.tsx                [ESSENTIAL]
│   ├── RouletteWheel.tsx                     [ESSENTIAL]
│   ├── RatingScale.tsx                       [ESSENTIAL]
│   ├── utils/
│   │   └── miniBlockGenerator.ts             [ESSENTIAL]
│   └── ui/                                    [DEPENDENCY]
│       ├── button.tsx
│       ├── progress.tsx
│       └── slider.tsx
├── styles/
│   └── globals.css                           [STYLING]
└── guidelines/
    └── CURSOR_HANDOFF.md                     [THIS FILE]
```

**Note**: There's a duplicate `miniBlockGenerator.ts` in `/components/` that should be ignored. The correct one is in `/components/utils/`.

---

## Key Implementation Details

### Why Seeded Randomization?
The wheel pattern must be identical across all three wheels, only rotated. Using `Math.random()` would create different patterns. The seeded random generator ensures:
1. Same probability → Same base pattern
2. Deterministic shuffle
3. Reproducible for same probability

### Why Mini-Blocking?
Ensures balanced win/loss distribution:
- Prevents long streaks of wins or losses
- Controls outcome variance per probability level
- Maintains statistical validity across trials

### Why 40 Segments?
- 20% = 8 segments (exactly divisible)
- 40% = 16 segments (exactly divisible)
- 60% = 24 segments (exactly divisible)
- 80% = 32 segments (exactly divisible)
- No rounding errors for visual representation

### Agency Mechanism
The 50/50 agency split is randomized at trial generation (line 49 in RouletteExperiment.tsx):
```tsx
agency: Math.random() < 0.5
```

This is NOT part of the mini-block system. Agency is independent of outcome and probability.

---

## Common Modifications

### Changing Number of Trials
1. Modify mini-block loop in RouletteExperiment.tsx (lines 38-52)
2. Adjust mini-block generation in miniBlockGenerator.ts
3. Update matrix dimensions

### Adding New Phases
1. Add to `ExperimentPhase` type (line 16)
2. Create phase UI in main render (lines 204-344)
3. Add transition function (e.g., `proceedToNewPhase()`)
4. Update `proceedToNextTrial()` to reset new state

### Modifying Rating Scales
1. Change `min`/`max` props in RatingScale component calls
2. Update `quickRatings` array in RatingScale.tsx (lines 18-24)
3. Adjust validation logic if needed

### Customizing Wheel Appearance
1. Edit SVG path colors (lines 163-166 in RouletteWheel.tsx)
2. Modify segment stroke width (line 165)
3. Change center circle size (line 175)
4. Adjust clock hand styling (lines 196-214)

---

## Data Analysis Considerations

### Exported Variables
- `probability` - Factorial variable (4 levels)
- `agency` - Binary independent variable (approved/vetoed)
- `outcomeWin` - Binary dependent variable (predetermined)
- `confidenceRating` - Continuous dependent variable (0-100)
- `satisfactionRating` - Continuous dependent variable (0-100)
- `selectedWheel` - Nominal variable (0, 1, 2) - should be uniform if wheels are truly equivalent
- `miniBlock` - Blocking variable (1-5)

### Statistical Analyses
Possible analyses:
- 2×4 ANOVA (Agency × Probability) on satisfaction
- Confidence vs. Outcome correlation
- Agency effect on confidence
- Mini-block learning effects
- Wheel preference distribution (should be 33%/33%/33%)

---

## Known Issues & Limitations

### Current State
✅ All core functionality implemented
✅ Data export working
✅ Mini-block validation working
✅ Wheel animations smooth
✅ Rating scales functional

### Potential Improvements
- Add participant ID input
- Add practice trials
- Add attention checks
- Add response time tracking
- Add browser/device detection
- Add data validation before export
- Add resume functionality (save state to localStorage)

---

## Testing Checklist

### Functionality Tests
- [ ] 40 trials generate successfully
- [ ] Mini-block matrix is valid (no all-0 or all-1 columns)
- [ ] Three wheels display identical patterns (just rotated)
- [ ] Wheel selection highlights correctly
- [ ] Approval/veto displays correct message
- [ ] Confidence rating records values 0-100
- [ ] Wheel spins and lands on correct outcome
- [ ] Satisfaction rating records values 0-100
- [ ] Progress bar advances correctly
- [ ] Data export downloads JSON file
- [ ] Export includes all 40 trials with complete data

### Visual Tests
- [ ] Wheels display 40 equal segments
- [ ] Green/red colors clearly distinguishable
- [ ] Clock hand visible and centered
- [ ] Selection ring animates on hover
- [ ] Spin animation smooth (2.5s)
- [ ] Rating sliders responsive
- [ ] All text readable

### Edge Cases
- [ ] Rapid clicking doesn't break state
- [ ] Can't proceed without making selections
- [ ] Can't proceed without ratings
- [ ] Works on different screen sizes
- [ ] Console logs show valid matrix generation

---

## Quick Start Commands

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### File to Share with Cursor
Share this entire file (`CURSOR_HANDOFF.md`) plus these 5 essential files:
1. `/App.tsx`
2. `/components/RouletteExperiment.tsx`
3. `/components/RouletteWheel.tsx`
4. `/components/RatingScale.tsx`
5. `/components/utils/miniBlockGenerator.ts`

---

## Questions to Consider

When working with Cursor, you might want to address:
1. Should wheel selection be randomized (position counterbalancing)?
2. Should there be a time limit on choices?
3. Should confidence ratings be required before seeing outcome?
4. Should there be feedback on overall performance?
5. Should mini-block boundaries be visible to participants?
6. Should practice trials be added?
7. Should response times be tracked?

---

## Contact & Research Context

This is a psychological research experiment interface designed for studying:
- **Agency and control perception**
- **Decision confidence under uncertainty**
- **Satisfaction with outcomes vs. process**
- **Probability judgment and learning**

The design follows psychological research best practices:
- Counterbalanced stimuli (rotated wheels)
- Blocked randomization (mini-blocks)
- Comprehensive data collection
- Standardized rating scales
- Controlled outcome distributions

---

## Version History

**Current Version**: Restored state with manual edits to RouletteWheel.tsx
- ✅ Complete 7-phase experiment flow
- ✅ Mini-block outcome generation with validation
- ✅ Three equivalent rotated wheels (0°, 120°, 240°)
- ✅ Seeded randomization for consistent patterns
- ✅ Clock-hand pointer animation
- ✅ Confidence and satisfaction ratings
- ✅ Comprehensive data export
- ✅ Progress tracking and trial management

**Key Files Modified**:
- `RouletteWheel.tsx` - Manually edited for clock-hand pointer
- `Guidelines.md` - Manually edited (if exists)

---

## End of Documentation

This file contains everything needed to understand and continue development of the Roulette Wheel Psychological Research Experiment. Share this with Cursor along with the 5 essential code files listed above.
