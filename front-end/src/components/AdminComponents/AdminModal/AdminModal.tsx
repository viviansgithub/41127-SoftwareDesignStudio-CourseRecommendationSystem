import React, { useState } from 'react';
import styles from './AdminModal.module.scss';
import { Button } from '@/components/Button/Button';
import { InputField } from '@/components/InputField/InputField';
import { FormField } from '../Interfaces';
import { UUID } from 'crypto';
import { FeaturesInput } from '../AdminPage/FeaturesInput/FeaturesInput';

interface AdminModalProps {
  formFields: FormField[];
  initialFormData?: any;
  onSubmit: (formData: any) => Promise<void>;
  title: string;
  onClose: () => void;
  course_id?: any;
  onDelete?: () => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  formFields,
  onSubmit,
  title,
  onClose,
  onDelete,
  initialFormData,
}) => {
  const defaultFormData = formFields.reduce<{ [key: string]: any }>((acc, field) => {
    acc[field.label] = '';
    return acc;
  }, {});

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
      onClose();
    }
  };

  const [formData, setFormData] = useState<any>(initialFormData || defaultFormData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.topBar}>
          <Button type="button" className={styles.backButton} onClick={onClose}>
            ← Back
          </Button>
          <Button type="button" className={styles.backButton} onClick={handleDelete}>
            Delete
          </Button>
        </div>
        <h1 className={styles.modalHeader}>{title}</h1>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {formFields.map((field, index) =>
            field.componentType === 'tags' ? (
              <FeaturesInput key={index} {...field} />
            ) : (
              <InputField key={index} {...field} />
            ),
          )}
          <Button type="submit" className={styles.submitButton}>
            {title}
          </Button>
        </form>
      </div>
    </div>
  );
};
