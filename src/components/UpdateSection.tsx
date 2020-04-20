import React from 'react';
import { Update } from '../logic/Update';
import { Spinner } from './Spinner';

export const UpdateSection: React.FC<{ updates: Readonly<Update>[] }> = ({
  updates,
  children,
}) => {
  const { errors, updating } = updates.reduce(
    (acc, update) => {
      return {
        errors: update.error ? [...acc.errors, update.error] : acc.errors,
        updating: acc.updating || update.updating,
      };
    },
    {
      errors: [] as Error[],
      updating: false,
    }
  );

  return (
    <>
      <ul>
        {errors.map((err, i) => (
          <li key={i}>{err.message}</li>
        ))}
      </ul>
      {children}
      {updating ? <Spinner /> : null}
    </>
  );
};
