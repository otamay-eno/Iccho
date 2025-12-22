import React, { useState } from 'react';
import { 
  TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, 
  FormLabel, FormGroup, Checkbox, Card, CardContent, Typography, Box, CircularProgress 
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { postData } from '../api/gasClient';

const AddTransaction = ({ members, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    payer: members.length > 0 ? members[0].name : '',
    for_whom: members.map(m => m.name), // デフォルトは全員
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => {
    setFormData(prev => {
      const current = prev.for_whom;
      const newTargets = current.includes(name)
        ? current.filter(n => n !== name)
        : [...current, name];
      return { ...prev, for_whom: newTargets };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.title || formData.for_whom.length === 0) {
      alert("必須項目を入力してください");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      id: uuidv4(),
      ...formData
    };

    try {
      await postData('addTransaction', payload);
      alert('登録しました');
      onComplete();
    } catch (error) {
      console.error(error);
      alert('送信に失敗しました');
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>新規取引の登録</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <TextField
            label="日付"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          
          <TextField
            label="用途（例: ランチ、タクシー）"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="金額"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl>
            <FormLabel>支払った人</FormLabel>
            <RadioGroup row name="payer" value={formData.payer} onChange={handleChange}>
              {members.map(m => (
                <FormControlLabel key={m.id} value={m.name} control={<Radio />} label={m.name} />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>対象者（割り勘する人）</FormLabel>
            <FormGroup row>
              {members.map(m => (
                <FormControlLabel
                  key={m.id}
                  control={
                    <Checkbox 
                      checked={formData.for_whom.includes(m.name)} 
                      onChange={() => handleCheckboxChange(m.name)} 
                    />
                  }
                  label={m.name}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Button 
            variant="contained" 
            size="large" 
            type="submit" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? '送信中...' : '登録する'}
          </Button>

        </Box>
      </CardContent>
    </Card>
  );
};

export default AddTransaction;