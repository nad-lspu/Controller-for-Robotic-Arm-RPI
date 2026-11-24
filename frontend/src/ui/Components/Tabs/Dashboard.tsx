
import DashboardHeader from "../DashboardHeader";
import Icons from "../../Utilities/Icons";
import { useCamera } from "../../Context/CameraContext";
import "./Dashboard.css";

const Dashboard = () => {
  const {
    cameraFeedUrl,
    isCameraConnected,
    connectCamera,
  } = useCamera();

  return (
    <main className="dashboard-main-container">
      <DashboardHeader title="Dashboard" deviceState={true} />

      <section className="dashboard-content-section scrollable">
        <h2>Welcome, Juan Dela Cruz!</h2>

        <article className="dashboard-indicator-container">
          <div className="device-indicator-card">
            <section className="device-indicator-title-icon">
              <p>Device Status</p>
              <Icons.DeviceIndicator className="device-indicator-card-icon" />
            </section>

            <h3>ONLINE</h3>
            <button>Disconnect Device</button>
          </div>

          <div className="arm-indicator-container">
            <section className="arm-indicator-title-icon">
              <Icons.ArrowDirection className="arm-indicator-icon" />
              <p>Arm Status</p>
            </section>
          </div>
        </article>

        <article className="camera-content-container">
          <div>
            <section className="camera-content-header"></section>

            <section className="camera-content">
              {isCameraConnected ? (
                cameraFeedUrl ? (
                  <img
                    className="camera-feed"
                    alt="RPi Cam Feed"
                    src={cameraFeedUrl}
                  />
                ) : (
                  <div className="camera-no-feed">
                    <p>Connecting to camera...</p>
                  </div>
                )
              ) : (
                <div className="camera-no-feed">
                  <div className="camera-icon-circle">
                    <Icons.Camera className="camera-icon" />
                  </div>

                  <p>No Camera Feed Available.</p>

                  <button
                    className="camera-connect-btn"
                    onClick={connectCamera}
                  >
                    Connect
                  </button>
                </div>
              )}
            </section>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
