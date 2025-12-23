import React, { useState } from 'react';
import {
  TextField, Button, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Typography, Box, CircularProgress, Paper, Divider, IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/PersonRounded';
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { v4 as uuidv4 } from 'uuid';
import { postData } from '../api/gasClient';

const Settings = ({ members, onUpdate }) => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    if (!newName.trim()) return;
    setLoading(true);

    const payload = {
      id: uuidv4(),
      name: newName
    };

    try {
      await postData('addMember', payload);
      setNewName('');
      onUpdate(); // 親コンポーネントのデータを更新
    } catch (e) {
      console.error(e);
      alert('追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
        <SettingsIcon /> 設定
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: '#ffffff',
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'primary.main' }}>
          <PersonAddIcon color="primary" /> メンバー追加
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            label="名前"
            placeholder="メンバー名を入力"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            variant="filled"
            InputProps={{
              disableUnderline: true,
              style: { borderRadius: 12, backgroundColor: '#F5F5F5' }
            }}
            sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
          />
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={loading || !newName.trim()}
            sx={{
              borderRadius: 4,
              px: 3,
              minWidth: 80,
              boxShadow: '0 4px 14px 0 rgba(0, 32, 91, 0.3)'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '追加'}
          </Button>
        </Box>
      </Paper>

      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 1, color: 'primary.main' }}>
          メンバー一覧 ({members.length})
        </Typography>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #E0E0E0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <List sx={{ p: 0 }}>
            {members.length === 0 && (
              <ListItem>
                <ListItemText primary="メンバーがいません" secondary="上のフォームから追加してください" />
              </ListItem>
            )}
            {members.map((m, index) => (
              <React.Fragment key={m.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={m.name}
                    primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                  />
                </ListItem>
                {index < members.length - 1 && <Divider component="li" variant="fullWidth" sx={{ opacity: 0.5 }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;