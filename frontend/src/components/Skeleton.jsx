import "./Skeleton.css";

function SkeletonLine({ width = "100%", style }) {
  return <div className="skel-line shimmer" style={{ width, ...style }} />;
}

function SkeletonCircle({ size }) {
  return (
    <div
      className="skel-circle shimmer"
      style={{ width: size, height: size }}
    />
  );
}

function SkeletonRect({ width, height, borderRadius = "0.5rem" }) {
  return (
    <div
      className="shimmer"
      style={{ width, height, borderRadius, flexShrink: 0 }}
    />
  );
}

function SkeletonPostCard({ delay = 0 }) {
  return (
    <div className="skel-post-card" style={{ "--delay": `${delay}s`}}>
      <SkeletonCircle size="36px" />
      <div className="skel-post-body">
        <SkeletonLine width="90px" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="75%" />
        <div className="skel-post-actions">
          <SkeletonLine width="36px" />
          <SkeletonLine width="36px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFeed() {
  return (
    <>
      <div className="skel-trigger">
        <div className="skel-trigger-left">
          <SkeletonCircle size="36px" />
          <SkeletonLine width="120px" />
        </div>
        <SkeletonRect width="56px" height="32px" borderRadius="0.625rem" />
      </div>
      {[0, 0.1, 0.2, 0.3].map((delay, i) => (
        <SkeletonPostCard key={i} delay={delay} />
      ))}
    </>
  );
}

export function SkeletonProfile() {
  return (
    <>
      <div className="skel-profile-header">
        <div className="skel-profile-top">
          <div className="skel-profile-names">
            <SkeletonLine width="140px" style={{ height: 14 }} />
            <SkeletonLine width="90px" />
          </div>
          <SkeletonCircle size="84px" />
        </div>
        <SkeletonLine width="80%" />
        <SkeletonRect width="100%" height="36px" borderRadius="0.5rem" />
      </div>
      {[0, 0.1, 0.2].map((delay, i) => (
        <SkeletonPostCard key={i} delay={delay} />
      ))}
    </>
  );
}

export function SkeletonPost() {
  return (
    <>
      <SkeletonPostCard />
      <div className="skel-reply-form">
        <SkeletonCircle size="20px" />
        <SkeletonLine width="60%" />
      </div>
    </>
  );
}

function SkeletonUserCard({ delay = 0 }) {
  return (
    <div className="skel-user-card" style={{ "--delay": `${delay}s` }}>
      <div className="skel-user-info">
        <SkeletonCircle size="48px" />
        <div className="skel-user-details">
          <SkeletonLine width="100px" />
          <SkeletonLine width="70px" />
        </div>
      </div>
      <SkeletonRect width="72px" height="32px" borderRadius="0.5rem" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <>
      {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
        <SkeletonUserCard key={i} delay={delay} />
      ))}
    </>
  );
}