import React, { useState } from 'react';
import { 
  TextField, Button, List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Typography, Card, CardContent, Box, Divider 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
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
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>メンバー追加</Typography>
          <Box display="flex" gap={1}>
            <TextField 
              label="名前" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              fullWidth 
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleAddMember}
              disabled={loading}
            >
              追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>メンバー一覧</Typography>
      <Card>
        <List>
          {members.map((m, index) => (
            <React.Fragment key={m.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={m.name} />
              </ListItem>
              {index < members.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
          {members.length === 0 && (
            <ListItem><ListItemText primary="メンバーがいません" /></ListItem>
          )}
        </List>
      </Card>
    </Box>
  );
};

export default Settings;