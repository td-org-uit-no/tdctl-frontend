import React from 'react';
import { baseUrl } from 'constants/apiConstants';
import styles from './jobCard.module.scss';
import Icon from 'components/atoms/icons/icon';
import { JobItem } from 'models/apiModels';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const JobCard: React.FC<JobItem> = (job) => {
  const imgUrl = baseUrl + 'jobs/' + job.id + '/image';

  return (
    <div className={styles.job_card}>
      <div className={styles.publish_date}>
        {new Date(job.published_date).toDateString()}
      </div>
      <div>
        <div className={styles.card_headerContent}>
          <div className={styles.card_header_line}>
            <div className={styles.imgWrapper}>
              <img
                className={styles.card_img}
                src={imgUrl}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = 'https://img.logoipsum.com/295.svg';
                }}
              />
            </div>
          </div>
          <div className={styles.titleTextWrapper}>
            <div className={styles.card_title}>
              {job.title}
              <div className={styles.card_header_line}>@{job.company}</div>
            </div>
            <div className={styles.jobInfo}>
              <div className={styles.dateWrapper}>
                <Icon type={'clock'} size={1} color="$primary" />
                <small>
                  {job.due_date
                    ? new Date(job?.due_date).toDateString()
                    : 'Fortløpende'}
                </small>
              </div>
              <small>{job.type}</small>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ReactMarkdown children={job.description_preview} />
      </div>
      <div className={styles.card_headerContent}>
        <div className={styles.tags_container}>
          {job.tags.map((tag, key) => {
            return (
              <div className={styles.tags} key={key}>
                {tag}
              </div>
            );
          })}
        </div>
        <Link to={'/jobs/' + job.id} style={{ textDecoration: 'none' }}>
          <div className={styles.icon} id="icon">
            Les mer
            <Icon type={'arrow-right'} size={1} color="#f09667" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
