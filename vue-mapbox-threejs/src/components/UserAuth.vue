<template>
  <div v-if="isVisible" class="auth-overlay" @click.self="closeModal">
    <div class="auth-box" :class="{ 'shake-animation': errorMessage }">
      <!-- Unregistered status -->
      <template v-if="!isLoggedIn">
        <div class="auth-header">
          <h2 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
          <div class="auth-subtitle">{{ isLogin ? 'Login to continue' : 'Join our community' }}</div>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- user ID -->
          <div class="input-group">
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              required 
              class="floating-input"
              placeholder=" " 
            />
            <label for="username" class="floating-label">Username</label>
          </div>

          <!-- password -->
          <div class="input-group">
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              minlength="6"
              class="floating-input"
              placeholder=" "
            />
            <label for="password" class="floating-label">Password</label>
          </div>

          <!-- error message -->
          <div v-if="errorMessage" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24">
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Submit button -->
          <button type="submit" class="auth-btn">
            <span>{{ isLogin ? 'Sign In' : 'Get Started' }}</span>
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
            </svg>
          </button>

          <!-- Switching Forms -->
          <div class="switch-link" @click="toggleForm">
            {{ isLogin ? "Don't have an account? " : "Already registered? " }}
            <span class="highlight">{{ isLogin ? 'Sign Up' : 'Sign In' }}</span>
          </div>
        </form>
      </template>

      <!-- Login Success Screen -->
      <div v-else class="logged-in-view">
        <div class="auth-header">
          <h2 class="auth-title">Welcome, {{ currentUser }}</h2>
          <div class="auth-subtitle">You're successfully logged in!</div>
        </div>

        <div class="user-info">
          <svg class="user-icon" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
          <div class="username-display">{{ currentUser }}</div>
        </div>

        <button class="auth-btn" @click="handleLogout">
          <span>Log Out</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      isLogin: true,
      isLoggedIn: false,
      currentUser: '',
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  watch: {
    currentUser(newUser) {
      console.log("🔄 User switching：", newUser);
      if (!newUser) {
        this.isLoggedIn = false;
        this.username = '';
        this.password = '';
        this.errorMessage = '';
      }
    }
  },
  methods: {
    openModal() {
      this.isVisible = true;
      if (!this.isLoggedIn) {
        this.username = '';
        this.password = '';
        this.errorMessage = '';
      }
    },
    closeModal() {
      this.isVisible = false;
      this.errorMessage = '';
    },
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errorMessage = '';
    },
    async handleSubmit() {
      if (this.isLogin) {
        await this.login();
      } else {
        await this.register();
      }
    },
    async register() {
      if (!this.username || !this.password) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });

        if (response.ok) {
          this.isLoggedIn = true;
          this.currentUser = this.username;
          this.$emit('loginSuccess', this.currentUser);
          this.closeModal();
        } else {
          this.errorMessage = 'Registration failed';
        }
      } catch (error) {
        this.errorMessage = 'Error connecting to the server';
      }
    },
    async login() {
      try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        const user = users.find(u => u.username === this.username && u.password === this.password);

        if (user) {
          this.isLoggedIn = true;
          this.currentUser = this.username;
          this.$emit('loginSuccess', user.id); // ✅ Pass the user ID
          this.closeModal();
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      } catch (error) {
        this.errorMessage = 'Error connecting to the server';
      }
    },
    handleLogout() {
      console.log("🚪 用户登出");
      this.isLoggedIn = false;
      this.currentUser = '';
      this.$emit('logout');
      this.closeModal();
    }
  }
};
</script>

  
  <style scoped>
  /* Original style remains unchanged */
  .auth-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
    font-family: Arial, sans-serif;
  }
  
  .auth-box {
    background: white;
    padding: 30px 40px;
    border-radius: 15px;
    width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    transform-origin: center;
    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  /* New logout screen style */
  .logged-in-view {
    text-align: center;
  }
  
  .user-info {
    margin: 30px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .user-icon {
    width: 64px;
    height: 64px;
    padding: 12px;
    background: #f0faff;
    border-radius: 50%;
    fill: #16b0ed;
  }
  
  .username-display {
    font-size: 1.2rem;
    color: #333;
    font-weight: 500;
  }
  
  /* Adjust the hover effect of the logout button */
  .auth-btn:hover {
    background: #ff4444;
    box-shadow: 0 5px 15px rgba(255, 68, 68, 0.3);
  }
  
  /* Maintain other original styles */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleUp {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .auth-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .auth-title {
    font-size: 24px;
    color: #1a1a1a;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .auth-subtitle {
    color: #666;
    font-size: 14px;
  }
  
  .input-group {
    position: relative;
    margin-bottom: 25px;
  }
  
  .floating-input {
    width: 100%;
    height: 60px;
    padding: 12px 40px 0 20px;
    border: 2px solid #e6e6e6;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: transparent;
    box-sizing: border-box; 
  }
  
  .floating-input:focus {
    border-color: #16b0ed;
    outline: none;
    box-shadow: 0 0 0 3px rgba(22, 176, 237, 0.1);
  }
  
  .floating-label {
    position: absolute;
    left: 20px;
    top: 18px;
    color: #999;
    font-size: 16px;
    pointer-events: none;
    transition: all 0.3s ease;
  }
  
  .floating-input:focus ~ .floating-label,
  .floating-input:not(:placeholder-shown) ~ .floating-label {
    top: 8px;
    font-size: 12px;
    color: #16b0ed;
  }
  
  .input-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  
  .error-message {
    background: #fee;
    color: #e74c3c;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    border: 1px solid #ffd6d6;
  }
  
  
  .highlight {
    color: #16b0ed;
    font-weight: 600;
  }
  
  .auth-btn {
  width: 100%;
  padding: 16px;
  background: #16b0ed;
  border: none;
  border-radius: 10px; 
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.auth-btn:hover {
  background: #1491d7;
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(22, 176, 237, 0.3);
}

.btn-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.switch-link {
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.switch-link:hover {
  color: #333;
}

  
  @keyframes shake {
    10%, 90% { transform: translateX(-2px); }
    20%, 80% { transform: translateX(4px); }
    30%, 50%, 70% { transform: translateX(-6px); }
    40%, 60% { transform: translateX(6px); }
  }
  
  @media (max-width: 480px) {
    .auth-box {
      width: 90%;
      padding: 25px 30px;
    }
  }
  </style>