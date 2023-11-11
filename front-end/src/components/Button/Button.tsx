import { FC, ReactNode, MouseEvent } from 'react';
import styles from './Button.module.scss';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  href?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<Props> = ({ children, className, type, href, disabled = false, onClick }) => {
  return href ? (
    <Link prefetch={false} href={href} passHref>
      <button className={`${styles.root} ${className}`} type={type} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    </Link>
  ) : (
    <button className={`${styles.root} ${className}`} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
