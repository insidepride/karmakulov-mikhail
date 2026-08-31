const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  });
});

const modal = document.querySelector('#videoModal');
const modalTitle = document.querySelector('#modalTitle');

document.querySelectorAll('.video-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (modalTitle) modalTitle.textContent = card.dataset.title || 'Видео';
    modal?.showModal();
  });
});

document.querySelector('#closeModal')?.addEventListener('click', () => modal?.close());
modal?.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

document.querySelectorAll('.faq button').forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.classList.contains('open');
    document.querySelectorAll('.faq button').forEach((item) => item.classList.remove('open'));
    if (!open) button.classList.add('open');
  });
});

document.querySelectorAll('.quiz').forEach((quiz) => {
  const steps = [...quiz.querySelectorAll('.step')];
  const stepLabel = quiz.querySelector('.step-label');
  const stepBar = quiz.querySelector('.step-bar');
  const prevStep = quiz.querySelector('.prev-step');
  const nextStep = quiz.querySelector('.next-step');
  const submitQuiz = quiz.querySelector('.submit-quiz');
  const result = quiz.querySelector('.result');
  let currentStep = 0;

  function renderStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex === currentStep));
    if (stepLabel) stepLabel.textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
    if (stepBar) stepBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    if (prevStep) prevStep.disabled = currentStep === 0;
    nextStep?.classList.toggle('hidden', currentStep === steps.length - 1);
    submitQuiz?.classList.toggle('hidden', currentStep !== steps.length - 1);
  }

  function stepIsValid() {
    const required = [...steps[currentStep].querySelectorAll('[required]')];
    return required.every((field) => {
      if (field.type === 'radio') {
        return Boolean(steps[currentStep].querySelector(`input[name="${field.name}"]:checked`));
      }
      if (field.type === 'checkbox') return field.checked;
      return field.value.trim().length > 0;
    });
  }

  prevStep?.addEventListener('click', () => renderStep(currentStep - 1));
  nextStep?.addEventListener('click', () => {
    if (!stepIsValid()) {
      steps[currentStep].querySelector('[required]')?.reportValidity();
      return;
    }
    renderStep(currentStep + 1);
  });

  quiz.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!stepIsValid()) return;
    localStorage.setItem('mk-top100-lead', JSON.stringify(Object.fromEntries(new FormData(quiz).entries())));
    if (result) result.textContent = 'Спасибо за ваш интерес! Стоимость будет сообщена выбранным способом в самые короткие сроки.';
  });

  renderStep(0);
});
