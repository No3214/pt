// Lazy exports — kodsplitting icin dogrudan default export kullan
// Kullanim:
//   import Volleyball3D from '@/components/animations/3d/Volleyball3D'
//   import Spotlight from '@/components/animations/3d/Spotlight'
// Daha hafif alternatif: named re-export (tree-shakeable)

// Volleyball3D ve ParallaxScene3D three/drei gerektirir.
// Deps install edildikten sonra aktif olacak:
//   npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
// export { default as Volleyball3D } from './Volleyball3D'
// export { default as ParallaxScene3D } from './ParallaxScene3D'
export { default as Spotlight } from './Spotlight'
export { Card3D, Card3DLayer, Card3DShine } from './Card3D'
export { default as ShineBorder } from './ShineBorder'
