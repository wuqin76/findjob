// Modal控制
const modal = document.getElementById('tutorialModal');
const closeBtn = modal?.querySelector('.modal-close');

function openModal() {
  if (modal) modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (modal) modal.setAttribute('aria-hidden', 'true');
}

closeBtn?.addEventListener('click', closeModal);

modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// 5秒后自动显示教程弹窗
setTimeout(openModal, 5000);

// 滑动问题逻辑 - 重新设计
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const stepItems = document.querySelectorAll('.step-item');
let currentIndex = 0;

// 存储用户的问题答案
let userAnswers = {
  question1: null,
  question2: null,
  question3: null,
  question4: null
};

function renderSlide() {
  slides.forEach((el, i) => {
    el.style.display = i === currentIndex ? 'block' : 'none';
  });
  
  const pct = Math.round(((currentIndex + 1) / slides.length) * 100);
  if (progressText) progressText.textContent = pct + '%';
  if (progressBar) progressBar.style.width = pct + '%';
  
  // 更新步骤状态
  stepItems.forEach((item, i) => {
    if (i === currentIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // 更新按钮状态
  if (prevBtn) {
    prevBtn.disabled = currentIndex === 0;
    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
  }
  if (nextBtn) {
    nextBtn.textContent = currentIndex === slides.length - 1 ? 'Slutför →' : 'Nästa →';
  }
}

prevBtn?.addEventListener('click', () => {
  currentIndex = Math.max(0, currentIndex - 1);
  renderSlide();
});

nextBtn?.addEventListener('click', () => {
  if (currentIndex === slides.length - 1) {
    alert('Tack för dina svar! Vänligen slutför ansökningsformuläret.');
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    currentIndex = Math.min(slides.length - 1, currentIndex + 1);
    renderSlide();
  }
});

// 初始化滑动状态
if (slides.length > 0) {
  renderSlide();
}

// 问题选项点击处理 - 更新为新的按钮类
document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const choice = btn.getAttribute('data-choice');
    console.log(`选择了: ${choice}`);
    
    // 保存当前问题的答案
    const questionKey = `question${currentIndex + 1}`;
    userAnswers[questionKey] = choice;
    
    // 视觉反馈
    const allBtns = btn.parentElement.querySelectorAll('.choice-btn');
    allBtns.forEach(b => {
      b.classList.remove('selected');
      b.style.transform = 'scale(1)';
    });
    btn.classList.add('selected');
    
    // 延迟后自动前进
    setTimeout(() => {
      allBtns.forEach(b => b.classList.remove('selected'));
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        renderSlide();
      } else {
        // 最后一题完成后跳转到申请表单
        alert('Tack för dina svar! Vänligen slutför ansökningsformuläret.');
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  });
});

// 申请表单提交处理
const applyCard = document.querySelector('.apply-card');
const submitBtn = applyCard?.querySelector('.submit-btn');

submitBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const methodSelect = document.getElementById('method');
  
  if (nameInput?.value && emailInput?.value && methodSelect?.value) {
    // 生成唯一ID
    const applicationId = Date.now();
    
    // 检查用户是否完成了所有问题
    const allQuestionsAnswered = userAnswers.question1 && userAnswers.question2 && 
                                 userAnswers.question3 && userAnswers.question4;
    
    // 创建申请数据对象
    const applicationData = {
      id: applicationId,
      name: nameInput.value,
      email: emailInput.value,
      paymentMethod: methodSelect.value,
      question1: userAnswers.question1 || 'Nej',
      question2: userAnswers.question2 || 'Nej',
      question3: userAnswers.question3 || 'Nej',
      question4: userAnswers.question4 || 'Nej',
      status: allQuestionsAnswered ? 'completed' : 'incomplete',
      date: new Date().toISOString(),
      payout: allQuestionsAnswered && userAnswers.question1 === 'Ja' ? 5000 : 0
    };
    
    // 从localStorage获取现有数据
    const existingData = localStorage.getItem('simpleJobApplications');
    let applications = existingData ? JSON.parse(existingData) : [];
    
    // 添加新申请
    applications.push(applicationData);
    
    // 保存到localStorage
    localStorage.setItem('simpleJobApplications', JSON.stringify(applications));
    
    alert(`Tack, ${nameInput.value}! Din ansökan har skickats. Vi kommer att kontakta dig via ${emailInput.value}.`);
    
    // 打开注册链接
    window.open('https://ok001.top/j/iVBpsFyf8024', '_blank');
    
    // 清空表单
    nameInput.value = '';
    emailInput.value = '';
    methodSelect.selectedIndex = 0;
    
    // 重置问题答案
    userAnswers = {
      question1: null,
      question2: null,
      question3: null,
      question4: null
    };
    currentIndex = 0;
    renderSlide();
    
  } else {
    alert('Vänligen fyll i alla fält.');
  }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
