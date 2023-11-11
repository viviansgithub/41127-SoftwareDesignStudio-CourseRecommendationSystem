import { FC } from 'react';
import { Button } from '../../Button/Button';
import styles from './AdminHeader.module.scss';

interface ButtonConfig {
  href: string;
  label: string;
}

interface Props {
  title?: string;
  buttons?: ButtonConfig[];
}

export const AdminHeader: FC<Props> = ({ title = 'Admin Dashboard', buttons = [] }) => {
  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminHeader}>{title}</h1>
      <div className={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <Button key={index} href={button.href}>
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
