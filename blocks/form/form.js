export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  try {
    const resp = await fetch(link.href);
    const data = await resp.json();
    const fields = data.data || data;

    const form = document.createElement('form');
    form.classList.add('dynamic-form');

    fields.forEach((field) => {
      if (!field.Type) return;

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
        input.type = field.Type.toLowerCase() === 'mobile'
          ? 'tel'
          : field.Type.toLowerCase();
      }

      input.name = field.Name.toLowerCase();
      input.placeholder = field.placeholder || '';
      input.required = true;

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      form.appendChild(wrapper);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const jsonData = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(
          'https://script.google.com/macros/s/AKfycbylsTeHBa5ncTLOqot0hwpnfWwwaLPD_dmExm9q8LdWdS8QXB_n8seIURyXuzeMV1Qn/exec',
          {
            method: 'POST',
            body: JSON.stringify(jsonData),
          },
        );

        const result = await res.json();

        const message = document.createElement('p');
        message.style.marginTop = '10px';

        if (result.status === 'success') {
          message.textContent = 'Form Submitted Successfully';
          message.style.color = 'green';
          form.reset();
        } else {
          message.textContent = 'Submission Failed';
          message.style.color = 'red';
        }

        form.appendChild(message);
      } catch (e) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Submission Failed';
        errorMsg.style.color = 'red';
        errorMsg.style.marginTop = '10px';
        form.appendChild(errorMsg);
      }
    });

    block.innerHTML = '';
    block.appendChild(form);
  } catch (e) {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Form could not be loaded';
    errorMsg.style.color = 'red';
    block.appendChild(errorMsg);
  }
}
