const Badge = ({ status }) => {
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge-approved';
      case 'pending': return 'badge-pending';
      case 'rejected': return 'badge-rejected';
      case 'withdrawn': return 'badge-withdrawn';
      default: return 'badge-withdrawn';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status}
    </span>
  );
};

export default Badge;
