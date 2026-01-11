const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pl = require('tau-prolog');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_...'); // Replace with your Stripe secret key
const nodemailer = require('nodemailer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// Load the Prolog knowledge base
const KB_TEXT = fs.readFileSync(path.join(__dirname, 'kb.pl'), 'utf8');

const app = express();

app.use(bodyParser.json());

// Session setup
app.use(session({
  secret: 'valued-module-484008-j3-session-secret', // Strong secret
  resave: false,
  saveUninitialized: true
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: '1002244412344-5eglg5kr3r3c6vtgjev1glpqhkesslc6.apps.googleusercontent.com', // Your Google Client ID
    clientSecret: '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', // Your Google Client Secret
    callbackURL: 'http://localhost:3000/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user exists in DB
    db.get("SELECT * FROM users WHERE email = ?", [profile.emails[0].value], (err, user) => {
      if (err) return done(err);
      if (user) {
        return done(null, user);
      } else {
        // Create new user
        const username = profile.displayName.replace(/\s/g, '').toLowerCase();
        db.run("INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", 
          [username, profile.emails[0].value, 'google_oauth', 'user'], function(err) {
          if (err) return done(err);
          db.get("SELECT * FROM users WHERE email = ?", [profile.emails[0].value], (err, newUser) => {
            return done(null, newUser);
          });
        });
      }
    });
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to frontend with token
    const token = jwt.sign({ id: req.user.id, username: req.user.username, email: req.user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.redirect(`http://localhost:3000?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// Gmail transporter (replace with your credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com', // Replace with your Gmail
    pass: 'your_app_password' // Replace with Gmail app password
  }
});

// Function to send confirmation email
const sendConfirmationEmail = (email, tourName) => {
  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: email,
    subject: 'Booking Confirmation - Shone Traveler',
    text: `Dear Customer,\n\nThank you for booking ${tourName} with Shone Traveler.\nYour payment was successful!\n\nBest regards,\nShone Traveler Team`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email send error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Initialize SQLite database
const db = new sqlite3.Database('./chat.db');
db.serialize(() => {
  // Create chats table
  db.run("CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY, user_message TEXT, bot_reply TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
  
  // Create destinations table
  db.run(`CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    category TEXT,
    features TEXT
  )`);
  
  // Create tours table
  db.run(`CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category TEXT,
    duration_days INTEGER,
    description TEXT,
    price_starting REAL,
    highlights TEXT
  )`);
  
  // Create hotels table
  db.run(`CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY,
    name TEXT,
    location TEXT,
    category TEXT,
    description TEXT,
    features TEXT
  )`);
  
  // Create experiences table
  db.run(`CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category TEXT,
    description TEXT,
    location TEXT
  )`);
  
  // Create faq table
  db.run(`CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY,
    question TEXT,
    answer TEXT,
    category TEXT
  )`);
  
  // Create offers table
  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY,
    title TEXT,
    discount_percent INTEGER,
    description TEXT,
    starting_price REAL,
    valid_until TEXT
  )`);
  
  // Create company_info table
  db.run(`CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY,
    info_type TEXT,
    content TEXT
  )`);
  
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )`);
  
  // Create bookings table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    tour_id INTEGER,
    agent_id INTEGER,
    status TEXT,
    total_amount REAL,
    currency TEXT,
    start_date TEXT,
    end_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (tour_id) REFERENCES tours (id),
    FOREIGN KEY (agent_id) REFERENCES users (id)
  )`);
  
  // Create payments table
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY,
    booking_id INTEGER,
    provider TEXT,
    provider_payment_id TEXT,
    amount REAL,
    currency TEXT,
    status TEXT,
    raw_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings (id)
  )`);
  
  // Insert destinations data
  db.get("SELECT COUNT(*) as count FROM destinations", (err, row) => {
    if (!err && row.count === 0) {
      const destinations = [
        [1, 'Sigiriya', 'A mystical ancient rock fortress adorned with mesmerizing frescoes', 'History & Culture', 'rock fortress, frescoes, gardens, panoramic views'],
        [2, 'Anuradhapura', 'Ancient sacred city with Buddhist temples and ruins', 'History & Culture', 'temples, ruins, historical'],
        [3, 'Yala', 'National park famous for wildlife safaris', 'Wildlife & Nature', 'leopards, elephants, safari'],
        [4, 'Ella', 'Scenic hill country destination', 'Adventure', 'hiking, trains, waterfalls'],
        [5, 'Colombo', 'Capital city with modern attractions', 'Cities', 'shopping, dining, culture'],
        [6, 'Galle', 'Historic fort city on the coast', 'History & Culture', 'fort, beaches, colonial architecture'],
        [7, 'Kandy', 'Cultural capital with Temple of Tooth', 'History & Culture', 'temple, cultural shows, botanical gardens'],
        [8, 'Bentota', 'Beach resort town', 'Popular Beaches', 'beaches, water sports'],
        [9, 'Arugam Bay', 'Surfing paradise', 'Popular Beaches', 'surfing, beaches'],
        [10, 'Mirissa', 'Beach town for whale watching', 'Popular Beaches', 'whale watching, beaches']
      ];
      const stmt = db.prepare("INSERT INTO destinations VALUES (?, ?, ?, ?, ?)");
      destinations.forEach(dest => stmt.run(dest));
      stmt.finalize();
    }
  });
  
  // Insert tours data
  db.get("SELECT COUNT(*) as count FROM tours", (err, row) => {
    if (!err && row.count === 0) {
      const tours = [
        [1, 'Everlasting Summer', 'Sri Lanka with Jetwing', 8, 'Immerse in tropical bliss, explore vibrant culture', 1500.00, 'beaches, culture, nature'],
        [2, 'Experiential East', 'Sri Lanka with Jetwing', 7, 'Ancient ruins, vibrant culture and pristine beaches', 1300.00, 'east coast, ruins, beaches'],
        [3, 'Sustainable Luxury', 'Sri Lanka with Jetwing', 12, 'Eco-luxury journey with sustainability', 3500.00, 'eco-friendly, luxury, culture'],
        [4, 'Authentic Ceylon', 'Authentic Ceylon', 10, 'Traditional Sri Lankan cultural experience', 1800.00, 'heritage, temples, tea plantations'],
        [5, 'Adventurous Spirit', 'Adventurous Spirit', 9, 'Hiking, wildlife and thrilling activities', 1600.00, 'hiking, rafting, safari'],
        [6, 'Barefoot Luxury', 'Barefoot Luxury', 8, 'Luxury beach and cultural tour', 2800.00, 'luxury hotels, fine dining, spa'],
        [7, 'Following The Wild', 'Following The Wild', 6, 'Wildlife safari focused tour', 1400.00, 'Yala, Wilpattu, Minneriya safari'],
        [8, 'Romantic Serendipity', 'Romantic Serendipity', 7, 'Honeymoon and couples tour', 2200.00, 'romantic settings, beaches, hill country']
      ];
      const stmt = db.prepare("INSERT INTO tours VALUES (?, ?, ?, ?, ?, ?, ?)");
      tours.forEach(tour => stmt.run(tour));
      stmt.finalize();
    }
  });
  
  // Insert hotels data
  db.get("SELECT COUNT(*) as count FROM hotels", (err, row) => {
    if (!err && row.count === 0) {
      const hotels = [
        [1, 'SHONE Blue', 'Negombo', 'Beach Resort', 'Beachfront hotel near airport', 'pool, beach access, restaurant'],
        [2, 'Jetwing Colombo Seven', 'Colombo', 'City Hotel', 'Modern luxury hotel in Colombo', 'rooftop pool, city views, spa'],
        [3, 'SHONE Saman Villas', 'Bentota', 'Luxury Villa', 'Exclusive beach villas', 'private villas, beach, fine dining'],
        [4, 'SHONE Vil Uyana', 'Sigiriya', 'Eco Resort', 'Nature resort near Sigiriya', 'eco-friendly, wetlands, wildlife'],
        [5, 'Jetwing Yala', 'Yala', 'Safari Lodge', 'Lodge near Yala National Park', 'safari access, nature, wildlife viewing'],
        [6, 'Jetwing Lighthouse', 'Galle', 'Heritage Hotel', 'Historic hotel near Galle Fort', 'ocean views, colonial architecture']
      ];
      const stmt = db.prepare("INSERT INTO hotels VALUES (?, ?, ?, ?, ?, ?)");
      hotels.forEach(hotel => stmt.run(hotel));
      stmt.finalize();
    }
  });
  
  // Insert experiences data
  db.get("SELECT COUNT(*) as count FROM experiences", (err, row) => {
    if (!err && row.count === 0) {
      const experiences = [
        [1, 'Popular Beaches', 'Beach', 'Relax on pristine beaches', 'Bentota, Mirissa, Arugam Bay'],
        [2, 'History & Culture', 'Cultural', 'Ancient temples and historical sites', 'Anuradhapura, Polonnaruwa, Sigiriya'],
        [3, 'Wildlife & Nature', 'Wildlife', 'Safari and nature exploration', 'Yala, Wilpattu, Sinharaja'],
        [4, 'Lesser Travelled', 'Exploration', 'Discover hidden gems', 'Jaffna, Pekoe Trail'],
        [5, 'Adventure', 'Activity', 'Hiking, surfing, water sports', 'Ella, Arugam Bay, Kalpitiya'],
        [6, 'Gastronomy', 'Food', 'Sri Lankan cuisine experiences', 'Colombo, Kandy, Galle']
      ];
      const stmt = db.prepare("INSERT INTO experiences VALUES (?, ?, ?, ?, ?)");
      experiences.forEach(exp => stmt.run(exp));
      stmt.finalize();
    }
  });
  
  // Insert faq data
  db.get("SELECT COUNT(*) as count FROM faq", (err, row) => {
    if (!err && row.count === 0) {
      const faqs = [
        [1, 'How many days do I need in Sri Lanka?', 'We recommend 7-14 days to experience the key highlights of Sri Lanka', 'Duration'],
        [2, 'What is the best time to visit?', 'December to March for west/south coast, April to September for east coast', 'Weather'],
        [3, 'Do you provide airport transfers?', 'Yes, we provide airport pickup and drop-off services', 'Services'],
        [4, 'Can tours be customized?', 'Yes, all our tours can be customized to your preferences', 'Booking'],
        [5, 'What is included in tour packages?', 'Accommodation, transportation, guide, some meals and activities', 'Pricing'],
        [6, 'Is Sri Lanka safe for tourists?', 'Yes, Sri Lanka is very safe for tourists with friendly locals', 'Safety'],
        [7, 'Do I need a visa?', 'Most nationalities need ETA (Electronic Travel Authorization)', 'Travel Requirements'],
        [8, 'What currency is used?', 'Sri Lankan Rupee (LKR), but USD and EUR widely accepted', 'Money']
      ];
      const stmt = db.prepare("INSERT INTO faq VALUES (?, ?, ?, ?)");
      faqs.forEach(faq => stmt.run(faq));
      stmt.finalize();
    }
  });
  
  // Insert offers data
  db.get("SELECT COUNT(*) as count FROM offers", (err, row) => {
    if (!err && row.count === 0) {
      const offers = [
        [1, 'Maldives Special Offer', 15, 'Luxury 5-star private island resort in Maldives', 5550.00, '2026-03-31'],
        [2, 'Ayurveda Wellness', 15, 'Ancient healing traditions and yoga retreats', 1180.00, '2026-06-30']
      ];
      const stmt = db.prepare("INSERT INTO offers VALUES (?, ?, ?, ?, ?, ?)");
      offers.forEach(offer => stmt.run(offer));
      stmt.finalize();
    }
  });
  
  // Insert company_info data
  db.get("SELECT COUNT(*) as count FROM company_info", (err, row) => {
    if (!err && row.count === 0) {
      const companyInfo = [
        [1, 'about', 'Jetwing Travels is the No.1 Travel Agent in Sri Lanka with over 50 years of experience'],
        [2, 'contact_email', 'info@jetwingtravels.com'],
        [3, 'contact_phone', '+94 77 726 5746'],
        [4, 'address', '46/26, Navam Mawatha, Colombo 02, Sri Lanka'],
        [5, 'working_hours', 'Monday to Friday: 9 AM to 5 PM'],
        [6, 'experience_years', '50+'],
        [7, 'specialization', 'Destination Management Company, Sustainable Tourism']
      ];
      const stmt = db.prepare("INSERT INTO company_info VALUES (?, ?, ?)");
      companyInfo.forEach(info => stmt.run(info));
      stmt.finalize();
    }
  });
  
  // Insert users data (seed admin, agent, customer)
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (!err && row.count === 0) {
      const users = [
        { name: 'Admin User', email: 'admin@jetwing.com', password: 'admin123', role: 'admin', phone: '+94 77 123 4567' },
        { name: 'Agent User', email: 'agent@jetwing.com', password: 'agent123', role: 'agent', phone: '+94 77 234 5678' },
        { name: 'Customer User', email: 'customer@example.com', password: 'customer123', role: 'customer', phone: '+94 77 345 6789' }
      ];
      for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        db.run("INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [user.name, user.email, hash, user.role]);
      }
    }
  });
});

app.get('/api/destinations', (req, res) => {
  db.all("SELECT * FROM destinations", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ destinations: rows });
    }
  });
});

app.get('/api/tours', (req, res) => {
  db.all("SELECT * FROM tours", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ tours: rows });
    }
  });
});

app.get('/api/hotels', (req, res) => {
  db.all("SELECT * FROM hotels", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ hotels: rows });
    }
  });
});

app.get('/api/experiences', (req, res) => {
  db.all("SELECT * FROM experiences", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ experiences: rows });
    }
  });
});

app.get('/api/faq', (req, res) => {
  db.all("SELECT * FROM faq", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ faq: rows });
    }
  });
});

app.get('/api/offers', (req, res) => {
  db.all("SELECT * FROM offers", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ offers: rows });
    }
  });
});

app.get('/api/company-info', (req, res) => {
  db.all("SELECT * FROM company_info", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ companyInfo: rows });
    }
  });
});

// User authentication routes
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    stmt.run(username, email, hashedPassword, 'user', function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'User already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      const token = jwt.sign({ id: this.lastID, username, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
      res.status(201).json({ message: 'User registered successfully', token, user: { id: this.lastID, username, email } });
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const { tour_id, start_date, end_date, total_amount, currency } = req.body;
  const user_id = req.user.id;

  if (!tour_id) {
    return res.status(400).json({ message: 'Tour ID is required' });
  }

  const stmt = db.prepare("INSERT INTO bookings (user_id, tour_id, status, total_amount, currency, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
  stmt.run(user_id, tour_id, 'pending', total_amount || 0, currency || 'USD', start_date || null, end_date || null, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Booking created successfully', booking_id: this.lastID });
  });
  stmt.finalize();
});

app.post('/api/create-checkout-session', authenticateToken, async (req, res) => {
  const { booking_id, amount, currency } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'usd',
            product_data: {
              name: 'Tour Booking',
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      metadata: {
        booking_id: booking_id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-payment-intent', authenticateToken, async (req, res) => {
  const { booking_id, amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: currency || 'usd',
      metadata: {
        booking_id: booking_id,
      },
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send-email', (req, res) => {
  const { email, tourName } = req.body;
  sendConfirmationEmail(email, tourName);
  res.json({ message: 'Email sent successfully' });
});

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message || '';
  const lastIntent = req.body.lastIntent || 'none';
  const msg = userMessage.toLowerCase();
  
  // Check for destination queries
  if (msg.includes('destination') || msg.includes('place') || msg.includes('visit') || msg.includes('ගමනාන්ත')) {
    db.all("SELECT * FROM destinations", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        let reply = 'Here are some amazing destinations in Sri Lanka:\n\n';
        rows.forEach(dest => {
          reply += `• **${dest.name}** (${dest.category})\n  ${dest.description}\n  Features: ${dest.features}\n\n`;
        });
        db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
        res.json({ reply, explanation: 'Destinations retrieved from database' });
      }
    });
    return;
  }
  
  // Check for tour queries
  if (msg.includes('tour') || msg.includes('package') || msg.includes('සංචාර') || msg.includes('පැකේජ')) {
    db.all("SELECT * FROM tours", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        let reply = 'Here are our tour packages:\n\n';
        rows.forEach(tour => {
          reply += `• **${tour.name}** (${tour.category})\n  Duration: ${tour.duration_days} days\n  Price from: $${tour.price_starting}\n  ${tour.description}\n  Highlights: ${tour.highlights}\n\n`;
        });
        db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
        res.json({ reply, explanation: 'Tour packages retrieved from database' });
      }
    });
    return;
  }
  
  // Check for hotel queries
  if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation') || msg.includes('හෝටල්')) {
    db.all("SELECT * FROM hotels", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        let reply = 'Here are our hotel recommendations:\n\n';
        rows.forEach(hotel => {
          reply += `• **${hotel.name}** (${hotel.category})\n  Location: ${hotel.location}\n  ${hotel.description}\n  Features: ${hotel.features}\n\n`;
        });
        db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
        res.json({ reply, explanation: 'Hotels retrieved from database' });
      }
    });
    return;
  }
  
  // Check for FAQ queries
  if (msg.includes('faq') || msg.includes('question') || msg.includes('how') || msg.includes('what') || msg.includes('when') || msg.includes('where')) {
    db.all("SELECT * FROM faq", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        let reply = 'Here are some frequently asked questions:\n\n';
        rows.forEach(faq => {
          reply += `• **${faq.question}**\n  ${faq.answer}\n\n`;
        });
        db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
        res.json({ reply, explanation: 'FAQ retrieved from database' });
      }
    });
    return;
  }
  
  // Check for offers/specials
  if (msg.includes('offer') || msg.includes('special') || msg.includes('discount') || msg.includes('deal')) {
    db.all("SELECT * FROM offers", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        let reply = 'Here are our current special offers:\n\n';
        rows.forEach(offer => {
          reply += `• **${offer.title}** (${offer.discount_percent}% off)\n  ${offer.description}\n  Starting from: $${offer.starting_price}\n  Valid until: ${offer.valid_until}\n\n`;
        });
        db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
        res.json({ reply, explanation: 'Special offers retrieved from database' });
      }
    });
    return;
  }
  
  // Check for contact/company info
  if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('address') || msg.includes('about') || msg.includes('company')) {
    db.all("SELECT * FROM company_info", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        let reply = 'Here is our company information:\n\n';
        rows.forEach(info => {
          reply += `• **${info.info_type.replace('_', ' ').toUpperCase()}:** ${info.content}\n`;
        });
        db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
        res.json({ reply, explanation: 'Company information retrieved from database' });
      }
    });
    return;
  }
  
  // Check for greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('ආයුබෝවන්') || msg.includes('හෙලෝ')) {
    const reply = 'Hello! How can I assist you with your travel plans to Sri Lanka?';
    db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
    res.json({ reply, explanation: 'Greeting detected' });
    return;
  }
  
  try {
    const program = KB_TEXT || '';
    const query = `response('${userMessage.replace(/'/g, "\\'")}', '${lastIntent}', Reply, Explanation)`;
    const answers = await runProlog(program, query);
    let reply = 'Sorry, I could not understand that.';
    let explanation = '';
    if (answers.length > 0) {
      const parts = answers[0].split(', Explanation = ');
      if (parts.length === 2) {
        const replyPart = parts[0].split('Reply = ')[1];
        const explanationPart = parts[1];
        reply = replyPart.replace(/"/g, '');
        explanation = explanationPart.replace(/"/g, '');
      }
    }
    // Save to database
    db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
    res.json({ reply, explanation });
  } catch (err) {
    console.error('prolog chat error', err);
    // On Prolog error, return default reply
    const reply = 'Sorry, I could not understand that.';
    const explanation = 'Prolog query failed, using default response.';
    db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
    res.json({ reply, explanation });
  }
});

app.get('/api/chat/history', (req, res) => {
  db.all("SELECT * FROM chats ORDER BY timestamp DESC LIMIT 50", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ history: rows });
    }
  });
});

app.delete('/api/chat/history', (req, res) => {
  db.run("DELETE FROM chats", [], (err) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'History cleared' });
    }
  });
});

// Helper to run a Prolog program and collect answers
function runProlog(program, query) {
  return new Promise((resolve, reject) => {
    const session = pl.create(1000);
    session.consult(program, {
      success: () => {
        session.query(query, {
          success: () => {
            const answers = [];
            function getAnswer() {
              session.answer(ans => {
                if (ans === false || ans === null) return resolve(answers);
                if (pl.type.is_error(ans)) return reject(ans);
                answers.push(session.format_answer(ans));
                getAnswer();
              });
            }
            getAnswer();
          },
          error: err => reject(err)
        });
      },
      error: err => reject(err)
    });
  });
}

// Prolog query endpoint
app.post('/api/prolog', async (req, res) => {
  try {
    const program = req.body.program || KB_TEXT || '';
    const query = req.body.query;
    if (!query) return res.status(400).json({ error: 'Missing prolog query in body' });
    const answers = await runProlog(program, query);
    res.json({ answers });
  } catch (err) {
    console.error('prolog error', err);
    res.status(500).json({ error: String(err) });
  }
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
