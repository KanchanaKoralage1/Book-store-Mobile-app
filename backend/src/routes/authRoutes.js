import express from 'express';

const router = express.Router();


router.get('/login', (req, res) => {
    // Logic for handling login
    res.send('Login route');
});

router.get('/register', (req, res) => {
    // Logic for handling registration  
    res.send('Registration route');
});

export default router;