import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function TableSkeleton() {
  return (
    <Box sx={{ minHeight: '300px' }}>
      {/* 标题区域 */}
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="text" width={120} height={32} />
      </Box>
      
      {/* 说明文字 */}
      <Box mb={1}>
        <Skeleton variant="text" width="60%" height={16} />
      </Box>

      {/* 表格容器 - 匹配Table组件的最大高度200px */}
      <TableContainer 
        component={Paper} 
        variant="outlined"
        sx={{ 
          maxHeight: 200, 
          overflowX: 'auto',
        }}
      >
        <Table size="small">
          <TableBody>
            {/* 表头行 */}
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ minWidth: 120, fontWeight: 'bold' }}>
                <Skeleton variant="text" width="100%" height={20} />
              </TableCell>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableCell key={index} sx={{ minWidth: 100 }}>
                  <Skeleton variant="text" width="100%" height={20} />
                </TableCell>
              ))}
            </TableRow>
            
            {/* 数据行 */}
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <Skeleton variant="text" width="80%" height={16} />
                </TableCell>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" width="60%" height={16} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}