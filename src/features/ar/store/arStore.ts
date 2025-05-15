import { create } from 'zustand';

export interface PatternInfo {
  id: string;
  name: string;
  description: string;
  culturalSignificance: string;
  imageUrl: string;
  position: [number, number, number]; // x, y, z coordinates on the model
}

interface ARState {
  // AR state
  isARReady: boolean;
  isModelLoaded: boolean;
  loadingProgress: number;
  isDetecting: boolean;
  
  // Model interaction
  selectedPattern: PatternInfo | null;
  showPatternInfo: boolean;
  
  // Camera permissions
  hasCameraPermission: boolean;
  cameraError: string | null;
  
  // Da Nang specific model data
  modelInfo: {
    name: string;
    description: string;
    region: string;
    patterns: PatternInfo[];
  };
  
  // Actions
  setARReady: (isReady: boolean) => void;
  setModelLoaded: (isLoaded: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setDetecting: (isDetecting: boolean) => void;
  selectPattern: (patternId: string | null) => void;
  setShowPatternInfo: (show: boolean) => void;
  setCameraPermission: (hasPermission: boolean) => void;
  setCameraError: (error: string | null) => void;
}

// Da Nang traditional clothing patterns data
const daNangPatterns: PatternInfo[] = [
  {
    id: 'dragon-pattern',
    name: 'Dragon Pattern',
    description: 'Traditional dragon motif found on Da Nang ceremonial clothing',
    culturalSignificance: 'The dragon represents imperial power and prosperity in Vietnamese culture, particularly significant in Da Nang\'s royal heritage.',
    imageUrl: '/assets/patterns/danang-dragon.jpg',
    position: [0, 0.2, 0.1],
  },
  {
    id: 'cloud-pattern',
    name: 'Cloud Pattern',
    description: 'Stylized cloud designs common in Da Nang traditional textiles',
    culturalSignificance: 'Clouds symbolize good fortune and heavenly blessings, reflecting Da Nang\'s connection to both mountains and sea.',
    imageUrl: '/assets/patterns/danang-cloud.jpg',
    position: [0.15, 0, 0],
  },
  {
    id: 'floral-pattern',
    name: 'Champa Flower Pattern',
    description: 'Floral pattern inspired by the Kingdom of Champa',
    culturalSignificance: 'The Champa flower patterns honor the ancient Champa Kingdom that once flourished in what is now Da Nang, representing cultural heritage and historical roots.',
    imageUrl: '/assets/patterns/danang-champa.jpg',
    position: [-0.15, -0.1, 0],
  },
  {
    id: 'marble-pattern',
    name: 'Marble Mountains Motif',
    description: 'Patterns inspired by Da Nang\'s famous Marble Mountains',
    culturalSignificance: 'These motifs represent the five elements symbolized by the Marble Mountains (Ngũ Hành Sơn), a sacred site in Da Nang.',
    imageUrl: '/assets/patterns/danang-marble.jpg',
    position: [0, -0.2, 0],
  },
];

const useARStore = create<ARState>((set, get) => ({
  // Initial state
  isARReady: false,
  isModelLoaded: false,
  loadingProgress: 0,
  isDetecting: false,
  selectedPattern: null,
  showPatternInfo: false,
  hasCameraPermission: false,
  cameraError: null,
  
  // Da Nang model info
  modelInfo: {
    name: 'Da Nang Traditional Áo Dài',
    description: 'A modern áo dài with traditional Da Nang patterns, showcasing the cultural heritage of Central Vietnam.',
    region: 'Da Nang',
    patterns: daNangPatterns,
  },
  
  // Actions
  setARReady: (isReady) => set({ isARReady: isReady }),
  setModelLoaded: (isLoaded) => set({ isModelLoaded: isLoaded }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setDetecting: (isDetecting) => set({ isDetecting: isDetecting }),
  selectPattern: (patternId) => {
    if (patternId === null) {
      set({ selectedPattern: null });
      return;
    }
    
    const { patterns } = get().modelInfo;
    const pattern = patterns.find(p => p.id === patternId);
    set({ selectedPattern: pattern || null });
  },
  setShowPatternInfo: (show) => set({ showPatternInfo: show }),
  setCameraPermission: (hasPermission) => set({ hasCameraPermission: hasPermission }),
  setCameraError: (error) => set({ cameraError: error }),
}));

export default useARStore;