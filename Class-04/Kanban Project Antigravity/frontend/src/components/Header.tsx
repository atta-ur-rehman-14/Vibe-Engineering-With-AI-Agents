'use client';

import React from 'react';
import { KanbanSquare, Columns3, CheckCircle2 } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  totalCards: number;
  columnCount: number;
}

export const Header: React.FC<HeaderProps> = ({ totalCards, columnCount }) => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.iconWrapper}>
          <KanbanSquare size={22} />
        </div>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Kanban Studio</h1>
          <p className={styles.subtitle}>Unified Project Workspace</p>
        </div>
      </div>

      <div className={styles.metaGroup}>
        <div className={styles.statBadge}>
          <Columns3 size={15} />
          <span>Columns:</span>
          <span className={styles.statValue}>{columnCount}</span>
        </div>
        <div className={styles.statBadge}>
          <CheckCircle2 size={15} />
          <span>Active Tasks:</span>
          <span className={styles.statValue}>{totalCards}</span>
        </div>
      </div>
    </header>
  );
};
