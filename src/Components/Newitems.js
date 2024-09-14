import React, { useState } from 'react';

const Newitems = (props) => {
  const { title, description, imageUrl, newsUrl, author, date, source } = props;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true); // Set image error to true when the image fails to load
  };

  return (
    <div className="my-3">
      <div className={`card bg-${props.mode === 'dark' ? 'dark' : 'light'}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '0' }}>
          <span className="badge rounded-pill bg-danger">{source}</span>
        </div>

        {/* Show news image or fallback image if there's an error */}
        {!imageError ? (
          <img
            src={imageUrl}
            className="card-img-top"
            alt="News"
            onError={handleImageError} // Fallback if image fails to load
          />
        ) : (
          <img
            src="https://static1.xdaimages.com/wordpress/wp-content/uploads/2023/01/samsung-galaxy-s23-ultra-9.jpg"
            className="card-img-top"
            alt="Image not available"
          />
        )}

        <div className="card-body">
          {/* Title */}
          <h5 className={`card-title text-${props.mode === 'dark' ? 'white' : 'black'}`}>{title}</h5>

          {/* Description */}
          <p className={`card-text text-${props.mode === 'dark' ? 'white' : 'black'}`}>{description}</p>

          {/* Author and Date */}
          <p className="card-text">
            <small className="text-body-secondary">
              <span className={`text-${props.mode === 'dark' ? 'white' : 'black'}`}>By {author ? author : "Unknown"}</span>{' '}
              <span className={`text-${props.mode === 'dark' ? 'white' : 'black'}`}> on {new Date(date).toGMTString()}</span>
            </small>
          </p>

          {/* Read More Button */}
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className={`btn ${props.mode === 'dark' ? 'btn-black btn-dark-mode' : 'btn-dark'}`}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Newitems;
