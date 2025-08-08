import { 
  Box, 
  Skeleton, 
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export default function TableSkeleton() {
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={100} height={32} />
      </Box>
      
      <Stack spacing={1} mb={3}>
        <Skeleton variant="text" width="85%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="75%" height={20} />
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {Array.from({ length: 7 }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" width="100%" height={20} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {Array.from({ length: 7 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" width="100%" height={16} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Stack spacing={0.5}>
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="45%" height={16} />
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="95%" height={16} />
        </Stack>
      </Box>
    </Box>
  );
}