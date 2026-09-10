'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './AddCardModal.module.css';

interface AddCardModalProps {
  isOpen: boolean;
  columnId: string;
  columnTitle: string;
  onClose: () => void;
  onSubmit: (columnId: string, title: string, details: string) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnId,
  columnTitle,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      titleInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle('');
    setDetails('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit(columnId, trimmedTitle, details.trim());
    setTitle('');
    setDetails('');
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      data-testid="add-card-overlay"
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-heading">
        <div className={styles.header}>
          <h2 id="modal-heading" className={styles.title}>
            Add Task to {columnTitle}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
            data-testid="close-modal-button"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="card-title-input" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="card-title-input"
              ref={titleInputRef}
              type="text"
              className={styles.input}
              placeholder="e.g. Implement user authentication flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="card-title-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="card-details-input" className={styles.label}>
              Details
            </label>
            <textarea
              id="card-details-input"
              className={styles.textarea}
              placeholder="Provide technical specifics, acceptance criteria, or context..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              data-testid="card-details-input"
            />
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              data-testid="cancel-card-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!title.trim()}
              data-testid="submit-card-button"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
