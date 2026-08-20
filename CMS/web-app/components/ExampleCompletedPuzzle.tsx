type ExampleCompletedPuzzleProps = {
  imageFile: string;
  puzzleName: string;
  caption: string;
  imageTitle?: string;
  eyebrow: string;
  heading: string;
};

/** A reusable showcase for a real, completed puzzle photo. */
export default function ExampleCompletedPuzzle({
  imageFile,
  puzzleName,
  caption,
  imageTitle = `Completed ${puzzleName} Dot to Dot Printable`,
  eyebrow,
  heading,
}: ExampleCompletedPuzzleProps) {
  return (
    <section className="completed-puzzle" aria-labelledby="completed-puzzle-heading">
      <div className="completed-puzzle__heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="completed-puzzle-heading">{heading}</h2>
      </div>
      <figure className="completed-puzzle__card">
        {/* Static export serves this already-optimized WebP directly. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="completed-puzzle__image"
          src={imageFile}
          alt={imageTitle}
          title={imageTitle}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
        />
        <figcaption>
          <strong>{puzzleName}</strong>
          <span>{caption}</span>
        </figcaption>
      </figure>
    </section>
  );
}
