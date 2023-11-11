import { FC } from 'react';
import { Button } from '../../Button/Button';
import styles from './UserHeader.module.scss';

interface ButtonConfig {
  href: string;
  label: string;
}

interface Props {
  title?: string;
  buttons?: ButtonConfig[];
}

export const UserHeader: FC<Props> = ({ title = 'User Dashboard', buttons = [] }) => {
  return (
    <div className={styles.userContainer}>
      <h1 className={styles.userHeader}>{title}</h1>
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
