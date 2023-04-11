import React, { useEffect, useContext } from 'react';
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
import Button from 'components/atoms/button/Button';
import useTitle from 'hooks/useTitle';
import useModal from 'hooks/useModal';
import ReactMarkdown from 'react-markdown';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';

interface IValidJob {
  jobData: JobItem | undefined;
}

export const ValidJob: React.FC<IValidJob> = ({ jobData }) => {
  return (
    <div>
      {jobData !== undefined ? (
        <ValidJobLayout jobData={jobData} />
      ) : (
        <p> 404 job not found!</p>
      )}
    </div>
  );
};

const ValidJobLayout: React.FC<{ jobData: JobItem }> = ({ jobData }) => {
  useTitle(`${jobData.title}`);
  const isMobile = useMobileScreen();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { role } = useContext(AuthenticateContext);
  const history = useHistory();
  const imgUrl = baseUrl + 'jobs/' + jobData?.id + '/image';

  const { isOpen, onOpen, onClose } = useModal();

  return (
    <div>
      <div className={'pageWrapper'}>
        <div>
          <div className={'content'}>
            <div className={'sidebar'}>
              {!isMobile && (
                <div
                  style={{
                    marginBottom: '2rem',
                  }}>
                  <Icon
                    type="arrow-left"
                    size={2}
                    color=" rgba(240, 150, 103, 0.3)"
                    onClick={() => {
                      // id undefined means in preview mode
                      if (id === undefined) {
                        return;
                      }
                      history.goBack();
                    }}></Icon>
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
                Ansettelsform: <br /> <small>{jobData.type}</small>
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
                  <small>{new Date(jobData?.start_date).toDateString()}</small>
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
              <div>
                Hjemmeside <br />
                <small>
                  <a href={jobData.link} style={{ textDecoration: 'none' }}>
                    <div style={{ color: '#f09667' }}>{jobData.link}</div>
                  </a>
                </small>
              </div>
              <hr />
              <a href={jobData.link} style={{ textDecoration: 'none' }}>
                <div className={'applyButton'}>
                  Søk her!
                  <Icon type={''} size={1.5} color={'#f09667'}></Icon>
                </div>
              </a>
              {role === Roles.admin && (
                <div className={'applyButton'} onClick={onOpen}>
                  Slett
                  <Icon type={'trash'} size={1.2} color={'#f09667'}></Icon>
                </div>
              )}
            </div>
            <div className={'main_content'}>
              <div>
                <h3>{jobData.title}</h3>
                <hr />
              </div>
              <ReactMarkdown children={jobData.description} />
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
            version="primary"
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
    </div>
  );
};

const Job: React.FC = () => {
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
      <ValidJob jobData={data}></ValidJob>;
    </LoadingWrapper>
  );
};

export default Job;
