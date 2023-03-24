import React, { useState, useEffect, useContext } from 'react';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import TextField from 'components/atoms/textfield/Textfield';
import { JoinEventPayload } from 'models/apiModels';
import styles from './EventPreferences.module.scss';

export interface EventPreferencesProps {
  preferences: JoinEventPayload;
  isfood: boolean | undefined;
  istransportation: boolean | undefined;
  changePrefs: (prefs: JoinEventPayload) => void;
}

const EventPreferences: React.FC<EventPreferencesProps> = ({
  preferences,
  isfood,
  istransportation,
  changePrefs,
}) => {
  const [prefs, setPrefs] = useState<JoinEventPayload>(preferences);
  const [showAllergies, setShowAllergies] = useState<boolean>(
    prefs.dietaryRestrictions ? true : false
  );

  /* Send prefs change back to parent */
  useEffect(() => {
    changePrefs(prefs);
  }, [prefs]);

  return (
    <div className={styles.formToggles}>
      {isfood && (
        <>
          <ToggleButton
            label={'Vil du ha mat på arrangementet?'}
            initValue={prefs.food}
            onChange={() => {
              setPrefs({
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
                setPrefs({
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
                    setPrefs({
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
            setPrefs({
              ...prefs,
              transportation: !prefs.transportation,
            });
          }}
        />
      )}
    </div>
  );
};

export default EventPreferences;
