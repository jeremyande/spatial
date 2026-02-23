(function () {
  const MODULE_URL = 'https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@0.4.7/+esm';

  function showFallback(el, message) {
    el.innerHTML = '';
    const fallback = document.createElement('div');
    fallback.className = 'gsv-fallback';
    fallback.textContent = message || 'Your browser does not support this 3D viewer.';
    el.appendChild(fallback);
  }

  async function initViewer(el) {
    const src = el.dataset.src;
    const controls = el.dataset.controls === 'true';
    const autoplay = el.dataset.autoplay === 'true';
    const fallback = el.dataset.fallback;

    if (!src) {
      showFallback(el, 'No .ply file configured.');
      return;
    }

    if (!window.WebGLRenderingContext) {
      showFallback(el, fallback);
      return;
    }

    try {
      const GaussianSplats3D = await import(MODULE_URL);

      const viewer = new GaussianSplats3D.Viewer({
        rootElement: el,
        selfDrivenMode: true,
        useBuiltInControls: controls,
        ignoreDevicePixelRatio: false,
      });

      await viewer.addSplatScene(src, {
        showLoadingUI: true,
      });

      viewer.start();

      if (autoplay && controls) {
        let angle = 0;
        const animate = () => {
          angle += 0.002;
          if (viewer.camera) {
            const radius = 3;
            viewer.camera.position.x = Math.cos(angle) * radius;
            viewer.camera.position.z = Math.sin(angle) * radius;
            viewer.camera.lookAt(0, 0, 0);
          }
          requestAnimationFrame(animate);
        };
        animate();
      }
    } catch (err) {
      console.error('Gaussian Splat Viewer failed:', err);
      showFallback(el, fallback);
    }
  }

  function initAll() {
    document.querySelectorAll('.gsv-viewer').forEach((el) => {
      initViewer(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
