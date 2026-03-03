export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;
  try {
    const response = await fetch(link.href);
    const data = await response.json();
    const fields = data.data || data;
    const form = document.createElement('form');
    form.classList.add('dynamic-form');
    fields.forEach((field) => {
      if (!field.Type) return;
      // Submit button
      if (field.Type.toLowerCase() === 'submit') {
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = field.Label;
        form.appendChild(button);
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.classList.add('form-group');
      const label = document.createElement('label');
      label.textContent = field.Label;
      let input;
      if (field.Type.toLowerCase() === 'message') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.Type.toLowerCase() === 'mobile' ? 'tel': field.Type.toLowerCase();
      }
      input.name = field.Name;
      input.placeholder = field.placeholder || '';
      input.required = true;
      wrapper.appendChild(label);
      wrapper.appendChild(input);
      form.appendChild(wrapper);
    });
    // ✅ Submit Event
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const jsonData = Object.fromEntries(formData.entries());
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });
        if (res.ok) {
          const message = document.createElement('p');
          message.textContent = 'Form Submitted Successfully';
          message.style.color = 'green';
          form.appendChild(message);
          form.reset();
        } else {
          alert('Submission Failed');
        }
      } catch (err) {
        console.error(err);
        alert('Submission Failed');
      }
    });
    block.innerHTML = '';
    block.appendChild(form);

  } catch (error) {
    console.error('Error loading form:', error);
  }
}