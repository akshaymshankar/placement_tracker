// Enhanced Placement Portal App JavaScript with Authentication and Role Management

class EnhancedPlacementPortal {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.editingExperience = null;
        
        // Initialize data with localStorage support
        this.initializeData();
        this.charts = {
            companyChart: null,
            packageChart: null
        };

        this.init();
    }

    initializeData() {
        // Initialize users from localStorage or default data
        const savedUsers = JSON.parse(localStorage.getItem('placementPortalUsers') || '[]');
        const defaultUsers = [
            {
                email: "admin@psgtech.ac.in", 
                password: "admin123", 
                name: "Placement Officer", 
                role: "admin", 
                placementStatus: "not-applicable", 
                company: "", 
                package: "", 
                placedRole: ""
            }
        ];

        this.data = {
            users: savedUsers.length > 0 ? savedUsers : defaultUsers,
            placementRecords: JSON.parse(localStorage.getItem('placementPortalRecords') || JSON.stringify([
                {id: 1, name: "Aarav Sharma", company: "Google", role: "Software Engineer", year: 2024, package: "45.0 LPA"},
                {id: 2, name: "Ananya Reddy", company: "Microsoft", role: "Software Developer", year: 2024, package: "42.0 LPA"},
                {id: 3, name: "Arjun Patel", company: "Amazon", role: "SDE-1", year: 2024, package: "35.0 LPA"},
                {id: 4, name: "Ishita Gupta", company: "TCS", role: "Software Engineer", year: 2024, package: "7.5 LPA"},
                {id: 5, name: "Vikram Singh", company: "Infosys", role: "Systems Engineer", year: 2024, package: "6.5 LPA"},
                {id: 6, name: "Sneha Jain", company: "Wipro", role: "Software Developer", year: 2024, package: "8.0 LPA"},
                {id: 7, name: "Kiran Kumar", company: "Cognizant", role: "Associate", year: 2024, package: "7.0 LPA"},
                {id: 8, name: "Meera Iyer", company: "Accenture", role: "Analyst", year: 2024, package: "6.8 LPA"},
                {id: 9, name: "Rohit Mehta", company: "HCL", role: "Software Engineer", year: 2024, package: "7.2 LPA"},
                {id: 10, name: "Kavya Nair", company: "Tech Mahindra", role: "Associate Engineer", year: 2024, package: "6.9 LPA"}
            ])),
            interviewExperiences: JSON.parse(localStorage.getItem('placementPortalExperiences') || JSON.stringify([
                {
                    id: 1, company: "Google", role: "Software Engineer", year: 2024, difficulty: "Hard",
                    authorEmail: "placed.student@psgtech.ac.in", authorName: "Sample Placed Student", 
                    rounds: "Online Test, Technical Interview 1, Technical Interview 2, HR Interview",
                    experience: "The process started with an online coding test with 2 medium-hard problems. Technical interviews focused on system design and data structures. Very challenging but fair process.",
                    tips: "Practice system design, brush up on algorithms, be confident during interviews."
                }
            ])),
            resources: {
                DSA: [
                    {name: "GeeksforGeeks DSA Course", type: "website", url: "https://geeksforgeeks.org"},
                    {name: "Striver DSA Sheet", type: "pdf", url: "#"},
                    {name: "Abdul Bari Algorithms", type: "video", url: "#"}
                ],
                OS: [
                    {name: "Operating Systems Concepts", type: "pdf", url: "#"},
                    {name: "OS Tutorials Point", type: "website", url: "#"},
                    {name: "Gate Smashers OS", type: "video", url: "#"}
                ],
                DBMS: [
                    {name: "Database System Concepts", type: "pdf", url: "#"},
                    {name: "DBMS Tutorial", type: "website", url: "#"},
                    {name: "Gate Lectures DBMS", type: "video", url: "#"}
                ],
                CN: [
                    {name: "Computer Networks Tanenbaum", type: "pdf", url: "#"},
                    {name: "Networking Basics", type: "website", url: "#"},
                    {name: "Computer Networks Lectures", type: "video", url: "#"}
                ],
                Aptitude: [
                    {name: "Quantitative Aptitude RS Aggarwal", type: "pdf", url: "#"},
                    {name: "IndiaBix Aptitude", type: "website", url: "#"},
                    {name: "Aptitude Made Easy", type: "video", url: "#"}
                ],
                Resume: [
                    {name: "Resume Writing Guide", type: "pdf", url: "#"},
                    {name: "Canva Resume Templates", type: "website", url: "#"},
                    {name: "Resume Building Tips", type: "video", url: "#"}
                ]
            }
        };

        // Save default data if not exists
        this.saveData();
    }

    saveData() {
        localStorage.setItem('placementPortalUsers', JSON.stringify(this.data.users));
        localStorage.setItem('placementPortalRecords', JSON.stringify(this.data.placementRecords));
        localStorage.setItem('placementPortalExperiences', JSON.stringify(this.data.interviewExperiences));
    }

    init() {
        this.setupEventListeners();
        this.showAuthContainer();
        this.clearAuthForms();
        // Ensure logout button is visible on init
        this.ensureLogoutButtonVisible();
    }

    ensureLogoutButtonVisible() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'flex';
            logoutBtn.style.visibility = 'visible';
        }
    }

    setupEventListeners() {
        // Auth event listeners
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterPage();
        });
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginPage();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Logout - Make sure it's properly attached
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.logout();
            });
        }

        // Modals
        this.setupModalEventListeners();

        // Filters and search
        this.setupFiltersAndSearch();

        // Resource cards
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.showResourceModal(category);
            });
        });

        // Experience cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.experience-card') && !e.target.closest('.btn')) {
                const card = e.target.closest('.experience-card');
                this.toggleExperienceDetails(card);
            }
        });

        // Admin tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchAdminTab(tab);
            });
        });

        // Admin student search
        const studentSearch = document.getElementById('studentSearch');
        if (studentSearch) {
            studentSearch.addEventListener('input', () => this.filterStudents());
        }
        
        const refreshBtn = document.getElementById('refreshStudentsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadAdminStudents());
        }
    }

    setupModalEventListeners() {
        // Add Experience Modal
        document.getElementById('addExperienceBtn').addEventListener('click', () => {
            if (this.canAddExperience()) {
                // Reset modal state for new experience
                this.editingExperience = null;
                document.getElementById('experienceModalTitle').textContent = 'Share Your Interview Experience';
                document.getElementById('submitExperienceBtn').textContent = 'Share Experience';
                document.getElementById('experienceForm').reset();
                this.showModal('addExperienceModal');
            } else {
                alert('Only placed students can share interview experiences.');
            }
        });
        document.getElementById('experienceForm').addEventListener('submit', (e) => this.handleAddExperience(e));

        // Mark as Placed Modal
        const markPlacedForm = document.getElementById('markPlacedForm');
        if (markPlacedForm) {
            markPlacedForm.addEventListener('submit', (e) => this.handleMarkAsPlaced(e));
        }

        // Add Record Modal
        const addRecordBtn = document.getElementById('addRecordBtn');
        if (addRecordBtn) {
            addRecordBtn.addEventListener('click', () => {
                this.showModal('addRecordModal');
            });
        }
        document.getElementById('recordForm').addEventListener('submit', (e) => this.handleAddRecord(e));

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.hideAllModals());
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAllModals();
                }
            });
        });
    }

    setupFiltersAndSearch() {
        // Experience filters
        document.getElementById('companyFilter').addEventListener('change', () => this.filterExperiences());
        document.getElementById('yearFilter').addEventListener('change', () => this.filterExperiences());
        document.getElementById('difficultyFilter').addEventListener('change', () => this.filterExperiences());

        // Records search and filter
        document.getElementById('recordsSearch').addEventListener('input', () => this.filterRecords());
        document.getElementById('batchFilter').addEventListener('change', () => this.filterRecords());
    }

    validatePSGEmail(email) {
        return email.endsWith('@psgtech.ac.in');
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    }

    clearAuthForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
    }

    handleLogin(e) {
        e.preventDefault();
        this.clearErrors();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!this.validatePSGEmail(email)) {
            this.showError('loginEmailError', 'Please use a valid @psgtech.ac.in email address');
            return;
        }

        const user = this.data.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.showMainApp();
        } else {
            this.showError('loginPasswordError', 'Invalid email or password');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        this.clearErrors();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (!name) {
            this.showError('registerNameError', 'Please enter your full name');
            return;
        }

        if (!this.validatePSGEmail(email)) {
            this.showError('registerEmailError', 'Please use a valid @psgtech.ac.in email address');
            return;
        }

        if (password.length < 6) {
            this.showError('registerPasswordError', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            return;
        }

        if (this.data.users.find(u => u.email === email)) {
            this.showError('registerEmailError', 'Email already exists');
            return;
        }

        const newUser = {
            email,
            password,
            name,
            role: email === 'admin@psgtech.ac.in' ? 'admin' : 'student',
            placementStatus: email === 'admin@psgtech.ac.in' ? 'not-applicable' : 'not-placed',
            company: '',
            package: '',
            placedRole: ''
        };

        this.data.users.push(newUser);
        this.saveData();
        this.currentUser = newUser;
        this.showMainApp();
    }

    showAuthContainer() {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        this.showLoginPage();
    }

    showMainApp() {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        this.clearAuthForms();
        this.clearErrors();
        
        this.updateUserInterface();
        this.resetNavigation();
        this.navigateToPage('dashboard');
        this.ensureLogoutButtonVisible();
    }

    updateUserInterface() {
        // Update user info in sidebar
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userRole').textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);

        // Update placement status in sidebar
        const statusBadge = document.getElementById('placementStatus');
        if (this.currentUser.role === 'student') {
            statusBadge.classList.remove('hidden');
            if (this.currentUser.placementStatus === 'placed') {
                statusBadge.textContent = 'Placed';
                statusBadge.classList.add('placed');
                statusBadge.classList.remove('not-placed');
            } else {
                statusBadge.textContent = 'Not Placed';
                statusBadge.classList.add('not-placed');
                statusBadge.classList.remove('placed');
            }
        } else {
            statusBadge.classList.add('hidden');
        }

        // Show/hide admin nav item
        const adminNavItem = document.getElementById('adminNavItem');
        if (this.currentUser.role === 'admin') {
            adminNavItem.classList.remove('hidden');
        } else {
            adminNavItem.classList.add('hidden');
        }

        // Update placement badge in dashboard
        this.updateDashboardPlacementBadge();
        
        // Update Add Experience button visibility
        this.updateExperienceButtonVisibility();
        
        // Ensure logout button is visible
        this.ensureLogoutButtonVisible();
    }

    updateDashboardPlacementBadge() {
        const placementBadge = document.getElementById('userPlacementBadge');
        if (this.currentUser.role === 'student' && this.currentUser.placementStatus === 'placed') {
            placementBadge.classList.remove('hidden');
            document.getElementById('placementCompany').textContent = this.currentUser.company;
            document.getElementById('placementPackage').textContent = this.currentUser.package + ' LPA';
        } else {
            placementBadge.classList.add('hidden');
        }
    }

    updateExperienceButtonVisibility() {
        const addExperienceBtn = document.getElementById('addExperienceBtn');
        if (this.canAddExperience()) {
            addExperienceBtn.style.display = 'inline-flex';
        } else {
            addExperienceBtn.style.display = 'none';
        }
    }

    canAddExperience() {
        return this.currentUser.role === 'admin' || 
               (this.currentUser.role === 'student' && this.currentUser.placementStatus === 'placed');
    }

    showLoginPage() {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('registerPage').classList.add('hidden');
        this.clearErrors();
        document.getElementById('loginEmail').focus();
    }

    showRegisterPage() {
        document.getElementById('registerPage').classList.remove('hidden');
        document.getElementById('loginPage').classList.add('hidden');
        this.clearErrors();
        document.getElementById('registerName').focus();
    }

    resetNavigation() {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('[data-page="dashboard"]').classList.add('active');
        this.currentPage = 'dashboard';
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.currentUser = null;
            this.hideAllModals();
            
            if (this.charts.companyChart) {
                this.charts.companyChart.destroy();
                this.charts.companyChart = null;
            }
            if (this.charts.packageChart) {
                this.charts.packageChart.destroy();
                this.charts.packageChart = null;
            }
            
            this.showAuthContainer();
        }
    }

    navigateToPage(page) {
        if (this.currentPage === page) return;

        if (page === 'admin' && this.currentUser.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            return;
        }

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        document.getElementById(`${page}Page`).classList.add('active');
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        this.currentPage = page;

        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'experiences':
                this.loadExperiences();
                break;
            case 'records':
                this.loadRecords();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'admin':
                this.loadAdmin();
                break;
        }
    }

    loadDashboard() {
        const stats = this.calculateStats();
        
        document.getElementById('totalPlacements').textContent = stats.totalPlacements;
        document.getElementById('totalExperiences').textContent = stats.totalExperiences;
        document.getElementById('placementRate').textContent = stats.placementRate;

        this.loadRecentPlacements();
        this.loadTopCompanies();
        this.updateDashboardPlacementBadge();
    }

    calculateStats() {
        const currentYear = 2024;
        const currentYearPlacements = this.data.placementRecords.filter(r => r.year === currentYear);
        
        return {
            totalPlacements: currentYearPlacements.length,
            totalExperiences: this.data.interviewExperiences.length,
            placementRate: '87%'
        };
    }

    loadRecentPlacements() {
        const recentPlacements = this.data.placementRecords
            .filter(r => r.year === 2024)
            .slice(0, 5);

        const container = document.getElementById('recentPlacements');
        container.innerHTML = recentPlacements.map(placement => `
            <div class="recent-item">
                <div class="recent-item-info">
                    <div class="recent-item-name">${placement.name}</div>
                    <div class="recent-item-details">${placement.company} • ${placement.role}</div>
                </div>
                <div class="recent-item-package">${placement.package}</div>
            </div>
        `).join('');
    }

    loadTopCompanies() {
        const companies = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys'];
        const container = document.getElementById('topCompaniesList');
        container.innerHTML = companies.map(company => `
            <div class="company-item">${company}</div>
        `).join('');
    }

    loadExperiences() {
        this.populateExperienceFilters();
        this.renderExperiences(this.data.interviewExperiences);
        this.updateExperienceButtonVisibility();
    }

    populateExperienceFilters() {
        const companies = [...new Set(this.data.interviewExperiences.map(exp => exp.company))];
        const years = [...new Set(this.data.interviewExperiences.map(exp => exp.year))].sort((a, b) => b - a);

        const companyFilter = document.getElementById('companyFilter');
        companyFilter.innerHTML = '<option value="">All Companies</option>' + 
            companies.map(company => `<option value="${company}">${company}</option>`).join('');

        const yearFilter = document.getElementById('yearFilter');
        yearFilter.innerHTML = '<option value="">All Years</option>' + 
            years.map(year => `<option value="${year}">${year}</option>`).join('');
    }

    renderExperiences(experiences) {
        const container = document.getElementById('experiencesList');
        container.innerHTML = experiences.map(exp => {
            const canEdit = this.currentUser.role === 'admin' || exp.authorEmail === this.currentUser.email;
            return `
                <div class="experience-card" data-id="${exp.id}">
                    ${canEdit ? `
                        <div class="experience-actions">
                            <button class="btn btn--outline btn--sm" onclick="app.editExperience(${exp.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn--outline btn--sm" onclick="app.deleteExperience(${exp.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    ` : ''}
                    <div class="experience-header">
                        <div>
                            <h3 class="experience-company">${exp.company}</h3>
                            <p class="experience-role">${exp.role}</p>
                        </div>
                        <div class="experience-meta">
                            <span class="experience-year">${exp.year}</span>
                            <span class="difficulty-badge difficulty-${exp.difficulty.replace(/[-\s]/g, '')}">${exp.difficulty}</span>
                        </div>
                    </div>
                    <p class="experience-preview">${exp.experience.substring(0, 120)}...</p>
                    <p class="experience-author">— ${exp.authorName}</p>
                    <div class="experience-details">
                        <div class="detail-section">
                            <h4>Interview Rounds</h4>
                            <p>${exp.rounds}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Detailed Experience</h4>
                            <p>${exp.experience}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Tips for Future Candidates</h4>
                            <p>${exp.tips}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterExperiences() {
        const companyFilter = document.getElementById('companyFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;
        const difficultyFilter = document.getElementById('difficultyFilter').value;

        let filtered = this.data.interviewExperiences;

        if (companyFilter) {
            filtered = filtered.filter(exp => exp.company === companyFilter);
        }
        if (yearFilter) {
            filtered = filtered.filter(exp => exp.year.toString() === yearFilter);
        }
        if (difficultyFilter) {
            filtered = filtered.filter(exp => exp.difficulty === difficultyFilter);
        }

        this.renderExperiences(filtered);
    }

    toggleExperienceDetails(card) {
        const details = card.querySelector('.experience-details');
        details.classList.toggle('show');
    }

    loadProfile() {
        // Update profile information
        document.getElementById('profileName').textContent = this.currentUser.name;
        document.getElementById('profileEmail').textContent = this.currentUser.email;
        
        const statusElement = document.getElementById('profilePlacementStatus');
        const detailsElement = document.getElementById('placementDetails');
        
        if (this.currentUser.role === 'student') {
            if (this.currentUser.placementStatus === 'placed') {
                statusElement.innerHTML = '<span class="placement-status placed">Placed</span>';
                detailsElement.classList.remove('hidden');
                document.getElementById('profileCompany').textContent = this.currentUser.company || '-';
                document.getElementById('profileRole').textContent = this.currentUser.placedRole || '-';
                document.getElementById('profilePackage').textContent = this.currentUser.package ? `${this.currentUser.package} LPA` : '-';
            } else {
                statusElement.innerHTML = '<span class="placement-status not-placed">Not Placed</span>';
                detailsElement.classList.add('hidden');
            }
        } else {
            statusElement.innerHTML = '<span class="placement-status">Admin</span>';
            detailsElement.classList.add('hidden');
        }

        // Load user's interview experiences
        this.loadUserExperiences();
    }

    loadUserExperiences() {
        const userExperiences = this.data.interviewExperiences.filter(exp => 
            exp.authorEmail === this.currentUser.email
        );

        const container = document.getElementById('userExperiences');
        
        if (userExperiences.length === 0) {
            container.innerHTML = '<p class="no-experiences">No interview experiences shared yet.</p>';
        } else {
            container.innerHTML = userExperiences.map(exp => `
                <div class="user-experience-item">
                    <div class="user-experience-header">
                        <div>
                            <div class="user-experience-company">${exp.company}</div>
                            <div class="user-experience-role">${exp.role} • ${exp.year}</div>
                        </div>
                        <div class="user-experience-actions">
                            <button class="btn btn--outline btn--sm" onclick="app.editExperience(${exp.id})">Edit</button>
                            <button class="btn btn--outline btn--sm" onclick="app.deleteExperience(${exp.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    loadRecords() {
        this.renderRecordsTable(this.data.placementRecords);
        this.createCharts();
    }

    renderRecordsTable(records) {
        const tbody = document.getElementById('recordsTableBody');
        tbody.innerHTML = records.map(record => `
            <tr>
                <td>${record.name}</td>
                <td>${record.company}</td>
                <td>${record.role}</td>
                <td>${record.year}</td>
                <td>${record.package}</td>
            </tr>
        `).join('');
    }

    filterRecords() {
        const searchTerm = document.getElementById('recordsSearch').value.toLowerCase();
        const batchFilter = document.getElementById('batchFilter').value;

        let filtered = this.data.placementRecords;

        if (searchTerm) {
            filtered = filtered.filter(record => 
                record.name.toLowerCase().includes(searchTerm) ||
                record.company.toLowerCase().includes(searchTerm) ||
                record.role.toLowerCase().includes(searchTerm)
            );
        }

        if (batchFilter) {
            filtered = filtered.filter(record => record.year.toString() === batchFilter);
        }

        this.renderRecordsTable(filtered);
        this.updateChartsWithFilteredData(filtered);
    }

    createCharts() {
        this.createCompanyChart();
        this.createPackageChart();
    }

    createCompanyChart() {
        const ctx = document.getElementById('companyChart').getContext('2d');
        
        if (this.charts.companyChart) {
            this.charts.companyChart.destroy();
        }

        const companyData = this.getCompanyData();

        this.charts.companyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: companyData.labels,
                datasets: [{
                    label: 'Number of Placements',
                    data: companyData.values,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createPackageChart() {
        const ctx = document.getElementById('packageChart').getContext('2d');
        
        if (this.charts.packageChart) {
            this.charts.packageChart.destroy();
        }

        const packageData = this.getPackageData();

        this.charts.packageChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: packageData.labels,
                datasets: [{
                    data: packageData.values,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    getCompanyData() {
        const companies = {};
        this.data.placementRecords.forEach(record => {
            companies[record.company] = (companies[record.company] || 0) + 1;
        });

        const sortedCompanies = Object.entries(companies)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        return {
            labels: sortedCompanies.map(([company]) => company),
            values: sortedCompanies.map(([, count]) => count)
        };
    }

    getPackageData() {
        const ranges = {
            '0-10 LPA': 0,
            '10-20 LPA': 0,
            '20-30 LPA': 0,
            '30-40 LPA': 0,
            '40+ LPA': 0
        };

        this.data.placementRecords.forEach(record => {
            const packageValue = parseFloat(record.package);
            if (packageValue < 10) ranges['0-10 LPA']++;
            else if (packageValue < 20) ranges['10-20 LPA']++;
            else if (packageValue < 30) ranges['20-30 LPA']++;
            else if (packageValue < 40) ranges['30-40 LPA']++;
            else ranges['40+ LPA']++;
        });

        return {
            labels: Object.keys(ranges),
            values: Object.values(ranges)
        };
    }

    updateChartsWithFilteredData(filtered) {
        if (this.charts.companyChart) {
            const companies = {};
            filtered.forEach(record => {
                companies[record.company] = (companies[record.company] || 0) + 1;
            });

            const sortedCompanies = Object.entries(companies)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10);

            this.charts.companyChart.data.labels = sortedCompanies.map(([company]) => company);
            this.charts.companyChart.data.datasets[0].data = sortedCompanies.map(([, count]) => count);
            this.charts.companyChart.update();
        }

        if (this.charts.packageChart) {
            const ranges = {
                '0-10 LPA': 0,
                '10-20 LPA': 0,
                '20-30 LPA': 0,
                '30-40 LPA': 0,
                '40+ LPA': 0
            };

            filtered.forEach(record => {
                const packageValue = parseFloat(record.package);
                if (packageValue < 10) ranges['0-10 LPA']++;
                else if (packageValue < 20) ranges['10-20 LPA']++;
                else if (packageValue < 30) ranges['20-30 LPA']++;
                else if (packageValue < 40) ranges['30-40 LPA']++;
                else ranges['40+ LPA']++;
            });

            this.charts.packageChart.data.datasets[0].data = Object.values(ranges);
            this.charts.packageChart.update();
        }
    }

    loadAdmin() {
        if (this.currentUser.role !== 'admin') {
            this.navigateToPage('dashboard');
            return;
        }

        this.loadAdminStudents();
        this.loadAdminRecords();
        this.loadAdminExperiences();
    }

    loadAdminStudents() {
        const students = this.data.users.filter(user => user.role === 'student');
        const tbody = document.getElementById('studentsTableBody');
        
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>
                    <span class="student-status ${student.placementStatus === 'placed' ? 'placed' : 'not-placed'}">
                        ${student.placementStatus === 'placed' ? 'Placed' : 'Not Placed'}
                    </span>
                </td>
                <td>${student.company || '-'}</td>
                <td>${student.package ? `${student.package} LPA` : '-'}</td>
                <td>
                    ${student.placementStatus === 'not-placed' ? 
                        `<button class="btn btn--primary btn--sm" onclick="app.showMarkAsPlacedModal('${student.email}', '${student.name}')">
                            Mark as Placed
                        </button>` :
                        `<button class="btn btn--outline btn--sm" onclick="app.unmarkAsPlaced('${student.email}')">
                            Unmark Placed
                        </button>`
                    }
                </td>
            </tr>
        `).join('');
    }

    filterStudents() {
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        const students = this.data.users.filter(user => 
            user.role === 'student' && 
            (user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm))
        );
        
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>
                    <span class="student-status ${student.placementStatus === 'placed' ? 'placed' : 'not-placed'}">
                        ${student.placementStatus === 'placed' ? 'Placed' : 'Not Placed'}
                    </span>
                </td>
                <td>${student.company || '-'}</td>
                <td>${student.package ? `${student.package} LPA` : '-'}</td>
                <td>
                    ${student.placementStatus === 'not-placed' ? 
                        `<button class="btn btn--primary btn--sm" onclick="app.showMarkAsPlacedModal('${student.email}', '${student.name}')">
                            Mark as Placed
                        </button>` :
                        `<button class="btn btn--outline btn--sm" onclick="app.unmarkAsPlaced('${student.email}')">
                            Unmark Placed
                        </button>`
                    }
                </td>
            </tr>
        `).join('');
    }

    showMarkAsPlacedModal(email, name) {
        document.getElementById('placedStudentEmail').value = email;
        document.getElementById('placedStudentName').value = name;
        this.showModal('markPlacedModal');
    }

    handleMarkAsPlaced(e) {
        e.preventDefault();
        
        const email = document.getElementById('placedStudentEmail').value;
        const company = document.getElementById('placedCompany').value.trim();
        const role = document.getElementById('placedRole').value.trim();
        const packageValue = document.getElementById('placedPackage').value.trim();
        
        const user = this.data.users.find(u => u.email === email);
        if (user) {
            user.placementStatus = 'placed';
            user.company = company;
            user.placedRole = role;
            user.package = packageValue;
            
            this.saveData();
            this.hideAllModals();
            this.loadAdminStudents();
            
            // Update UI if this is the current user
            if (this.currentUser.email === email) {
                this.currentUser = user;
                this.updateUserInterface();
            }
            
            document.getElementById('markPlacedForm').reset();
            alert('Student marked as placed successfully!');
        }
    }

    unmarkAsPlaced(email) {
        if (confirm('Are you sure you want to unmark this student as placed?')) {
            const user = this.data.users.find(u => u.email === email);
            if (user) {
                user.placementStatus = 'not-placed';
                user.company = '';
                user.placedRole = '';
                user.package = '';
                
                this.saveData();
                this.loadAdminStudents();
                
                // Update UI if this is the current user
                if (this.currentUser.email === email) {
                    this.currentUser = user;
                    this.updateUserInterface();
                }
                
                alert('Student unmarked as placed successfully!');
            }
        }
    }

    loadAdminRecords() {
        const container = document.getElementById('adminRecordsList');
        container.innerHTML = this.data.placementRecords.map(record => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <div class="admin-item-title">${record.name}</div>
                    <div class="admin-item-details">${record.company} • ${record.role} • ${record.year} • ${record.package}</div>
                </div>
                <div class="admin-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.deleteRecord(${record.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    loadAdminExperiences() {
        const container = document.getElementById('adminExperiencesList');
        container.innerHTML = this.data.interviewExperiences.map(exp => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <div class="admin-item-title">${exp.company} - ${exp.role}</div>
                    <div class="admin-item-details">${exp.authorName} (${exp.authorEmail}) • ${exp.year} • ${exp.difficulty}</div>
                </div>
                <div class="admin-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.deleteExperience(${exp.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    switchAdminTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.admin-tab').forEach(tabContent => tabContent.classList.remove('active'));

        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        // Force focus to ensure modal is interactive
        setTimeout(() => {
            const modal = document.getElementById(modalId);
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.editingExperience = null;
        // Clear forms
        const forms = document.querySelectorAll('.modal form');
        forms.forEach(form => form.reset());
    }

    showResourceModal(category) {
        const modal = document.getElementById('resourceModal');
        const title = document.getElementById('resourceModalTitle');
        const content = document.getElementById('resourceModalContent');

        const categoryNames = {
            'DSA': 'Data Structures & Algorithms',
            'OS': 'Operating Systems',
            'DBMS': 'Database Management Systems',
            'CN': 'Computer Networks',
            'Aptitude': 'Aptitude & Reasoning',
            'Resume': 'Resume Building'
        };

        title.textContent = categoryNames[category] + ' Resources';

        const resources = this.data.resources[category] || [];
        content.innerHTML = `
            <div class="resource-list">
                ${resources.map(resource => `
                    <div class="resource-item">
                        <div class="resource-item-icon">
                            <i class="fas fa-${this.getResourceIcon(resource.type)}"></i>
                        </div>
                        <div class="resource-item-info">
                            <div class="resource-item-name">${resource.name}</div>
                            <div class="resource-item-type">${resource.type}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.showModal('resourceModal');
    }

    getResourceIcon(type) {
        const icons = {
            'website': 'globe',
            'pdf': 'file-pdf',
            'video': 'play-circle'
        };
        return icons[type] || 'file';
    }

    handleAddExperience(e) {
        e.preventDefault();
        
        const isEdit = this.editingExperience !== null;
        
        const experienceData = {
            company: document.getElementById('expCompany').value.trim(),
            role: document.getElementById('expRole').value.trim(),
            year: parseInt(document.getElementById('expYear').value),
            difficulty: document.getElementById('expDifficulty').value,
            authorEmail: this.currentUser.email,
            authorName: this.currentUser.name,
            rounds: document.getElementById('expRounds').value.trim(),
            experience: document.getElementById('expDetails').value.trim(),
            tips: document.getElementById('expTips').value.trim()
        };

        if (isEdit) {
            const index = this.data.interviewExperiences.findIndex(exp => exp.id === this.editingExperience);
            if (index !== -1) {
                this.data.interviewExperiences[index] = { ...experienceData, id: this.editingExperience };
            }
        } else {
            const newExperience = {
                ...experienceData,
                id: Math.max(...this.data.interviewExperiences.map(exp => exp.id), 0) + 1
            };
            this.data.interviewExperiences.push(newExperience);
        }

        this.saveData();
        this.hideAllModals();
        
        if (this.currentPage === 'experiences') {
            this.loadExperiences();
        }
        if (this.currentPage === 'profile') {
            this.loadUserExperiences();
        }
        if (this.currentPage === 'admin') {
            this.loadAdminExperiences();
        }

        alert(isEdit ? 'Experience updated successfully!' : 'Experience shared successfully!');
    }

    editExperience(id) {
        const experience = this.data.interviewExperiences.find(exp => exp.id === id);
        if (!experience) return;

        // Check permission
        if (this.currentUser.role !== 'admin' && experience.authorEmail !== this.currentUser.email) {
            alert('You can only edit your own experiences.');
            return;
        }

        this.editingExperience = id;
        
        // Populate form
        document.getElementById('expCompany').value = experience.company;
        document.getElementById('expRole').value = experience.role;
        document.getElementById('expYear').value = experience.year;
        document.getElementById('expDifficulty').value = experience.difficulty;
        document.getElementById('expRounds').value = experience.rounds;
        document.getElementById('expDetails').value = experience.experience;
        document.getElementById('expTips').value = experience.tips;
        
        // Update modal title and button text
        document.getElementById('experienceModalTitle').textContent = 'Edit Interview Experience';
        document.getElementById('submitExperienceBtn').textContent = 'Update Experience';
        
        this.showModal('addExperienceModal');
    }

    handleAddRecord(e) {
        e.preventDefault();

        const newRecord = {
            id: Math.max(...this.data.placementRecords.map(r => r.id), 0) + 1,
            name: document.getElementById('recordName').value.trim(),
            company: document.getElementById('recordCompany').value.trim(),
            role: document.getElementById('recordRole').value.trim(),
            year: parseInt(document.getElementById('recordYear').value),
            package: document.getElementById('recordPackage').value.trim() + ' LPA'
        };

        this.data.placementRecords.push(newRecord);
        this.saveData();
        this.hideAllModals();
        
        if (this.currentPage === 'records') {
            this.loadRecords();
        }
        if (this.currentPage === 'admin') {
            this.loadAdminRecords();
        }

        alert('Record added successfully!');
    }

    deleteRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.data.placementRecords = this.data.placementRecords.filter(r => r.id !== id);
            this.saveData();
            this.loadAdminRecords();
            if (this.currentPage === 'records') {
                this.loadRecords();
            }
            alert('Record deleted successfully!');
        }
    }

    deleteExperience(id) {
        const experience = this.data.interviewExperiences.find(exp => exp.id === id);
        if (!experience) return;

        // Check permission
        if (this.currentUser.role !== 'admin' && experience.authorEmail !== this.currentUser.email) {
            alert('You can only delete your own experiences.');
            return;
        }

        if (confirm('Are you sure you want to delete this experience?')) {
            this.data.interviewExperiences = this.data.interviewExperiences.filter(e => e.id !== id);
            this.saveData();
            
            if (this.currentPage === 'experiences') {
                this.loadExperiences();
            }
            if (this.currentPage === 'profile') {
                this.loadUserExperiences();
            }
            if (this.currentPage === 'admin') {
                this.loadAdminExperiences();
            }
            
            alert('Experience deleted successfully!');
        }
    }
}

// Initialize the application
const app = new EnhancedPlacementPortal();
