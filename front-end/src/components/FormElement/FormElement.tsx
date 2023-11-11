import { FC, ReactNode } from 'react';
import styles from './FormElement.module.scss';

interface Props {
  name: string;
  type: string;
  text: string;
}

export const FormElement: FC<Props> = ({ name, type, text }) => {
  return (
    <div className={styles.formElement}>
      <label className={styles.label} form={name}>
        {`${text}:`}
      </label>
      <input className={styles.input} type={type} name={name} />
    </div>
  );
};
