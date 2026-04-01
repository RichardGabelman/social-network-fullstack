import "./Avatar.css";

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23181818'/%3E%3Cpath fill='%234d4d4d' d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z'/%3E%3C/svg%3E`;

function Avatar({
  src, alt, size = "medium"
}) {
  const handleError = (e) => {
    e.currentTarget.src = FALLBACK_SVG;
  }

  return (
    <img src={src || FALLBACK_SVG} alt={alt} className={`avatar avatar-${size}`} onError={handleError} />
  );
}

export default Avatar;