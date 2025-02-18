// Image optimization utilities
export const imageOptimization = {
  // Dynamically load images based on viewport
  loadImage: (src: string, options: { width: number; quality?: number } = { width: 800, quality: 80 }) => {
    const params = new URLSearchParams({
      w: options.width.toString(),
      q: (options.quality || 80).toString(),
      auto: 'format'
    });

    return `${src}?${params.toString()}`;
  },

  // Generate srcset for responsive images
  generateSrcSet: (src: string, widths: number[] = [320, 640, 960, 1280]) => {
    return widths
      .map(width => `${imageOptimization.loadImage(src, { width })} ${width}w`)
      .join(', ');
  }
};

// Code splitting utilities
export const codeSplitting = {
  // Preload critical chunks
  preloadChunk: (chunkName: string) => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = `/assets/${chunkName}.js`;
    document.head.appendChild(link);
  },

  // Prefetch non-critical chunks
  prefetchChunk: (chunkName: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/assets/${chunkName}.js`;
    document.head.appendChild(link);
  }
};

// Resource hints
export const resourceHints = {
  // Add DNS prefetch
  addDnsPrefetch: (domain: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  },

  // Add preconnect
  addPreconnect: (domain: string, crossOrigin = true) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    if (crossOrigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }
};