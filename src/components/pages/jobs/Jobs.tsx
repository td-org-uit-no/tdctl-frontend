import React, { useEffect, useState, useContext } from 'react';
import styles from './jobs.module.scss';
import Icon from 'components/atoms/icons/icon';
import { JobItem } from 'models/apiModels';
import TextField from 'components/atoms/textfield/Textfield';
import { getJobs } from 'api/jobs';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import JobFilterProvider, {
  FilterContextHook,
} from 'contexts/filterJobProvider';
import JobCard from 'components/molecules/jobCard/JobCard';
import useTitle from 'hooks/useTitle';
import Footer from 'components/molecules/footer/Footer';
import { useHistory } from 'react-router-dom';
import {
  Box,
  HStack,
  Heading,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';

interface ChipProps {
  label: string;
  active: boolean;
  onClick?: () => void;
}
const Chip: React.FC<ChipProps> = (props) => {
  const ctxHook = useContext(FilterContextHook);
  const [active, setActive] = useState<boolean>(props.active);

  const filterBasedOnTag = (active: boolean) => {
    active
      ? ctxHook?.setContext({
          ...ctxHook?.context,
          tags: ctxHook?.context.tags.filter((tag) => tag !== props.label),
        })
      : ctxHook?.setContext({
          ...ctxHook?.context,
          tags: [...ctxHook?.context.tags, props.label],
        });
    setActive(!active);
  };

  return (
    <div
      className={styles.chip}
      onClick={() => filterBasedOnTag(active)}
      style={{
        backgroundColor: active ? '#f09667' : 'rgba(240, 150, 103, 0.3)',
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
        onClick={() => {
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
            Dataforening? Send en e-post til
            <a
              href="mailto:bedriftskommunikasjon@td-uit.no"
              style={{
                textDecoration: 'None',
                color: 'rgba(240, 150, 103, 0.5)',
              }}>
              {' '}
              bedriftskommunikasjon@td-uit.no{' '}
            </a>
            for å få mer informasjon!
          </p>
        </div>
      )}
    </div>
  );
};

export interface JobsProps {
  isArchive?: boolean;
}

const JobList: React.FC<JobsProps> = ({ isArchive = false }) => {
  const { role } = useContext(AuthenticateContext);
  const { context, setContext } = useContext(FilterContextHook);
  const history = useHistory();

  const goToCreate = () => {
    history.push('/create-job');
  };

  const toggleArchive = () => {
    isArchive ? history.push('/jobs') : history.push('/jobs/archive');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const _jobs = await getJobs();
        const filteredJobs = _jobs.filter((job) => {
          if (job.due_date) {
            const today = new Date();
            const jobDate = new Date(job.due_date);
            return isArchive ? jobDate < today : jobDate >= today;
          }
          return true;
        });
        setContext({
          ...context,
          allJobs: filteredJobs,
          sortedJobs: filteredJobs,
          sort_date: true,
        });
      } catch (error) {
        // no need to display error as the array will be empty and the component displays "no job listings" message
        return;
      }
    };
    fetchJobs();
  }, [isArchive]);

  return (
    <VStack>
      <VStack width={{ base: '90vw', lg: '80vw' }} maxW={1500}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          mt={{ base: '1rem', lg: '5rem' }}
          mb={{ base: '.5rem', lg: '2rem' }}
          align={{ base: 'center', lg: 'end' }}
          width={'100%'}
          justify={'space-between'}>
          <HStack>
            <Heading size={'xl'} padding={0} margin={0}>
              Stillingsutlysninger
            </Heading>
            {role === Roles.admin && (
              <Icon
                type={'plus'}
                size={2}
                color={'rgba(240, 150, 103, 0.3)'}
                onClick={goToCreate}></Icon>
            )}
          </HStack>
          <Box color={'slate.500'}>
            <ToggleButton
              label="Arkiv"
              onChange={toggleArchive}
              initValue={isArchive}
            />
          </Box>
        </Stack>

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          width={'100%'}
          align={'start'}
          gap={{ base: '1rem', xl: '5rem' }}>
          <Box width={{ base: '100%', lg: '420px' }}>
            <FilterJobs />
          </Box>

          <Box flexGrow={1} width={{ base: '100%', lg: 'auto' }}>
            <VStack width={'100%'}>
              {context.allJobs?.length === 0 && (
                <Box width={'100%'} textAlign={'left'}>
                  <Heading size={'lg'}>Ingen stillingsutlysninger</Heading>
                  <Text fontSize={'.75rem'}>
                    <Link href="mailto:bedriftskommunikasjon@td-uit.no">
                      Ta kontakt
                    </Link>{' '}
                    for informasjon om hvordan du kan legge ut en annonse
                  </Text>
                </Box>
              )}
              {context.sortedJobs?.map((job, key) => {
                return <JobCard {...job} key={key} />;
              })}
            </VStack>
          </Box>
        </Stack>
      </VStack>
      <Footer />
    </VStack>
  );
};

const Jobs: React.FC<JobsProps> = ({ isArchive }) => {
  useTitle('Stillingsutlysninger');
  return (
    <JobFilterProvider>
      <JobList isArchive={isArchive} />
    </JobFilterProvider>
  );
};

export default Jobs;
