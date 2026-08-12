type LiteYouTubeEmbedProps = {
  videoId: string;
  title: string;
  thumbnailSrc: string;
  thumbnailSrcSet?: string;
  thumbnailSizes?: string;
};

export default function LiteYouTubeEmbed({
  videoId,
  title,
  thumbnailSrc,
  thumbnailSrcSet,
  thumbnailSizes,
}: LiteYouTubeEmbedProps) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  const playerId = `yt-player-${videoId}`;

  return (
    <div id={playerId} style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 24, boxShadow: 'var(--shadow)', background: '#000' }}>
      <button
        type="button"
        data-video-src={embedUrl}
        data-video-title={title}
        aria-label={title}
        style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', padding: 0, border: 0, cursor: 'pointer', background: '#000' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Static export serves local pre-generated image assets directly. */}
        <img
          src={thumbnailSrc}
          srcSet={thumbnailSrcSet}
          sizes={thumbnailSizes}
          alt={title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }}
        />
        <span
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.42))' }}
        >
          <span style={{ display: 'grid', placeItems: 'center', width: 78, height: 78, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 10px 30px rgba(0,0,0,0.28)' }}>
            <span style={{ display: 'block', width: 0, height: 0, marginLeft: 5, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: '24px solid #fff' }} />
          </span>
        </span>
        <span style={{ position: 'absolute', left: 24, right: 24, bottom: 22, color: '#fff', fontWeight: 900, textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,0.52)' }}>
          {title}
        </span>
      </button>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              var root = document.getElementById(${JSON.stringify(playerId)});
              if (!root) return;
              var button = root.querySelector('button[data-video-src]');
              if (!button) return;
              button.addEventListener('click', function(){
                var iframe = document.createElement('iframe');
                iframe.src = button.getAttribute('data-video-src');
                iframe.title = button.getAttribute('data-video-title') || 'Video';
                iframe.loading = 'lazy';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                iframe.allowFullscreen = true;
                iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
                root.textContent = '';
                root.appendChild(iframe);
              }, { once: true });
            })();
          `
        }}
      />
    </div>
  );
}
