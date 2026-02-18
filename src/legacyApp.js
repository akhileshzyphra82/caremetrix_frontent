export function initLegacyApp() {
  if (window.__caremetrixLegacyInitialized) return;
  window.__caremetrixLegacyInitialized = true;

  const app = document.querySelector('.app');
  const sidebarParents = document.querySelectorAll('.sidebar-parent');
  const sidebarSingleParents = document.querySelectorAll('.sidebar-parent[data-menu]');
  const sidebarButtons = document.querySelectorAll('.sidebar-item');
  const menuPanels = document.querySelectorAll('.menu-panel');
  const tableBody = document.getElementById('table-body');
  const emptyState = document.getElementById('empty-state');
  const toast = document.getElementById('toast');
  const editModal = document.getElementById('edit-modal');
  const addModal = document.getElementById('add-modal');
  const detailsModal = document.getElementById('details-modal');
  const dashboardModal = document.getElementById('dashboard-modal');
  const editForm = document.getElementById('edit-form');
  const addForm = document.getElementById('add-form');
  const profileMenu = document.querySelector('.profile-menu');
  const profileTrigger = document.querySelector('[data-action="profile-menu"]');
  const dashboardModalTitle = dashboardModal?.querySelector('[data-dashboard-title]');
  const dashboardModalSubtitle = dashboardModal?.querySelector('[data-dashboard-subtitle]');
  const dashboardModalMetrics = dashboardModal?.querySelector('[data-dashboard-metrics]');
  const dashboardModalList = dashboardModal?.querySelector('[data-dashboard-list]');
  const greetingHeading = document.querySelector('[data-greeting]');
  const chatbot = document.getElementById('chatbot');
  const chatbotPanel = document.getElementById('chatbot-panel');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotForm = document.getElementById('chatbot-form');
  
  let activeMenu = document.querySelector('.sidebar-item.active')?.dataset.menu || 'dashboard';
  let activeRow = null;
  let lastFocusedElement = null;
  
  const statusStyles = {
    Active: 'badge--teal',
    Inactive: 'badge--gray',
    Resolved: 'badge--teal',
    Investigating: 'badge--blue'
  };
  
  const priorityStyles = {
    High: 'priority--high',
    Medium: 'priority--medium',
    Low: 'priority--low'
  };
  
  const dashboardDetails = {
    operations: {
      title: 'Operational Queue',
      subtitle: 'Expanded operational snapshot for today.',
      metrics: [
        { label: 'Shifts Today', value: '86', note: '18 sites' },
        { label: 'Coverage Gaps', value: '3', note: 'Immediate fill' },
        { label: 'Late Clock-ins', value: '6', note: 'Last 24 hrs' },
        { label: 'Escalations', value: '2', note: 'Clinical alerts' }
      ],
      list: [
        { badge: 'On Track', badgeClass: 'badge--teal', text: '83 shifts confirmed' },
        { badge: 'At Risk', badgeClass: 'badge--blue', text: '3 gaps across North Hub' },
        { badge: 'Pending', badgeClass: 'badge--gray', text: '4 shift swaps awaiting approval' }
      ]
    },
    funding: {
      title: 'Funding & Claims',
      subtitle: 'NDIS billing health and claim throughput.',
      metrics: [
        { label: 'Claims Submitted', value: '72', note: 'Awaiting payment' },
        { label: 'Claims Paid', value: '118', note: 'This month' },
        { label: 'Rejected', value: '6', note: 'Needs review' },
        { label: 'Avg Payment Time', value: '4.2d', note: 'Rolling 30 days' }
      ],
      list: [
        { badge: 'NDIA', badgeClass: 'badge--teal', text: '62% managed funding mix' },
        { badge: 'Plan', badgeClass: 'badge--blue', text: '28% plan-managed participants' },
        { badge: 'Self', badgeClass: 'badge--gray', text: '10% self-managed participants' }
      ]
    },
    compliance: {
      title: 'Compliance & Risk',
      subtitle: 'Incident monitoring and WHS readiness.',
      metrics: [
        { label: 'Open Incidents', value: '6', note: '2 critical' },
        { label: 'WHS Actions', value: '2', note: 'Overdue' },
        { label: 'Audit Reviews', value: '4', note: 'Due this month' },
        { label: 'Training Expiry', value: '9', note: 'Next 30 days' }
      ],
      list: [
        { badge: 'Investigating', badgeClass: 'badge--blue', text: 'Medication delay report - 3 days' },
        { badge: 'Resolved', badgeClass: 'badge--teal', text: '8 incidents closed this month' },
        { badge: 'WHS', badgeClass: 'badge--gray', text: '2 actions awaiting sign-off' }
      ]
    },
    approvals: {
      title: 'Approvals & Tasks',
      subtitle: 'Items awaiting superadmin review.',
      metrics: [
        { label: 'Plan Reviews', value: '12', note: 'Due in 14 days' },
        { label: 'Agreement Renewals', value: '8', note: 'Pending signatures' },
        { label: 'Access Requests', value: '5', note: 'Awaiting approval' },
        { label: 'Audit Exports', value: '3', note: 'Compliance review' }
      ],
      list: [
        { badge: 'High', badgeClass: 'badge--teal', text: '3 urgent plan renewals' },
        { badge: 'Standard', badgeClass: 'badge--blue', text: '8 agreements awaiting signatures' },
        { badge: 'Info', badgeClass: 'badge--gray', text: '3 audit exports requested' }
      ]
    },
    quality: {
      title: 'Service Quality Pulse',
      subtitle: 'Participant feedback, complaints, and outcomes.',
      metrics: [
        { label: 'Feedback Score', value: '4.6/5', note: 'Last 30 days' },
        { label: 'Open Complaints', value: '2', note: 'Pending review' },
        { label: 'Follow-ups Due', value: '7', note: 'Next 14 days' },
        { label: 'Positive Notes', value: '14', note: 'This week' }
      ],
      list: [
        { badge: 'Feedback', badgeClass: 'badge--teal', text: '92% satisfaction rate' },
        { badge: 'Complaints', badgeClass: 'badge--blue', text: '2 active investigations' },
        { badge: 'Recognition', badgeClass: 'badge--gray', text: '14 positive notes logged' }
      ]
    }
  };
  
  const chatbotReplies = {
    'Show coverage gaps for today': 'There are 3 coverage gaps across today’s roster. Two are in North Hub and one in Central Clinic.',
    'Which plans are expiring soon?': '18 participant plans are expiring within 30 days. 6 of those require priority review this week.',
    'Open incidents needing review': 'There are 3 incidents under investigation and 2 WHS actions overdue.',
    'Summarize claims status': '72 claims submitted, 118 paid this month, and 6 rejected requiring review.'
  };
  
  const toasts = {
    show(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
    }
  };
  
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  function trapFocus(modal) {
    const focusable = Array.from(modal.querySelectorAll(focusableSelector));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
  
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  
    modal._handleTab = handleTab;
    modal.addEventListener('keydown', handleTab);
    setTimeout(() => first.focus(), 0);
  }
  
  function openModal(modal) {
    if (!modal) return;
    closeProfileMenu();
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    trapFocus(modal);
  }
  
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modal._handleTab) {
      modal.removeEventListener('keydown', modal._handleTab);
    }
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
  
  function toggleProfileMenu() {
    if (!profileMenu || !profileTrigger) return;
    const isOpen = profileMenu.classList.toggle('is-open');
    profileTrigger.setAttribute('aria-expanded', String(isOpen));
  }
  
  function closeProfileMenu() {
    if (!profileMenu || !profileTrigger) return;
    profileMenu.classList.remove('is-open');
    profileTrigger.setAttribute('aria-expanded', 'false');
  }
  
  function toggleChatbot(forceOpen) {
    if (!chatbot) return;
    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !chatbot.classList.contains('is-open');
    chatbot.classList.toggle('is-open', isOpen);
    if (chatbotPanel) {
      chatbotPanel.setAttribute('aria-hidden', String(!isOpen));
    }
    const toggleButton = chatbot.querySelector('[data-action="chatbot-toggle"]');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    }
  }
  
  function addChatMessage(text, type = 'assistant') {
    if (!chatbotMessages) return;
    const message = document.createElement('div');
    message.className = `chatbot-message chatbot-message--${type}`;
    message.innerHTML = `<div class="chatbot-message__bubble">${text}</div>`;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  function handleChatQuestion(text) {
    if (!text) return;
    addChatMessage(text, 'user');
    const reply = chatbotReplies[text] || 'Thanks for the question. I can prepare a detailed snapshot once data refresh completes.';
    setTimeout(() => addChatMessage(reply, 'assistant'), 250);
  }
  
  function setGreeting() {
    if (!greetingHeading) return;
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 18) {
      greeting = 'Good Afternoon';
    } else if (hour >= 18 || hour < 5) {
      greeting = 'Good Evening';
    }
    greetingHeading.textContent = greeting;
  }
  
  function updateEmptyState() {
    if (!tableBody || !emptyState) return;
    const hasRows = tableBody.querySelectorAll('tr').length > 0;
    emptyState.classList.toggle('hidden', hasRows);
  }
  
  function renumberRows() {
    if (!tableBody) return;
    Array.from(tableBody.querySelectorAll('tr')).forEach((row, index) => {
      const cell = row.querySelector('td');
      if (cell) {
        cell.textContent = String(index + 1).padStart(2, '0');
      }
    });
  }
  
  function setBadge(badge, status) {
    if (!badge) return;
    badge.classList.remove('badge--teal', 'badge--blue', 'badge--green', 'badge--gray');
    badge.classList.add(statusStyles[status] || 'badge--blue');
    badge.textContent = status;
  }
  
  function setPriority(element, priority) {
    if (!element) return;
    element.classList.remove('priority--high', 'priority--medium', 'priority--low');
    element.classList.add(priorityStyles[priority] || 'priority--medium');
    element.textContent = priority;
  }
  
  function populateEditForm(row) {
    if (!editForm) return;
    editForm.title.value = row?.dataset.title || '';
    editForm.id.value = row?.dataset.id || '';
    editForm.type.value = row?.dataset.type || '';
    editForm.status.value = row?.dataset.status || '';
    editForm.priority.value = row?.dataset.priority || '';
    editForm.notes.value = '';
    editForm.cert.checked = row?.dataset.cert === 'true';
    Array.from(editForm.querySelectorAll('.is-error')).forEach(el => el.classList.remove('is-error'));
  }
  
  function populateDetails(row) {
    if (!detailsModal) return;
    detailsModal.querySelector('[data-detail="title"]').textContent = row?.dataset.title || '—';
    detailsModal.querySelector('[data-detail="id"]').textContent = row?.dataset.id || '—';
    detailsModal.querySelector('[data-detail="type"]').textContent = row?.dataset.type || '—';
    detailsModal.querySelector('[data-detail="status"]').textContent = row?.dataset.status || '—';
    detailsModal.querySelector('[data-detail="priority"]').textContent = row?.dataset.priority || '—';
  }
  
  function populateDashboardDetail(key) {
    if (!dashboardModal) return;
    const detail = dashboardDetails[key] || dashboardDetails.operations;
    if (dashboardModalTitle) dashboardModalTitle.textContent = detail.title;
    if (dashboardModalSubtitle) dashboardModalSubtitle.textContent = detail.subtitle;
    if (dashboardModalMetrics) {
      dashboardModalMetrics.innerHTML = detail.metrics
        .map(metric => `
          <div class="info-card">
            <p>${metric.label}</p>
            <h3>${metric.value}</h3>
            ${metric.note ? `<span class="muted">${metric.note}</span>` : ''}
          </div>
        `)
        .join('');
    }
    if (dashboardModalList) {
      dashboardModalList.innerHTML = detail.list
        .map(item => {
          const badge = item.badge ? `<span class="badge ${item.badgeClass || ''}">${item.badge}</span>` : '';
          return `<li>${badge}${badge ? ' ' : ''}${item.text}</li>`;
        })
        .join('');
    }
  }
  
  function createRow({ id, title, type, status, priority, team }) {
    const row = document.createElement('tr');
    row.dataset.id = id;
    row.dataset.title = title;
    row.dataset.type = type;
    row.dataset.status = status;
    row.dataset.priority = priority;
    row.dataset.cert = 'false';
  
    row.innerHTML = `
      <td>00</td>
      <td>${id}</td>
      <td>
        <div class="cell-title">
          <span class="cell-title__name">${title}</span>
          <span class="cell-title__sub">${team || 'General Operations'}</span>
        </div>
      </td>
      <td>${type}</td>
      <td><span class="badge">${status}</span></td>
      <td><span class="priority">${priority}</span></td>
      <td>
        <div class="actions">
          <button class="icon-btn icon-btn--gradient" data-action="edit" title="Edit role" aria-label="Edit role">
            <svg viewBox="0 0 24 24"><path d="M4 17.2V20h2.8l8.4-8.4-2.8-2.8L4 17.2zM19.7 7.3c.4-.4.4-1 0-1.4l-1.6-1.6c-.4-.4-1-.4-1.4 0l-1.3 1.3 2.8 2.8 1.5-1.1z"/></svg>
          </button>
          <button class="icon-btn" data-action="view" title="View details" aria-label="View details">
            <svg viewBox="0 0 24 24"><path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
          </button>
          <button class="icon-btn icon-btn--danger" data-action="delete" title="Delete role" aria-label="Delete role">
            <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z"/></svg>
          </button>
        </div>
      </td>
    `;
  
    setBadge(row.querySelector('.badge'), status);
    setPriority(row.querySelector('.priority'), priority);
    return row;
  }
  
  function setSubmenuState(parent, shouldOpen) {
    if (!parent) return;
    parent.classList.toggle('is-open', shouldOpen);
    parent.setAttribute('aria-expanded', String(shouldOpen));
    const submenu = parent.nextElementSibling;
    if (submenu && submenu.classList.contains('sidebar-submenu')) {
      submenu.classList.toggle('is-open', shouldOpen);
      submenu.setAttribute('aria-hidden', String(!shouldOpen));
    }
  }
  
  function syncParentMenus() {
    sidebarParents.forEach(parent => {
      parent.classList.remove('active');
    });
    const activeItem = Array.from(sidebarButtons).find(button => button.classList.contains('active'));
    const parentKey = activeItem?.dataset.parent;
    if (!parentKey) {
      sidebarParents.forEach(parent => setSubmenuState(parent, false));
      sidebarSingleParents.forEach(parent => {
        const isActive = parent.dataset.menu === activeMenu;
        parent.classList.toggle('active', isActive);
      });
      return;
    }
    const parent = document.querySelector(`.sidebar-parent[data-parent="${parentKey}"]`);
    if (parent) {
      sidebarParents.forEach(other => {
        if (other !== parent) {
          setSubmenuState(other, false);
        }
      });
      parent.classList.add('active');
      setSubmenuState(parent, true);
    }
  }
  
  function setActiveMenu(menuId) {
    activeMenu = menuId;
  
    sidebarButtons.forEach(button => {
      const isActive = button.dataset.menu === menuId;
      button.classList.toggle('active', isActive);
      if (isActive) {
        button.setAttribute('aria-current', 'page');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  
    menuPanels.forEach(panel => {
      const show = panel.dataset.menu === menuId;
      panel.classList.toggle('active', show);
    });
  
    sidebarSingleParents.forEach(parent => {
      const isActive = parent.dataset.menu === menuId;
      parent.classList.toggle('active', isActive);
    });
  
    syncParentMenus();
  }
  
  sidebarParents.forEach(parent => {
    parent.addEventListener('click', () => {
      if (parent.dataset.menu) {
        sidebarParents.forEach(other => {
          if (other !== parent) {
            setSubmenuState(other, false);
          }
        });
        setActiveMenu(parent.dataset.menu);
        return;
      }
      sidebarParents.forEach(other => {
        if (other !== parent) {
          setSubmenuState(other, false);
        }
      });
      const isOpen = parent.classList.contains('is-open');
      setSubmenuState(parent, !isOpen);
      if (!isOpen) {
        const submenu = parent.nextElementSibling;
        const firstItem = submenu?.querySelector('.sidebar-item');
        if (firstItem) {
          setActiveMenu(firstItem.dataset.menu);
        }
      }
    });
  });
  
  sidebarButtons.forEach(button => {
    button.addEventListener('click', () => {
      const menu = button.dataset.menu;
      setActiveMenu(menu);
    });
  });
  
  document.addEventListener('click', (event) => {
    if (profileMenu && !event.target.closest('.profile-menu')) {
      closeProfileMenu();
    }
  
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
  
    const action = actionButton.dataset.action;
    if (action === 'toggle-sidebar') {
      app.dataset.sidebar = app.dataset.sidebar === 'collapsed' ? 'expanded' : 'collapsed';
      const isCollapsed = app.dataset.sidebar === 'collapsed';
      if (isCollapsed) {
        sidebarParents.forEach(parent => setSubmenuState(parent, false));
      } else {
        syncParentMenus();
      }
      return;
    }
  
    if (action === 'profile-menu') {
      toggleProfileMenu();
      return;
    }
  
    if (action === 'chatbot-toggle') {
      toggleChatbot();
      return;
    }
  
    if (action === 'chatbot-close') {
      toggleChatbot(false);
      return;
    }
  
    if (action === 'chatbot-question') {
      handleChatQuestion(actionButton.dataset.question);
      return;
    }
  
    if (action === 'add') {
      if (addForm) {
        addForm.reset();
        Array.from(addForm.querySelectorAll('.is-error')).forEach(el => el.classList.remove('is-error'));
      }
      openModal(addModal);
      return;
    }
  
    if (action === 'open-dashboard-detail') {
      populateDashboardDetail(actionButton.dataset.detail);
      openModal(dashboardModal);
      return;
    }
  
    if (action === 'view') {
      const row = actionButton.closest('tr');
      if (row) activeRow = row;
      populateDetails(row || activeRow);
      openModal(detailsModal);
      return;
    }
  
    if (action === 'close-modal') {
      closeModal(editModal);
      closeModal(detailsModal);
      closeModal(addModal);
      closeModal(dashboardModal);
      return;
    }
  
    const row = actionButton.closest('tr');
    if (!row) return;
  
    if (action === 'edit') {
      activeRow = row;
      populateEditForm(row);
      openModal(editModal);
    }
  
    if (action === 'delete') {
      row.remove();
      renumberRows();
      updateEmptyState();
      toasts.show('Record removed from directory.');
    }
  });
  
  if (editForm) {
    editForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const requiredFields = ['title', 'id', 'type', 'status', 'priority'];
      let valid = true;
  
      requiredFields.forEach(name => {
        const field = editForm[name];
        if (!field.value.trim()) {
          field.classList.add('is-error');
          valid = false;
        } else {
          field.classList.remove('is-error');
        }
      });
  
      if (!valid) {
        toasts.show('Please complete the required fields.');
        return;
      }
  
      if (!activeRow) return;
      activeRow.dataset.title = editForm.title.value.trim();
      activeRow.dataset.id = editForm.id.value.trim();
      activeRow.dataset.type = editForm.type.value;
      activeRow.dataset.status = editForm.status.value;
      activeRow.dataset.priority = editForm.priority.value;
      activeRow.dataset.cert = editForm.cert.checked;
  
      activeRow.querySelector('.cell-title__name').textContent = editForm.title.value.trim();
      activeRow.children[1].textContent = editForm.id.value.trim();
      activeRow.children[3].textContent = editForm.type.value;
  
      const badge = activeRow.querySelector('.badge');
      setBadge(badge, editForm.status.value);
  
      const priority = activeRow.querySelector('.priority');
      setPriority(priority, editForm.priority.value);
  
      closeModal(editModal);
      toasts.show('Record updated successfully.');
    });
  }
  
  [editModal, detailsModal, addModal, dashboardModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal__backdrop')) {
        closeModal(modal);
      }
    });
  });
  
  if (addForm) {
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const requiredFields = ['title', 'id', 'type', 'status', 'priority'];
      let valid = true;
  
      requiredFields.forEach(name => {
        const field = addForm[name];
        if (!field.value.trim()) {
          field.classList.add('is-error');
          valid = false;
        } else {
          field.classList.remove('is-error');
        }
      });
  
      if (!valid) {
        toasts.show('Please complete the required fields.');
        return;
      }
  
      const row = createRow({
        id: addForm.id.value.trim(),
        title: addForm.title.value.trim(),
        type: addForm.type.value,
        status: addForm.status.value,
        priority: addForm.priority.value,
        team: addForm.team.value.trim()
      });
  
      if (tableBody) {
        tableBody.appendChild(row);
        renumberRows();
        updateEmptyState();
      }
  
      addForm.reset();
      closeModal(addModal);
      toasts.show('New entry added successfully.');
    });
  }
  
  if (chatbotForm) {
    chatbotForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = chatbotForm.elements.message;
      const value = input?.value.trim();
      if (!value) return;
      handleChatQuestion(value);
      input.value = '';
    });
  }
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal(editModal);
      closeModal(detailsModal);
      closeModal(addModal);
      closeModal(dashboardModal);
      closeProfileMenu();
      toggleChatbot(false);
    }
  });
  
  setActiveMenu(activeMenu);
  updateEmptyState();
  setGreeting();
}
