# Color Swatch Explorer

A React web app which displays a responsive grid of color swatches based on user-selected saturation and lightness values. The app fetches and caches color data from the [Color API](https://www.thecolorapi.com/), displaying each unique color's name and RGB values.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Design Decisions

This implementation focuses on performance and user experience through a few key architectural choices. The color fetching strategy uses an optimized search strategy to minimize API calls. Instead of querying every possible hue value (0-359) for each saturation-lightness pair $(S, L)$, this implementation leverages the fact that color names change monotonically across the hue spectrum. Thus, it first employs exponential search, doubling the step size until it finds a color name that was not previously encountered. Once a color change is detected, we use binary search to pinpoint the exact boundary. This allows us to efficiently find all boundaries between different color names. Asymptotic performance is $O(k \log{n})$, where $n = 360$ is the size of the hue range and $k$ is the number of unique colors in this range. In practice however, this can vary depending on where the transition points are defined, as this can vary based on the given $(S, L)$ specification.

The app also implements a few other performance optimizations:

- Persistent caching is done through `localStorage` to maintain color data between sessions.
- Abort signaling is set up to handle request cancellation for outdated queries, such as when users quickly change values.
- Separate draft and committed states are maintained for slider values, to prevent unnecessary refreshes.
- Color calculations are memoized to avoid redundant processing.
- Historical swatches are stored in a wrapped Map structure to allow for efficient loading state management.

The UI is built with a component hierarchy separating concerns as follows:

- `App` handles general state management and user input
- `Grid` handles the responsive layout of the color swatches
- `Swatch` focuses on display of individual colors and associated metadata

The user can specify a given saturation/lightness configuration by interacting with the sliders, which they can drag and release to generate and view swatches for different $(S, L)$ pairs. A loading progress indicator is also provided, which is updated every time a new color name is discovered, and which is expressed as a percentage out of the 360 total hues.
