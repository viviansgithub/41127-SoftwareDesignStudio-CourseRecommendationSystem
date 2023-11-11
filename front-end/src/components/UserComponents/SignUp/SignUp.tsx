'use client';
import { Button } from '@/components/Button/Button';
import { Modal } from '../Modal/Modal';
import styles from './SignUp.module.scss';
import React, { FC, useState } from 'react';
import { ProgressBar } from '@/components/progressBar';
import { InputField } from '@/components/InputField/InputField';
import { signUp } from '@/middleware/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormField {
  label: string;
  type: string;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

interface Props {}

export const SignUp: FC<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const formFields: FormField[] = [
    { label: 'Email', type: 'text', state: email, setState: setEmail },
    { label: 'Password', type: 'password', state: password, setState: setPassword },
  ];

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signUp(email, password);
    try {
      setLoading(true);

      if (result) {
        router.push(`/profile/${result.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>Sign Up</h1>
      <div className={styles.card}>
        <Modal>
          <form action="/profile" className={styles.form} onSubmit={handleSubmit}>
            {formFields.map((field, index) => (
              <InputField
                key={index}
                label={field.label}
                type={field.type}
                state={field.state}
                componentType="input"
                setState={field.setState}
              />
            ))}
            <Button className="input" type="submit">
              Sign
            </Button>
            {loading && <ProgressBar value={'Signing Up...'} loading={loading} />}{' '}
          </form>
        </Modal>
      </div>
      <Link href="/" className={styles.signUp}>
        Back to Log In
      </Link>
    </div>
  );
};
