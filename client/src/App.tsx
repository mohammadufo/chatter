import {
  Box,
  Container,
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import router from './components/Routes'
import { ApolloProvider } from '@apollo/client'
import client from './constants/apollo-client'
import Guard from './components/auth/Guard'
import Header from './components/header/Header'
import Snackbar from './components/snackbar/Snackbar'
import ChatList from './components/chat-list/ChatList'
import { usePath } from './hooks/usePath'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => {
  const { path } = usePath()

  const showChatList = path === '/' || path.includes('chats')

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
          <Header />

          <Guard>
            {showChatList ? (
              <Grid container>
                <Grid item md={3}>
                  <ChatList />
                </Grid>
                <Grid item md={9}>
                  <Routes />
                </Grid>
              </Grid>
            ) : (
              <Routes />
            )}
          </Guard>
        </Box>
        <Snackbar />
      </ThemeProvider>
    </ApolloProvider>
  )
}

const Routes = () => {
  return (
    <Container sx={{ height: '88vh' }}>
      <RouterProvider router={router} />
    </Container>
  )
}

export default App
