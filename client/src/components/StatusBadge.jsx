const variants = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-rose-100 text-rose-800',
};

export function StatusBadge({ status }) {
  const styles = variants[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}>
      {status}
    </span>
  );
}

