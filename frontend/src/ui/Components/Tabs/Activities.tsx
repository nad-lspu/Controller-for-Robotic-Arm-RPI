import DashboardHeader from "../DashboardHeader";
import ActivityItem from "../ActivityItem";
import "./Activities.css";

const Activities = () => {
  return (
    <main className="activity-main-container">
      <DashboardHeader title="Laboratory Activities" deviceState={true} />
      <section className="activity-content scrollable">
        <ActivityItem number={1} />
        <ActivityItem number={2} locked={true} />
        <ActivityItem number={3} locked={true} />
        <ActivityItem number={4} locked={true} />
        <ActivityItem number={5} locked={true} />
        <ActivityItem number={6} locked={true} />
        <ActivityItem number={7} locked={true} />
        <ActivityItem number={8} locked={true} />
      </section>
    </main>
  );
};

export default Activities;
