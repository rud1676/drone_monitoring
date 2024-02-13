import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  marginLeft: '15px',
  [theme.breakpoints.up('desktop')]: {
    marginTop: '100px',
  },
}));

export default function Loading() {
  return (
    <Container>
      <CircularProgress />
    </Container>
  );
}
