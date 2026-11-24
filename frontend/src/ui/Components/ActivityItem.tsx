import './ActivityItem.css'
import Icons from '../Utilities/Icons';
import clsx from 'clsx';

interface ActivityItemProps {
    number: number;
    locked?: boolean | undefined;
}

const ActivityItem = ({ number, locked }: ActivityItemProps) => {
  return (
    <article className={clsx('activity-item-container', !locked && 'hoverable')}>
        <section className='activity-item-title-icon'>
            <div>{number}</div>
            <h2>Introduction to Robotic Arm and Manual Control</h2>
        </section>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo sunt, vitae accusantium saepe a, sequi facilis eum commodi libero ea reprehenderit voluptates dicta voluptatem? Eveniet neque id similique! A, nesciunt? Cumque ducimus fuga ea sit iste.</p>
        {locked && <section className='locked-activity-container'>
            <div className='locked-activity-content'>
                <Icons.Locked />
                <p>This Laboratory Activity is not yet accessible</p>
            </div>
        </section>}
    </article>
  )
}

export default ActivityItem