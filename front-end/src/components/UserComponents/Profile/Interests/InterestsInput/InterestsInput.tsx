import React, { useState, useEffect } from 'react';
import styles from './InterestsInput.module.scss';
import { Button } from '@/components/Button/Button';
import { BaseTagField } from '../../../../AdminComponents/Interfaces';
import { getInterests, addInterest, removeInterest } from '@/middleware/api';
import { UUID } from 'crypto';

interface TagInputProps extends BaseTagField {
  user_id: string;
}

export const InterestsInput: React.FC<TagInputProps> = ({ state, setState, user_id }) => {
  const [selectedInterest, setSelectedInterest] = useState('');
  const [availableInterests, setAvailableInterests] = useState<string[]>([]);

  useEffect(() => {
    getInterests().then((data) => {
      const interests = data.filter((interest) => !state.includes(interest.name));
      setAvailableInterests(interests.map((interest) => interest.name));
    });
  }, [state]);

  const handleAddInterest = async (interest: string) => {
    try {
      await addInterest(user_id as UUID, interest);
    } catch (error) {
      console.error('Failed to update interests:', error);
    }
  };

  const handleRemoveInterest = async (interest: string) => {
    try {
      await removeInterest(user_id as UUID, interest);
    } catch (error) {
      console.error('Failed to update interests:', error);
    }
  };

  const addTag = () => {
    if (selectedInterest && !state.includes(selectedInterest)) {
      setState([...state, selectedInterest]);
      setSelectedInterest('');
      handleAddInterest(selectedInterest);
    }
  };

  const removeTag = (removeTag: string) => {
    setState(state.filter((t: string) => t !== removeTag));
    handleRemoveInterest(removeTag);
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.inputContainer}>
        <select
          value={selectedInterest}
          onChange={(e) => {
            setSelectedInterest(e.target.value);
          }}
        >
          <option value="" disabled>
            Add Interests
          </option>
          {availableInterests.map((interest) => (
            <option key={interest} value={interest} className={styles.dropDown}>
              {interest}
            </option>
          ))}
        </select>
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>
      <div className={styles.tagContainer}>
        {state.map((t: string, index: number) => (
          <span key={index} className={styles.tag}>
            {t}{' '}
            <button type="button" onClick={() => removeTag(t)}>
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
