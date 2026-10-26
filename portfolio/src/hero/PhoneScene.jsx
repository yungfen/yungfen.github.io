import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import './PhoneScene.css'

// World units are CSS pixels so the screen DOM renders at scale 1.
const PHONE_W = 400
const PHONE_H = 826
const PHONE_R = 62
const DEPTH = 30
const BEVEL = 6
const FRONT_Z = DEPTH / 2 + BEVEL
export const SCREEN_W = 376
export const SCREEN_H = 802

const INTRO_END = 2.9

const clamp01 = x => Math.min(Math.max(x, 0), 1)
const span = (t, a, b) => clamp01((t - a) / (b - a))
const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const easeIn = p => p * p * p
const easeOutBack = p => 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2)
const lerp = (a, b, p) => a + (b - a) * p

function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function buildPhone() {
  const phone = new THREE.Group()

  const frameMat = new THREE.MeshPhysicalMaterial({
    color: 0x6b6478,
    metalness: 0.95,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2
  })
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(PHONE_W - BEVEL * 2, PHONE_H - BEVEL * 2, PHONE_R - BEVEL), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 6,
      curveSegments: 24
    }),
    frameMat
  )
  body.geometry.translate(0, 0, -DEPTH / 2)
  phone.add(body)

  // front glass
  const glass = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRect(PHONE_W - 4, PHONE_H - 4, PHONE_R - 2), 24),
    new THREE.MeshPhysicalMaterial({ color: 0x050507, roughness: 0.05, metalness: 0, clearcoat: 1 })
  )
  glass.position.z = FRONT_Z + 0.4
  phone.add(glass)

  // frosted back glass
  const back = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRect(PHONE_W - 10, PHONE_H - 10, PHONE_R - 5), 24),
    new THREE.MeshPhysicalMaterial({ color: 0x6f6585, roughness: 0.6, metalness: 0.1, clearcoat: 0.15 })
  )
  back.rotation.y = Math.PI
  back.position.z = -FRONT_Z - 0.4
  phone.add(back)

  // camera bump with three lenses
  const bump = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(170, 170, 46), {
      depth: 6, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 3, curveSegments: 16
    }),
    new THREE.MeshPhysicalMaterial({ color: 0x9a90b2, roughness: 0.25, metalness: 0.2, clearcoat: 1 })
  )
  bump.rotation.y = Math.PI
  bump.position.set(PHONE_W / 2 - 110, PHONE_H / 2 - 110, -FRONT_Z - 0.5)
  phone.add(bump)

  const ringMat = new THREE.MeshStandardMaterial({ color: 0x3a3542, metalness: 1, roughness: 0.3 })
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a14, roughness: 0.05, clearcoat: 1, metalness: 0.3 })
  const lensPos = [[-38, 38], [-38, -38], [38, 0]]
  for (const [lx, ly] of lensPos) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 10, 40), ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.set(bump.position.x - lx, bump.position.y + ly, -FRONT_Z - 12)
    phone.add(ring)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(21, 21, 11, 40), lensMat)
    lens.rotation.x = Math.PI / 2
    lens.position.copy(ring.position)
    lens.position.z -= 0.5
    phone.add(lens)
  }
  const flash = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9, 4, 24),
    new THREE.MeshStandardMaterial({ color: 0xf3e9d2, emissive: 0x332b1c, roughness: 0.4 })
  )
  flash.rotation.x = Math.PI / 2
  flash.position.set(bump.position.x - 38, bump.position.y - 52, -FRONT_Z - 9)
  phone.add(flash)

  // side buttons
  const btnMat = frameMat
  const addButton = (x, y, h) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(6, h, 14), btnMat)
    b.position.set(x, y, 0)
    phone.add(b)
  }
  addButton(PHONE_W / 2 + 1, 150, 110)
  addButton(-PHONE_W / 2 - 1, 230, 40)
  addButton(-PHONE_W / 2 - 1, 140, 70)
  addButton(-PHONE_W / 2 - 1, 50, 70)

  return phone
}

function denimTexture(w, h, pocket) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  g.fillStyle = '#2b4570'
  g.fillRect(0, 0, w, h)
  // twill weave
  for (let i = -h; i < w; i += 3) {
    g.strokeStyle = `rgba(${150 + Math.random() * 60}, ${170 + Math.random() * 50}, 220, ${0.05 + Math.random() * 0.08})`
    g.lineWidth = 1.2
    g.beginPath()
    g.moveTo(i, 0)
    g.lineTo(i + h, h)
    g.stroke()
  }
  for (let i = 0; i < w * h * 0.02; i++) {
    g.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`
    g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
  }
  if (pocket) {
    // stitching along the hem and the outline
    g.strokeStyle = '#e0a458'
    g.lineWidth = 3
    g.setLineDash([10, 7])
    for (const off of [22, 34]) {
      g.beginPath()
      g.moveTo(0, off)
      g.lineTo(w, off)
      g.stroke()
    }
    g.beginPath()
    g.moveTo(14, 40)
    g.lineTo(14, h * 0.8)
    g.lineTo(w / 2, h - 14)
    g.lineTo(w - 14, h * 0.8)
    g.lineTo(w - 14, 40)
    g.stroke()
    // decorative arc
    g.beginPath()
    g.moveTo(60, h * 0.42)
    g.quadraticCurveTo(w / 2, h * 0.62, w - 60, h * 0.42)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function buildPocket() {
  const group = new THREE.Group()

  const jeansTex = denimTexture(512, 512, false)
  jeansTex.wrapS = jeansTex.wrapT = THREE.RepeatWrapping
  jeansTex.repeat.set(5, 5)
  const jeans = new THREE.Mesh(
    new THREE.PlaneGeometry(3200, 3200),
    new THREE.MeshStandardMaterial({ map: jeansTex, roughness: 1, transparent: true })
  )
  jeans.position.set(0, -1200, -80)
  group.add(jeans)

  const PW = 620
  const PH = 560
  const shape = new THREE.Shape()
  shape.moveTo(-PW / 2, 0)
  shape.lineTo(PW / 2, 0)
  shape.lineTo(PW / 2, -PH * 0.8)
  shape.lineTo(0, -PH)
  shape.lineTo(-PW / 2, -PH * 0.8)
  shape.closePath()
  const geo = new THREE.ShapeGeometry(shape)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + PW / 2) / PW, (pos.getY(i) + PH) / PH)
  }
  const pocketTex = denimTexture(512, 462, true)
  pocketTex.flipY = true
  const pocket = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pocketTex, roughness: 0.95, transparent: true }))
  pocket.position.set(0, -110, 60)
  group.add(pocket)

  // a soft shadow inside the pocket opening
  const lip = new THREE.Mesh(
    new THREE.PlaneGeometry(PW, 26),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  )
  lip.userData.baseOpacity = 0.35
  lip.position.set(0, -122, 58)
  group.add(lip)

  return group
}

export default function PhoneScene({ children, onIntroDone, skip }) {
  const stageRef = useRef(null)
  const skipRef = useRef(skip)
  const doneRef = useRef(false)
  const onDoneRef = useRef(onIntroDone)
  const [screenEl] = useState(() => {
    const el = document.createElement('div')
    el.className = 'phone-screen-host'
    el.style.width = `${SCREEN_W}px`
    el.style.height = `${SCREEN_H}px`
    return el
  })
  const [screenOn, setScreenOn] = useState(false)
  const [phase, setPhase] = useState('intro')

  useEffect(() => { skipRef.current = skip }, [skip])
  useEffect(() => { onDoneRef.current = onIntroDone }, [onIntroDone])

  useEffect(() => {
    const stage = stageRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'phone-gl'
    stage.appendChild(renderer.domElement)

    const cssRenderer = new CSS3DRenderer()
    cssRenderer.domElement.className = 'phone-css'
    stage.appendChild(cssRenderer.domElement)

    const scene = new THREE.Scene()
    const cssScene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.7

    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(600, 900, 1200)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xc4a7e7, 1.2)
    rim.position.set(-900, 300, -400)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))

    const camera = new THREE.PerspectiveCamera(30, 1, 10, 10000)

    const phone = buildPhone()
    scene.add(phone)
    const pocket = buildPocket()
    scene.add(pocket)

    const screenObj = new CSS3DObject(screenEl)
    screenObj.position.z = FRONT_Z + 0.8
    const screenAnchor = new THREE.Object3D()
    screenAnchor.add(screenObj)
    cssScene.add(screenAnchor)

    const resize = () => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      renderer.setSize(w, h)
      cssRenderer.setSize(w, h)
      camera.aspect = w / h
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      const fitH = (PHONE_H / 0.9) / (2 * tanHalf)
      const fitW = (PHONE_W / 0.86) / (2 * tanHalf * camera.aspect)
      camera.position.set(0, 0, Math.max(fitH, fitW))
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)

    // pointer tilt
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    let floatPhase = 0
    let overScreen = false
    const onMove = e => {
      if (overScreen) return
      const r = stage.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1
      tilt.ty = THREE.MathUtils.clamp(nx, -1.5, 1.5) * 0.28
      tilt.tx = THREE.MathUtils.clamp(ny, -1.5, 1.5) * 0.18
    }
    const onEnter = () => { overScreen = true }
    const onLeave = () => { overScreen = false }
    const canHover = window.matchMedia('(hover: hover)').matches
    if (canHover && !reduced) window.addEventListener('pointermove', onMove)
    screenEl.addEventListener('pointerenter', onEnter)
    screenEl.addEventListener('pointerleave', onLeave)

    let visible = true
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(stage)

    const clock = new THREE.Clock()
    let introT = reduced ? INTRO_END : 0
    let woke = false
    let raf

    const finishIntro = () => {
      if (doneRef.current) return
      doneRef.current = true
      setPhase('live')
      onDoneRef.current?.()
    }

    const pose = t => {
      // 0 → 0.55: phone sits in the back pocket, back facing us, with a little jiggle
      // 0.35 → 1.55: pulled up and out; the jeans slide away
      // 1.1 → 2.4: turned around to face us and brought to centre
      const dip = Math.sin(span(t, 0.25, 0.55) * Math.PI) * -22
      const pull = easeInOut(span(t, 0.45, 1.5))
      const turn = easeInOut(span(t, 1.05, 2.4))
      const settle = easeOutBack(span(t, 1.6, 2.6))

      const y = lerp(-400 + dip, 150, pull)
      phone.position.set(
        lerp(14, 0, turn),
        lerp(y, 0, settle),
        lerp(0, 140, pull) * (1 - turn) + Math.sin(turn * Math.PI) * 90
      )
      phone.rotation.set(
        Math.sin(turn * Math.PI) * 0.35 + lerp(-0.08, 0, pull),
        lerp(Math.PI, 0, turn),
        lerp(-0.07, 0, pull) + Math.sin(turn * Math.PI) * 0.12
      )
      const drop = span(t, 0.6, 1.7)
      pocket.position.y = -easeIn(drop) * 900
      pocket.traverse(o => {
        if (o.material) o.material.opacity = (o.userData.baseOpacity ?? 1) * (1 - easeIn(drop))
      })
      pocket.visible = t < 1.7
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.25)
      if (!visible) return

      if (introT < INTRO_END) {
        introT = skipRef.current ? INTRO_END : introT + dt
        pose(introT)
        stage.classList.toggle('in-pocket', introT < 1.7)
        if (!woke && introT > 2.35) {
          woke = true
          setScreenOn(true)
        }
        if (introT >= INTRO_END) {
          pose(INTRO_END)
          setScreenOn(true)
          finishIntro()
        }
      } else {
        if (!woke) {
          woke = true
          setScreenOn(true)
          pose(INTRO_END)
          finishIntro()
        }
        // hold the phone still while the pointer is on the screen so taps land
        if (!overScreen && !reduced) floatPhase += dt * 1.2
        if (!overScreen) {
          tilt.x += (tilt.tx - tilt.x) * 0.06
          tilt.y += (tilt.ty - tilt.y) * 0.06
        }
        phone.position.set(0, Math.sin(floatPhase) * 6, 0)
        phone.rotation.set(tilt.x, tilt.y, 0)
      }

      screenAnchor.position.copy(phone.position)
      screenAnchor.rotation.copy(phone.rotation)
      renderer.render(scene, camera)
      cssRenderer.render(cssScene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      screenEl.removeEventListener('pointerenter', onEnter)
      screenEl.removeEventListener('pointerleave', onLeave)
      scene.traverse(o => {
        o.geometry?.dispose()
        if (o.material) {
          o.material.map?.dispose()
          o.material.dispose()
        }
      })
      scene.environment?.dispose()
      pmrem.dispose()
      renderer.dispose()
      stage.removeChild(renderer.domElement)
      stage.removeChild(cssRenderer.domElement)
    }
  }, [screenEl])

  return (
    <div ref={stageRef} className={`phone-stage phase-${phase}`}>
      <div className="phone-shadow" aria-hidden="true" />
      {createPortal(
        <div className={`phone-screen${screenOn ? ' on' : ''}`}>{children}</div>,
        screenEl
      )}
    </div>
  )
}
