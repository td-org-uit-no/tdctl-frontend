import React, { useEffect, useState, useContext } from 'react';
import styles from './jobs.module.scss';

import Icon from 'components/atoms/icons/icon';
import { JobItem } from 'models/apiModels';
import TextField from 'components/atoms/textfield/Textfield';
import { getJobs } from 'api/jobs';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import JobForm from 'components/molecules/forms/jobForm/JobForm';
import JobFilterProvider, {
  FilterContextHook,
} from 'contexts/filterJobProvider';
import JobCard from 'components/molecules/jobCard/JobCard';

interface ChipProps {
  label: string;
  active: boolean;
  onClick?: () => void;
}
const Chip: React.FC<ChipProps> = (props) => {
  const ctxHook = useContext(FilterContextHook);
  const [active, setActive] = useState(props.active);

  useEffect(() => {
    setActive(!active);
  }, [props.active]);
  return (
    <div
      className={styles.chip}
      onClick={() => {
        active
          ? ctxHook?.setContext({
              ...ctxHook?.context,
              tags: [...ctxHook?.context.tags, props.label],
            })
          : ctxHook?.setContext({
              ...ctxHook?.context,
              tags: ctxHook?.context.tags.filter((tag) => tag !== props.label),
            });
        setActive(!active);
      }}
      style={{
        backgroundColor: active ? 'rgba(240, 150, 103, 0.3)' : '#f09667',
      }}>
      <span>{props.label}</span>
    </div>
  );
};

const FilterJobs: React.FC = () => {
  const [forBedrifter, setForBedrifter] = useState(false);
  const parseTags = (data: JobItem[]) => {
    const tags: string[] = [];
    data?.forEach((job) => {
      job.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    return tags.sort();
  };
  const ctxHook = useContext(FilterContextHook);
  const [uniqueTags, setUniqueTags] = useState<string[]>(
    parseTags(ctxHook.context.allJobs)
  );
  const [hoverSort, setHoverSort] = useState(false);
  useEffect(() => {
    setUniqueTags(parseTags(ctxHook.context.allJobs));
  }, [ctxHook?.context, ctxHook.context.allJobs]);

  return (
    <div className={styles.filterWrapper}>
      <TextField
        label={'Search'}
        type={'Search'}
        onChange={(e) => {
          ctxHook?.setContext({
            ...ctxHook?.context,
            search_string: e.target.value,
          });
        }}></TextField>
      <div
        className={styles.filterSortWrapper}
        onMouseEnter={() => {
          setHoverSort(true);
        }}
        onMouseLeave={() => {
          setHoverSort(false);
        }}
        onClick={(e) => {
          ctxHook?.setContext({
            ...ctxHook.context,
            sort_date: !ctxHook.context.sort_date,
          });
        }}>
        <small>Sort by date</small>
        <Icon
          color={hoverSort ? '#f09667' : '#444658'}
          type={
            ctxHook?.context.sort_date
              ? 'sort-amount-up-alt'
              : 'sort-amount-down-alt'
          }></Icon>
      </div>
      <hr />
      <div className={styles.filterTagWrapper}>
        {uniqueTags.map((tag, key) => {
          return (
            <div key={key}>
              <Chip label={tag} active={false} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', marginTop: '2rem' }}>
        <div
          className={styles.companyButton}
          onClick={() => {
            setForBedrifter(!forBedrifter);
          }}>
          For bedrifter!
        </div>
      </div>
      {forBedrifter && (
        <div className={styles.fade_in}>
          <p
            style={{
              fontSize: '0.8rem',
            }}>
            Har din organisasjon -eller bedrift lyst til å dele ledige
            stillinger, sommerjobber eller liknende hos oss i Tromsøstudentenes
            Dataforening? Send en epost til
            <a
              href="mailto:bedriftskommunikasjon@td-uit.no"
              style={{
                textDecoration: 'None',
                color: 'rgba(240, 150, 103, 0.5)',
              }}>
              {' '}
              bedriftskommunikasjon@td-uit.no{' '}
            </a>
            for å få mer informasjon om dette!
          </p>
        </div>
      )}
    </div>
  );
};
const _Jobs: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const { role } = useContext(AuthenticateContext);
  const { context, setContext } = useContext(FilterContextHook);

  useEffect(() => {
    const fetchJobs = async () => {
      const _jobs: JobItem[] = await getJobs();

      setContext({ ...context, allJobs: _jobs, sortedJobs: _jobs });
    };
    fetchJobs();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.jobsHeader}>
        <h4 style={{ padding: 0, margin: 0 }}>Stillingsutlysninger</h4>
        {role === Roles.admin && (
          <Icon
            type={formOpen ? 'minus' : 'plus'}
            size={2}
            color={'rgba(240, 150, 103, 0.3)'}
            onClick={() => setFormOpen(!formOpen)}></Icon>
        )}
      </div>

      <div className={styles.content}>
        <FilterJobs />

        <div className={styles.mainContent}>
          {formOpen ? <JobForm></JobForm> : null}
          {context.allJobs?.length === 0 && <h5>Ingen utlysninger</h5>}
          {context.sortedJobs?.map((job, key) => {
            return <JobCard {...job} key={key} />;
          })}
        </div>
      </div>
    </div>
  );
};

const Jobs: React.FC = () => {
  return (
    <JobFilterProvider>
      <_Jobs />
    </JobFilterProvider>
  );
};

export default Jobs;
