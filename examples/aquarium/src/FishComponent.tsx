import React, { useContext, createContext } from 'react';
import { useInstance, useObject, useBehavior } from '@objects/hooks';
import classNames from 'classNames';

import { Fish } from './Fish';
import { School } from './types';

import { swimming, flipping, avoiding, following } from './Fish.behaviors';

import './index.scss';

type Parent = {
  fish: Fish;
  school: School;
};

const ParentContext = createContext<Parent | null>(null);

export const FishComponent: React.FC<{
  id: string;
  speed: number;
}> = ({ children, speed, id }) => {
  const parent = useContext(ParentContext);
  const [fish] = useInstance(Fish, speed);
  const [school] = useObject({
    size: 0,
  });

  useBehavior(swimming, fish);
  useBehavior(flipping, fish);
  useBehavior(avoiding, fish);
  useBehavior(following, fish, parent?.fish, parent?.school);

  let schoolFish = [];

  for (let i = 0; i < school.size; i++) {
    schoolFish.push(
      <FishComponent key={i} id={`${id}-${i}`} speed={fish.speed}>
        {children}
      </FishComponent>
    );
  }

  const { x, y, z } = fish.position;

  return (
    <>
      <button
        id={id}
        className="fish"
        style={{
          top: y,
          left: x,
          transform: `translateZ(${-z}px)`,
          zIndex: Math.floor(2000 - z),
        }}
        onClick={() => school.size++}
      >
        <span
          aria-label="fish"
          className={classNames({
            swim: fish.target,
            flipped: fish.flipped,
          })}
          style={{
            filter: `blur(${Math.log(z / 50)}px)`,
          }}
          role="image"
        >
          {children}
        </span>
      </button>
      <ParentContext.Provider value={{ fish, school }}>
        {schoolFish}
      </ParentContext.Provider>
    </>
  );
};
