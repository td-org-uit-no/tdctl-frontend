import { MoviePollOption } from 'models/apiModels';
import { Button } from '@chakra-ui/react';
import TextField from 'components/atoms/textfield/Textfield';

interface Props {
  options: MoviePollOption[];
  onChange: (options: MoviePollOption[]) => void;
}

const newId = () =>
  `new-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const validateMovieOptions = (
  options: MoviePollOption[]
): string | undefined => {
  if (options.length === 0) return 'Legg til minst én film';
  const titles = options.map((o) => o.title.trim().toLowerCase());
  if (titles.some((t) => t === '')) return 'Alle filmer må ha en tittel';
  if (new Set(titles).size !== titles.length)
    return 'Samme film er lagt inn flere ganger';
  return undefined;
};

const MoviePollEditor: React.FC<Props> = ({ options, onChange }) => {
  const addOption = () => onChange([...options, { id: newId(), title: '' }]);

  const updateTitle = (id: string, title: string) =>
    onChange(options.map((o) => (o.id === id ? { ...o, title } : o)));

  const removeOption = (id: string) =>
    onChange(options.filter((o) => o.id !== id));

  return (
    <div>
      {options.map((option, idx) => (
        <div
          key={option.id}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <TextField
            label={`Film ${idx + 1}`}
            value={option.title}
            onChange={(e) => updateTitle(option.id, e.target.value)}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeOption(option.id)}>
            Fjern
          </Button>
        </div>
      ))}
      <Button size="sm" variant="secondary" onClick={addOption}>
        + Legg til film
      </Button>
    </div>
  );
};

export default MoviePollEditor;
