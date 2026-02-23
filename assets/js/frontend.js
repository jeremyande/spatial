(function () {
  const VIEWER_SELECTOR = '.gsv-viewer';
  let modulePromise = null;

  function loadViewerModule() {
    if (modulePromise) return modulePromise;
    modulePromise = import('https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@latest/build/gaussian-splats-3d.module.js');
    return modulePromise;
  }

  function showFallback(el, text) {
    el.innerHTML = '';
    const node = document.createElement('div');
    node.className = 'gsv-fallback';
    node.textContent = text || 'Your browser does not support this 3D viewer.';
    el.appendChild(node);
  }

  async function initViewer(el) {
    const src = el.dataset.src;
    const controls = el.dataset.controls === 'true';
    const autoplay = el.dataset.autoplay === 'true';
    const fallback = el.dataset.fallback || 'Your browser does not support this 3D viewer.';

    if (!src) {
      showFallback(el, 'No .ply source provided.');
      return;
    }

    if (!window.WebGLRenderingContext) {
      showFallback(el, fallback);
      return;
    }

    try {
      const splats = await loadViewerModule();

      const viewer = new splats.Viewer({
        rootElement: el,
        cameraUp: [0, -1, -0.6],
        initialCameraPosition: [0, -1, -6],
        initialCameraLookAt: [0, 0, 0],
        useBuiltInControls: controls,
      });

      await viewer.addSplatScene(src, {
        splatAlphaRemovalThreshold: 1,
        showLoadingUI: true,
        position: [0, 1, 0],
        rotation: [0, 0, 0, 1],
        scale: [1.5, 1.5, 1.5],
      });

      viewer.start();

      if (autoplay) {
        let t = 0;
        const tick = () => {
          t += 0.0025;
          const radius = 6;
          const x = Math.cos(t) * radius;
          const z = Math.sin(t) * radius;
          if (viewer && viewer.camera) {
            viewer.camera.position.set(x, -1, z);
            viewer.camera.lookAt(0, 0, 0);
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    } catch (e) {
      showFallback(el, fallback);
    }
  }

