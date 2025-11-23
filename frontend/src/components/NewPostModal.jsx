import { useState } from "react";
import { postService } from "../services/api.js";
import "./NewPostModal.css";

function NewPostModal({ isOpen, onClose, variant = "centered" }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await postService.createPost(content);
      setContent("");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      {variant === "centered" && (
        <div className="modal-overlay" onClick={onClose} />
      )}
      <div className={`modal ${variant}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="cancel-button" onClick={onClose}>
            {variant === "centered" ? "Cancel" : "✕"}
          </button>
          <h3>New Thread</h3>
          <div className="modal-header-spacer"></div>
        </div>
        <textarea
          placeholder="What's new?"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={500}
        />
        <div className="modal-footer">
          <span className="char-count">{content.length}/500</span>
          <div className="modal-actions">
            <button
              className="primary"
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPostModal;
