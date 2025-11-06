// Registration functionality for Spiritual Guide App
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const registerBtn = document.getElementById('registerBtn');
    const registrationMessage = document.getElementById('registrationMessage');

    // Simple client-side hash function
    async function simpleHash(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Registration form handler
    registrationForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Get form values
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const profile = document.getElementById('profile').value.trim();

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        if (username.length < 3) {
            showMessage('Username must be at least 3 characters long', 'error');
            return;
        }
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const originalText = registerBtn.textContent;
        registerBtn.disabled = true;
        registerBtn.textContent = 'Registering...';

        try {
            console.log('Attempting to register user:', { username, email });
            
            // SECURE: Hash password before sending to database
            const passwordHash = await simpleHash(password);
            
            // Insert user into Supabase with hashed password
            const { data, error } = await supabaseClient
                .from('auth_users')
                .insert([
                    {
                        username: username,
                        email: email,
                        hashed_password: passwordHash, // Now storing hash instead of plain text
                        profile: profile || null,
                        is_active: true
                    }
                ])
                .select();

            if (error) {
                console.error('Supabase error:', error);
                if (error.code === '23505') { // Unique violation
                    if (error.message.includes('username')) {
                        showMessage('Username already exists. Please choose a different one.', 'error');
                    } else if (error.message.includes('email')) {
                        showMessage('Email already exists. Please use a different email.', 'error');
                    } else {
                        showMessage('Registration failed: ' + error.message, 'error');
                    }
                } else if (error.code === '42501') { // RLS policy violation
                    showMessage('Registration not allowed. Please contact administrator.', 'error');
                } else {
                    showMessage('Registration failed: ' + error.message, 'error');
                }
                return;
            }

            // Success
            console.log('Registration successful:', data);
            showMessage('User registered successfully! You can now login to the main app.', 'success');
            registrationForm.reset();

            // Optional: Auto-redirect after success
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Registration failed. Please try again.', 'error');
        } finally {
            // Reset button
            registerBtn.disabled = false;
            registerBtn.textContent = originalText;
        }
    });

    // Helper function to show messages
    function showMessage(message, type) {
        registrationMessage.textContent = message;
        registrationMessage.className = `registration-message message-${type}`;
        registrationMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                registrationMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        if (confirmPassword && password !== confirmPassword) {
            this.style.borderColor = '#e53e3e';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
});