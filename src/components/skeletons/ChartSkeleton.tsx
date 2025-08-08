import { Box, Skeleton, Stack } from '@mui/material';

export default function ChartSkeleton() {
  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={120} height={32} />
      </Box>
      
      <Stack spacing={1} mb={3}>
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="85%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
      </Stack>
      
      <Box mb={4}>
        <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>

      <Box mb={3}>
        <Skeleton variant="text" width={220} height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>

      <Stack spacing={0.5}>
        <Skeleton variant="text" width="70%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="75%" height={16} />
      </Stack>
    </Box>
  );
}