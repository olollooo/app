import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { auth } from '../../lib/Firebase/FireBase'
import { useNavigate } from 'react-router-dom'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'

export const MenuBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const navigate = useNavigate()

  // メニューバーを開ける
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  // メニューバーを閉じる
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  // ユーザアイコンのメニューを開ける
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  // ユーザアイコンのメニューを閉じる
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  //Send
  const startOfQuestion = () => {
    navigate('/startofquestion')
  }

  //List
  const result = () => {
    navigate('/result')
  }

  //設定
  const settings = () => {
    navigate('/settings')
  }

  //お問い合わせ
  const contact = () => {
    navigate('/contact')
  }

  //ログアウト
  const logout = () => {
    auth.signOut()
    navigate('/login')
  }

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HOME
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={startOfQuestion}>Send</MenuItem>
                <MenuItem onClick={result}>List</MenuItem>
              </Menu>
            </Box>
            {/* ↑全画面サイズの場合・↓スマホ画面の場合 */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HOME
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                sx={{ pt: 2, my: 2, color: 'white', display: 'block' }}
                onClick={startOfQuestion}
              >
                Send
              </Button>
              <Button
                sx={{ pt: 2, my: 2, color: 'white', display: 'block' }}
                onClick={result}
              >
                List
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <MiscellaneousServicesIcon style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={settings}>設定</MenuItem>
                <MenuItem onClick={contact}>お問い合わせ</MenuItem>
                <MenuItem onClick={logout}>ログアウト</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar />
    </>
  )
}
