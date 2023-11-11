'use client';
import { UUID } from 'crypto';
import { InterestsInput } from './InterestsInput/InterestsInput';
import React, { useState } from 'react';

interface InterestsProps {
  user_id: string;
  interests: string[];
  setInterests: (newInterests: string[]) => void;
}

const Interests: React.FC<InterestsProps> = ({ user_id, interests, setInterests }) => {
  return (
    <>
      <h2>Interests</h2>
      <InterestsInput
        label="Add interests"
        componentType="tags"
        state={interests}
        setState={setInterests}
        user_id={user_id}
      />
    </>
  );
};

export default Interests;
