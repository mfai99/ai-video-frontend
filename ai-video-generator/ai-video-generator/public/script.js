document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('video-form');
  const topicInput = document.getElementById('topic');
  const styleSelect = document.getElementById('style');
  const durationInput = document.getElementById('duration');
  const messageDiv = document.getElementById('message');
  const loadingDiv = document.getElementById('loading');

  // 處理表單提交
  async function handleFormSubmit(event) {
    event.preventDefault();

    const topic = topicInput.value;
    const style = styleSelect.value;
    const duration = parseInt(durationInput.value);

    if (!topic || !style || !duration) {
      messageDiv.textContent = '請填寫所有欄位。';
      return;
    }

    messageDiv.textContent = '';
    loadingDiv.style.display = 'block';

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          style,
          duration,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`錯誤：${response.status} - ${errorText}`);
      }

      const result = await response.json();
      messageDiv.textContent = `成功發送請求：${JSON.stringify(result, null, 2)}`;
    } catch (error) {
      console.error('發送到後端時發生錯誤:', error);
      messageDiv.textContent = `發送到後端時發生錯誤: ${error.message}`;
    } finally {
      loadingDiv.style.display = 'none';
    }
  }

  form.addEventListener('submit', handleFormSubmit);
});
