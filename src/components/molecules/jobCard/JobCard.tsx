import React, { useEffect, useState, useContext } from 'react';
import { baseUrl } from 'constants/apiConstants';
import styles from './jobCard.module.scss';
import Icon from 'components/atoms/icons/icon';
import { JobItem } from 'models/apiModels';
import TextField from 'components/atoms/textfield/Textfield';
import { getJobs } from 'api/jobs';
import { Link } from 'react-router-dom';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import JobForm from 'components/molecules/forms/jobForm/JobForm';
import JobFilterProvider, {
  FilterContextHook,
} from 'contexts/filterJobProvider';

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
            <div className={styles.card_title}>
              {job.title}
              <div className={styles.card_header_line}>@{job.company}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <Icon type={'clock'} size={1} color="$primary" />
              <small>{new Date(job.due_date).toDateString()}</small>
            </div>
            <small>{job.type}</small>
          </div>
        </div>
      </div>
      <div>
        <p className={styles.card_header_line}>{job.description_preview}</p>
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
