import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function ChartSkeleton() {
  return (
    <Box sx={{ mb: 3, minHeight: '500px' }}>
      {/* 标题区域 */}
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="text" width={120} height={32} />
      </Box>
      
      {/* 说明文字 */}
      <Box mb={1}>
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
      
      {/* Y轴标签 */}
      <Box display="flex" justifyContent="space-between" mb={1} px={10}>
        <Skeleton variant="text" width={80} height={16} />
        <Skeleton variant="text" width={80} height={16} />
      </Box>
      
      {/* 主图表区域 - 匹配Chart组件的400px高度 */}
      <Box mb={2}>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 1 }} />
      </Box>
      
      {/* 图例按钮区域 */}
      <Box display="flex" justifyContent="center">
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={100} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Stack>
      </Box>
    </Box>
  );
}