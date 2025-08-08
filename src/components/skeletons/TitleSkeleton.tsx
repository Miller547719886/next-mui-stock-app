import Skeleton from '@mui/material/Skeleton';

export default function TitleSkeleton() {
  return (
    <div style={{ minHeight: '68px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="40%" height={24} />
    </div>
  );
}