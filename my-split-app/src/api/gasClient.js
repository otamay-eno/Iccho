const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbx836Y8P0_6_-DqvwHl9XlybRo-fzccGo_M3jNni4UJvOMneN7-VGA7MWfGV4lYejJW/exec';

export const fetchAllData = async () => {
  const response = await fetch(`${GAS_API_URL}?action=getData`);
  return response.json();
};

export const postData = async (action, payload) => {
  // GASのCORS制限を回避するため、第2引数にオブジェクトを渡す
  // type: 'text/plain' はPreflight requestを避けるための定石
  const response = await fetch(GAS_API_URL, {
    method: 'POST',
    mode: 'cors', // 重要
    headers: {
      'Content-Type': 'text/plain', 
    },
    body: JSON.stringify({ action, payload }),
  });
  return response.json();
};