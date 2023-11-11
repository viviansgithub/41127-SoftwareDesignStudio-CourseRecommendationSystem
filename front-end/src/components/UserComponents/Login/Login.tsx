'use client';
import { Button } from '@/components/Button/Button';
import { Modal } from '../Modal/Modal';
import styles from './Login.module.scss';
import React, { FC, useState } from 'react';
import { ProgressBar } from '@/components/progressBar';
import { InputField } from '@/components/InputField/InputField';
import { login } from '@/middleware/api';
import { useRouter } from 'next/navigation';
import ConfettiExplosion from 'react-confetti-explosion';
import Link from 'next/link';

interface FormField {
  label: string;
  type: string;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

interface Props {}

export const Login: FC<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const formFields: FormField[] = [
    { label: 'Email', type: 'text', state: email, setState: setEmail },
    { label: 'Password', type: 'password', state: password, setState: setPassword },
  ];

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);

      if (result) {
        setError(false);
        router.push(`/profile/${result.id}`);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>Course Recommendation System</h1>
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
            {error && (
              <div className={styles.error}>No account found with those credentials, please try signing up.</div>
            )}
            <Button className="input" type="submit">
              Log In
            </Button>
            {loading && <ProgressBar value={'Logging In...'} loading={loading} />}{' '}
          </form>
        </Modal>
      </div>
      <Link href="/sign-up" className={styles.signUp}>
        Sign Up
      </Link>
    </div>
  );
};
