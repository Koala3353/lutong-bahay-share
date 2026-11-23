import { useState } from 'react'

// Click to load, so the page does not pull in YouTube until the video is actually played.
export default function VideoEmbed({ id, title, author }) {
  const [on, setOn] = useState(false)
  return (
    <figure className="video">
      <div className="video-frame">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button className="poster" onClick={() => setOn(true)} aria-label={`Play video: ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="play">Play video</span>
          </button>
        )}
      </div>
      <figcaption>
        {title}, by {author}.{' '}
        <a href={`https://youtu.be/${id}`} target="_blank" rel="noreferrer">Open on YouTube</a>
      </figcaption>
    </figure>
  )
}
