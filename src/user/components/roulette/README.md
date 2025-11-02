# Roulette Wheel Psychological Research Experiment

This directory contains the implementation of a psychological research experiment for studying decision-making, agency, and satisfaction in a controlled roulette wheel task.

## Overview

The experiment runs 40 trials where participants choose between three visually identical roulette wheels at different probability levels (20%, 40%, 60%, 80%). The computer either approves or vetoes their choice, and the selected wheel spins to reveal the outcome.

## Components

### RouletteExperimentView.vue
Main orchestrator component that manages the experiment flow, trial generation, and data collection.

**Key Features:**
- 7-phase state machine (instructions, choice, approval, confidence, spin, satisfaction, complete)
- Mini-block trial generation with balanced outcomes
- Comprehensive data collection and export
- Progress tracking and trial management

### RouletteWheel.vue
Individual wheel component with SVG rendering, selection state, and spin animation.

**Key Features:**
- 40 equal segments (9° each) with seeded randomization
- Three wheels with rotational variations (0°, 120°, 240°)
- Smooth 2.5-second spin animation with easeOut easing
- Clock-hand pointer with arrow tip
- Visual selection feedback

### RatingScale.vue
Reusable rating interface for confidence and satisfaction ratings.

**Key Features:**
- Slider component (0-100, step=1)
- Large numeric display of current value
- Quick-select buttons (Very Low, Low, Medium, High, Very High)
- Min/Mid/Max labels for orientation

### miniBlockGenerator.js
Utility for generating and validating the 4×5 mini-block outcome matrix.

**Key Features:**
- Balanced win/loss distribution across trials
- Validation to prevent impossible outcome patterns
- Fallback matrix if generation fails
- Joint random column permutations

## Experimental Design

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

### Data Collection
Each trial records:
- Trial number, probability level, mini-block
- Predetermined outcome, agency status
- Selected wheel index, confidence rating
- Satisfaction rating, timestamp

## Usage

The experiment is integrated into the SMILE framework timeline and can be accessed through the standard SMILE navigation system. It includes:

- **Autofill support** for development and testing
- **Data export** in JSON format
- **Progress tracking** with visual indicators
- **Responsive design** for different screen sizes

## Research Applications

This experiment is suitable for studying:
- Agency and control perception
- Decision confidence under uncertainty
- Satisfaction with outcomes vs. process
- Probability judgment and learning
- Decision-making patterns across trials

## Technical Notes

- Uses seeded randomization to ensure wheel patterns are identical across rotations
- Implements proper experimental controls and counterbalancing
- Includes comprehensive data logging for post-experiment analysis
- Follows SMILE framework conventions and patterns
