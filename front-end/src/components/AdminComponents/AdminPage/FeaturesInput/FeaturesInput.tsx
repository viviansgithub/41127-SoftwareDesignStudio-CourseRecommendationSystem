import React, { useState, useEffect } from 'react';
import styles from './FeaturesInput.module.scss';
import { Button } from '@/components/Button/Button';
import { BaseTagField } from '../../Interfaces';
import { getInterests } from '@/middleware/api';
import { UUID } from 'crypto';

interface TagInputProps extends BaseTagField {}

export const FeaturesInput: React.FC<TagInputProps> = ({ state, setState }) => {
  const [selectedFeature, setSelectedFeature] = useState('');
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);

  useEffect(() => {
    getInterests().then((data) => {
      const features = data.filter((feature) => !state.includes(feature.name));
      setAvailableFeatures(features.map((feature) => feature.name));
    });
  }, [state]);

  const addFeature = () => {
    if (selectedFeature && !state.includes(selectedFeature)) {
      setState([...state, selectedFeature]);
      setSelectedFeature('');
    }
  };

  const removeFeature = (removeFeature: string) => {
    setState(state.filter((t: string) => t !== removeFeature));
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.inputContainer}>
        <select
          value={selectedFeature}
          onChange={(e) => {
            setSelectedFeature(e.target.value);
          }}
        >
          <option value="" disabled>
            Features List
          </option>
          {availableFeatures.map((feature) => (
            <option key={feature} value={feature} className={styles.dropDown}>
              {feature}
            </option>
          ))}
        </select>
        <Button type="button" onClick={addFeature}>
          Add
        </Button>
      </div>
      <div className={styles.tagContainer}>
        {state.map((t: string, index: number) => (
          <span key={index} className={styles.tag}>
            {t}{' '}
            <button type="button" onClick={() => removeFeature(t)}>
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
