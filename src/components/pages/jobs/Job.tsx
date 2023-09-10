import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import './job.scss';
import { JobItem } from 'models/apiModels';
import Icon from 'components/atoms/icons/icon';
import { getJob, deleteJob } from 'api/jobs';
import { baseUrl } from 'constants/apiConstants';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import Modal from 'components/molecules/modal/Modal';
import { useMobileScreen } from 'hooks/useMobileScreen';
import { useHistory } from 'react-router-dom';
import { useToast } from 'hooks/useToast';
import { Button, Center, Heading, Link, VStack } from '@chakra-ui/react';
import useTitle from 'hooks/useTitle';
import useModal from 'hooks/useModal';
import ReactMarkdown from 'react-markdown';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import Footer from 'components/molecules/footer/Footer';
import JobForm from 'components/molecules/forms/jobForm/JobForm';

interface IValidJob {
  jobData: JobItem | undefined;
  isPreview?: boolean;
}

export const ValidJob: React.FC<IValidJob> = ({ jobData, isPreview }) => {
  return (
    <div>
      {jobData !== undefined ? (
        <ValidJobLayout jobData={jobData} isPreview={isPreview} />
      ) : (
        <p> 404 job not found!</p>
      )}
      <Footer />
    </div>
  );
};

interface IValidJobLayout {
  jobData: JobItem;
  isPreview?: boolean;
}

const ValidJobLayout: React.FC<IValidJobLayout> = ({ jobData, isPreview }) => {
  useTitle(`${jobData.title}`);
  const isMobile = useMobileScreen();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { role } = useContext(AuthenticateContext);
  const history = useHistory();
  const imgUrl = baseUrl + 'jobs/' + jobData?.id + '/image';
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useModal();

  return (
    <div>
      {isEditing ? (
        <Center mt="2rem">
          <VStack>
            <Heading>Rediger Stillingsutlysning</Heading>
            <JobForm job={jobData} />
          </VStack>
        </Center>
      ) : (
        <>
          <div className={'pageWrapper'}>
            <div>
              <div className={'content'}>
                <div className={'sidebar'}>
                  {!isMobile && (
                    <div
                      style={{
                        marginBottom: '2rem',
                      }}>
                      {!isPreview && (
                        <Icon
                          type="arrow-left"
                          size={2}
                          color=" rgba(240, 150, 103, 0.3)"
                          onClick={() => {
                            history.goBack();
                          }}></Icon>
                      )}
                    </div>
                  )}
                  <div className={'logoWrapper'}>
                    <img
                      src={imgUrl}
                      alt=""
                      className={'logo'}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = 'https://img.logoipsum.com/295.svg';
                      }}
                    />
                  </div>
                  <hr />
                  <div>
                    Ansettelsesform: <br /> <small>{jobData.type}</small>
                  </div>
                  <hr />
                  <div>
                    Firma: <br /> <small>{jobData.company}</small>
                  </div>
                  <hr />
                  <div>
                    Sted: <br /> <small>{jobData.location}</small>
                  </div>
                  <hr />
                  {jobData?.start_date != null && (
                    <div>
                      Start dato
                      <br />
                      <small>
                        {new Date(jobData?.start_date).toDateString()}
                      </small>
                      <hr />
                    </div>
                  )}
                  <div>
                    Søknadsfrist <br />
                    <small>
                      {jobData.due_date != null
                        ? new Date(jobData.due_date).toDateString()
                        : 'Fortløpende'}
                    </small>
                  </div>
                  <hr />
                  <Button
                    as={Link}
                    href={jobData.link}
                    isExternal
                    mt="2rem"
                    color="white"
                    textDecoration="none">
                    Søk her!
                  </Button>
                  {role === Roles.admin && !isPreview && (
                    <>
                      <Button onClick={onOpen} mt="3rem" variant="secondary">
                        Slett
                      </Button>
                      <Button
                        onClick={() => setIsEditing(true)}
                        mt="1rem"
                        variant="secondary">
                        Rediger
                      </Button>
                    </>
                  )}
                </div>
                <div className={'main_content'}>
                  <div>
                    <h3>{jobData.title}</h3>
                    <hr />
                  </div>
                  <ReactMarkdown
                    children={jobData.description}
                    className="markdown"
                  />
                  <div className={'tags_container'}>
                    {jobData?.tags?.map((tag, key) => (
                      <div className={'tags'} key={key}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            title={'Delete ' + String(jobData?.title)}
            isOpen={isOpen}
            onClose={onClose}>
            <div className={'deleteModal'}>
              <h5>Er du sikker på at du vil slette utlysningen?</h5>
              <Button
                variant="primary"
                onClick={() => {
                  deleteJob(id);
                  history.goBack();
                  addToast({
                    title: 'Job: ' + jobData?.id + ' deleted',
                    status: 'success',
                  });
                }}>
                Slett
              </Button>

              <p onClick={onClose} style={{ cursor: 'pointer' }}>
                Tilbake
              </p>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

const Job = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = React.useState<JobItem | undefined>(undefined);

  useEffect(() => {
    const getData = async (id: string) => {
      try {
        const res: JobItem = await getJob(id);
        setData(res);
      } catch (error) {
        setData(undefined);
      }
    };
    getData(id);
  }, [id]);

  return (
    <LoadingWrapper data={data} startAfter={250}>
      <ValidJob jobData={data}></ValidJob>
    </LoadingWrapper>
  );
};

export default Job;
