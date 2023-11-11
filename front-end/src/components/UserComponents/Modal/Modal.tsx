import styles from './Modal.module.scss';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Modal: FC<Props> = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};
