import React, { useState } from 'react';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import TextField from 'components/atoms/textfield/Textfield';
import { JoinEventPayload, MoviePollOption } from 'models/apiModels';
import styles from './EventPreferences.module.scss';

export interface EventPreferencesProps {
  prefs: JoinEventPayload;
  isfood: boolean | undefined;
  istransportation: boolean | undefined;
  changePrefs: (prefs: JoinEventPayload) => void;
  movieOptions?: MoviePollOption[];
}

const EventPreferences: React.FC<EventPreferencesProps> = ({
  prefs,
  isfood,
  istransportation,
  changePrefs,
  movieOptions,
}) => {
  const [showAllergies, setShowAllergies] = useState<boolean>(
    prefs.dietaryRestrictions ? true : false
  );

  const toggleMovieVote = (id: string) => {
    const current = prefs.movieVotes ?? [];
    const updated = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    changePrefs({ ...prefs, movieVotes: updated });
  };

  return (
    <div className={styles.formToggles}>
      {isfood && (
        <>
          <ToggleButton
            label={'Vil du ha mat på arrangementet?'}
            initValue={prefs.food}
            onChange={() => {
              changePrefs({
                ...prefs,
                food: !prefs.food,
              });
            }}
          />
          <ToggleButton
            label={'Har du en allergi/matpreferanse?'}
            initValue={showAllergies}
            onChange={() => {
              if (showAllergies) {
                changePrefs({
                  ...prefs,
                  dietaryRestrictions: '',
                });
                setShowAllergies(false);
              } else {
                setShowAllergies(true);
              }
            }}
          />
          {showAllergies && (
            <div className={styles.allergyTextFieldContainer}>
              <div className={styles.allergyTextFieldAnim}>
                <TextField
                  label={'Allergier, vegetar, vegansk...'}
                  onChange={(e) => {
                    changePrefs({
                      ...prefs,
                      dietaryRestrictions: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
      {istransportation && (
        <ToggleButton
          label={'Har du behov for transport?'}
          initValue={prefs.transportation}
          onChange={() => {
            changePrefs({
              ...prefs,
              transportation: !prefs.transportation,
            });
          }}
        />
      )}
      {movieOptions && movieOptions.length > 0 && (
        <div className={styles.moviePoll}>
          <p className={styles.moviePollTitle}>Hvilke filmer vil du se?</p>
          {movieOptions.map((option) => (
            <ToggleButton
              key={option.id}
              label={option.title}
              initValue={prefs.movieVotes?.includes(option.id) ?? false}
              onChange={() => toggleMovieVote(option.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventPreferences;
