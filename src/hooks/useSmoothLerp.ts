// Smooothy-inspired frame-rate independent lerp hook.
// Kritik formul: k = 1 - exp(-damping * dt)
// 60Hz / 120Hz / 144Hz ekranda ayni davranis, clamp ile tab blur'unda patlamaz.

import { useEffect, useRef, useCallback } from 'react'

export interface SmoothLerpApi {
  /** Hedef degeri ayarla; bir sonraki frame'de lerp baslar. */
  setTarget: (value: number) => void
  /** Mevcut interpolated deger (ref icinden okunur, render trigger etmez). */
  getValue: () => number
  /** Hedefe anlik atla (reduced-motion ya da snap gerektiginde). */
  snapTo: (value: number) => void
  /** Her frame cagrilan callback (isteg bagli). */
  onUpdate: (cb: (value: number) => void) => void
}

/**
 * @param initial Baslangic degeri
 * @param damping Yumusatma sabiti (birim: 1/sn). 12 ~ 80ms settle.
 * @param enabled false ise RAF bosa dongmez (reduced-motion)
 */
export function useSmoothLerp(initial: number, damping = 12, enabled = true): SmoothLerpApi {
  const current = useRef(initial)
  const target = useRef(initial)
  const frame = useRef<number>(0)
  const updateCb = useRef<((v: number) => void) | null>(null)

  useEffect(() => {
    if (!enabled) {
      current.current = target.current
      updateCb.current?.(current.current)
      return
    }

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000) // 64ms clamp -> tab blur koruma
      last = now
      const k = 1 - Math.exp(-damping * dt)
      const next = current.current + (target.current - current.current) * k
      current.current = next
      updateCb.current?.(next)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [damping, enabled])

  const setTarget = useCallback((v: number) => { target.current = v }, [])
  const getValue = useCallback(() => current.current, [])
  const snapTo = useCallback((v: number) => {
    current.current = v
    target.current = v
    updateCb.current?.(v)
  }, [])
  const onUpdate = useCallback((cb: (value: number) => void) => {
    updateCb.current = cb
  }, [])

  return { setTarget, getValue, snapTo, onUpdate }
}
