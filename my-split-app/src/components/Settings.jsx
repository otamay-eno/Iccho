import React, { useState } from 'react';
import {
  TextField, Button, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Typography, Box, CircularProgress, Paper, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/PersonRounded';
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import { v4 as uuidv4 } from 'uuid';
import { postData } from '../api/gasClient';

const Settings = ({ members, onUpdate }) => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit/Delete State
  const [editMember, setEditMember] = useState(null); // Member object being edited
  const [deleteMemberId, setDeleteMemberId] = useState(null); // ID of member to delete
  const [editName, setEditName] = useState('');

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
      onUpdate();
    } catch (e) {
      console.error(e);
      alert('追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // Edit Handlers
  const openEditDialog = (member) => {
    setEditMember(member);
    setEditName(member.name);
  };

  const handleUpdateMember = async () => {
    if (!editName.trim() || !editMember) return;

    setIsEditing(true);
    try {
      await postData('updateMember', { id: editMember.id, name: editName });
      onUpdate();
      setEditMember(null);
    } catch (e) {
      console.error(e);
      alert('更新に失敗しました');
    } finally {
      setIsEditing(false);
    }
  };

  // Delete Handlers
  const handleDeleteMember = async () => {
    if (!deleteMemberId) return;

    setIsDeleting(true);
    try {
      await postData('deleteMember', { id: deleteMemberId });
      onUpdate();
      setDeleteMemberId(null);
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
        <SettingsIcon /> 設定
      </Typography>

      {/* Member Add Form */}
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
            disabled={loading}
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

      {/* Member List */}
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
                <ListItem
                  sx={{ py: 2 }}
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => openEditDialog(m)} sx={{ color: 'primary.light' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setDeleteMemberId(m.id)} sx={{ color: 'grey.400', '&:hover': { color: 'error.main' } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
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

      {/* Edit Dialog */}
      <Dialog open={!!editMember} onClose={() => setEditMember(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="bold">メンバー名の変更</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            autoFocus
            margin="dense"
            label="名前"
            fullWidth
            variant="filled"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            InputProps={{ disableUnderline: true, style: { borderRadius: 8, backgroundColor: '#F5F5F5' } }}
            sx={{ mt: 1, '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditMember(null)} sx={{ color: 'text.secondary' }}>キャンセル</Button>
          <Button
            onClick={handleUpdateMember}
            variant="contained"
            disabled={isEditing}
            sx={{ borderRadius: 2, boxShadow: 'none' }}
          >
            {isEditing ? <CircularProgress size={24} color="inherit" /> : '更新'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteMemberId} onClose={() => setDeleteMemberId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="bold" color="error">メンバー削除</DialogTitle>
        <DialogContent>
          <Typography>このメンバーを削除してもよろしいですか？</Typography>
          <Typography variant="caption" color="text.secondary">※過去の取引履歴の整合性が取れなくなる可能性があります。</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteMemberId(null)} sx={{ color: 'text.secondary' }}>キャンセル</Button>
          <Button
            onClick={handleDeleteMember}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{ borderRadius: 2, boxShadow: 'none' }}
          >
            {isDeleting ? <CircularProgress size={24} color="inherit" /> : '削除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;