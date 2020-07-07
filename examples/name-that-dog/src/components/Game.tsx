import React from 'react'

import { Button, Flex, Box, Text } from 'rebass'
import { Checkbox, Label } from '@rebass/forms'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { BreedForm } from './BreedForm'
import { RandomForm } from './RandomForm'
import { DogImage } from './DogImage'
import { BreedIndex } from './BreedIndex'
import { UpdateSection } from './UpdateSection'

import { useGameLogic } from '../hooks/useGameLogic'

import './Game.scss'

export const Game: React.FC = () => {
  const {
    terms,
    lists,
    breedsCollection,
    randomMode,
    selectionMode,
    selection,
    searches,
    createOnImageClick,
    selectBreed,
    addSearch,
    randomize,
    reset,
  } = useGameLogic()

  const images: React.ReactNode[] = []

  for (const id of Object.keys(searches).reverse()) {
    images.push(
      <CSSTransition key={id} timeout={500} classNames="dog">
        <DogImage
          id={id}
          key={id}
          terms={searches[id]}
          onClick={createOnImageClick(id, searches[id])}
          fadeOut={selectionMode.value && selection.dog?.id !== id}
        />
      </CSSTransition>
    )
  }

  return (
    <UpdateSection updates={[breedsCollection]}>
      <Flex>
        {randomMode.value ? (
          <RandomForm randomize={randomize} addSearch={addSearch} />
        ) : (
          <BreedForm terms={terms} lists={lists} addSearch={addSearch} />
        )}
        <Box mr={10}>
          <Button onClick={reset}>Reset</Button>
        </Box>
        <Flex alignItems="center">
          <Label>
            <Checkbox checked={randomMode.value} onChange={randomMode.toggle} />
            <Flex alignItems="center">
              <Text fontFamily="sans-serif">Random Mode</Text>
            </Flex>
          </Label>
        </Flex>
      </Flex>
      <BreedIndex
        searches={searches}
        selectionMode={selectionMode}
        onSelect={selectBreed}
      />
      <Flex flexWrap="wrap">
        <TransitionGroup component={null}>{images}</TransitionGroup>
      </Flex>
    </UpdateSection>
  )
}
